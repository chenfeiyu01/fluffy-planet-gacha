let ctx;
export function sound(kind, enabled) {
  if (!enabled) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    const notes =
      kind === "rare"
        ? [523, 659, 784, 1046, 1318]
        : kind === "reveal"
          ? [523, 659, 880]
          : kind === "draw"
            ? [262, 330, 392, 523]
            : [660];
    notes.forEach((hz, i) => {
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = hz;
      o.connect(g);
      g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.1;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.055, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.48);
      o.start(t);
      o.stop(t + 0.5);
    });
  } catch {
    /* Sound is optional; interaction remains usable. */
  }
}
