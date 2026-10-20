// Strange Attractor Forge — interactive 3D strange-attractor trail renderer.
"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { alpha: false });

const els = {
  preset: document.getElementById("preset"),
  scale: document.getElementById("scale"),
  speed: document.getElementById("speed"),
  fade: document.getElementById("fade"),
  hue: document.getElementById("hue"),
  params: document.getElementById("params"),
  randomize: document.getElementById("randomize"),
  reseed: document.getElementById("reseed"),
  export: document.getElementById("export"),
  copy: document.getElementById("copy"),
  info: document.getElementById("info"),
};

// ---- state ----
let W = 0, H = 0, dpr = 1;
let preset = null;
let paramValues = [];
let pos = [0, 0, 0];
let rotation = { x: -0.35, y: 0 };
let autoRotate = true;
let hue = 0;
let dt = 0.005;
let running = true;

// ---- share links (URL hash: #<presetName>:p1,p2,...) ----
function encodeState() {
  return `#${preset.name}:${paramValues.map((v) => v.toFixed(4)).join(",")}`;
}
function decodeState(hash) {
  try {
    const m = /^#([A-Za-z-]+):([\d.,eE+-]+)$/.exec(hash || "");
    if (!m) return null;
    const idx = PRESETS.findIndex((p) => p.name.toLowerCase() === m[1].toLowerCase());
    if (idx < 0) return null;
    const values = m[2].split(",").map(Number);
    const def = PRESETS[idx].params;
    if (values.length !== def.length || values.some((v) => !isFinite(v))) return null;
    // clamp to slider ranges
    const clamped = values.map((v, i) =>
      Math.max(def[i].min, Math.min(def[i].max, v))
    );
    return { presetIndex: idx, values: clamped };
  } catch {
    return null;
  }
}

// ---- helpers ----
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  W = Math.max(1, Math.floor(rect.width));
  H = Math.max(1, Math.floor(rect.height));
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#0b0d10";
  ctx.fillRect(0, 0, W, H);
}

function seedPoint() {
  // small random offset around the preset's start point so each run differs
  const s = preset.start;
  return [
    s[0] + (Math.random() - 0.5) * 0.2,
    s[1] + (Math.random() - 0.5) * 0.2,
    s[2] + (Math.random() - 0.5) * 0.2,
  ];
}

function stepPoint(p) {
  const f = preset.fn;
  const v = paramValues;
  const k1 = f(p[0], p[1], p[2], ...v);
  const mid = [p[0] + k1[0] * dt / 2, p[1] + k1[1] * dt / 2, p[2] + k1[2] * dt / 2];
  const k2 = f(mid[0], mid[1], mid[2], ...v);
  return [
    p[0] + k2[0] * dt,
    p[1] + k2[1] * dt,
    p[2] + k2[2] * dt,
  ];
}

function project(p) {
  // rotate Y then X, orthographic projection
  const cy = Math.cos(rotation.y), sy = Math.sin(rotation.y);
  const cx = Math.cos(rotation.x), sx = Math.sin(rotation.x);
  let x = p[0] * cy + p[2] * sy;
  let z = -p[0] * sy + p[2] * cy;
  let y = p[1] * cx - z * sx;
  z = p[1] * sx + z * cx;
  const s = +els.scale.value;
  return [W / 2 + x * s, H / 2 - y * s, z];
}

function hsl(h, l, a) {
  return `hsla(${((h % 360) + 360) % 360}, 85%, ${l}%, ${a})`;
}

// ---- rendering ----
function drawSteps(n) {
  const speed = +els.speed.value;
  const hueSpeed = +els.hue.value;
  const scale = +els.scale.value;
  const maxCoord = Math.max(
    Math.abs(project([1, 1, 1])[0] - W / 2) / 1, 1
  );
  ctx.lineWidth = Math.max(0.6, scale / 300);
  ctx.lineCap = "round";
  for (let i = 0; i < speed; i++) {
    const next = stepPoint(pos);
    // guard against blow-ups (parameter combos can diverge)
    if (!isFinite(next[0]) || Math.abs(next[0]) > 1e4 ||
        Math.abs(next[1]) > 1e4 || Math.abs(next[2]) > 1e4) {
      reseed();
      return;
    }
    const a = project(pos);
    const b = project(next);
    const depth = Math.max(0, Math.min(1, (b[2] / 30) + 0.5));
    ctx.strokeStyle = hsl(hue, 45 + depth * 30, 0.55 + depth * 0.35);
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
    pos = next;
    hue += hueSpeed * 0.02;
  }
}

