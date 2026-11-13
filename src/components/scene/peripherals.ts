import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/* ---------- keyboard ---------- */

type Key = { l: string; x: number; y: number; w?: number; h?: number };

const row = (y: number, x0: number, items: (string | [string, number])[]): Key[] => {
  let x = x0;
  return items.map((it) => {
    const [l, w] = typeof it === "string" ? [it, 1] : it;
    const k = { l, x, y, w };
    x += w;
    return k;
  });
};
const chars = (s: string) => s.split("");

/** The extended USB keyboard: function row, main block, arrows, navigation cluster, keypad. Units are key pitches. */
export const KEY_LAYOUT: Key[] = [
  { l: "esc", x: 0, y: 0 },
  ...row(0, 2, ["F1", "F2", "F3", "F4"]),
  ...row(0, 6.5, ["F5", "F6", "F7", "F8"]),
  ...row(0, 11, ["F9", "F10", "F11", "F12"]),
  ...row(0, 15.5, ["F13", "F14", "F15"]),
  { l: "power", x: 19, y: 0 },
  ...row(1.5, 0, [...chars("`1234567890-="), ["delete", 2]]),
  ...row(2.5, 0, [["tab", 1.5], ...chars("qwertyuiop[]"), ["\\", 1.5]]),
  ...row(3.5, 0, [["caps", 1.75], ...chars("asdfghjkl;'"), ["return", 2.25]]),
  ...row(4.5, 0, [["shift", 2.25], ...chars("zxcvbnm,./"), ["shift", 2.75]]),
  ...row(5.5, 0, [["ctrl", 1.5], ["opt", 1.5], ["cmd", 1.5], ["", 6], ["cmd", 1.5], ["opt", 1.5], ["ctrl", 1.5]]),
  ...row(1.5, 15.5, ["help", "home", "pg up"]),
  ...row(2.5, 15.5, ["del", "end", "pg dn"]),
  { l: "↑", x: 16.5, y: 4.5 },
  ...row(5.5, 15.5, ["←", "↓", "→"]),
  ...row(1.5, 19, ["clear", "=", "/", "*"]),
  ...row(2.5, 19, ["7", "8", "9", "-"]),
  ...row(3.5, 19, ["4", "5", "6", "+"]),
  ...row(4.5, 19, ["1", "2", "3"]),
  { l: "enter", x: 22, y: 4.5, h: 2 },
  { l: "0", x: 19, y: 5.5, w: 2 },
  { l: ".", x: 21, y: 5.5 },
];

const PITCH = 0.0188;
const GAP = 0.0022;
const KEY_H = 0.011;
const COLS = 23;
const ROWS = 6.5;
const BASE = { w: COLS * PITCH + 0.02, d: ROWS * PITCH + 0.026, h: 0.018 };

export const KEYBOARD_SIZE = BASE;

