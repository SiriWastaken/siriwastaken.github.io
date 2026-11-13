import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/**
 * A 1998 Bondi Blue iMac G3, built from code (metres; group origin on the desk under the middle
 * of the machine, front facing +z). Built from reference photographs:
 *  - from the side the body is a rounded wedge: crest at the top-front edge, a long convex slope down
 *    to a low rear nose, and a flat base that curls up over the rear 45% (fitted to side photographs);
 *  - the front bezel and the lower band are frosted white-grey; only the rear dome and upper sides
 *    are translucent Bondi blue (the two are one shell, split per pixel);
 *  - the tube sits deep inside a thick ribbed bezel, with teal speaker pods, a CD tray and a power
 *    button below it, and four small feet.
 */
export const IMAC = { W: 0.386, H: 0.4, D: 0.434, FOOT: 0.012 };
/** Visible picture area, 4:3 like the 15 inch tube. */
export const SCREEN = { w: 0.27, h: 0.2025 };
const GLASS = { w: 0.292, h: 0.222 };
const RECESS = 0.02;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const spow = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);
/** Half a superellipse: 1 at t0, falling to 0 a distance `front` ahead or `rear` behind. Exponent above 2 is fuller than an ellipse. */
const ell = (t: number, t0: number, front: number, rear: number, pf = 2.3, pr = 2.7) => {
  const d = Math.abs(t - t0) / (t < t0 ? front : rear);
  const p = t < t0 ? pf : pr;
  return Math.pow(Math.max(0, 1 - Math.pow(Math.min(1, d), p)), 1 / p);
};

/**
 * Cross-section of the shell at depth t (0 = front face, 1 = rear nose). From the side the iMac is a
 * rounded wedge: the crest is the top-front edge, the top falls in a long convex slope to a low, round
 * nose, and the flat base curls up to meet it. From behind it stays almost full width (a loaf).
 */
function section(t: number) {
  const nose = 0.36 * IMAC.H;
  const top = IMAC.FOOT + nose + (IMAC.H - nose) * ell(t, 0.06, 1, 0.94, 2, 1.6);
  // The base curls up over the rear 45% of the depth, gently at first (fitted to the side photograph).
  const u = t < 0.55 ? 0 : (t - 0.55) / 0.45;
  const bottom = IMAC.FOOT + nose * (1 - Math.pow(Math.max(0, 1 - Math.pow(u, 1.8)), 1 / 1.8));
  const edge = t < 0.06 ? 0.94 + 0.06 * Math.sqrt(1 - Math.pow(1 - t / 0.06, 2)) : 1; // rolled front lip
  return {
    w: (IMAC.W / 2) * (1 - 0.04 * smooth(0.1, 0.5, t)) * (t < 0.5 ? 1 : ell(t, 0.5, 1, 0.5, 2, 2.4)) * edge, // full width to mid-depth, then a round end
    h: ((top - bottom) / 2) * edge,
    c: (top + bottom) / 2,
    n: lerp(3.8, 2.5, smooth(0, 0.9, t)), // squarish face, rounder towards the nose
  };
}

/** A point on the shell surface. theta 0 = right side, going up and round. Bottom corners are near-square, top ones round. */
function surface(t: number, theta: number, out = new THREE.Vector3()) {
  const s = section(t);
  const sin = Math.sin(theta);
  const e = 2 / (sin >= 0 ? s.n : s.n + 2.6);
  const taper = 1 - 0.025 * Math.max(0, sin);
  return out.set(s.w * spow(Math.cos(theta), e) * taper, s.c + s.h * spow(sin, e), IMAC.D / 2 - t * IMAC.D);
}

/** Half-width of the front face at height y. */
function faceHalfWidth(y: number) {
  const p = new THREE.Vector3();
  let best = 0;
  let bestDy = Infinity;
  for (let k = 0; k <= 400; k++) {
    surface(0, -Math.PI / 2 + (k / 400) * Math.PI, p);
    const dy = Math.abs(p.y - y);
    if (dy < bestDy) {
      bestDy = dy;
      best = p.x;
    }
  }
  return best;
}