function frame() {
  if (running) {
    const fade = +els.fade.value;
    if (fade > 0) {
      ctx.fillStyle = `rgba(11, 13, 16, ${fade / 24})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (autoRotate) rotation.y += 0.0016;
    drawSteps();
  }
  requestAnimationFrame(frame);
}

function reseed() {
  pos = seedPoint();
  hue = Math.random() * 360;
  ctx.fillStyle = "#0b0d10";
  ctx.fillRect(0, 0, W, H);
  // burn in so the trail starts on the attractor
  for (let i = 0; i < 200; i++) pos = stepPoint(pos);
}

// ---- UI ----
function buildPresetSelect() {
  PRESETS.forEach((p, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = p.name;
    els.preset.appendChild(o);
  });
}

function buildParamSliders() {
  els.params.innerHTML = "";
  paramValues = preset.params.map((p) => p.value);
  preset.params.forEach((p, i) => {
    const label = document.createElement("label");
    const name = document.createElement("span");
    name.className = "pname";
    const val = document.createElement("span");
    val.className = "pval";
    const input = document.createElement("input");
    input.type = "range";
    input.min = p.min; input.max = p.max; input.step = p.step;
    input.value = p.value;
    const update = () => {
      paramValues[i] = +input.value;
      val.textContent = (+input.value).toFixed(3);
    };
    input.addEventListener("input", update);
    name.textContent = p.key;
    update();
    label.append(name, input, val);
    els.params.appendChild(label);
  });
}

function loadPreset(i, presetValues) {
  preset = PRESETS[i];
  els.scale.value = preset.scale;
  buildParamSliders();
  if (presetValues) {
    presetValues.forEach((v, j) => {
      paramValues[j] = v;
      const row = els.params.children[j];
      row.querySelector("input").value = v;
      row.querySelector(".pval").textContent = v.toFixed(3);
    });
  }
  dt = preset.name === "Lorenz" ? 0.004 : 0.008;
  reseed();
  els.info.textContent = `${preset.name}: rk2 integration, drag to orbit, scroll to zoom.`;
}

els.preset.addEventListener("change", () => loadPreset(+els.preset.value));

els.randomize.addEventListener("click", () => {
  preset.params.forEach((p, i) => {
    const steps = Math.floor((p.max - p.min) / p.step);
    const v = p.min + Math.floor(Math.random() * steps) * p.step;
    paramValues[i] = v;
    const row = els.params.children[i];
    row.querySelector("input").value = v;
    row.querySelector(".pval").textContent = v.toFixed(3);
  });
  reseed();
});

els.reseed.addEventListener("click", reseed);

els.export.addEventListener("click", () => {
  const a = document.createElement("a");
  a.download = `${preset.name.toLowerCase()}-attractor.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
});

els.copy.addEventListener("click", async () => {
  const url = `${location.origin}${location.pathname}${encodeState()}`;
  history.replaceState(null, "", encodeState());
  try {
    await navigator.clipboard.writeText(url);
    els.copy.textContent = "Copied!";
  } catch {
    els.copy.textContent = "See URL bar";
  }
  setTimeout(() => { els.copy.textContent = "Copy link"; }, 1500);
});

// pointer: drag to orbit
let dragging = false, lastX = 0, lastY = 0;
canvas.addEventListener("pointerdown", (e) => {
  dragging = true; lastX = e.clientX; lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  rotation.y += (e.clientX - lastX) * 0.005;
  rotation.x = Math.max(-1.4, Math.min(1.4, rotation.x + (e.clientY - lastY) * 0.005));
  lastX = e.clientX; lastY = e.clientY;
});
canvas.addEventListener("pointerup", () => { dragging = false; });
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  els.scale.value = Math.max(2, Math.min(400, +els.scale.value - e.deltaY * 0.2));
}, { passive: false });
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") { e.preventDefault(); running = !running; }
});

window.addEventListener("resize", resize);

// ---- boot ----
resize();
buildPresetSelect();
const shared = decodeState(location.hash);
els.preset.value = String(shared ? shared.presetIndex : 0);
loadPreset(shared ? shared.presetIndex : 0, shared ? shared.values : null);
if (shared) {
  els.info.textContent = `Loaded shared "${preset.name}" configuration.`;
}
requestAnimationFrame(frame);
