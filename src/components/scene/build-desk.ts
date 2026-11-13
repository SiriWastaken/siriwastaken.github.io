import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { buildImac, SCREEN } from "./imac";
import { buildKeyboard, buildMouse, cable, cableGeometry, KEYBOARD_SIZE, plug } from "./peripherals";
import {
  carpetTexture,
  coverTexture,
  padTexture,
  plasterTexture,
  spineTexture,
  stickyTexture,
  woodTexture,
} from "./textures";

export type Action =
  | { type: "screen" }
  | { type: "terminal" }
  | { type: "mouse" }
  | { type: "project"; slug: string }
  | { type: "contact" }
  | { type: "lamp" };

export type DeskProjectInput = { slug: string; title: string; heroUrl?: string };

export const DESK_Y = 0.74;
export { SCREEN };

const std = (color: string, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...o });
const rbox = (w: number, h: number, d: number, r = 0.003) => new RoundedBoxGeometry(w, h, d, 3, r);

function rod(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) {
  const len = a.distanceTo(b);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return m;
}

function act<T extends THREE.Object3D>(o: T, action: Action, label: string, hover?: { axis: "y" | "z"; amt: number }) {
  o.userData.action = action;
  o.userData.label = label;
  if (hover) o.userData.hover = hover;
  return o;
}

export type Built = {
  root: THREE.Group;
  screen: THREE.Mesh;
  screenCenter: THREE.Vector3;
  mouse: THREE.Group;
  /** Rebuild the cables after the keyboard or mouse moved. */
  rewire: () => void;
  pickables: THREE.Object3D[];
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  glow: THREE.PointLight;
  lamp: THREE.SpotLight;
  lampBulb: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
};

