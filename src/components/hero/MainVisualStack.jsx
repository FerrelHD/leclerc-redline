import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import TransparentCutout from './TransparentCutout';

export default function MainVisualStack({
  topImage = "/images/leclercface.jpe",
  bottomImage = "/images/charles-helmet-front.jpg",
  className = "",
  globalMouse = { x: -500, y: -500 },
  isHovered = false,
}) {
  const containerRef = useRef(null);
  const [blobPath, setBlobPath] = useState("");
  const [time, setTime] = useState(0);

  // Motion values for mask coordinates relative to image container
  const maskX = useMotionValue(-500);
  const maskY = useMotionValue(-500);
  const maskRadius = useMotionValue(0);

  const springConfig = { damping: 26, stiffness: 240, mass: 0.5 };
  const smoothX = useSpring(maskX, springConfig);
  const smoothY = useSpring(maskY, springConfig);
  const smoothRadius = useSpring(maskRadius, { damping: 20, stiffness: 180 });

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = globalMouse.x - rect.left;
    const relY = globalMouse.y - rect.top;

    maskX.set(relX);
    maskY.set(relY);

    if (isHovered) {
      maskRadius.set(185); // Organic liquid puddle radius
    } else {
      maskRadius.set(0);
    }
  }, [globalMouse, isHovered]);

  // Organic fluid oscillation loop
  useEffect(() => {
    let animId;
    const loop = () => {
      setTime((prev) => prev + 0.05);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Generate 12-point Organic Wavy Liquid Blob SVG Path
  useEffect(() => {
    const r = smoothRadius.get();
    if (r <= 5) {
      setBlobPath("");
      return;
    }

    const cx = smoothX.get();
    const cy = smoothY.get();
    const points = 12;
    const pathCoords = [];

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      // Multi-harmonic fluid wave deformers
      const wave =
        1 +
        0.13 * Math.sin(3 * angle + time) +
        0.08 * Math.cos(5 * angle - time * 1.3) +
        0.05 * Math.sin(7 * angle + time * 0.7);

      const rad = r * wave;
      const x = cx + Math.cos(angle) * rad;
      const y = cy + Math.sin(angle) * rad;
      pathCoords.push({ x, y });
    }

    // Build smooth cubic bezier closed path
    let d = `M ${pathCoords[0].x} ${pathCoords[0].y}`;
    for (let i = 0; i < points; i++) {
      const curr = pathCoords[i];
      const next = pathCoords[i + 1];
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;
      d += ` Q ${curr.x} ${curr.y}, ${midX} ${midY}`;
    }
    d += " Z";
    setBlobPath(d);
  }, [time, smoothX, smoothY, smoothRadius]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none pointer-events-none ${className}`}
    >
      {/* Dynamic SVG ClipPath Definition for Organic Liquid Blob */}
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="organic-liquid-mask">
            {blobPath && <path d={blobPath} />}
          </clipPath>
        </defs>
      </svg>

      {/* 1. TOP LAYER: Charles Leclerc Clean Portrait Cutout */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none translate-y-4">
        <TransparentCutout
          src={topImage}
          alt="Charles Leclerc Top Face"
          className="max-h-[102%] object-contain object-bottom filter brightness-[1.02] contrast-[1.04]"
        />
      </div>

      {/* 2. BOTTOM LAYER: Official Monaco GP 2024 Special Helmet (Sharpened & High Definition) */}
      <div
        className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none translate-y-4 transition-opacity duration-150"
        style={{
          clipPath: blobPath ? 'url(#organic-liquid-mask)' : 'none',
          opacity: blobPath ? 1 : 0,
        }}
      >
        <div className="w-full h-full flex items-end justify-center">
          <TransparentCutout
            src={bottomImage}
            alt="Charles Leclerc Official Monaco GP 2024 Helmet"
            className="max-h-[100%] object-contain object-bottom filter brightness-[1.05] contrast-[1.12] drop-shadow-[0_20px_45px_rgba(225,6,0,0.4)] scale-[1.04] -translate-y-6"
          />
        </div>
      </div>
    </div>
  );
}
