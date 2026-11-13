type P = [number, number];

/**
 * CSS matrix3d that maps a w x h element (origin top-left) onto four screen points
 * (TL, TR, BR, BL). This is what lets the live HTML desktop sit on the 3D screen.
 */
export function quadMatrix(w: number, h: number, q: [P, P, P, P]): string {
  const src: [P, P, P, P] = [[0, 0], [w, 0], [w, h], [0, h]];
  // Solve the 8 homography unknowns by Gaussian elimination.
  const a: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = q[i];
    a.push([x, y, 1, 0, 0, 0, -x * u, -y * u, u]);
    a.push([0, 0, 0, x, y, 1, -x * v, -y * v, v]);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(a[r][c]) > Math.abs(a[p][c])) p = r;
    [a[c], a[p]] = [a[p], a[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = a[r][c] / a[c][c];
      for (let k = c; k < 9; k++) a[r][k] -= f * a[c][k];
    }
  }
  const [h11, h12, h13, h21, h22, h23, h31, h32] = a.map((row, i) => row[8] / row[i]);
  return `matrix3d(${h11},${h21},0,${h31},${h12},${h22},0,${h32},0,0,1,0,${h13},${h23},0,1)`;
}
