import test from "node:test";
import assert from "node:assert/strict";
import {
  anyCodeConfigured,
  checkPin,
  checkTeamPin,
  familyDoor,
  isOwnerName,
  pinEnvKey,
  teamDoor,
  teamPinEnvKey,
} from "./door.ts";
import type { Person } from "./people.ts";

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

function withEnv(vars: Record<string, string | undefined>, fn: () => void) {
  const saved: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(vars)) {
    saved[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

test("env key names survive spaces and punctuation in a name", () => {
  assert.equal(pinEnvKey("Anna"), "HM_PIN_ANNA");
  assert.equal(pinEnvKey("Mary-Kate O'Hara"), "HM_PIN_MARY_KATE_O_HARA");
  assert.equal(teamPinEnvKey("Anna"), "HM_TEAM_PIN_ANNA");
});

test("the family door is owners and adults — never children, never staff", () => {
  const people = [
    person({ name: "Dad", role: "owner" }),
    person({ name: "Mom", role: "adult" }),
    person({ name: "Anna", role: "staff" }),
    person({ name: "Nora", role: "child" }),
  ];
  withEnv({ HM_OWNER: undefined }, () => {
    assert.deepEqual(familyDoor(people), ["Dad", "Mom"]);
  });
});

test("the bootstrap owner exists before the database does, and is not duplicated", () => {
  withEnv({ HM_OWNER: "Dad" }, () => {
    assert.deepEqual(familyDoor([]), ["Dad"]);
    assert.deepEqual(familyDoor([person({ name: "Dad", role: "owner" })]), ["Dad"]);
  });
});

test("🔴 an unset code must never mean open", () => {
  const people = [person({ name: "Dad", role: "owner", pin: null })];
  withEnv({ HM_OWNER: undefined, HM_PIN_DAD: undefined }, () => {
    assert.equal(checkPin("Dad", "1234", people), false);
    assert.equal(checkPin("Dad", "", people), false);
    assert.equal(anyCodeConfigured(["Dad"], people), false);
  });
});

test("env beats the table so a code can be rotated without a database write", () => {
  const people = [person({ name: "Dad", role: "owner", pin: "1111" })];
  withEnv({ HM_OWNER: undefined, HM_PIN_DAD: "2222" }, () => {
    assert.equal(checkPin("Dad", "2222", people), true);
    assert.equal(checkPin("Dad", "1111", people), false, "the old table code stops working");
    assert.equal(anyCodeConfigured(["Dad"], people), true);
  });
});

test("a code only opens its own person's door", () => {
  const people = [
    person({ name: "Dad", role: "owner", pin: "1111" }),
    person({ name: "Mom", role: "adult", pin: "2222" }),
  ];
  withEnv({ HM_OWNER: undefined, HM_PIN_DAD: undefined, HM_PIN_MOM: undefined }, () => {
    assert.equal(checkPin("Dad", "1111", people), true);
    assert.equal(checkPin("Dad", "2222", people), false);
    assert.equal(checkPin("Mom", "1111", people), false);
  });
});

test("⛔ no shared code and no master code opens the team door", () => {
  const people = [person({ name: "Anna", role: "staff", pin: "4321" })];
  withEnv({ HM_TEAM_PIN_ANNA: undefined, MASTER_PIN: "8008", HM_PIN: "1234" }, () => {
    assert.equal(checkTeamPin("Anna", "4321", people), true);
    assert.equal(checkTeamPin("Anna", "8008", people), false, "no master override exists");
    assert.equal(checkTeamPin("Anna", "1234", people), false, "no shared code exists");
  });
});

test("the staff door is staff only, and an inactive person is locked out", () => {
  const people = [
    person({ name: "Anna", role: "staff", pin: "4321" }),
    person({ name: "Dad", role: "owner", pin: "1111" }),
    person({ name: "Gone", role: "staff", pin: "5555", active: false }),
  ];
  withEnv({ HM_TEAM_PIN_ANNA: undefined, HM_TEAM_PIN_DAD: undefined, HM_TEAM_PIN_GONE: undefined }, () => {
    assert.deepEqual(teamDoor(people), ["Anna"]);
    assert.equal(checkTeamPin("Dad", "1111", people), false, "the family door is not this door");
    assert.equal(checkTeamPin("Gone", "5555", people), false);
  });
});

test("owners see money; adults do not, and the bootstrap owner always does", () => {
  const people = [
    person({ name: "Dad", role: "owner" }),
    person({ name: "Mom", role: "adult" }),
    person({ name: "Anna", role: "staff" }),
  ];
  withEnv({ HM_OWNER: undefined }, () => {
    assert.equal(isOwnerName("Dad", people), true);
    assert.equal(isOwnerName("Mom", people), false);
    assert.equal(isOwnerName("Anna", people), false);
    assert.equal(isOwnerName("Nobody", people), false);
  });
  withEnv({ HM_OWNER: "Boot" }, () => {
    assert.equal(isOwnerName("Boot", []), true, "before the database exists");
  });
});

test("a staff member with no code set cannot sign in", () => {
  const people = [person({ name: "Anna", role: "staff", pin: null })];
  withEnv({ HM_TEAM_PIN_ANNA: undefined }, () => {
    assert.equal(checkTeamPin("Anna", "0000", people), false);
    assert.equal(checkTeamPin("Anna", "", people), false);
  });
});
