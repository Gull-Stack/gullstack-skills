import test from "node:test";
import assert from "node:assert/strict";
import {
  byRole,
  childNames,
  findPerson,
  PERSON_PALETTE,
  staffNames,
  toneFor,
  toneMap,
  validatePerson,
  workerNames,
  type Person,
} from "./people.ts";

function person(over: Partial<Person> = {}): Person {
  return {
    name: "Anna",
    role: "staff",
    title: null,
    pin: null,
    color: null,
    sort_order: 10,
    active: true,
    pay_rate_cents: null,
    pay_kind: "none",
    birthday: null,
    note: null,
    ...over,
  };
}

const HOUSE = [
  person({ name: "Dad", role: "owner" }),
  person({ name: "Mom", role: "adult" }),
  person({ name: "Anna", role: "staff", title: "Nanny" }),
  person({ name: "Gone", role: "staff", active: false }),
  person({ name: "Nora", role: "child" }),
  person({ name: "Theo", role: "child" }),
];

test("roles slice the house, and an inactive person is in none of them", () => {
  assert.deepEqual(staffNames(HOUSE), ["Anna"]);
  assert.deepEqual(childNames(HOUSE), ["Nora", "Theo"]);
  assert.deepEqual(byRole(HOUSE, "owner").map((p) => p.name), ["Dad"]);
  assert.deepEqual(workerNames(HOUSE), ["Dad", "Mom", "Anna"], "children are never assignable");
});

test("findPerson is case- and whitespace-forgiving", () => {
  assert.equal(findPerson(HOUSE, "anna")?.name, "Anna");
  assert.equal(findPerson(HOUSE, "  Anna  ")?.name, "Anna");
  assert.equal(findPerson(HOUSE, "Nobody"), undefined);
});

test("⛔ the person palette never borrows a status or action colour", () => {
  // green = done, amber = left undone, red = overdue, #6ea8ff = every link.
  const banned = ["#34c77b", "#e8a33d", "#e8834a", "#6ea8ff", "#2f62d8"];
  for (const hue of PERSON_PALETTE) {
    assert.ok(!banned.includes(hue.toLowerCase()), `${hue} already means something else`);
  }
});

test("tones invert on a dark ground: a tinted plate carrying a light hue", () => {
  const t = toneFor(person({ color: "#7c3aed" }));
  assert.equal(t.chip, "#7c3aed");
  assert.equal(t.ink, "#7c3aed");
  assert.equal(t.bg, "rgba(124,58,237,0.18)");
});

test("a person with no colour still gets a stable one, and garbage degrades safely", () => {
  assert.equal(toneFor(person(), 0).chip, PERSON_PALETTE[0]);
  assert.equal(toneFor(person(), 1).chip, PERSON_PALETTE[1]);
  assert.equal(toneFor(person(), PERSON_PALETTE.length).chip, PERSON_PALETTE[0], "wraps");
  assert.equal(toneFor(person({ color: "not-a-hex" })).chip, "var(--muted)");

  const map = toneMap([person({ name: "A" }), person({ name: "B" })]);
  assert.deepEqual(Object.keys(map), ["A", "B"]);
});

test("validatePerson holds the line on names, codes and rates", () => {
  assert.equal(validatePerson({ name: "  ", role: "staff" }).ok, false);
  assert.equal(validatePerson({ name: "Anna" }).ok, false, "a role is required");
  assert.equal(validatePerson({ name: "Anna", role: "staff", pin: "12" }).ok, false, "a code is 4–8 digits");
  assert.equal(validatePerson({ name: "Anna", role: "staff", pin: "abcd" }).ok, false);
  assert.equal(validatePerson({ name: "Anna", role: "staff", pay_rate_cents: -1 }).ok, false);
  assert.equal(validatePerson({ name: "Anna", role: "staff", birthday: "August" }).ok, false);

  const ok = validatePerson({ name: "  Anna  ", role: "staff", title: "Nanny", pin: "4321", pay_kind: "hourly", pay_rate_cents: 2500 });
  assert.equal(ok.ok, true);
  const p = (ok as { person: Omit<Person, "id"> }).person;
  assert.equal(p.name, "Anna", "trimmed");
  assert.equal(p.active, true);
  assert.equal(p.sort_order, 100);
});
