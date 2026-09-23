import test from "node:test";
import assert from "node:assert/strict";
import { traceSilhouette, mirrorOutline } from "../src/cardSilhouette.js";
test("silhouette preserves a wing and ignores an interior artwork hole", () => {
  const w = 12,
    h = 16,
    a = new Uint8Array(w * h);
  for (let y = 2; y < 14; y++) for (let x = 2; x < 9; x++) a[y * w + x] = 255;
  for (let y = 8; y < 12; y++) for (let x = 9; x < 12; x++) a[y * w + x] = 255;
  a[5 * w + 5] = 0;
  const outline = traceSilhouette(a, w, h);
  assert.equal(Math.max(...outline.map((p) => p[0])), 1);
  assert.equal(Math.min(...outline.map((p) => p[0])), 2 / 12);
  assert.ok(outline.some(([x, y]) => x === 9 / 12 && y === 8 / 16));
  assert.ok(!outline.some(([x, y]) => x === 5 / 12 && y === 5 / 16));
  const back = mirrorOutline(outline);
  for (let i = 0; i < outline.length; i++)
    assert.ok(
      Math.abs(back[back.length - 1 - i][0] + outline[i][0] - 1) < 1e-12,
    );
});
test("detached texture speckles do not become part of the card body", () => {
  const a = new Uint8Array(100);
  for (let y = 2; y < 8; y++) for (let x = 2; x < 8; x++) a[y * 10 + x] = 255;
  a[0] = 255;
  assert.equal(traceSilhouette(a, 10, 10).length, 4);
});
