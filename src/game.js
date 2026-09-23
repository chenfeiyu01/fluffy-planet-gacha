import { CARDS, CARD_MAP } from "./data.js";
export const STORAGE_KEY = "fluffy-planet-v1";
export const emptyState = () => ({
  version: 1,
  pity: 0,
  total: 0,
  collection: {},
  history: [],
  pending: [],
});
export function readState(storage) {
  try {
    const raw = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!raw || raw.version !== 1) return emptyState();
    const state = emptyState();
    state.pity = Math.max(0, Math.min(29, Number(raw.pity) || 0));
    state.total = Math.max(0, Number(raw.total) || 0);
    for (const [id, n] of Object.entries(raw.collection || {})) {
      if (CARD_MAP[id] && Number.isInteger(n) && n > 0)
        state.collection[id] = n;
    }
    state.history = (Array.isArray(raw.history) ? raw.history : [])
      .filter((x) => CARD_MAP[x.id])
      .slice(0, 100);
    state.pending = (Array.isArray(raw.pending) ? raw.pending : []).filter(
      (x) => CARD_MAP[x.id],
    );
    return state;
  } catch {
    return emptyState();
  }
}
export function drawCards(state, count, rng = Math.random, now = Date.now()) {
  if (![1, 10].includes(count))
    throw new Error("Only single or ten draws supported");
  if (state.pending.length) throw new Error("Finish the current draw first");
  const next = {
    ...state,
    collection: { ...state.collection },
    history: [...state.history],
    pending: [],
  };
  let higher = false;
  for (let i = 0; i < count; i++) {
    const roll = rng();
    let rarity =
      next.pity >= 29 || roll < 0.05 ? "SSR" : roll < 0.25 ? "SR" : "R";
    if (count === 10 && i === 9 && !higher && rarity === "R") rarity = "SR";
    const pool = CARDS.filter((c) => c.rarity === rarity),
      card = pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
    const item = {
      id: card.id,
      isNew: !next.collection[card.id],
      serial: next.total + 1,
      time: now,
    };
    next.collection[card.id] = (next.collection[card.id] || 0) + 1;
    next.total++;
    next.pity = rarity === "SSR" ? 0 : next.pity + 1;
    higher ||= rarity !== "R";
    next.pending.push(item);
    next.history.unshift(item);
  }
  next.history = next.history.slice(0, 100);
  return next;
}
