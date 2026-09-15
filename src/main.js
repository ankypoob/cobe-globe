import createGlobe from "cobe";
import "./style.css";

const canvas = document.getElementById("globe");

const markers = [
  { location: [37.7749, -122.4194], size: 0.05 }, // San Francisco
  { location: [40.7128, -74.006], size: 0.06 }, // New York
  { location: [51.5074, -0.1278], size: 0.05 }, // London
  { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
  { location: [-23.5505, -46.6333], size: 0.05 }, // São Paulo
  { location: [19.076, 72.8777], size: 0.05 }, // Mumbai
  { location: [-33.8688, 151.2093], size: 0.04 }, // Sydney
  { location: [30.0444, 31.2357], size: 0.04 }, // Cairo
];

const arcs = [
  { from: [37.7749, -122.4194], to: [40.7128, -74.006] },
  { from: [40.7128, -74.006], to: [51.5074, -0.1278] },
  { from: [51.5074, -0.1278], to: [35.6762, 139.6503] },
  { from: [35.6762, 139.6503], to: [19.076, 72.8777] },
  { from: [-23.5505, -46.6333], to: [40.7128, -74.006] },
];

const AUTO_ROTATE_SPEED = 0.003;
const DRAG_SENSITIVITY = 0.005;
const FRICTION = 0.93;
const IDLE_MS = 1400;
const MIN_THETA = -0.8;
const MAX_THETA = 0.8;

let phi = 2.3;
let theta = 0.28;
let dragging = false;
let lastX = 0;
let lastY = 0;
let velocityPhi = 0;
let velocityTheta = 0;
let autoRotate = true;
let idleTimer = 0;
let raf = 0;
const dpr = Math.min(window.devicePixelRatio || 1, 2);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function cssSize() {
  return Math.max(1, Math.round(canvas.clientWidth || 600));
}

function scheduleAutoRotate() {
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    autoRotate = true;
  }, IDLE_MS);
}

const globe = createGlobe(canvas, {
  devicePixelRatio: dpr,
  width: cssSize(),
  height: cssSize(),
  phi,
  theta,
  dark: 1,
  diffuse: 1.2,
  scale: 1.05,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.35, 0.5, 0.75],
  markerColor: [0.49, 0.83, 0.99],
  glowColor: [0.55, 0.72, 1],
  markers,
  arcs,
  arcColor: [0.49, 0.83, 0.99],
  arcWidth: 0.45,
  arcHeight: 0.28,
  markerElevation: 0.02,
});

function tick() {
  if (!dragging) {
    phi += velocityPhi;
    theta = clamp(theta + velocityTheta, MIN_THETA, MAX_THETA);
    velocityPhi *= FRICTION;
    velocityTheta *= FRICTION;

    if (autoRotate && Math.abs(velocityPhi) < 0.0004) {
      phi += AUTO_ROTATE_SPEED;
    }
  }

  const side = cssSize();
  globe.update({
    phi,
    theta,
    width: side,
    height: side,
  });

  raf = window.requestAnimationFrame(tick);
}

raf = window.requestAnimationFrame(tick);

canvas.addEventListener("pointerdown", (event) => {
  dragging = true;
  autoRotate = false;
  velocityPhi = 0;
  velocityTheta = 0;
  lastX = event.clientX;
  lastY = event.clientY;
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (!dragging) return;

  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  lastX = event.clientX;
  lastY = event.clientY;

  phi += dx * DRAG_SENSITIVITY;
  theta = clamp(theta + dy * DRAG_SENSITIVITY, MIN_THETA, MAX_THETA);
  velocityPhi = dx * DRAG_SENSITIVITY;
  velocityTheta = dy * DRAG_SENSITIVITY;
});

function endDrag() {
  if (!dragging) return;
  dragging = false;
  scheduleAutoRotate();
}

canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);

window.addEventListener("pagehide", () => {
  window.cancelAnimationFrame(raf);
  globe.destroy();
});
