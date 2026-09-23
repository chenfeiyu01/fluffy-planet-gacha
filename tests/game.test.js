import test from "node:test";
import assert from "node:assert/strict";
import { drawCards, emptyState, readState, STORAGE_KEY } from "../src/game.js";
import { CARD_MAP } from "../src/data.js";
test("ten draws contain SR even with all R rolls, and collection records ten", () => {
  const s = drawCards(emptyState(), 10, () => 0.99, 100);
  assert.equal(s.total, 10);
  assert.equal(s.pending.length, 10);
  assert.equal(CARD_MAP[s.pending[9].id].rarity, "SR");
  assert.equal(
    Object.values(s.collection).reduce((a, b) => a + b, 0),
    10,
  );
  assert.equal(s.pending.filter((x) => x.isNew).length, 2);
});
test("30th guaranteed SSR resets pity across single and ten draws", () => {
  let s = emptyState();
  for (let i = 0; i < 2; i++) {
    s = drawCards(s, 10, () => 0.99);
    s.pending = [];
  }
  for (let i = 0; i < 9; i++) {
    s = drawCards(s, 1, () => 0.99);
    s.pending = [];
  }
  assert.equal(s.pity, 29);
  s = drawCards(s, 1, () => 0.99);
  assert.equal(CARD_MAP[s.pending[0].id].rarity, "SSR");
  assert.equal(s.pity, 0);
  assert.equal(s.total, 30);
});
test("natural SSR resets pity; single SSR needs no forced SR in ten pack", () => {
  const s = { ...emptyState(), pity: 18 };
  let i = 0;
  const next = drawCards(s, 10, () => (i++ === 0 ? 0.01 : 0.99));
  assert.equal(CARD_MAP[next.pending[0].id].rarity, "SSR");
  assert.equal(CARD_MAP[next.pending[9].id].rarity, "R");
  assert.equal(next.pity, 9);
});
test("cannot double-draw while results pending; original state is untouched", () => {
  const start = emptyState(),
    s = drawCards(start, 1, () => 0.99);
  assert.throws(() => drawCards(s, 10));
  assert.deepEqual(start, emptyState());
});
test("saved pending cards and history restore after reload", () => {
  const s = drawCards(emptyState(), 10, () => 0.99, 123);
  const restored = readState({
    getItem: (k) => (k === STORAGE_KEY ? JSON.stringify(s) : null),
  });
  assert.deepEqual(restored, s);
});
test("malformed storage does not prevent app boot; invalid card ids ignored", () => {
  assert.deepEqual(readState({ getItem: () => "{oops" }), emptyState());
  assert.deepEqual(
    readState({
      getItem: () =>
        JSON.stringify({
          version: 1,
          collection: { unknown: 4, bunny: -1 },
          pending: [{ id: "bad" }],
        }),
    }).collection,
    {},
  );
});
