import React, { useEffect, useRef } from 'react';

// 2D Simplex Noise Implementation (Self-contained, Zero External Dependencies)
function buildPermutationTable(seed = 1337) {
  const table = new Uint8Array(256);
  for (let i = 0; i < 256; i++) table[i] = i;
  let s = seed * 65536;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const n = Math.floor((s / 2147483647) * (i + 1));
    const q = table[i];
    table[i] = table[n];
    table[n] = q;
  }
  return table;
}

function createNoise2D(seed = Math.random()) {
  const p = buildPermutationTable(seed);
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }
  const grad2 = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [1, 0], [-1, 0],
    [0, 1], [0, -1], [0, 1], [0, -1],
  ];
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;

  return function noise2D(x, y) {
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      t0 *= t0;
      const gi0 = permMod12[ii + perm[jj]];
      n0 = t0 * t0 * (grad2[gi0][0] * x0 + grad2[gi0][1] * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      t1 *= t1;
      const gi1 = permMod12[ii + i1 + perm[jj + j1]];
      n1 = t1 * t1 * (grad2[gi1][0] * x1 + grad2[gi1][1] * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      t2 *= t2;
      const gi2 = permMod12[ii + 1 + perm[jj + 1]];
      n2 = t2 * t2 * (grad2[gi2][0] * x2 + grad2[gi2][1] * y2);
    }
    return 70 * (n0 + n1 + n2);
  };
}

export default function WavesBackground({
  strokeColor = "rgba(0, 0, 0, 0.08)",
  backgroundColor = "transparent",
  spacing = 16,
  strokeWidth = 1,
  showPointer = false,
  pointerSize = 0.5,
  className = "",
  globalMouse = null,
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const mouseRef = useRef({
    x: -500,
    y: -500,
    lx: -500,
    ly: -500,
    sx: -500,
    sy: -500,
    v: 0,
    vs: 0,
    a: 0,
    set: false,
  });
  const pathsRef = useRef([]);
  const linesRef = useRef([]);
  const noiseRef = useRef(null);
  const rafRef = useRef(null);
  const boundingRef = useRef(null);

  // Sync external globalMouse if provided
  useEffect(() => {
    if (globalMouse && boundingRef.current) {
      const mouse = mouseRef.current;
      mouse.x = globalMouse.x - boundingRef.current.left;
      mouse.y = globalMouse.y - boundingRef.current.top;
      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.set = true;
      }
    }
  }, [globalMouse]);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;
    noiseRef.current = createNoise2D(42);

    const setSize = () => {
      if (!containerRef.current || !svgRef.current) return;
      boundingRef.current = containerRef.current.getBoundingClientRect();
      const { width, height } = boundingRef.current;
      svgRef.current.style.width = `${width}px`;
      svgRef.current.style.height = `${height}px`;
    };

    const setLines = () => {
      if (!svgRef.current || !boundingRef.current) return;
      const { width, height } = boundingRef.current;
      linesRef.current = [];
      pathsRef.current.forEach((path) => path.remove());
      pathsRef.current = [];

      const xGap = Math.max(4, spacing);
      const yGap = Math.max(4, spacing);
      const oWidth = width + 120;
      const oHeight = height + 40;
      const totalLines = Math.ceil(oWidth / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);
      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      for (let i = 0; i < totalLines; i++) {
        const points = [];
        for (let j = 0; j < totalPoints; j++) {
          points.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          });
        }
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", strokeColor);
        path.setAttribute("stroke-width", String(strokeWidth));
        svgRef.current.appendChild(path);
        pathsRef.current.push(path);
        linesRef.current.push(points);
      }
    };

    setSize();
    setLines();

    const onResize = () => {
      setSize();
      setLines();
    };

    const onMouseMove = (e) => {
      if (!boundingRef.current) return;
      const mouse = mouseRef.current;
      mouse.x = e.clientX - boundingRef.current.left;
      mouse.y = e.clientY - boundingRef.current.top;
      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.set = true;
      }
    };

    window.addEventListener("resize", onResize);
    const container = containerRef.current;
    container.addEventListener("mousemove", onMouseMove);

    const movePoints = (time) => {
      const lines = linesRef.current;
      const mouse = mouseRef.current;
      const noise = noiseRef.current;
      if (!noise) return;

      lines.forEach((points) => {
        points.forEach((p) => {
          const move = noise((p.x + time * 0.006) * 0.003, (p.y + time * 0.002) * 0.002) * 8;
          p.wave.x = Math.cos(move) * 10;
          p.wave.y = Math.sin(move) * 6;

          const dx = p.x - mouse.sx;
          const dy = p.y - mouse.sy;
          const d = Math.hypot(dx, dy);
          const l = Math.max(160, mouse.vs);

          if (d < l) {
            const s = 1 - d / l;
            const f = Math.cos(d * 0.001) * s;
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00035;
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00035;
          }

          p.cursor.vx += (0 - p.cursor.x) * 0.02;
          p.cursor.vy += (0 - p.cursor.y) * 0.02;
          p.cursor.vx *= 0.94;
          p.cursor.vy *= 0.94;
          p.cursor.x += p.cursor.vx;
          p.cursor.y += p.cursor.vy;
          p.cursor.x = Math.min(45, Math.max(-45, p.cursor.x));
          p.cursor.y = Math.min(45, Math.max(-45, p.cursor.y));
        });
      });
    };

    const moved = (point) => ({
      x: point.x + point.wave.x + point.cursor.x,
      y: point.y + point.wave.y + point.cursor.y,
    });

    const drawLines = () => {
      const lines = linesRef.current;
      const paths = pathsRef.current;
      lines.forEach((points, lIndex) => {
        if (points.length < 2 || !paths[lIndex]) return;
        const firstPoint = moved(points[0]);
        let d = `M ${firstPoint.x} ${firstPoint.y}`;
        for (let i = 1; i < points.length; i++) {
          const current = moved(points[i]);
          d += ` L ${current.x} ${current.y}`;
        }
        paths[lIndex].setAttribute("d", d);
      });
    };

    const tick = (time) => {
      const mouse = mouseRef.current;
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);
      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(90, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);

      movePoints(time);
      drawLines();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      container?.removeEventListener("mousemove", onMouseMove);
    };
  }, [spacing, strokeColor, strokeWidth]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{ backgroundColor }}
    >
      <svg
        ref={svgRef}
        className="block w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
}
