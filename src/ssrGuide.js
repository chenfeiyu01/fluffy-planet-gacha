export const SSR_GUIDE_KEY = "fluffy-ssr-slide-seen-v1";
export function needsSSRGuide() {
  try {
    return localStorage.getItem(SSR_GUIDE_KEY) !== "1";
  } catch {
    return true;
  }
}
export function completeSSRGuide() {
  try {
    localStorage.setItem(SSR_GUIDE_KEY, "1");
  } catch {}
}
