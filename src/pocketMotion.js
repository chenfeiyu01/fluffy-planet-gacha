export function pocketFlight(rect, index, count, viewport) {
  const { width, height } = viewport;
  const visible = rect.right > 0 && rect.left < width;
  const x = visible ? rect.left : rect.left < 0 ? -rect.width - 24 : width + 24;
  const y = visible ? rect.top : height * 0.32;
  const cx = x + rect.width / 2,
    cy = y + rect.height / 2;
  const mouth = Math.min(Math.round(height * 0.78), height - 244);
  const stackWidth = Math.min(148, width * 0.38),
    entryWidth = Math.min(108, width * 0.28);
  const entryHeight = (rect.height * entryWidth) / rect.width;
  return {
    x,
    y,
    w: rect.width,
    h: rect.height,
    mouth,
    gx: width / 2 - cx + (index - (count - 1) / 2) * 1.6,
    gy: height * 0.4 - cy,
    dx: width / 2 - cx,
    hoverY: mouth - entryHeight / 2 - 20 - cy,
    enterY: mouth + entryHeight / 2 + 20 - cy,
    stackScale: stackWidth / rect.width,
    entryScale: entryWidth / rect.width,
    tilt: (index - (count - 1) / 2) * 0.8,
  };
}
