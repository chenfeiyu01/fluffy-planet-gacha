import { loadCollectionArtwork } from "./collectionArtwork";
import { CARDS } from "./data";
import { loadCardArtwork, loadImage } from "./cardArtwork";
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
      "/art/screen/fluffy-planet-logo-v3.webp",
      "/art/screen/loading-garden.webp",
      "/art/screen/scene.webp",
      "/art/screen/summon-first-frame.webp",
      "/art/screen/buttons.webp",
      "/art/card-parts/pocket/card-bag.webp",
    ].map((path) => () => loadImage(path)),
    () => bufferVideo("/media/home-idle.mp4"),
    () => bufferVideo("/media/summon.mp4"),
    () => document.fonts.load('40px "Fluffy Display"'),
    ...CARDS.slice(0, 4).map((card) => () => loadCardArtwork(card)),
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
  // Keep the first screen independent of the full catalogue; prepare thumbnails in idle time.
  void warmCollection();
}

let warming = false;
async function warmCollection() {
  if (warming) return;
  warming = true;
  for (const card of CARDS.slice(0, 4)) {
    for (const back of [false, true]) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      try { await loadCollectionArtwork(card, back); }
      catch (error) { console.error(error); }
    }
  }
}
