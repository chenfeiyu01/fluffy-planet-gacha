import { traceSilhouette } from "./cardSilhouette.js";
const layouts = new Map();
export function frameLayout(image) {
  if (layouts.has(image.src)) return layouts.get(image.src);
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, 800, 1200);
  const pixels = ctx.getImageData(0, 0, 800, 1200).data;
  const seen = new Uint8Array(800 * 1200),
    queue = new Int32Array(800 * 1200);
  const start = 450 * 800 + 400;
  if (pixels[start * 4 + 3] > 200)
    throw new Error("Frame picture opening must contain real transparency");
  let head = 0,
    tail = 1;
  queue[0] = start;
  seen[start] = 1;
  let left = 800,
    top = 1200,
    right = 0,
    bottom = 0;
  while (head < tail) {
    const i = queue[head++],
      x = i % 800,
      y = Math.floor(i / 800);
    left = Math.min(left, x);
    right = Math.max(right, x);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
    for (const n of [
      x > 0 ? i - 1 : -1,
      x < 799 ? i + 1 : -1,
      y > 0 ? i - 800 : -1,
      y < 1199 ? i + 800 : -1,
    ])
      if (n >= 0 && !seen[n] && pixels[n * 4 + 3] < 220) {
        seen[n] = 1;
        queue[tail++] = n;
      }
  }
  if (left === 0 || top === 0 || right === 799 || bottom === 1199)
    throw new Error("Frame opening is not enclosed");
  const mask = document.createElement("canvas");
  mask.width = 800;
  mask.height = 1200;
  const m = mask.getContext("2d"),
    data = m.createImageData(800, 1200);
  for (let k = 0; k < tail; k++) {
    const i = queue[k];
    for (const n of [i, i - 1, i + 1, i - 800, i + 800])
      if (n >= 0 && n < seen.length) data.data[n * 4 + 3] = 255;
  }
  m.putImageData(data, 0, 0);
  const layout = {
    canvas,
    mask,
    box: { x: left - 1, y: top - 1, w: right - left + 3, h: bottom - top + 3 },
  };
  layouts.set(image.src, layout);
  return layout;
}
export function drawCover(ctx, image, source, box) {
  const [sx, sy, sw, sh] = source,
    scale = Math.max(box.w / sw, box.h / sh),
    cw = box.w / scale,
    ch = box.h / scale;
  ctx.drawImage(
    image,
    sx + (sw - cw) / 2,
    sy + (sh - ch) / 2,
    cw,
    ch,
    box.x,
    box.y,
    box.w,
    box.h,
  );
}
export function canvasOutline(canvas) {
  const sample = document.createElement("canvas");
  sample.width = 160;
  sample.height = 240;
  const ctx = sample.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(canvas, 0, 0, 160, 240);
  const rgba = ctx.getImageData(0, 0, 160, 240).data,
    alpha = new Uint8Array(160 * 240);
  for (let i = 0; i < alpha.length; i++) alpha[i] = rgba[i * 4 + 3];
  return traceSilhouette(alpha, 160, 240);
}
export function composeFramedCard(image, source, frame, card) {
  const { canvas: overlay, mask, box } = frameLayout(frame);
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  drawCover(ctx, image, source, box);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(mask, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(overlay, 0, 0);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '42px "Fluffy Display",sans-serif';
  ctx.fillStyle = card.rarity === "SSR" ? "#624c76" : "#80545d";
  ctx.fillText(card.name, 400, card.rarity === "SSR" ? 899 : 927, 350);
  return {
    canvas,
    url: canvas.toDataURL("image/png"),
    outline: canvasOutline(canvas),
  };
}