export function buildDesk(projects: DeskProjectInput[], onTexture: () => void): Built {
  const root = new THREE.Group();
  const pickables: THREE.Object3D[] = [];

  /* ---------- room ---------- */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), std("#ffffff", { map: carpetTexture(), roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  const wallMap = plasterTexture();
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.2), std("#ffffff", { map: wallMap, roughness: 0.95 }));
  wall.position.set(0, 1.6, -0.48);
  const skirting = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 0.02), std("#f1ede5", { roughness: 0.6 }));
  skirting.position.set(0, 0.05, -0.47);
  root.add(floor, wall, skirting);

  // Venetian blind out of frame on the left: it exists to throw stripes of sun across the room.
  const blind = new THREE.Group();
  const slatMat = std("#dedad2");
  for (let i = 0; i < 30; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.042, 3.2), slatMat);
    s.position.set(-1.7, 0.4 + i * 0.085, 0.7);
    s.castShadow = true;
    blind.add(s);
  }
  root.add(blind);

  /* ---------- desk ---------- */
  const woodMap = woodTexture();
  const top = new THREE.Mesh(rbox(1.7, 0.035, 0.8, 0.008), std("#ffffff", { map: woodMap, roughness: 0.55 }));
  top.position.set(0, DESK_Y - 0.0175, 0);
  root.add(top);
  const metal = std("#16181c", { metalness: 0.6, roughness: 0.45 });
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.035, DESK_Y - 0.035, 0.035), metal);
      leg.position.set(sx * 0.79, (DESK_Y - 0.035) / 2, sz * 0.36);
      root.add(leg);
    }
  const bar = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.03, 0.02), metal);
  bar.position.set(0, 0.45, -0.36);
  root.add(bar);

  /* ---------- the iMac, keyboard and mouse ---------- */
  const IMAC_Z = -0.08;
  const imac = buildImac();
  imac.group.position.set(0, DESK_Y, IMAC_Z);
  root.add(imac.group);
  pickables.push(imac.group);
  const screen = imac.screen;
  const screenCenter = imac.screenCenter.clone().add(new THREE.Vector3(0, DESK_Y, IMAC_Z));

  // The "say hi" note is stuck to the wall beside the machine; the machine's face is busy enough.
  const sticky = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.075), std("#ffffff", { map: stickyTexture(), roughness: 0.9 }));
  sticky.position.set(0.33, DESK_Y + 0.33, -0.466);
  sticky.rotation.z = 0.08;
  act(sticky, { type: "contact" }, "Note: how to reach me", { axis: "z", amt: 0.006 });
  pickables.push(sticky);
  root.add(sticky);

  const KB_Z = 0.27;
  const kb = buildKeyboard();
  kb.position.set(-0.01, DESK_Y + KEYBOARD_SIZE.h / 2 + 0.004, KB_Z);
  kb.rotation.x = 0.05;
  kb.userData.base = kb.position.clone();
  pickables.push(kb);
  root.add(kb);

  const pad = new THREE.Mesh(rbox(0.2, 0.003, 0.17, 0.001), std("#ffffff", { map: padTexture(), roughness: 1 }));
  pad.position.set(0.36, DESK_Y + 0.0015, KB_Z - 0.01);
  const mouse = buildMouse();
  mouse.position.set(0.36, DESK_Y + 0.003, KB_Z - 0.01);
  pickables.push(mouse);
  root.add(pad, mouse);

  // Clear cables, as on the originals. The keyboard plugs into the port on the machine's right side;
  // the mouse cable leaves the back of the puck and plugs into the keyboard's right end.
  // Plugs sit exactly in their sockets; the keyboard's plugs are its children, so they move with it.
  const X = new THREE.Vector3(1, 0, 0);
  const Z = new THREE.Vector3(0, 0, 1);
  const kbOutLocal = new THREE.Vector3(KEYBOARD_SIZE.w / 2 - 0.05, 0, -KEYBOARD_SIZE.d / 2); // socket in the back edge
  const kbInLocal = new THREE.Vector3(KEYBOARD_SIZE.w / 2, 0, -KEYBOARD_SIZE.d / 2 + 0.03); // socket in the right end
  kb.add(plug(kbOutLocal, Z), plug(kbInLocal, X.clone().negate()));
  imac.group.updateMatrixWorld(true);
  const port = imac.group.localToWorld(imac.port.clone());
  const portOut = imac.portOut.clone().transformDirection(imac.group.matrixWorld);
  root.add(plug(port, portOut.clone().negate()));
  const lead = (p: THREE.Vector3, dir: THREE.Vector3, d: number) => p.clone().addScaledVector(dir, d);
  const PLUG = 0.018; // cables end inside the back of their plug
  // Height for a cable lying on the desk or on the mouse pad at (x, z): resting on top, not buried.
  const padBox = new THREE.Box3().setFromObject(pad);
  const rest = (p: THREE.Vector3) =>
    p.setY((p.x > padBox.min.x && p.x < padBox.max.x && p.z > padBox.min.z && p.z < padBox.max.z ? padBox.max.y : DESK_Y) + 0.0026);

  const kbCablePoints = () => {
    kb.updateMatrixWorld(true);
    const out = kb.localToWorld(kbOutLocal.clone());
    const back = Z.clone().negate().transformDirection(kb.matrixWorld);
    return [
      lead(out, back, PLUG),
      rest(lead(out, back, 0.05)),
      rest(new THREE.Vector3(port.x + 0.09, 0, (port.z + out.z) / 2 + 0.02)),
      rest(lead(port, portOut, 0.07)),
      lead(port, portOut, PLUG),
    ];
  };
  const mouseCablePoints = () => {
    kb.updateMatrixWorld(true);
    const inn = kb.localToWorld(kbInLocal.clone());
    const right = X.clone().transformDirection(kb.matrixWorld);
    const tail = mouse.position.clone().add(new THREE.Vector3(0, 0.006, -0.03)); // starts inside the puck's rim
    return [
      tail,
      rest(tail.clone().add(new THREE.Vector3(0.008, 0, -0.03))),
      rest(new THREE.Vector3((tail.x + inn.x) / 2 + 0.07, 0, Math.min(tail.z, inn.z) - 0.06)),
      rest(lead(inn, right, 0.045)),
      lead(inn, right, PLUG),
    ];
  };
  const kbCable = cable(kbCablePoints());
  const mouseCable = cable(mouseCablePoints());
  root.add(kbCable, mouseCable);
  /** The keyboard and mouse move (hover lift, the mouse following the pointer); the cables follow both. */
  const rewire = () => {
    kbCable.geometry.dispose();
    kbCable.geometry = cableGeometry(kbCablePoints());
    mouseCable.geometry.dispose();
    mouseCable.geometry = cableGeometry(mouseCablePoints());
  };

  /* ---------- mug and notebook ---------- */
  const mug = new THREE.Group();
  const ceramic = std("#f4f1ea", { roughness: 0.25 });
  ceramic.side = THREE.DoubleSide;
  const profile = [[0, 0], [0.036, 0], [0.04, 0.005], [0.041, 0.09], [0.038, 0.091], [0.0375, 0.012], [0, 0.011]].map(
    ([x, y]) => new THREE.Vector2(x, y),
  );
  mug.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 32), ceramic));
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.0372, 32), std("#2c1b11", { roughness: 0.15 }));
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.078;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.0045, 10, 22, Math.PI), ceramic);
  handle.rotation.z = -Math.PI / 2;
  handle.position.set(0.04, 0.047, 0);
  mug.add(coffee, handle);
  mug.position.set(-0.4, DESK_Y, 0.15);
  mug.rotation.y = 0.5;
  root.add(mug);

  const notebook = new THREE.Group();
  const nb = std("#3a4a6b");
  const nbTop = std("#ffffff", { map: coverTexture("notes"), roughness: 0.8 });
  notebook.add(new THREE.Mesh(rbox(0.16, 0.014, 0.21, 0.002), [nb, nb, nbTop, nb, nb, nb]));
  const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.17, 6), std("#e0b020"));
  pencil.rotation.set(Math.PI / 2, 0, 0.5);
  pencil.position.set(0.02, 0.0185, 0);
  notebook.add(pencil);
  notebook.position.set(-0.58, DESK_Y + 0.007, 0.05);
  notebook.rotation.y = 0.4;
  root.add(notebook);

  /* ---------- desk lamp ---------- */
  const lampG = new THREE.Group();
  lampG.position.set(-0.7, DESK_Y, -0.2);
  const lampMat = std("#1a1c20", { metalness: 0.7, roughness: 0.4 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.02, 32), lampMat);
  base.position.y = 0.01;
  const p0 = new THREE.Vector3(0, 0.02, 0);
  const p1 = new THREE.Vector3(0.05, 0.34, 0.02);
  const p2 = new THREE.Vector3(0.24, 0.45, 0.07);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.07, 28, 1, true), std("#e8e6e0", { side: THREE.DoubleSide, roughness: 0.5 }));
  shade.position.copy(p2);
  shade.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0.25, -1, 0.4).normalize());
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 12), new THREE.MeshStandardMaterial({ color: "#fff4d8", emissive: "#ffd28a", emissiveIntensity: 0 }));
  bulb.position.copy(p2).add(new THREE.Vector3(0.01, -0.03, 0.015));
  lampG.add(base, rod(p0, p1, 0.005, lampMat), rod(p1, p2, 0.005, lampMat), shade, bulb);
  const spot = new THREE.SpotLight("#ffd9a0", 0, 2.6, 0.75, 0.6, 1.4);
  spot.position.copy(p2).add(new THREE.Vector3(0.01, -0.04, 0.015));
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0004;
  const spotTarget = new THREE.Object3D();
  spotTarget.position.set(0.5, 0, 0.2);
  lampG.add(spot, spotTarget);
  spot.target = spotTarget;
  act(lampG, { type: "lamp" }, "Desk lamp: click to switch");
  pickables.push(lampG);
  root.add(lampG);

  /* ---------- plant ---------- */
  const plant = new THREE.Group();
  plant.position.set(0.74, DESK_Y, -0.22);
  const potProfile = [[0, 0], [0.05, 0], [0.066, 0.11], [0.072, 0.12], [0.064, 0.12], [0.06, 0.108], [0, 0.1]].map(([x, y]) => new THREE.Vector2(x, y));
  const pot = new THREE.Mesh(new THREE.LatheGeometry(potProfile, 32), std("#b5623a", { side: THREE.DoubleSide, roughness: 0.85 }));
  const soil = new THREE.Mesh(new THREE.CircleGeometry(0.06, 24), std("#2b1d14", { roughness: 1 }));
  soil.rotation.x = -Math.PI / 2;
  soil.position.y = 0.108;
  plant.add(pot, soil);
  const leaf = new THREE.Shape();
  leaf.moveTo(0, 0);
  leaf.quadraticCurveTo(0.035, 0.11, 0, 0.3);
  leaf.quadraticCurveTo(-0.035, 0.11, 0, 0);
  const leafGeo = new THREE.ShapeGeometry(leaf);
  const greens = ["#3f7a3a", "#4b8a43", "#357033", "#548f4a"];
  for (let i = 0; i < 18; i++) {
    const pivot = new THREE.Object3D();
    pivot.rotation.y = (i / 18) * Math.PI * 2 + (i % 3) * 0.2;
    pivot.position.y = 0.11;
    const l = new THREE.Mesh(leafGeo, std(greens[i % 4], { side: THREE.DoubleSide, roughness: 0.6 }));
    l.rotation.x = 0.25 + (i % 5) * 0.2;
    l.scale.setScalar(0.85 + (i % 4) * 0.22);
    pivot.add(l);
    plant.add(pivot);
  }
  root.add(plant);

  /* ---------- project books ---------- */
  const palette = [
    ["#1f3a5f", "#f2e8d0"], ["#8a3b2a", "#f4e3c3"], ["#2f5d44", "#efe6cf"], ["#d9c9a3", "#262626"],
    ["#2b2b30", "#e7c15a"], ["#2c6f7a", "#f1eadb"], ["#6a3d5c", "#f3e6d2"],
  ];
  const pages = std("#efe8d6", { roughness: 0.9 });
  const stacks = [
    { x: 0.46, z: -0.06, rot: 0.1, from: 0, to: 4 },
    { x: 0.64, z: 0.24, rot: -0.2, from: 4, to: 7 },
  ];
  for (const st of stacks) {
    let y = DESK_Y;
    projects.slice(st.from, st.to).forEach((p, k) => {
      const i = st.from + k;
      const [bg, fg] = palette[i % palette.length];
      const h = 0.026 + ((i * 7) % 5) * 0.003;
      const w = 0.2 + ((i * 3) % 4) * 0.01;
      const cover = std(bg, { roughness: 0.75 });
      const spine = std("#ffffff", { map: spineTexture(p.title, bg, fg), roughness: 0.7 });
      const book = new THREE.Mesh(rbox(w, h, 0.15, 0.002), [cover, cover, cover, cover, spine, pages]);
      book.position.set(st.x + Math.sin(i * 2.1) * 0.008, y + h / 2, st.z);
      book.rotation.y = st.rot + Math.sin(i * 1.7) * 0.05;
      y += h;
      act(book, { type: "project", slug: p.slug }, `${p.title}: open the project`, { axis: "y", amt: 0.004 });
      pickables.push(book);
      root.add(book);
    });
  }

  /* ---------- framed screenshots on the wall ---------- */
  const framed = projects.filter((p) => p.heroUrl).slice(0, 2);
  const frameSpots: [number, number][] = [[-0.56, 1.3], [0.5, 1.33]];
  const loader = new THREE.TextureLoader();
  framed.forEach((p, i) => {
    const g = new THREE.Group();
    const frameMat = std("#14151a", { roughness: 0.5 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.02), frameMat);
    const mat = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), std("#f3f1ea", { roughness: 0.9 }));
    mat.position.z = 0.0105;
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ color: "#222", roughness: 0.6 }));
    pic.position.z = 0.0112;
    g.add(frame, mat, pic);
    const size = (aspect: number) => {
      const h = aspect > 1.2 ? 0.17 : 0.24;
      const w = h * aspect;
      frame.scale.set(w + 0.07, h + 0.07, 1);
      mat.scale.set(w + 0.05, h + 0.05, 1);
      pic.scale.set(w, h, 1);
    };
    size(1.5);
    loader.load(p.heroUrl!, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      size(tex.image.width / tex.image.height);
      (pic.material as THREE.MeshStandardMaterial).map = tex;
      (pic.material as THREE.MeshStandardMaterial).color.set("#ffffff");
      (pic.material as THREE.MeshStandardMaterial).needsUpdate = true;
      onTexture();
    });
    g.position.set(frameSpots[i][0], frameSpots[i][1], -0.47);
    act(g, { type: "project", slug: p.slug }, `${p.title}: open the project`, { axis: "z", amt: 0.008 });
    pickables.push(g);
    root.add(g);
  });

  /* ---------- lights ---------- */
  const sun = new THREE.DirectionalLight("#ffe9c7", 3);
  sun.position.set(-3.2, 2.5, 1.7);
  sun.target.position.set(0.1, 0.8, -0.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -2.2, right: 2.2, top: 2.2, bottom: -2.2, near: 0.5, far: 9 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  const hemi = new THREE.HemisphereLight("#fff6e8", "#6b5a48", 0.5);
  const glow = new THREE.PointLight("#7fb2ff", 0, 1.4, 1.6);
  glow.position.set(0, screenY - 0.05, 0.2);
  root.add(sun, sun.target, hemi, glow);

  root.traverse((o) => {
    if (o instanceof THREE.Mesh && o !== floor && o !== wall && !blind.children.includes(o)) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  floor.receiveShadow = wall.receiveShadow = true;

  return { root, screen, screenCenter, mouse, rewire, pickables, sun, hemi, glow, lamp: spot, lampBulb: bulb };
}
