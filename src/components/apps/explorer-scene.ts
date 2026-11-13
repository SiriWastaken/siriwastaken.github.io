import * as THREE from "three";
import type { NodeKind, VNode } from "@/lib/portfolio/types";

/**
 * The Storage Explorer's 3D view. The drive is laid out as a radial tree. Shapes carry meaning:
 * platters for the volume, octahedra for programs, cubes for projects, gems for developer
 * tools, plates for documents, rings for the system. Rendered at low resolution on purpose.
 */

/** Everything is drawn a little oversize so the shapes read at the low render resolution. */
const SIZE = 1.3;

const COLORS: Record<NodeKind, string> = {
  volume: "#6fd3e6",
  apps: "#f2a93b",
  app: "#f2a93b",
  projects: "#3fb6a8",
  project: "#3fb6a8",
  developer: "#8fd694",
  group: "#8fd694",
  tech: "#8fd694",
  documents: "#e8e0cc",
  doc: "#e8e0cc",
  system: "#9aa7b4",
};

type N3 = {
  node: VNode;
  depth: number;
  pos: THREE.Vector3;
  obj: THREE.Object3D;
  edge: THREE.Line | null;
  label: HTMLButtonElement;
  spin: number;
  scale: number;
};

export type ExplorerOptions = {
  canvas: HTMLCanvasElement;
  labels: HTMLElement;
  root: VNode;
  reduceMotion: boolean;
  onSelect: (n: VNode) => void;
};

export type Explorer = { focus: (n: VNode) => void; dispose: () => void };

function geometryFor(n: VNode): THREE.BufferGeometry {
  switch (n.kind) {
    case "apps":
    case "app":
      return new THREE.OctahedronGeometry(n.kind === "apps" ? 0.9 : 0.4);
    case "projects":
      return new THREE.BoxGeometry(1.3, 1.3, 1.3);
    case "project": {
      const s = 0.55 + Math.min(0.35, n.children.length * 0.05);
      return new THREE.BoxGeometry(s, s, s);
    }
    case "developer":
      return new THREE.IcosahedronGeometry(0.9);
    case "group":
      return new THREE.DodecahedronGeometry(0.5);
    case "tech":
      return new THREE.TetrahedronGeometry(0.32);
    case "documents":
      return new THREE.BoxGeometry(1.5, 0.18, 1.1);
    case "doc":
      return new THREE.BoxGeometry(0.5, 0.08, 0.38);
    case "system":
      return new THREE.TorusGeometry(0.7, 0.22, 8, 16);
    default:
      return new THREE.BoxGeometry(1, 1, 1);
  }
}

