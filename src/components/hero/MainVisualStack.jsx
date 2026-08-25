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

  const springConfig = { damping: 28, stiffness: 260, mass: 0.5 };
  const smoothX = useSpring(maskX, springConfig);
  const smoothY = useSpring(maskY, springConfig);
  const smoothRadius = useSpring(maskRadius, { damping: 22, stiffness: 200 });

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = globalMouse.x - rect.left;
    const relY = globalMouse.y - rect.top;

    maskX.set(relX);
    maskY.set(relY);

    if (isHovered) {
      maskRadius.set(130); // Compact elongated liquid droplet
    } else {
      maskRadius.set(0);
    }
  }, [globalMouse, isHovered]);

  // Organic fluid oscillation loop
  useEffect(() => {
    let animId;
    const loop = () => {
      setTime((prev) => prev + 0.06);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Generate Elongated Wavy Liquid Blob SVG Path (Memanjang Horizontal)
  useEffect(() => {
    const r = smoothRadius.get();
    if (r <= 5) {
      setBlobPath("");
      return;
    }

    const cx = smoothX.get();
    const cy = smoothY.get();
    const points = 16;
    const pathCoords = [];

    // Aspect ratio: stretched horizontally
    const stretchX = 1.62;
    const stretchY = 0.82;

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const wave =
        1 +
        0.12 * Math.sin(3 * angle + time) +
        0.09 * Math.cos(4 * angle - time * 1.2) +
        0.05 * Math.sin(6 * angle + time * 0.8);

      const radX = r * stretchX * wave;
      const radY = r * stretchY * wave;

      const x = cx + Math.cos(angle) * radX;
      const y = cy + Math.sin(angle) * radY;
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
      {/* Dynamic SVG ClipPath Definition for Elongated Liquid Blob */}
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="organic-liquid-mask">
            {blobPath && <path d={blobPath} />}
          </clipPath>
        </defs>
      </svg>

      {/* 1. TOP LAYER: Charles Leclerc Clean Cutout (Lowered to translate-y-16 for Seamless Submersion) */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none translate-y-16 scale-[1.04]">
        <TransparentCutout
          src={topImage}
          alt="Charles Leclerc Top Face"
          className="max-h-[110%] object-contain object-bottom filter brightness-[1.02] contrast-[1.04]"
        />
      </div>

      {/* 2. BOTTOM LAYER: Official Monaco GP Helmet (Aligned with Head & Chin) */}
      <div
        className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none translate-y-16 scale-[1.04] transition-opacity duration-150"
        style={{
          clipPath: blobPath ? 'url(#organic-liquid-mask)' : 'none',
          opacity: blobPath ? 1 : 0,
        }}
      >
        <div className="w-full h-full flex items-end justify-center">
          <TransparentCutout
            src={bottomImage}
            alt="Charles Leclerc Official Monaco GP Helmet Worn"
            className="max-h-[110%] object-contain object-bottom filter brightness-[1.05] contrast-[1.12] drop-shadow-[0_20px_45px_rgba(225,6,0,0.4)] scale-[0.80] -translate-y-16"
          />
        </div>
      </div>
    </div>
  );
}
