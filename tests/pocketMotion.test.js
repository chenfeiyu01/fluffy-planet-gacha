import test from "node:test";
import assert from "node:assert/strict";
import { pocketFlight } from "../src/pocketMotion.js";
for (const [width, height] of [
  [320, 568],
  [375, 667],
  [390, 844],
  [1536, 1024],
]) {
  test(`collection path enters the real mouth at ${width}x${height}`, () => {
    const rect = { left: 40, top: 120, right: 300, width: 260, height: 390 };
    const f = pocketFlight(rect, 0, 10, { width, height });
    assert.equal(f.x + f.w / 2 + f.dx, width / 2);
    assert.ok(f.y + f.h / 2 + f.hoverY + (f.h * f.entryScale) / 2 < f.mouth);
    assert.ok(f.y + f.h / 2 + f.enterY - (f.h * f.entryScale) / 2 > f.mouth);
    assert.ok(f.w * f.stackScale <= 148);
    assert.ok(
      f.mouth + 236 <= height,
      "pouch body and confirmation fit below the mouth",
    );
  });
}
test("offscreen carousel cards stay outside the viewport before gathering", () => {
  const right = pocketFlight(
    { left: 1900, right: 2160, top: 200, width: 260, height: 390 },
    9,
    10,
    { width: 390, height: 844 },
  );
  const left = pocketFlight(
    { left: -900, right: -640, top: 200, width: 260, height: 390 },
    0,
    10,
    { width: 390, height: 844 },
  );
  assert.ok(right.x > 390);
  assert.ok(left.x + left.w < 0);
});