export function createExplorer(o: ExplorerOptions): Explorer {
  const { canvas, labels } = o;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "low-power" });
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#04060a");
  scene.fog = new THREE.Fog("#04060a", 14, 46);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80);
  scene.add(new THREE.AmbientLight("#8aa0b8", 0.7));
  const key = new THREE.DirectionalLight("#fff1d6", 2.2);
  key.position.set(5, 9, 6);
  const core = new THREE.PointLight("#6fd3e6", 40, 30, 1.6);
  scene.add(key, core);

  const geos = new Map<string, THREE.BufferGeometry>();
  const mats = new Map<string, THREE.Material>();
  const edgeMat = new THREE.LineBasicMaterial({ color: "#2f4a58" });
  const outlineMats = new Map<string, THREE.LineBasicMaterial>();
  const own: THREE.BufferGeometry[] = [];
  const mat = (kind: NodeKind) => {
    let m = mats.get(kind);
    if (!m) {
      m = new THREE.MeshStandardMaterial({ color: COLORS[kind], emissive: COLORS[kind], emissiveIntensity: 0.22, roughness: 0.55, metalness: 0.1, flatShading: true });
      mats.set(kind, m);
    }
    return m;
  };
  const outline = (kind: NodeKind) => {
    let m = outlineMats.get(kind);
    if (!m) {
      m = new THREE.LineBasicMaterial({ color: new THREE.Color(COLORS[kind]).lerp(new THREE.Color("#ffffff"), 0.45) });
      outlineMats.set(kind, m);
    }
    return m;
  };

  /* ---------- layout ---------- */
  const all = new Map<VNode, N3>();
  const make = (node: VNode, depth: number, pos: THREE.Vector3, parent: N3 | null) => {
    let obj: THREE.Object3D;
    if (node.kind === "volume") {
      const g = new THREE.Group();
      const platter = new THREE.CylinderGeometry(1.5, 1.5, 0.16, 6);
      own.push(platter);
      for (let i = 0; i < 6; i++) {
        const m = new THREE.Mesh(platter, mat("volume"));
        m.position.y = (i - 2.5) * 0.3;
        m.rotation.y = i * 0.25;
        m.scale.setScalar(1 - Math.abs(i - 2.5) * 0.08);
        g.add(m);
      }
      const coreMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), new THREE.MeshBasicMaterial({ color: "#d8fbff" }));
      own.push(coreMesh.geometry);
      g.add(coreMesh);
      obj = g;
    } else {
      const key = `${node.kind}:${node.kind === "project" ? Math.min(7, node.children.length) : ""}`;
      let g = geos.get(key);
      if (!g) {
        g = geometryFor(node);
        geos.set(key, g);
      }
      const m = new THREE.Mesh(g, mat(node.kind));
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(g), outline(node.kind));
      m.add(edges);
      obj = m;
    }
    obj.position.copy(pos);
    obj.userData.node = node;
    scene.add(obj);

    let edge: THREE.Line | null = null;
    if (parent) {
      const geo = new THREE.BufferGeometry().setFromPoints([parent.pos, pos]);
      own.push(geo);
      edge = new THREE.Line(geo, edgeMat);
      scene.add(edge);
    }
    const label = document.createElement("button");
    label.type = "button";
    label.className = `xl xl-${node.type}`;
    label.textContent = node.label;
    label.tabIndex = -1;
    label.addEventListener("click", () => o.onSelect(node));
    labels.appendChild(label);
    const n3: N3 = { node, depth, pos, obj, edge, label, spin: 0.15 + (depth % 3) * 0.08, scale: 1 };
    all.set(node, n3);
    return n3;
  };

  const place = (parent: N3, depth: number) => {
    const kids = parent.node.children;
    if (!kids.length) return;
    const out = parent.pos.clone();
    if (out.lengthSq() < 1e-4) out.set(1, 0, 0);
    out.normalize();
    const u = new THREE.Vector3().crossVectors(out, new THREE.Vector3(0, 1, 0));
    if (u.lengthSq() < 1e-3) u.set(1, 0, 0);
    u.normalize();
    const v = new THREE.Vector3().crossVectors(out, u);
    const n = kids.length;
    const r = depth === 2 ? 1.5 + 0.5 * n : 1.1 + 0.34 * n;
    const fwd = depth === 2 ? 4.2 : 3.2;
    kids.forEach((k, i) => {
      const phi = (i / n) * Math.PI * 2 + depth * 0.7;
      const p = parent.pos.clone().addScaledVector(out, fwd).addScaledVector(u, Math.cos(phi) * r).addScaledVector(v, Math.sin(phi) * r);
      place(make(k, depth, p, parent), depth + 1);
    });
  };
  const rootN = make(o.root, 0, new THREE.Vector3(), null);
  o.root.children.forEach((k, i) => {
    const a = (i / o.root.children.length) * Math.PI * 2 + 0.3;
    const p = new THREE.Vector3(Math.cos(a) * 6.5, i % 2 ? 1 : -1, Math.sin(a) * 6.5);
    place(make(k, 1, p, rootN), 2);
  });

  // Dust, so the dark has depth.
  const dust = new Float32Array(900);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  for (let i = 0; i < dust.length; i++) dust[i] = rnd() * 28;
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  const dustPts = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: "#7fa0b5", size: 0.07, sizeAttenuation: true }));
  scene.add(dustPts);

  /* ---------- focus and camera ---------- */
  let focus: VNode = o.root;
  const path = new Set<VNode>();
  const shown = new Set<N3>();
  const target = new THREE.Vector3();
  const goalTarget = new THREE.Vector3();
  let dist = 18;
  let goalDist = 18;
  let az = 0.5;
  let goalAz = 0.5;
  let el = 0.45;
  let zoomMul = 1;
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

  const applyFocus = (snap: boolean) => {
    path.clear();
    for (let n: VNode | null = focus; n; n = n.parent) path.add(n);
    shown.clear();
    for (const n3 of all.values()) {
      const parentOnPath = n3.node.parent ? path.has(n3.node.parent) : true;
      const vis = n3.depth <= 1 || parentOnPath;
      n3.obj.visible = vis;
      if (n3.edge) n3.edge.visible = vis;
      n3.label.style.display = "none";
      if (vis) shown.add(n3);
      const emphasis = path.has(n3.node) || n3.node.parent === focus;
      n3.scale = (emphasis ? 1 : 0.6) * SIZE;
    }
    const f = all.get(focus)!;
    const group = focus.children.length ? [f, ...focus.children.map((c) => all.get(c)!)] : [f, ...(focus.parent?.children ?? []).map((c) => all.get(c)!)];
    const box = new THREE.Box3();
    for (const g of group) box.expandByPoint(g.pos);
    box.getCenter(goalTarget);
    const radius = Math.max(1.6, box.getBoundingSphere(new THREE.Sphere()).radius + 1.2);
    goalDist = Math.max(5, (radius / tanHalf) * 0.9);
    const out = f.pos.clone().setY(0);
    goalAz = out.lengthSq() > 1e-3 ? Math.atan2(out.x, out.z) + 0.7 : goalAz;
    zoomMul = 1;
    if (snap || o.reduceMotion) {
      target.copy(goalTarget);
      dist = goalDist;
      az = goalAz;
    }
    dirty = true;
  };

  let width = 1;
  let height = 1;
  const resize = () => {
    width = canvas.clientWidth || 1;
    height = canvas.clientHeight || 1;
    renderer.setPixelRatio(0.6);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    dirty = true;
  };
  let dirty = true;
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  applyFocus(true);

  /* ---------- loop ---------- */
  let raf = 0;
  let last = performance.now();
  let hot: N3 | null = null;
  const v3 = new THREE.Vector3();
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    if (o.reduceMotion ? !dirty : now - last < 30 && !dirty) return;
    last = now;
    const k = 1 - Math.exp(-4 * dt);
    if (!o.reduceMotion) {
      target.lerp(goalTarget, k);
      dist += (goalDist * zoomMul - dist) * k;
      az += (goalAz - az) * k;
      for (const n of shown) {
        n.obj.rotation.y += dt * n.spin;
        const s = n.scale * (n === hot ? 1.18 : 1);
        n.obj.scale.setScalar(n.obj.scale.x + (s - n.obj.scale.x) * k);
      }
    } else {
      dist = goalDist * zoomMul;
      for (const n of shown) n.obj.scale.setScalar(n.scale * (n === hot ? 1.18 : 1));
    }
    camera.position.set(target.x + Math.sin(az) * Math.cos(el) * dist, target.y + Math.sin(el) * dist, target.z + Math.cos(az) * Math.cos(el) * dist);
    camera.lookAt(target);
    camera.updateMatrixWorld();
    renderer.render(scene, camera);
    dirty = false;

    for (const n of shown) {
      const important = path.has(n.node) || n.node.parent === focus || n.depth <= 1;
      if (!important) continue;
      v3.copy(n.pos).project(camera);
      const l = n.label;
      if (v3.z > 1) {
        l.style.display = "none";
        continue;
      }
      l.style.display = "block";
      l.style.transform = `translate(-50%, 12px) translate(${((v3.x + 1) / 2) * width}px, ${((1 - v3.y) / 2) * height}px)`;
      l.classList.toggle("xl-focus", n.node === focus);
      l.classList.toggle("xl-hot", n === hot);
      l.tabIndex = n.node.parent === focus || n.node === focus ? 0 : -1;
    }
  };
  raf = requestAnimationFrame(tick);

  /* ---------- pointer ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pick = (ev: PointerEvent) => {
    ndc.set((ev.offsetX / width) * 2 - 1, -(ev.offsetY / height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const meshes = [...shown].map((n) => n.obj);
    const hit = ray.intersectObjects(meshes, true)[0];
    for (let n: THREE.Object3D | null = hit?.object ?? null; n; n = n.parent) if (n.userData.node) return all.get(n.userData.node as VNode) ?? null;
    return null;
  };
  let down: { x: number; y: number } | null = null;
  let dragged = false;
  const onDown = (e: PointerEvent) => {
    down = { x: e.clientX, y: e.clientY };
    dragged = false;
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (down) {
      if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4) dragged = true;
      if (dragged) {
        goalAz -= e.movementX * 0.006;
        az = goalAz;
        el = Math.min(1.25, Math.max(-0.2, el + e.movementY * 0.005));
        dirty = true;
      }
      return;
    }
    const h = pick(e);
    if (h !== hot) {
      hot = h;
      canvas.style.cursor = h ? "pointer" : "grab";
      dirty = true;
    }
  };
  const onUp = (e: PointerEvent) => {
    canvas.releasePointerCapture(e.pointerId);
    const was = dragged;
    down = null;
    dragged = false;
    if (was) return;
    const h = pick(e);
    if (h) o.onSelect(h.node);
  };
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    zoomMul = Math.min(1.8, Math.max(0.55, zoomMul * (e.deltaY > 0 ? 1.1 : 0.9)));
    dirty = true;
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  return {
    focus(n) {
      if (n === focus) return;
      focus = n;
      applyFocus(false);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("wheel", onWheel);
      for (const n of all.values()) n.label.remove();
      for (const g of [...geos.values(), ...own, dustGeo]) g.dispose();
      for (const m of [...mats.values(), ...outlineMats.values(), edgeMat]) m.dispose();
      scene.traverse((x) => {
        if (x instanceof THREE.LineSegments) x.geometry.dispose();
      });
      // No forceContextLoss(): React remounts in development reuse this canvas, and a lost context cannot be recreated.
      renderer.dispose();
    },
  };
}
