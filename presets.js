// Strange attractor presets.
// Each: name, fn(x,y,z,a,b,c) -> [dx,dy,dz] per unit step, params list, suggested scale, and initial point.
const PRESETS = [
  {
    name: "Lorenz",
    scale: 5,
    start: [0.1, 0, 20],
    fn: (x, y, z, a, b, c) => [a * (y - x), x * (b - z) - y, x * y - c * z],
    params: [
      { key: "sigma", value: 10, min: 1, max: 20, step: 0.1 },
      { key: "rho", value: 28, min: 5, max: 60, step: 0.1 },
      { key: "beta", value: 8 / 3, min: 0.5, max: 6, step: 0.05 },
    ],
  },
  {
    name: "Thomas",
    scale: 60,
    start: [0.1, 0, 0],
    fn: (x, y, z, a) => [Math.sin(y) - a * x, Math.sin(z) - a * y, Math.sin(x) - a * z],
    params: [
      { key: "b", value: 0.19, min: 0.05, max: 0.35, step: 0.005 },
    ],
  },
  {
    name: "Aizawa",
    scale: 130,
    start: [0.1, 0, 0],
    fn: (x, y, z, a, b, c, d, e, f) => [
      (z - b) * x - d * y,
      d * x + (z - b) * y,
      c + a * z - z ** 3 / 3 - (x * x + y * y) * (1 + e * z) + f * z * x ** 3,
    ],
    params: [
      { key: "a", value: 0.95, min: 0.4, max: 1.5, step: 0.01 },
      { key: "b", value: 0.7, min: 0.2, max: 1.2, step: 0.01 },
      { key: "c", value: 0.6, min: 0.1, max: 1.5, step: 0.01 },
      { key: "d", value: 3.5, min: 1, max: 8, step: 0.05 },
      { key: "e", value: 0.25, min: 0, max: 0.6, step: 0.005 },
      { key: "f", value: 0.1, min: 0, max: 0.3, step: 0.005 },
    ],
  },
  {
    name: "Halvorsen",
    scale: 18,
    start: [-1.48, -1.51, 2.04],
    fn: (x, y, z, a) => [
      -a * x - 4 * y - 4 * z - y * y,
      -a * y - 4 * z - 4 * x - z * z,
      -a * z - 4 * x - 4 * y - x * x,
    ],
    params: [
      { key: "a", value: 1.4, min: 0.6, max: 2.2, step: 0.01 },
    ],
  },
  {
    name: "Rossler",
    scale: 11,
    start: [0.1, 0, 0],
    fn: (x, y, z, a, b, c) => [-y - z, x + a * y, b + z * (x - c)],
    params: [
      { key: "a", value: 0.2, min: 0.05, max: 0.45, step: 0.005 },
      { key: "b", value: 0.2, min: 0.05, max: 1, step: 0.01 },
      { key: "c", value: 5.7, min: 2, max: 14, step: 0.05 },
    ],
  },
  {
    name: "Chen-Lee",
    scale: 7,
    start: [1, 1, 1],
    fn: (x, y, z, a, b, c) => [a * x - y * z, b * y + x * z, c * z + x * y / 3],
    params: [
      { key: "a", value: 5, min: 2, max: 8, step: 0.05 },
      { key: "b", value: -10, min: -16, max: -4, step: 0.1 },
      { key: "c", value: -0.38, min: -1.5, max: 0.5, step: 0.01 },
    ],
  },
  {
    name: "Sprott",
    scale: 10,
    start: [0.1, 0.2, 0.1],
    fn: (x, y, z, a, b) => [y, a * x - y - x * z, x * y - b * z],
    params: [
      { key: "a", value: 2, min: 1.2, max: 3, step: 0.01 },
      { key: "b", value: 2, min: 0.5, max: 6, step: 0.05 },
    ],
  },
  {
    name: "Dadras",
    scale: 20,
    start: [1.1, 2.1, -2],
    fn: (x, y, z, a, b, c, d, e) => [
      y - a * x + b * y * z,
      c * y - x * z + z,
      d * x * y - e * z,
    ],
    params: [
      { key: "a", value: 3, min: 1, max: 6, step: 0.05 },
      { key: "b", value: 2.7, min: 1, max: 5, step: 0.05 },
      { key: "c", value: 1.7, min: 0.5, max: 4, step: 0.05 },
      { key: "d", value: 2, min: 0.5, max: 4, step: 0.05 },
      { key: "e", value: 9, min: 4, max: 16, step: 0.1 },
    ],
  },
];
