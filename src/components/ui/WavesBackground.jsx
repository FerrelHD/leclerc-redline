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
  const canvasRef = useRef(null);
  const strokeColorRef = useRef(strokeColor);
  strokeColorRef.current = strokeColor;

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

  const linesRef = useRef([]);
  const noiseRef = useRef(null);
  const rafRef = useRef(null);
  const isVisibleRef = useRef(true);
  const boundingRef = useRef({ width: 0, height: 0, left: 0, top: 0 });

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
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!noiseRef.current) {
      noiseRef.current = createNoise2D();
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      boundingRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };

      const w = Math.max(rect.width, 100);
      const h = Math.max(rect.height, 100);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      initLines(w, h);
    };

    const initLines = (width, height) => {
      const xGap = spacing;
      const yGap = 12;

      const oWidth = width + 240;
      const oHeight = height + 40;

      const totalLines = Math.ceil(oWidth / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);

      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      const lines = [];
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
        lines.push(points);
      }
      linesRef.current = lines;
    };

    setSize();

    const onResize = () => {
      setSize();
    };

    const onMouseMove = (e) => {
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

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !rafRef.current) {
          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const movePoints = (time) => {
      const lines = linesRef.current;
      const mouse = mouseRef.current;
      const noise = noiseRef.current;
      if (!noise) return;

      for (let i = 0; i < lines.length; i++) {
        const points = lines[i];
        for (let j = 0; j < points.length; j++) {
          const p = points[j];

          // 1. Dual-Layer Simplex Noise Harmonic Motion
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

          // 2. Interactive Cursor Force Field
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
        }
      }
    };

    const drawCanvas = () => {
      const { width, height } = boundingRef.current;
      if (width === 0 || height === 0) return;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.strokeStyle = strokeColorRef.current;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const lines = linesRef.current;
      for (let lIndex = 0; lIndex < lines.length; lIndex++) {
        const points = lines[lIndex];
        if (points.length < 2) continue;

        const p0 = points[0];
        ctx.moveTo(p0.x + p0.wave.x, p0.y + p0.wave.y);

        for (let i = 1; i < points.length; i++) {
          const p = points[i];
          ctx.lineTo(p.x + p.wave.x + p.cursor.x, p.y + p.wave.y + p.cursor.y);
        }
      }

      ctx.stroke();
      ctx.restore();
    };

    const tick = (time) => {
      if (!isVisibleRef.current) {
        rafRef.current = null;
        return;
      }

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
      drawCanvas();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      observer.disconnect();
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
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
}
