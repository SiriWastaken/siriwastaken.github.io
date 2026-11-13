import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { buildDesk, SCREEN, type Action, type DeskProjectInput } from "./build-desk";
import { quadMatrix } from "./projection";

export const COMPACT_QUERY = "(max-width: 899px), (max-aspect-ratio: 1/1)";
/** Design size of the desktop that is mapped onto the screen. */
const OS_W = 1024;
const OS_H = 768;
const ZOOM_SECONDS = 1.1;
const NIGHT_SECONDS = 0.9;

export type EngineOptions = {
  canvas: HTMLCanvasElement;
  os: HTMLElement;
  projects: DeskProjectInput[];
  night: boolean;
  reduceMotion: boolean;
  onState: (s: { zoomed: boolean; live: boolean }) => void;
  onAction: (a: Action) => void;
  /** Label and pointer position, or null to hide. Updated imperatively, so no React renders. */
  onHover: (label: string | null, x: number, y: number) => void;
  onReady: () => void;
};

export type Engine = {
  setZoom: (zoomed: boolean) => void;
  setNight: (night: boolean) => void;
  toggleLamp: () => void;
  dispose: () => void;
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Throws if WebGL is unavailable: the caller falls back to the plain page. */
export function createEngine(o: EngineOptions): Engine {
  const { canvas, os } = o;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // The plastic is transmissive; refract from a half-size copy of the scene to keep it cheap.
  renderer.transmissionResolutionScale = 0.5;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  let dirty = true;
  const built = buildDesk(o.projects, () => (dirty = true));
  scene.add(built.root);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 40);
  const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const lookDesk = new THREE.Vector3(0.04, 1.0, -0.08);
  const screenCenter = built.screenCenter;
  const spherical = new THREE.Spherical().setFromVector3(new THREE.Vector3(0.1, 0.22, 1).normalize());

  let width = 1;
  let height = 1;
  let deskDist = 1.6;
  let screenDist = 0.6;
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Keep the whole desk in frame on tall screens; fit the screen to the viewport when zoomed.
    deskDist = Math.max(1.9, (camera.aspect < 1 ? 0.36 : 0.8) / (tan * camera.aspect));
    const fill = 0.88;
    screenDist = Math.max(SCREEN.h / 2 / (tan * fill), SCREEN.w / 2 / (tan * camera.aspect * fill));
    dirty = true;
  };
  resize();

  /* ---------- state ---------- */
  let zoomTarget = 0;
  let zoom = 0;
  let nightTarget = o.night ? 1 : 0;
  let night = nightTarget;
  let lampOn = true;
  // Start a little to the right, so the blue dome shows beside the frosted front.
  let yaw = 0.42;
  let pitch = 0;
  let lastLive = false;
  let lastZoomed = false;
  const compact = window.matchMedia(COMPACT_QUERY);

  const bg = { day: new THREE.Color("#2a211a"), night: new THREE.Color("#07080c") };
  const screenMat = built.screen.material as THREE.MeshStandardMaterial;

  const applyLighting = () => {
    built.sun.intensity = 3 * (1 - night);
    built.hemi.intensity = 0.5 * (1 - night) + 0.06 * night;
    scene.environmentIntensity = 0.42 * (1 - night) + 0.05 * night;
    built.lamp.intensity = lampOn ? 10 * (0.12 + 0.88 * night) : 0;
    built.lampBulb.material.emissiveIntensity = lampOn ? 2.5 * (0.2 + 0.8 * night) : 0;
    built.glow.intensity = 0.5 * night;
    screenMat.emissiveIntensity = 0.55 + 0.3 * night;
    renderer.toneMappingExposure = 1 + 0.15 * night;
    scene.background = bg.day.clone().lerp(bg.night, night);
  };
  applyLighting();

  /* ---------- camera and screen overlay ---------- */
  const tmp = new THREE.Vector3();
  const look = new THREE.Vector3();
  const sph = new THREE.Spherical();
  const offDesk = new THREE.Vector3();
  const offScreen = new THREE.Vector3();
  const updateCamera = () => {
    const e = ease(zoom);
    look.copy(lookDesk).lerp(screenCenter, e);
    sph.copy(spherical);
    sph.radius = deskDist;
    sph.theta += yaw * (1 - e);
    sph.phi = clamp(sph.phi - pitch * (1 - e), 0.9, 1.7);
    offDesk.setFromSpherical(sph);
    offScreen.set(0, 0, screenDist);
    camera.position.copy(look).add(offDesk.lerp(offScreen, e));
    camera.lookAt(look);
    camera.updateMatrixWorld();
  };

  const corners = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
  const updateOverlay = () => {
    const q = corners.map(([cx, cy]) => {
      tmp.set((cx * SCREEN.w) / 2, (cy * SCREEN.h) / 2, 0);
      built.screen.localToWorld(tmp).project(camera);
      return [((tmp.x + 1) / 2) * width, ((1 - tmp.y) / 2) * height] as [number, number];
    }) as [[number, number], [number, number], [number, number], [number, number]];
    if (compact.matches && zoom >= 0.999) {
      // Phones: once zoomed, the desktop is simply the full viewport.
      os.style.width = `${width}px`;
      os.style.height = `${height}px`;
      os.style.transform = "none";
    } else {
      os.style.width = `${OS_W}px`;
      os.style.height = `${OS_H}px`;
      os.style.transform = quadMatrix(OS_W, OS_H, q);
    }
  };

  /* ---------- loop ---------- */
  let raf = 0;
  let last = performance.now();
  let firstFrame = true;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (zoom !== zoomTarget) {
      zoom = o.reduceMotion ? zoomTarget : clamp(zoom + Math.sign(zoomTarget - zoom) * (dt / ZOOM_SECONDS), 0, 1);
      if (Math.abs(zoom - zoomTarget) < 1e-4) zoom = zoomTarget;
      dirty = true;
    }
    if (night !== nightTarget) {
      night = o.reduceMotion ? nightTarget : clamp(night + Math.sign(nightTarget - night) * (dt / NIGHT_SECONDS), 0, 1);
      if (Math.abs(night - nightTarget) < 1e-4) night = nightTarget;
      applyLighting();
      dirty = true;
    }
    live = zoomTarget === 1 && zoom === 1;
    const zoomed = zoomTarget === 1;
    if (!live) mouseTarget.copy(mouseBase);
    if (stepHover(dt)) dirty = true;
    if (live !== lastLive || zoomed !== lastZoomed) {
      lastLive = live;
      lastZoomed = zoomed;
      o.onState({ zoomed, live });
    }
    if (!dirty) return;
    dirty = false;
    updateCamera();
    renderer.render(scene, camera);
    updateOverlay();
    if (firstFrame) {
      firstFrame = false;
      o.onReady();
    }
  };
  raf = requestAnimationFrame(tick);

  /* ---------- hover lift and the physical mouse ---------- */
  const hoverables = built.pickables.filter((p) => p.userData.hover);
  for (const h of hoverables) {
    h.userData.base = h.position.clone();
    h.userData.lift = 0;
    h.userData.liftTarget = 0;
  }
  const mouseBase = built.mouse.position.clone();
  const mouseTarget = mouseBase.clone();
  let hoverObj: THREE.Object3D | null = null;
  let live = false;
  const stepHover = (dt: number) => {
    let moving = false;
    let rewire = false;
    for (const h of hoverables) {
      const target = h === hoverObj && !live ? h.userData.hover.amt : 0;
      const d = target - h.userData.lift;
      if (Math.abs(d) > 1e-5) {
        h.userData.lift = o.reduceMotion ? target : h.userData.lift + d * Math.min(1, dt * 14);
        h.position.copy(h.userData.base);
        h.position[h.userData.hover.axis as "y" | "z"] += h.userData.lift;
        moving = true;
        if (h === built.mouse || h.userData.action?.type === "terminal") rewire = true;
      }
    }
    mouseTarget.y = mouseBase.y + (built.mouse.userData.lift as number); // hover lift and pointer-follow agree
    if (built.mouse.position.distanceToSquared(mouseTarget) > 1e-9) {
      built.mouse.position.lerp(mouseTarget, o.reduceMotion ? 1 : Math.min(1, dt * 18));
      moving = true;
      rewire = true;
    }
    if (rewire) built.rewire();
    return moving;
  };
  const onWindowMove = (ev: PointerEvent) => {
    if (!live) return;
    // The real mouse on the desk follows the pointer on the screen.
    mouseTarget.set(mouseBase.x + clamp(ev.clientX / width - 0.5, -0.5, 0.5) * 0.1, mouseBase.y, mouseBase.z + clamp(ev.clientY / height - 0.5, -0.5, 0.5) * 0.07);
    dirty = true;
  };
  window.addEventListener("pointermove", onWindowMove);

  /* ---------- pointer ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pickObj = (ev: PointerEvent): THREE.Object3D | null => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(built.pickables, true)[0];
    for (let n: THREE.Object3D | null = hit?.object ?? null; n; n = n.parent) if (n.userData.action) return n;
    return null;
  };
  const pick = (ev: PointerEvent): Action | null => (pickObj(ev)?.userData.action as Action | undefined) ?? null;

  let down: { x: number; y: number } | null = null;
  let dragged = false;
  const onDown = (ev: PointerEvent) => {
    down = { x: ev.clientX, y: ev.clientY };
    dragged = false;
    canvas.setPointerCapture(ev.pointerId);
  };
  const onMove = (ev: PointerEvent) => {
    if (down) {
      const dx = ev.clientX - down.x;
      const dy = ev.clientY - down.y;
      if (!dragged && Math.hypot(dx, dy) > 5) dragged = true;
      if (dragged && zoomTarget === 0) {
        yaw = clamp(yaw - ev.movementX * 0.004, -0.95, 0.95);
        pitch = clamp(pitch + ev.movementY * 0.003, -0.15, 0.3);
        dirty = true;
        canvas.style.cursor = "grabbing";
      }
      return;
    }
    if (zoomTarget === 1) {
      canvas.style.cursor = "zoom-out";
      o.onHover(null, 0, 0);
      return;
    }
    const obj = pickObj(ev);
    canvas.style.cursor = obj ? "pointer" : "grab";
    if (obj !== hoverObj) {
      hoverObj = obj;
      dirty = true;
    }
    o.onHover((obj?.userData.label as string | undefined) ?? null, ev.clientX, ev.clientY);
  };
  const onLeave = () => {
    hoverObj = null;
    o.onHover(null, 0, 0);
    dirty = true;
  };
  const onUp = (ev: PointerEvent) => {
    canvas.releasePointerCapture(ev.pointerId);
    const wasDrag = dragged;
    down = null;
    dragged = false;
    if (wasDrag) return;
    if (zoomTarget === 1) {
      zoomTarget = 0;
      dirty = true;
      return;
    }
    const a = pick(ev);
    if (!a) return;
    if (a.type === "lamp") {
      lampOn = !lampOn;
      applyLighting();
      dirty = true;
      return;
    }
    zoomTarget = 1;
    o.onHover(null, 0, 0);
    if (a.type !== "screen" && a.type !== "mouse") o.onAction(a);
    dirty = true;
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", resize);

  return {
    setZoom(z) {
      zoomTarget = z ? 1 : 0;
      dirty = true;
    },
    toggleLamp() {
      lampOn = !lampOn;
      applyLighting();
      dirty = true;
    },
    setNight(n) {
      nightTarget = n ? 1 : 0;
      dirty = true;
    },
    dispose() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("resize", resize);
      built.root.traverse((n) => {
        if (n instanceof THREE.Mesh) {
          n.geometry.dispose();
          for (const m of Array.isArray(n.material) ? n.material : [n.material]) {
            for (const v of Object.values(m)) if (v instanceof THREE.Texture) v.dispose();
            m.dispose();
          }
        }
      });
      pmrem.dispose();
      // No forceContextLoss(): React remounts in development reuse this canvas, and a lost context cannot be recreated.
      renderer.dispose();
    },
  };
}