/** Positive where the shell is blue plastic, negative where it is frosted white. Interpolated, so the edge is crisp. */
function blueField(t: number, y: number) {
  const yn = (y - IMAC.FOOT) / IMAC.H;
  // A shallow white bezel frame, then blue above a near-level line that dips slightly towards the front.
  return Math.min(t - 0.06, yn - (0.25 + 0.16 * t));
}

function shellGeometry(rings = 72, around = 128) {
  const pos = new Float32Array(rings * around * 3);
  const field = new Float32Array(rings * around);
  const p = new THREE.Vector3();
  for (let i = 0; i < rings; i++) {
    const t = i / (rings - 1);
    for (let j = 0; j < around; j++) {
      surface(t, (j / around) * Math.PI * 2, p).toArray(pos, (i * around + j) * 3);
      field[i * around + j] = blueField(t, p.y);
    }
  }
  const idx: number[] = [];
  for (let i = 0; i < rings - 1; i++)
    for (let j = 0; j < around; j++) {
      const a = i * around + j;
      const b = i * around + ((j + 1) % around);
      idx.push(a, a + around, b, b, a + around, b + around);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aField", new THREE.BufferAttribute(field, 1));
  g.setIndex(idx);
  g.computeVertexNormals();
  // Faces must point outwards: the crest ring's top vertex needs an upward normal.
  if (g.getAttribute("normal").getY(Math.floor(rings * 0.2) * around + Math.floor(around / 4)) < 0) {
    const flipped = idx.slice();
    for (let k = 0; k < flipped.length; k += 3) [flipped[k + 1], flipped[k + 2]] = [flipped[k + 2], flipped[k + 1]];
    g.setIndex(flipped);
    g.computeVertexNormals();
  }
  return g;
}

function roundedRectPoints(w: number, h: number, r: number, perCorner = 8): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const corners: [number, number, number][] = [
    [w / 2 - r, h / 2 - r, 0],
    [-w / 2 + r, h / 2 - r, Math.PI / 2],
    [-w / 2 + r, -h / 2 + r, Math.PI],
    [w / 2 - r, -h / 2 + r, (3 * Math.PI) / 2],
  ];
  for (const [cx, cy, a0] of corners)
    for (let k = 0; k <= perCorner; k++) {
      const a = a0 + (k / perCorner) * (Math.PI / 2);
      pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
  return pts;
}

/** Splits one shell geometry into the blue and the frosted part by discarding on the interpolated field. */
function splitMaterial<T extends THREE.Material>(mat: T, keep: "blue" | "frost"): T {
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aField;\nvarying float vField;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvField = aField;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vField;")
      .replace("void main() {", `void main() {\n  if (${keep === "blue" ? "vField < 0.0" : "vField >= 0.0"}) discard;`);
  };
  mat.customProgramCacheKey = () => `imac-shell-${keep}`;
  return mat;
}

/** Fine vertical ribs, as on the bezel. */
function ribTexture() {
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
  t.repeat.set(1 / 0.0045, 1);
  return t;
}

function emblemTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.translate(64, 64);
  g.strokeStyle = "#3a4a52";
  g.fillStyle = "#6b7c85";
  g.lineWidth = 6;
  g.lineJoin = "round";
  g.beginPath();
  for (let i = 0; i < 6; i++) g[i ? "lineTo" : "moveTo"](Math.cos((i * Math.PI) / 3 - Math.PI / 2) * 46, Math.sin((i * Math.PI) / 3 - Math.PI / 2) * 46);
  g.closePath();
  g.fill();
  g.stroke();
  g.beginPath();
  g.moveTo(-40, -23);
  g.lineTo(0, 0);
  g.lineTo(40, -23);
  g.moveTo(0, 0);
  g.lineTo(0, 46);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export type Imac = {
  group: THREE.Group;
  screen: THREE.Mesh;
  /** Where the camera looks when sitting down (group-local). */
  screenCenter: THREE.Vector3;
  /** Where the keyboard cable plugs in, and the outward direction there (group-local). */
  port: THREE.Vector3;
  portOut: THREE.Vector3;
};

