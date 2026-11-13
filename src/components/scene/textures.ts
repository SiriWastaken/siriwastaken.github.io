import * as THREE from "three";

/** Everything in the room is generated here, so the scene ships no image or model files. */
function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function woodTexture() {
  const t = canvasTexture(1024, 512, (g, w, h) => {
    g.fillStyle = "#c9a26c";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 320; i++) {
      const y = rand(0, h);
      g.strokeStyle = `rgba(${rand(90, 130)},${rand(55, 85)},${rand(20, 40)},${rand(0.03, 0.11)})`;
      g.lineWidth = rand(0.5, 2.6);
      g.beginPath();
      g.moveTo(0, y);
      for (let x = 0; x <= w; x += 64) g.lineTo(x, y + Math.sin(x * 0.012 + i) * 3 + rand(-1, 1));
      g.stroke();
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function plasterTexture() {
  const t = canvasTexture(512, 512, (g, w, h) => {
    g.fillStyle = "#e6dfd2";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "255,255,255" : "120,100,80"},${rand(0.01, 0.045)})`;
      g.fillRect(rand(0, w), rand(0, h), rand(1, 3), rand(1, 3));
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 2);
  return t;
}

export function carpetTexture() {
  const t = canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = "#1f2a44";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 7000; i++) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "255,255,255" : "0,0,0"},${rand(0.02, 0.08)})`;
      g.fillRect(rand(0, w), rand(0, h), 1.5, 1.5);
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(8, 8);
  return t;
}

/** The spine of a book, readable from the front of the desk. */
export function spineTexture(title: string, bg: string, fg: string) {
  return canvasTexture(1024, 128, (g, w, h) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    g.fillStyle = fg;
    g.fillRect(40, 18, w - 80, 3);
    g.fillRect(40, h - 21, w - 80, 3);
    let size = 52;
    g.font = `600 ${size}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    while (g.measureText(title).width > w - 120 && size > 20) {
      size -= 2;
      g.font = `600 ${size}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    }
    g.textBaseline = "middle";
    g.fillText(title, 60, h / 2 + 2);
  });
}

export function stickyTexture() {
  return canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = "#ffe27a";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(0,0,0,0.06)";
    g.fillRect(0, h - 40, w, 40);
    g.fillStyle = "#2a2a2a";
    g.font = '700 64px "Bradley Hand", "Segoe Script", "Comic Sans MS", cursive';
    g.fillText("say hi", 36, 100);
    g.font = '500 28px "Bradley Hand", "Segoe Script", "Comic Sans MS", cursive';
    g.fillText("github.com/", 36, 160);
    g.fillText("SiriWastaken", 36, 196);
  });
}

export function coverTexture(label: string) {
  return canvasTexture(512, 384, (g, w, h) => {
    g.fillStyle = "#3a4a6b";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#e9e1cf";
    g.fillRect(48, 56, w - 96, 110);
    g.fillStyle = "#222";
    g.font = '600 46px "Helvetica Neue", Helvetica, Arial, sans-serif';
    g.textBaseline = "middle";
    g.fillText(label, 72, 112);
  });
}

export function padTexture() {
  return canvasTexture(512, 400, (g, w, h) => {
    g.fillStyle = "#252b38";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) {
      g.fillStyle = `rgba(255,255,255,${rand(0.01, 0.04)})`;
      g.fillRect(rand(0, w), rand(0, h), 1.5, 1.5);
    }
  });
}
