// A single top-left image convention for the grid, reveal and WebGL viewer.
import { composeFramedCard } from "./frameArtwork.js";
import { mirrorOutline } from "./cardSilhouette.js";
const images = new Map();
const faces = new Map();
const readyFaces = new Map();
export function atlasRect(tile, width, height) {
  const x = Math.round(((tile % 5) * width) / 5);
  const y = Math.round((Math.floor(tile / 5) * height) / 2);
  return [
    x,
    y,
    Math.round((((tile % 5) + 1) * width) / 5) - x,
    Math.round(((Math.floor(tile / 5) + 1) * height) / 2) - y,
  ];
}
export function loadImage(src) {
  if (!images.has(src))
    images.set(
      src,
      new Promise((resolve, reject) => {
        const image = new Image();
        const timeout = setTimeout(() => {
          images.delete(src);
          image.onload = image.onerror = null;
          reject(new Error(`Image load timed out: ${src}`));
        }, 30000);
        image.onload = () => {
          clearTimeout(timeout);
          resolve(image);
        };
        image.onerror = () => {
          clearTimeout(timeout);
          images.delete(src);
          reject(new Error(`Unable to load ${src}`));
        };
        image.src = src;
      }),
    );
  return images.get(src);
}
export function loadCardArtwork(card, alternate = false) {
  const key = `${card.id}:${alternate}`;
  if (!faces.has(key))
    faces.set(
      key,
      (async () => {
        const source = await loadImage(
          alternate && card.alternate
            ? card.alternate
            : card.image || card.atlas || "/art/characters/atlas/friends.webp",
        );
        await document.fonts.load('40px "Fluffy Display"');
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 1200;
        const ctx = canvas.getContext("2d");
        const [sx, sy, sw, sh] =
          card.tile === undefined
            ? [0, 0, source.width, source.height]
            : atlasRect(card.tile, source.width, source.height);
        if (card.rarity !== "R") {
          const frame = await loadImage(
            `/art/card-parts/frames/${card.rarity.toLowerCase()}-frame.webp`,
          );
          const result = composeFramedCard(source, [sx, sy, sw, sh], frame, card);
          readyFaces.set(key, result);
          return result;
        }
        const finish = {
          R: {
            colors: ["#fffbed", "#e9e3c8", "#d8e9df", "#fff9e9"],
            rim: "#b9b994",
            ink: "#73887d",
          },
          SR: {
            colors: ["#f9ecff", "#c4b0df", "#dce5ff", "#fff0f4"],
            rim: "#a99bc9",
            ink: "#826ca8",
          },
          SSR: {
            colors: ["#fff1cb", "#e2b27f", "#f2c2d7", "#fff4d4"],
            rim: "#bd915a",
            ink: "#956029",
          },
        }[card.rarity];
        const enamel = ctx.createLinearGradient(0, 0, 800, 1200);
        finish.colors.forEach((c, i) => enamel.addColorStop(i / 3, c));
        ctx.beginPath();
        ctx.roundRect(0, 0, 800, 1200, 30);
        ctx.clip();
        ctx.fillStyle = enamel;
        ctx.fillRect(0, 0, 800, 1200);
        // Artwork is inset inside the enamel binding, keeping the character's proportions.
        const box = { x: 42, y: 62, w: 716, h: 1076 };
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(box.x, box.y, box.w, box.h, 24);
        ctx.clip();
        const scale = Math.max(box.w / sw, box.h / sh);
        const cw = box.w / scale,
          ch = box.h / scale;
        ctx.drawImage(
          source,
          sx + (sw - cw) / 2,
          sy + (sh - ch) / 2,
          cw,
          ch,
          box.x,
          box.y,
          box.w,
          box.h,
        );
        const shade = ctx.createLinearGradient(0, 800, 0, 1138);
        shade.addColorStop(0, "transparent");
        shade.addColorStop(1, "#302241dc");
        ctx.fillStyle = shade;
        ctx.fillRect(42, 800, 716, 338);
        // A quiet pearlescent reflection remains visible even when the card is still.
        const glaze = ctx.createLinearGradient(60, 0, 720, 950);
        [
          [0, "#fffefc00"],
          [0.22, "#fffce21a"],
          [0.3, "#fffffb26"],
          [0.37, "#fff6fb00"],
          [0.7, "#e6d6ff10"],
          [1, "#fff0cd19"],
        ].forEach(([t, c]) => glaze.addColorStop(t, c));
        ctx.fillStyle = glaze;
        ctx.fillRect(42, 62, 716, 1076);
        ctx.restore();
        ctx.strokeStyle = finish.rim;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(12, 12, 776, 1176, 31);
        ctx.stroke();
        ctx.strokeStyle = "#fffdf0dd";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(19, 19, 762, 1162, 27);
        ctx.stroke();
        ctx.strokeStyle = finish.rim;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(39, 59, 722, 1082, 27);
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff8e7";
        ctx.shadowColor = "#25152e88";
        ctx.shadowBlur = 10;
        ctx.font = '46px "Fluffy Display", sans-serif';
        ctx.letterSpacing = "3px";
        ctx.fillText(card.name, 400, 976);
        ctx.shadowBlur = 0;
        ctx.font = "bold 68px Georgia, serif";
        ctx.letterSpacing = "6px";
        ctx.fillStyle = "#fff0c9";
        ctx.strokeStyle = "#59435c";
        ctx.lineWidth = 3;
        ctx.strokeText(card.rarity, 400, 1072);
        ctx.fillText(card.rarity, 400, 1072);
        const result = { canvas, url: canvas.toDataURL("image/png") };
        readyFaces.set(key, result);
        return result;
      })().catch((e) => {
        faces.delete(key);
        throw e;
      }),
    );
  return faces.get(key);
}
export const getCardArtwork = (card, alternate = false) =>
  readyFaces.get(`${card.id}:${alternate}`);

const backs = new Map();
const readyBacks = new Map();
const backKey = (card) => card.rarity === "R" ? "R" : card.id;
export function loadCardBack(card) {
  const key = backKey(card);
  if (!backs.has(key))
    backs.set(
      key,
      (async () => {
        const [front, image] = await Promise.all([
          card.rarity === "R" ? null : loadCardArtwork(card),
          loadImage(
            card.rarity === "SSR"
              ? "/art/card-parts/backs/ssr-back-art.webp"
              : "/art/card-parts/backs/card-back.webp",
          ),
        ]);
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 1200;
        const ctx = canvas.getContext("2d");
        const outline = front?.outline ? mirrorOutline(front.outline) : null;
        ctx.beginPath();
        if (outline) {
          outline.forEach(([x, y], i) =>
            i ? ctx.lineTo(x * 800, y * 1200) : ctx.moveTo(x * 800, y * 1200),
          );
          ctx.closePath();
        } else ctx.roundRect(0, 0, 800, 1200, 30);
        ctx.clip();
        ctx.drawImage(image, 0, 0, 800, 1200);
        const result = { canvas, url: canvas.toDataURL("image/png"), outline };
        readyBacks.set(key, result);
        return result;
      })().catch((e) => {
        backs.delete(key);
        throw e;
      }),
    );
  return backs.get(key);
}
export const getCardBack = (card) => readyBacks.get(backKey(card));
