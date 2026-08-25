import React, { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';

export default function WavesBackground({
  strokeColor = "rgba(0, 0, 0, 0.08)",
  backgroundColor = "transparent",
  spacing = 16,
  strokeWidth = 1,
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

  // Smoothly update stroke color when prop changes
  useEffect(() => {
    if (pathsRef.current && pathsRef.current.length > 0) {
      pathsRef.current.forEach((path) => {
        if (path) path.setAttribute('stroke', strokeColor);
      });
    }
  }, [strokeColor]);

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
    noiseRef.current = createNoise2D();

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

      pathsRef.current.forEach((path) => {
        if (path) path.remove();
      });
      pathsRef.current = [];

      const xGap = spacing;
      const yGap = 12;

      const oWidth = width + 240;
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

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', `${strokeWidth}`);
        path.style.transition = 'stroke 0.15s ease-out';

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

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);

    // Dynamic Multi-Frequency Wave Engine: Continuous Ambient Flow + Mouse Force Field
    const movePoints = (time) => {
      const lines = linesRef.current;
      const mouse = mouseRef.current;
      const noise = noiseRef.current;
      if (!noise) return;

      lines.forEach((points) => {
        points.forEach((p) => {
          // 1. Dual-Layer Simplex Noise Harmonic Motion (Flows smoothly 24/7 without hovering)
          const primaryMove = noise(
            (p.x + time * 0.005) * 0.0025,
            (p.y + time * 0.003) * 0.002
          ) * 12;

          const harmonicMove = noise(
            (p.x - time * 0.003) * 0.005,
            (p.y + time * 0.002) * 0.004
          ) * 6;

          p.wave.x = Math.cos(primaryMove) * 16 + Math.sin(harmonicMove) * 6;
          p.wave.y = Math.sin(primaryMove) * 10 + Math.cos(harmonicMove) * 4;

          // 2. Interactive Cursor Force Field (Added when hovering)
          const dx = p.x - mouse.sx;
          const dy = p.y - mouse.sy;
          const d = Math.hypot(dx, dy);
          const l = Math.max(160, mouse.vs * 1.5);

          if (d < l) {
            const s = 1 - d / l;
            const f = Math.cos(d * 0.001) * s;
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00035;
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00035;
          }

          // Restoration spring physics
          p.cursor.vx += (0 - p.cursor.x) * 0.015;
          p.cursor.vy += (0 - p.cursor.y) * 0.015;
          p.cursor.vx *= 0.93;
          p.cursor.vy *= 0.93;
          p.cursor.x += p.cursor.vx;
          p.cursor.y += p.cursor.vy;
          p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x));
          p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y));
        });
      });
    };

    const drawLines = () => {
      const lines = linesRef.current;
      const paths = pathsRef.current;

      lines.forEach((points, lIndex) => {
        if (points.length < 2 || !paths[lIndex]) return;

        const p0 = points[0];
        let d = `M ${(p0.x + p0.wave.x).toFixed(1)} ${(p0.y + p0.wave.y).toFixed(1)}`;

        for (let i = 1; i < points.length; i++) {
          const p = points[i];
          const x = (p.x + p.wave.x + p.cursor.x).toFixed(1);
          const y = (p.y + p.wave.y + p.cursor.y).toFixed(1);
          d += ` L ${x} ${y}`;
        }

        paths[lIndex].setAttribute('d', d);
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
      mouse.vs = Math.min(100, mouse.vs);

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
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [spacing, strokeWidth]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{
        backgroundColor,
        transition: 'background-color 0.2s ease-out',
      }}
    >
      <svg
        ref={svgRef}
        className="block w-full h-full js-svg pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
}
