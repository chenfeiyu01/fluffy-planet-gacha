import test from "node:test";
import assert from "node:assert/strict";
import { atlasRect } from "../src/cardArtwork.js";
import { CARD_MAP } from "../src/data.js";
test("capybara uses bottom-left image, penguin uses top-left, with no Y inversion", () => {
  assert.deepEqual(
    atlasRect(CARD_MAP.penguin.tile, 1619, 971),
    [0, 0, 324, 486],
  );
  assert.deepEqual(
    atlasRect(CARD_MAP.capy.tile, 1619, 971),
    [0, 486, 324, 485],
  );
});
test("atlas tiles cover each pixel once even for non-divisible dimensions", () => {
  for (let row = 0; row < 2; row++) {
    let end = 0;
    for (let col = 0; col < 5; col++) {
      const [x, y, w, h] = atlasRect(row * 5 + col, 1619, 971);
      assert.equal(x, end);
      end = x + w;
      assert.equal(y, row === 0 ? 0 : 486);
      assert.equal(y + h, row === 0 ? 486 : 971);
    }
    assert.equal(end, 1619);
  }
});
