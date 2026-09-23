import { loadCollectionArtwork } from "./collectionArtwork";
import { CARDS } from "./data";
import { loadImage } from "./cardArtwork";
const media = new Map();
export const mediaUrl = (path) => media.get(path) || path;
export const loadViewer = () => import("./components/CardViewer");
async function bufferVideo(path) {
  if (media.has(path)) return;
  const response = await fetch(path, { signal: AbortSignal.timeout(180000) });
  if (!response.ok) throw new Error(path);
  const url = URL.createObjectURL(await response.blob());
  try {
    await new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const timer = setTimeout(
        () => finish(new Error("video decode timeout")),
        15000,
      );
      const finish = (error) => {
        clearTimeout(timer);
        video.onloadeddata = null;
        video.onerror = null;
        video.removeAttribute("src");
        video.load();
        error ? reject(error) : resolve();
      };
      video.muted = true;
      video.preload = "auto";
      video.onloadeddata = () => finish();
      video.onerror = () => finish(new Error(path));
      video.src = url;
      video.load();
    });
    media.set(path, url);
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}
async function bounded(job) {
  let timer;
  try {
    return await Promise.race([
      job(),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("preload timeout")), 210000);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
export async function preload(onProgress) {
  const jobs = [
    ...[
      "/art/fluffy-planet-logo-v3.webp",
      "/art/loading-garden.webp",
      "/art/scene.webp",
      "/art/summon-first-frame.webp",
      "/art/buttons.webp",
      "/art/final/card-bag.webp",
    ].map((path) => () => loadImage(path)),
    () => bufferVideo("/media/home-idle.mp4"),
    () => bufferVideo("/media/summon.mp4"),
    () => document.fonts.load('40px "Fluffy Display"'),
    ...CARDS.flatMap((card) => [
      () => loadCollectionArtwork(card),
      () => loadCollectionArtwork(card, true),
    ]),
  ];
  let cursor = 0,
    done = 0;
  const errors = [];
  onProgress(0);
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (cursor < jobs.length) {
        const job = jobs[cursor++];
        try {
          await bounded(job);
          done++;
          onProgress(Math.round((done / jobs.length) * 100));
        } catch (e) {
          errors.push(e);
        }
      }
    }),
  );
  if (errors.length) throw new Error(`${errors.length} 项素材尚未准备好`);
}
