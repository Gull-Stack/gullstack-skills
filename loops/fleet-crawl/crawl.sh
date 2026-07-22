#!/usr/bin/env bash
# Fleet crawl — the dumb gate for the nightly loop.
# Runs the DEPLOYMENT-CHECKLIST automated crawl + bryce-method gates #1/#4
# against every site in fleet.json. Exit 0 = no BLOCKERs, exit 1 = BLOCKERs.
#
# Findings severities mirror the Argus rubric:
#   BLOCKER — homepage down, dead internal link, empty tel:, GA4 absent (gate #1)
#   WARN    — Meta pixel absent, href="#", sitemap/robots/brand-facts/meta missing
#
# Usage: bash loops/fleet-crawl/crawl.sh [fleet.json path]
set -u
FLEET="${1:-$(dirname "$0")/fleet.json}"
OUTDIR="$(dirname "$0")/findings"
STAMP="$(date -u +%Y-%m-%d)"
JSON_OUT="$OUTDIR/$STAMP-findings.json"
MD_OUT="$OUTDIR/$STAMP-report.md"
MAX_LINKS=25
UA="Mozilla/5.0 (compatible; GullStackFleetCrawl/1.0)"
mkdir -p "$OUTDIR"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

FINDINGS="$TMP/findings.tsv"   # severity \t site \t rule \t detail
: > "$FINDINGS"
finding() { printf '%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$4" >> "$FINDINGS"; }

fetch_code() { curl -A "$UA" -o /dev/null -s -L -w '%{http_code}' --max-time 30 "$1" 2>/dev/null || echo "000"; }

python3 - "$FLEET" <<'PY' > "$TMP/fleet.tsv"
import json, sys
for s in json.load(open(sys.argv[1]))["sites"]:
    print(f"{s['name']}\t{s['url'].rstrip('/')}\t{s.get('vertical','marketing')}")
PY

while IFS=$'\t' read -r NAME URL VERTICAL; do
  echo "== $NAME ($URL)" >&2
  HOME_HTML="$TMP/home.html"
  CODE=$(curl -A "$UA" -s -L -o "$HOME_HTML" -w '%{http_code}' --max-time 30 "$URL" 2>/dev/null || echo "000")
  if [ "$CODE" != "200" ]; then
    finding BLOCKER "$NAME" "homepage-down" "GET $URL returned $CODE"
    continue
  fi

  # -- CTAs (bryce-method gate #4) --
  grep -qiE 'href="tel:"' "$HOME_HTML" && finding BLOCKER "$NAME" "empty-tel" 'href="tel:" with no number'
  grep -qiE 'href="mailto:"' "$HOME_HTML" && finding BLOCKER "$NAME" "empty-mailto" 'href="mailto:" with no address'
  N_HASH=$(grep -oiE 'href="#"' "$HOME_HTML" | wc -l | tr -d ' ')
  [ "$N_HASH" -gt 0 ] && finding WARN "$NAME" "hash-links" "$N_HASH link(s) to \"#\" on homepage"

  # -- Analytics (bryce-method gate #1: no pixel, no launch) --
  if ! grep -qiE 'googletagmanager\.com|gtag\(|G-[A-Z0-9]{6,}|GTM-[A-Z0-9]+' "$HOME_HTML"; then
    finding BLOCKER "$NAME" "no-ga4" "No GA4/GTM tag found on homepage"
  fi
  if ! grep -qiE 'connect\.facebook\.net|fbq\(' "$HOME_HTML"; then
    finding WARN "$NAME" "no-meta-pixel" "No Meta pixel found on homepage"
  fi

  # -- Head basics --
  grep -qiE '<title>[^<]+</title>' "$HOME_HTML" || finding WARN "$NAME" "no-title" "Missing or empty <title>"
  grep -qiE '<meta[^>]+name="description"[^>]+content="[^"]+"|<meta[^>]+content="[^"]+"[^>]+name="description"' "$HOME_HTML" \
    || finding WARN "$NAME" "no-meta-desc" "Missing meta description"

  # -- SEO/AEO surfaces (marketing sites; WARN for apps too, same severity) --
  [ "$(fetch_code "$URL/sitemap.xml")" = "200" ] || finding WARN "$NAME" "no-sitemap" "/sitemap.xml not 200"
  [ "$(fetch_code "$URL/robots.txt")" = "200" ] || finding WARN "$NAME" "no-robots" "/robots.txt not 200"
  if [ "$VERTICAL" = "marketing" ]; then
    [ "$(fetch_code "$URL/.well-known/brand-facts.json")" = "200" ] \
      || finding WARN "$NAME" "no-brand-facts" "/.well-known/brand-facts.json not 200 (AEO moat)"
  fi

  # -- Internal links (DEPLOYMENT-CHECKLIST crawl: no 404s) --
  grep -oiE 'href="[^"]+"' "$HOME_HTML" | sed -E 's/^href="//; s/"$//' \
    | grep -vE '^(#|mailto:|tel:|sms:|javascript:|data:)' \
    | grep -vE '^https?://' > "$TMP/rel_links" || true
  grep -oiE 'href="[^"]+"' "$HOME_HTML" | sed -E 's/^href="//; s/"$//' \
    | grep -E "^$URL" >> "$TMP/rel_links" || true
  sort -u "$TMP/rel_links" | head -n "$MAX_LINKS" > "$TMP/links"
  while IFS= read -r LINK; do
    [ -z "$LINK" ] && continue
    case "$LINK" in
      http*) TARGET="$LINK" ;;
      /*)    TARGET="$URL$LINK" ;;
      *)     TARGET="$URL/$LINK" ;;
    esac
    LCODE=$(fetch_code "$TARGET")
    if [ "$LCODE" = "404" ] || [ "${LCODE:0:1}" = "5" ] || [ "$LCODE" = "000" ]; then
      finding BLOCKER "$NAME" "dead-link" "$LINK -> $LCODE"
    fi
  done < "$TMP/links"
done < "$TMP/fleet.tsv"

# -- Emit findings JSON + markdown report --
python3 - "$FINDINGS" "$JSON_OUT" "$MD_OUT" "$STAMP" <<'PY'
import json, sys, collections
rows = []
for line in open(sys.argv[1]):
    sev, site, rule, detail = line.rstrip("\n").split("\t", 3)
    rows.append({"severity": sev, "site": site, "rule": rule, "detail": detail})
blockers = [r for r in rows if r["severity"] == "BLOCKER"]
json.dump({"date": sys.argv[4], "blockers": len(blockers), "warns": len(rows) - len(blockers),
           "findings": rows}, open(sys.argv[2], "w"), indent=2)
by_site = collections.defaultdict(list)
for r in rows: by_site[r["site"]].append(r)
with open(sys.argv[3], "w") as md:
    md.write(f"# Fleet crawl — {sys.argv[4]}\n\nVerdict: "
             f"{'FAIL (' + str(len(blockers)) + ' blockers)' if blockers else 'PASS'} · "
             f"{len(rows) - len(blockers)} warnings\n\n")
    for site, rs in sorted(by_site.items()):
        md.write(f"## {site}\n")
        for r in sorted(rs, key=lambda x: x["severity"]):
            md.write(f"- **{r['severity']}** — {r['rule']} — {r['detail']}\n")
        md.write("\n")
    if not rows:
        md.write("No findings. Every site passed every check.\n")
print(f"{len(blockers)} BLOCKER(s), {len(rows)-len(blockers)} WARN(s) -> {sys.argv[2]}")
sys.exit(0)
PY

BLOCKER_COUNT=$(grep -c '^BLOCKER' "$FINDINGS" || true)
echo "Report: $MD_OUT" >&2
[ "$BLOCKER_COUNT" -gt 0 ] && exit 1
exit 0