function legendTexture() {
  const ppm = 5200; // canvas pixels per metre
  const w = Math.round(COLS * PITCH * ppm);
  const d = Math.round(ROWS * PITCH * ppm);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = d;
  const g = c.getContext("2d")!;
  g.fillStyle = "#98a1a8";
  g.strokeStyle = "#98a1a8";
  g.lineWidth = 3;
  g.textAlign = "center";
  g.textBaseline = "middle";
  const px = PITCH * ppm;
  for (const k of KEY_LAYOUT) {
    if (!k.l) continue;
    const kw = (k.w ?? 1) * px;
    const kh = (k.h ?? 1) * px;
    const cx = k.x * px + kw / 2;
    const cy = k.y * px + kh / 2;
    if (k.l === "power") {
      g.beginPath();
      g.arc(cx, cy + 2, px * 0.2, -Math.PI * 0.35, Math.PI * 1.35);
      g.moveTo(cx, cy - px * 0.28);
      g.lineTo(cx, cy);
      g.stroke();
      continue;
    }
    const long = k.l.length > 1 && !/^[←↑→↓]$/.test(k.l);
    g.font = `600 ${long ? px * (k.l.length > 4 ? 0.26 : 0.3) : px * 0.46}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    g.fillText(k.l, cx, cy);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Fine ribbing along the frame, as on the real keyboard. */
function frameRibs() {
  const c = document.createElement("canvas");
  c.width = 16;
  c.height = 4;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 16, 0);
  grad.addColorStop(0, "#000");
  grad.addColorStop(0.5, "#fff");
  grad.addColorStop(1, "#000");
  g.fillStyle = grad;
  g.fillRect(0, 0, 16, 4);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(30, 1);
  return t;
}

export function buildKeyboard() {
  const g = new THREE.Group();
  // Translucent grey-blue frame, black keys.
  const frame = new THREE.MeshPhysicalMaterial({
    color: "#a9bec5",
    transmission: 0.5,
    thickness: 0.014,
    ior: 1.45,
    roughness: 0.34,
    clearcoat: 0.5,
    attenuationColor: new THREE.Color("#2b7f8f"),
    attenuationDistance: 0.06,
    bumpMap: frameRibs(),
    bumpScale: 0.4,
  });
  const base = new THREE.Mesh(new RoundedBoxGeometry(BASE.w, BASE.h, BASE.d, 3, 0.007), frame);
  const plate = new THREE.Mesh(new RoundedBoxGeometry(BASE.w - 0.012, 0.008, BASE.d - 0.012, 2, 0.002), new THREE.MeshStandardMaterial({ color: "#2a3a40", roughness: 0.6 }));
  plate.position.y = 0.004;
  g.add(base, plate);

  const keyMat = new THREE.MeshStandardMaterial({ color: "#17191d", roughness: 0.45, metalness: 0.05 });
  const keys = new THREE.InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.14), keyMat, KEY_LAYOUT.length);
  const m = new THREE.Matrix4();
  const x0 = -(COLS * PITCH) / 2;
  const z0 = -(ROWS * PITCH) / 2;
  const top = BASE.h / 2 + KEY_H / 2 + 0.001;
  KEY_LAYOUT.forEach((k, i) => {
    const w = (k.w ?? 1) * PITCH - GAP;
    const d = (k.h ?? 1) * PITCH - GAP;
    m.compose(
      new THREE.Vector3(x0 + (k.x + (k.w ?? 1) / 2) * PITCH, top, z0 + (k.y + (k.h ?? 1) / 2) * PITCH),
      new THREE.Quaternion(),
      new THREE.Vector3(w, KEY_H, d),
    );
    keys.setMatrixAt(i, m);
  });
  g.add(keys);

  const legends = new THREE.Mesh(
    new THREE.PlaneGeometry(COLS * PITCH, ROWS * PITCH),
    new THREE.MeshBasicMaterial({ map: legendTexture(), transparent: true, depthWrite: false, toneMapped: false }),
  );
  legends.rotation.x = -Math.PI / 2;
  legends.position.y = top + KEY_H / 2 + 0.0004;
  g.add(legends);

  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = o !== legends;
  });
  g.userData.action = { type: "terminal" };
  g.userData.label = "Keyboard: open the Terminal";
  g.userData.hover = { axis: "y", amt: 0.004 };
  return g;
}

/* ---------- mouse: the round USB puck ---------- */

export function buildMouse() {
  const g = new THREE.Group();
  const rimProfile = [[0, 0.0005], [0.032, 0.0005], [0.0345, 0.004], [0.0345, 0.0095], [0.0315, 0.0095]].map(([x, y]) => new THREE.Vector2(x, y));
  const domeProfile = [[0.0315, 0.0095], [0.0335, 0.0135], [0.031, 0.0205], [0.02, 0.0255], [0.008, 0.0272], [0, 0.0274]].map(([x, y]) => new THREE.Vector2(x, y));
  const rim = new THREE.Mesh(
    new THREE.LatheGeometry(rimProfile, 48),
    new THREE.MeshPhysicalMaterial({ color: "#1b8f9e", transmission: 0.45, thickness: 0.012, roughness: 0.2, attenuationColor: new THREE.Color("#06485b"), attenuationDistance: 0.04, clearcoat: 0.7, side: THREE.DoubleSide }),
  );
  const dome = new THREE.Mesh(
    new THREE.LatheGeometry(domeProfile, 48),
    new THREE.MeshPhysicalMaterial({ color: "#b3c8c6", transmission: 0.55, thickness: 0.02, ior: 1.45, roughness: 0.18, clearcoat: 0.8, attenuationColor: new THREE.Color("#5d8f94"), attenuationDistance: 0.05, side: THREE.DoubleSide }),
  );
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.0225, 0.0005, 6, 48), new THREE.MeshStandardMaterial({ color: "#6d8a8c", roughness: 0.4 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.0215;
  const inside = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.004, 24), new THREE.MeshStandardMaterial({ color: "#1b2c30", roughness: 0.5 }));
  inside.position.y = 0.006;
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.008, 14, 10), new THREE.MeshStandardMaterial({ color: "#cfd8da", roughness: 0.4 }));
  ball.position.y = 0.011;
  g.add(rim, dome, ring, inside, ball);
  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  g.userData.action = { type: "mouse" };
  g.userData.label = "Mouse: use the computer";
  g.userData.hover = { axis: "y", amt: 0.003 };
  return g;
}

const cableMat = () => new THREE.MeshPhysicalMaterial({ color: "#e4dbb8", roughness: 0.35, transmission: 0.35, thickness: 0.004 });
const plugMat = new THREE.MeshStandardMaterial({ color: "#d9dde0", roughness: 0.4 });

export function cableGeometry(points: THREE.Vector3[], radius = 0.0024) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5), 64, radius, 6);
}

/**
 * A small USB-style plug seated in the socket at `socket`, `dirIn` pointing into it. It reaches 1 mm
 * into the socket and 19 mm out. Coordinates are in whatever space the plug is added to.
 */
export function plug(socket: THREE.Vector3, dirIn: THREE.Vector3) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(0.011, 0.006, 0.02, 2, 0.002), plugMat);
  m.position.copy(socket).addScaledVector(dirIn, -0.009);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dirIn.clone().normalize());
  m.castShadow = true;
  return m;
}

/** A thin clear cable, slightly yellowed like the originals. */
export function cable(points: THREE.Vector3[], radius = 0.0024) {
  const m = new THREE.Mesh(cableGeometry(points, radius), cableMat());
  m.castShadow = true;
  return m;
}
