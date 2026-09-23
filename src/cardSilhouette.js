// Trace the largest exterior boundary. Interior texture holes are not physical holes.
export function traceSilhouette(alpha, width, height) {
  const edges = new Map();
  const filled = (x, y) =>
    x >= 0 && y >= 0 && x < width && y < height && alpha[y * width + x] > 48;
  const add = (x, y, a, b) => {
    const key = y * (width + 1) + x;
    if (!edges.has(key)) edges.set(key, []);
    edges.get(key).push(b * (width + 1) + a);
  };
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (filled(x, y)) {
        if (!filled(x, y - 1)) add(x, y, x + 1, y);
        if (!filled(x + 1, y)) add(x + 1, y, x + 1, y + 1);
        if (!filled(x, y + 1)) add(x + 1, y + 1, x, y + 1);
        if (!filled(x - 1, y)) add(x, y + 1, x, y);
      }
  let best = [],
    area = 0;
  while (edges.size) {
    const start = edges.keys().next().value;
    let key = start,
      loop = [];
    do {
      loop.push([key % (width + 1), Math.floor(key / (width + 1))]);
      const next = edges.get(key);
      if (!next?.length) break;
      const value = next.pop();
      if (!next.length) edges.delete(key);
      key = value;
    } while (key !== start && loop.length < (width + 1) * (height + 1));
    const a = Math.abs(
      loop.reduce((sum, p, i) => {
        const q = loop[(i + 1) % loop.length];
        return sum + p[0] * q[1] - q[0] * p[1];
      }, 0),
    );
    if (a > area) {
      area = a;
      best = loop;
    }
  }
  return best
    .filter((p, i) => {
      const a = best[(i + best.length - 1) % best.length],
        b = best[(i + 1) % best.length];
      return (p[0] - a[0]) * (b[1] - p[1]) !== (p[1] - a[1]) * (b[0] - p[0]);
    })
    .map(([x, y]) => [x / width, y / height]);
}

// The back has a mirrored outline in its own readable, face-on coordinate system.
export const mirrorOutline = (points) =>
  points.map(([x, y]) => [1 - x, y]).reverse();