export function buildImac(): Imac {
  const g = new THREE.Group();
  const zf = IMAC.D / 2;

  /* ---------- materials ---------- */
  const blue = splitMaterial(
    new THREE.MeshPhysicalMaterial({
      color: "#1fa3b8",
      transmission: 0.72,
      thickness: 0.07,
      ior: 1.5,
      roughness: 0.1,
      attenuationColor: new THREE.Color("#0a6a80"),
      attenuationDistance: 0.09,
      clearcoat: 0.8,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.3,
    }),
    "blue",
  );
  const frostShell = splitMaterial(
    new THREE.MeshPhysicalMaterial({ color: "#d9e0e2", roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.25, sheen: 0.4, sheenColor: new THREE.Color("#ffffff") }),
    "frost",
  );
  const ribs = ribTexture();
  const frostFront = new THREE.MeshPhysicalMaterial({
    color: "#d6dde0",
    roughness: 0.42,
    clearcoat: 0.5,
    clearcoatRoughness: 0.25,
    bumpMap: ribs,
    bumpScale: 0.7,
    side: THREE.DoubleSide,
  });
  const teal = new THREE.MeshPhysicalMaterial({ color: "#1d9aa8", transmission: 0.5, thickness: 0.02, roughness: 0.25, attenuationColor: new THREE.Color("#06485b"), attenuationDistance: 0.05, clearcoat: 0.6 });
  const dark = new THREE.MeshStandardMaterial({ color: "#14181b", roughness: 0.55, metalness: 0.3 });
  const chassis = new THREE.MeshStandardMaterial({ color: "#c9d3d5", roughness: 0.5 });

  /* ---------- shell: one continuous surface, two plastics ---------- */
  const shellGeo = shellGeometry();
  const shellBlue = new THREE.Mesh(shellGeo, blue);
  const shellFrost = new THREE.Mesh(shellGeo, frostShell);
  g.add(shellBlue, shellFrost);

  // Front face, with the opening for the tube.
  const s0 = section(0);
  const faceTop = s0.c + s0.h;
  const faceBottom = s0.c - s0.h;
  const OPEN = { w: GLASS.w + 0.024, h: GLASS.h + 0.024 };
  // Highest opening that still leaves a bezel at its top corners (the face narrows towards the top).
  let winCy = faceTop - 0.026 - OPEN.h / 2;
  const fits = (cy: number) => {
    const topY = cy + OPEN.h / 2;
    return faceHalfWidth(topY - 0.012) >= OPEN.w / 2 - 0.012 + 0.016 && faceHalfWidth(topY) >= OPEN.w / 2 - 0.04 + 0.016;
  };
  while (!fits(winCy) && winCy > faceBottom + OPEN.h / 2 + 0.07) winCy -= 0.002;
  // Outline of the face. Squared-off corners bunch points together, which breaks triangulation, so thin them out.
  const facePts: THREE.Vector2[] = [];
  const sp = new THREE.Vector3();
  for (let j = 0; j < 240; j++) {
    surface(0, (j / 240) * Math.PI * 2, sp);
    const last = facePts.at(-1);
    if (!last || Math.hypot(sp.x - last.x, sp.y - last.y) > 0.003) facePts.push(new THREE.Vector2(sp.x, sp.y));
  }
  if (facePts.length > 2 && facePts[0].distanceTo(facePts.at(-1)!) < 0.003) facePts.pop();
  const outline = new THREE.Shape(facePts);
  outline.holes.push(new THREE.Path(roundedRectPoints(OPEN.w, OPEN.h, 0.04).map((v) => new THREE.Vector2(v.x, v.y + winCy))));
  const front = new THREE.Mesh(new THREE.ShapeGeometry(outline, 12), frostFront);
  front.position.z = zf;
  g.add(front);

  // The thick bezel wall, sloping from the face down to the tube.
  const outer = roundedRectPoints(OPEN.w, OPEN.h, 0.04);
  const inner = roundedRectPoints(GLASS.w, GLASS.h, 0.03);
  const wallPos: number[] = [];
  const wallIdx: number[] = [];
  const wallUv: number[] = [];
  outer.forEach((o, i) => {
    const n = inner[i];
    wallPos.push(o.x, o.y + winCy, zf, n.x, n.y + winCy, zf - RECESS);
    wallUv.push(o.x, o.y, n.x, n.y);
  });
  for (let i = 0; i < outer.length; i++) {
    const a = i * 2;
    const b = ((i + 1) % outer.length) * 2;
    wallIdx.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const wallGeo = new THREE.BufferGeometry();
  wallGeo.setAttribute("position", new THREE.Float32BufferAttribute(wallPos, 3));
  wallGeo.setAttribute("uv", new THREE.Float32BufferAttribute(wallUv, 2));
  wallGeo.setIndex(wallIdx);
  wallGeo.computeVertexNormals();
  g.add(new THREE.Mesh(wallGeo, frostFront));

  // Curved tube glass, recessed.
  const glassGeo = new THREE.PlaneGeometry(GLASS.w, GLASS.h, 32, 24);
  const gp = glassGeo.getAttribute("position");
  for (let i = 0; i < gp.count; i++) {
    const nx = gp.getX(i) / (GLASS.w / 2);
    const ny = gp.getY(i) / (GLASS.h / 2);
    gp.setZ(i, 0.01 * (1 - nx * nx) * (1 - ny * ny));
  }
  glassGeo.computeVertexNormals();
  const glass = new THREE.Mesh(
    glassGeo,
    new THREE.MeshPhysicalMaterial({ color: "#050607", roughness: 0.05, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.03 }),
  );
  const glassZ = zf - RECESS + 0.002;
  glass.position.set(0, winCy, glassZ);
  g.add(glass);

  // The picture area: the live desktop is mapped onto this quad.
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(SCREEN.w, SCREEN.h),
    new THREE.MeshStandardMaterial({ color: "#050608", emissive: "#142846", emissiveIntensity: 0.5, roughness: 0.2 }),
  );
  screen.position.set(0, winCy, glassZ + 0.0105);
  g.add(screen);

  /* ---------- below the screen: pods, tray, power, emblem ---------- */
  const winBottom = winCy - OPEN.h / 2;
  const lowY = faceBottom + 0.036; // speaker pods and power button sit low
  const trayY = Math.min(faceBottom + 0.064, winBottom - 0.03); // the CD tray sits higher, between them
  const dotGeo = new THREE.CircleGeometry(0.0013, 6);
  const dotMat = new THREE.MeshBasicMaterial({ color: "#052a30" });
  const grilleDots = (cx: number, w: number, h: number, round: boolean) => {
    const pitch = 0.0052;
    const pts: THREE.Vector3[] = [];
    for (let ix = -Math.floor(w / pitch / 2); ix <= Math.floor(w / pitch / 2); ix++)
      for (let iy = -Math.floor(h / pitch / 2); iy <= Math.floor(h / pitch / 2); iy++) {
        const x = ix * pitch;
        const y = iy * pitch;
        if (round && Math.hypot(x, y) > Math.min(w, h) / 2) continue;
        pts.push(new THREE.Vector3(cx + x, lowY + y, zf + 0.0046));
      }
    const m = new THREE.InstancedMesh(dotGeo, dotMat, pts.length);
    const t = new THREE.Matrix4();
    pts.forEach((p, i) => m.setMatrixAt(i, t.makeTranslation(p.x, p.y, p.z)));
    return m;
  };
  const pod = (cx: number, w: number, h: number, r: number) => {
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(roundedRectPoints(w, h, r)), { depth: 0.0045, bevelEnabled: false }), teal);
    m.position.set(cx, lowY, zf - 0.0005);
    return m;
  };
  // Keep the pods inside the face, with a margin, at the height they sit.
  const half = Math.min(faceHalfWidth(lowY - 0.025), faceHalfWidth(lowY + 0.025)) - 0.014;
  const leftX = -half + 0.025;
  const rightX = half - 0.039;
  g.add(pod(leftX, 0.05, 0.05, 0.024), grilleDots(leftX, 0.034, 0.034, true));
  g.add(pod(rightX, 0.078, 0.05, 0.02), grilleDots(rightX + 0.012, 0.05, 0.034, false));
  for (const dy of [-0.0085, 0.0085]) {
    const jack = new THREE.Mesh(new THREE.CircleGeometry(0.0042, 14), new THREE.MeshBasicMaterial({ color: "#04181c" }));
    jack.position.set(rightX - 0.025, lowY + dy, zf + 0.0048);
    g.add(jack);
  }
  // CD tray door with its slot and button.
  const tray = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(roundedRectPoints(0.15, 0.034, 0.004)), { depth: 0.003, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: "#c0c9cd", roughness: 0.4 }));
  tray.position.set(-0.015, trayY, zf);
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.0015, 0.001), dark);
  slot.position.set(-0.015, trayY + 0.013, zf + 0.0033);
  const trayBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.002, 16), new THREE.MeshStandardMaterial({ color: "#2fa3ae", roughness: 0.3 }));
  trayBtn.rotation.x = Math.PI / 2;
  trayBtn.position.set(-0.015, trayY - 0.004, zf + 0.0035);
  g.add(tray, slot, trayBtn);
  // Power button with its glow.
  const power = new THREE.Mesh(new THREE.CylinderGeometry(0.0095, 0.0095, 0.003, 20), new THREE.MeshStandardMaterial({ color: "#cfd8d4", roughness: 0.3 }));
  power.rotation.x = Math.PI / 2;
  power.position.set(rightX - 0.056, lowY - 0.005, zf + 0.002);
  const led = new THREE.Mesh(new THREE.CircleGeometry(0.0045, 16), new THREE.MeshBasicMaterial({ color: "#b6f08c" }));
  led.position.set(rightX - 0.056, lowY - 0.005, zf + 0.0036);
  g.add(power, led);
  // A small mark just under the screen, where the wordmark sits (an original one, not a logo).
  const emblem = new THREE.Mesh(new THREE.PlaneGeometry(0.014, 0.014), new THREE.MeshBasicMaterial({ map: emblemTexture(), transparent: true }));
  emblem.position.set(-0.015, winBottom - 0.013, zf + 0.001);
  g.add(emblem);

  /* ---------- feet, top vents, handle, side port, front foot ---------- */
  const clear = new THREE.MeshPhysicalMaterial({ color: "#e3eef0", roughness: 0.2, transmission: 0.6, thickness: 0.01 });
  const footGeo = new THREE.CylinderGeometry(0.008, 0.009, 0.012, 14);
  for (const [x, z] of [[-0.14, 0.14], [0.14, 0.14], [-0.12, -0.06], [0.12, -0.06]]) {
    const f = new THREE.Mesh(footGeo, clear);
    f.position.set(x, 0.006, z);
    g.add(f);
  }
  // The flip-out foot under the front.
  const tab = new THREE.Mesh(new RoundedBoxGeometry(0.07, 0.006, 0.05, 2, 0.002), teal);
  tab.position.set(0, 0.004, zf - 0.03);
  tab.rotation.x = 0.12;
  g.add(tab);

  // An oriented frame on the shell: x across (theta), y along depth, z out of the surface.
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const frameAt = (t: number, th: number) => {
    surface(t, th, a);
    surface(t, th + 0.01, c).sub(a).normalize();
    surface(t + 0.01, th, b).sub(a).normalize();
    const n = new THREE.Vector3().crossVectors(c, b).normalize();
    if (n.dot(new THREE.Vector3(a.x, a.y - 0.15, 0)) < 0) n.negate();
    const y = new THREE.Vector3().crossVectors(n, c).normalize();
    return new THREE.Matrix4().makeBasis(c.clone(), y, n).setPosition(a.clone());
  };

  // Three long vent slots across the top, ahead of the handle.
  const slots: THREE.Matrix4[] = [];
  for (const t of [0.36, 0.42, 0.48])
    for (let k = 0; k < 26; k++) {
      const m = frameAt(t, Math.PI / 2 - 0.62 + (k / 25) * 1.24);
      slots.push(m.multiply(new THREE.Matrix4().makeTranslation(0, 0, -0.0012)));
    }
  const vents = new THREE.InstancedMesh(new THREE.BoxGeometry(0.012, 0.011, 0.003), new THREE.MeshStandardMaterial({ color: "#0b3a46", roughness: 0.5 }), slots.length);
  slots.forEach((mm, i) => vents.setMatrixAt(i, mm));
  g.add(vents);

  // The loop handle: a frosted oval ring with a grip bar, over a dark well.
  const handle = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.007, 10, 48), clear);
  ring.scale.set(1, 0.55, 1);
  const grip = new THREE.Mesh(new RoundedBoxGeometry(0.145, 0.018, 0.006, 2, 0.003), clear);
  const well = new THREE.Mesh(new THREE.CircleGeometry(0.08, 40), new THREE.MeshStandardMaterial({ color: "#082a33", roughness: 0.6 }));
  well.scale.set(1, 0.5, 1);
  well.position.z = -0.006;
  handle.add(ring, grip, well);
  handle.applyMatrix4(frameAt(0.66, Math.PI / 2).multiply(new THREE.Matrix4().makeTranslation(0, 0, -0.004)));
  g.add(handle);

  // A port door on the right of the lower band, where the keyboard cable plugs in.
  const portFrame = frameAt(0.3, -0.42);
  const door = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(roundedRectPoints(0.06, 0.05, 0.008))), new THREE.MeshStandardMaterial({ color: "#eef3f4", roughness: 0.35, side: THREE.DoubleSide }));
  door.applyMatrix4(portFrame.clone().multiply(new THREE.Matrix4().makeTranslation(0, 0, 0.0015)));
  const portRing = new THREE.Mesh(new THREE.RingGeometry(0.006, 0.0095, 24), teal);
  portRing.applyMatrix4(portFrame.clone().multiply(new THREE.Matrix4().makeTranslation(-0.012, 0, 0.0025)));
  g.add(door, portRing);
  const port = new THREE.Vector3(0.012, -0.012, 0.003).applyMatrix4(portFrame);
  const portOut = new THREE.Vector3(0, 0, 1).transformDirection(portFrame);

  /* ---------- what shows through the blue ---------- */
  const crtFront = new THREE.Mesh(new RoundedBoxGeometry(GLASS.w + 0.005, GLASS.h + 0.005, 0.05, 3, 0.01), dark);
  crtFront.position.set(0, winCy, glassZ - 0.03);
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.045, 0.16, 4, 1, true), dark);
  cone.rotation.set(Math.PI / 2, Math.PI / 4, 0);
  cone.scale.set(1.05, 1, 0.78);
  cone.position.set(0, winCy - 0.02, glassZ - 0.13);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.09, 16), dark);
  neck.rotation.x = Math.PI / 2;
  neck.position.set(0, winCy - 0.03, glassZ - 0.24);
  const board = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.006, 0.13, 2, 0.002), new THREE.MeshStandardMaterial({ color: "#1f3d36", roughness: 0.6 }));
  board.position.set(0, IMAC.FOOT + 0.03, 0.02);
  const rails = new THREE.Mesh(new RoundedBoxGeometry(0.28, 0.012, 0.012, 2, 0.003), chassis);
  rails.position.set(0, winCy + GLASS.h / 2 + 0.012, zf - 0.09);
  g.add(crtFront, cone, neck, board, rails);

  g.traverse((o) => {
    if (o instanceof THREE.Mesh || o instanceof THREE.InstancedMesh) {
      o.castShadow = o !== glass && o !== screen && o !== shellBlue && o !== led && o !== emblem && o !== door;
      o.receiveShadow = true;
    }
  });
  g.userData.action = { type: "screen" };
  g.userData.label = "Sit down at the computer";

  return { group: g, screen, screenCenter: new THREE.Vector3(0, winCy, glassZ + 0.0105), port, portOut };
}
