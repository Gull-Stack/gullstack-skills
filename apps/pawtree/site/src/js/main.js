// The Good Bowl — motion system (vanilla, reduced-motion aware)
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sticky nav condenses after the hero
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Scroll reveals with per-child stagger
  var groups = [
    ".section .eyebrow, .section h2",
    ".guide-card",
    ".steps li",
    ".stat-band > div",
    ".villain-grid p",
    ".section-faq details",
    ".table-scroll",
    ".section-footnote",
    ".steps-cta",
    ".final-cta > *",
  ];
  var targets = document.querySelectorAll(groups.join(","));
  targets.forEach(function (el) {
    el.classList.add("reveal");
  });
  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var seenParents = new Map();
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var parent = el.parentElement;
          var idx = seenParents.get(parent) || 0;
          seenParents.set(parent, idx + 1);
          el.style.setProperty("--d", Math.min(idx * 0.09, 0.45) + "s");
          el.classList.add("in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
    );
    targets.forEach(function (el) { io.observe(el); });
  }

  // Reading progress bar (guide pages only)
  var progress = document.querySelector(".read-progress");
  var article = document.querySelector("article.guide");
  if (progress && article) {
    var onProgress = function () {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onProgress, { passive: true });
    onProgress();
  }

  // Count-up for stat numbers
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && !reduced && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          cio.unobserve(el);
          var end = parseInt(el.getAttribute("data-count"), 10);
          var start = performance.now();
          var dur = 1200;
          var tick = function (now) {
            var t = Math.min((now - start) / dur, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(end * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }
})();
