import { loadCardArtwork, loadCardBack } from './cardArtwork';

// Album-only, decoded thumbnails. Full-size artwork stays available to the viewer.
const pending = new Map();
const ready = new Map();
const keyFor = (card, back) => `${card.id}:${back ? 'back' : 'front'}`;
export function getCollectionArtwork(card, back = false) {
  return ready.get(keyFor(card, back));
}
export function loadCollectionArtwork(card, back = false) {
  const key = keyFor(card, back);
  if (!pending.has(key)) {
    pending.set(key, (async () => {
      const artwork = await (back ? loadCardBack(card) : loadCardArtwork(card));
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 540;
      const context = canvas.getContext('2d');
      context.drawImage(artwork.canvas, 0, 0, 360, 540);
      const blob = await new Promise((resolve, reject) => canvas.toBlob(
        result => result ? resolve(result) : reject(new Error('Album thumbnail failed')),
        'image/webp', 0.88,
      ));
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.src = url;
      try { await image.decode(); }
      catch (error) { URL.revokeObjectURL(url); throw error; }
      const result = { url, image };
      ready.set(key, result);
      return result;
    })().catch(error => { pending.delete(key); throw error; }));
  }
  return pending.get(key);
}
