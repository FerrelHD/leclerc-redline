import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import TransparentCutout from './TransparentCutout';

export default function MainVisualStack({
  topImage = "/images/leclercface.jpe",
  bottomImage = "/images/charles-helmet-front.jpg",
  className = "",
  globalMouse = { x: -500, y: -500 },
  isHovered = false,
}) {
  const containerRef = useRef(null);
  const [localMouse, setLocalMouse] = useState({ x: -500, y: -500 });
  const [wobble, setWobble] = useState(0);

  // Framer Motion values for local mask coordinates
  const maskX = useMotionValue(-500);
  const maskY = useMotionValue(-500);
  const maskRadius = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 260, mass: 0.5 };
  const smoothX = useSpring(maskX, springConfig);
  const smoothY = useSpring(maskY, springConfig);
  const smoothRadius = useSpring(maskRadius, { damping: 22, stiffness: 200 });

  // Update mask relative to image bounds
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = globalMouse.x - rect.left;
    const relY = globalMouse.y - rect.top;

    maskX.set(relX);
    maskY.set(relY);

    if (isHovered) {
      maskRadius.set(155);
    } else {
      maskRadius.set(0);
    }
  }, [globalMouse, isHovered]);

  // Subtle organic fluid pulse
  useEffect(() => {
    let animId;
    const loop = () => {
      setWobble((prev) => (prev + 0.04) % (Math.PI * 2));
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Smooth radial gradient mask
  const maskImage = useTransform(
    [smoothX, smoothY, smoothRadius],
    ([x, y, r]) => {
      const rx = r * (1 + 0.05 * Math.sin(wobble * 2));
      const ry = r * (1 + 0.05 * Math.cos(wobble * 2));
      return `radial-gradient(ellipse ${rx}px ${ry}px at ${x}px ${y}px, black 65%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0.2) 92%, transparent 100%)`;
    }
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none pointer-events-none ${className}`}
    >
      {/* 1. TOP LAYER: Charles Leclerc Clean Bust Portrait */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none translate-y-4">
        <TransparentCutout
          src={topImage}
          alt="Charles Leclerc Top Face"
          className="max-h-[102%] object-contain object-bottom filter brightness-[1.02] contrast-[1.04]"
        />
      </div>

      {/* 2. BOTTOM LAYER: Front 3D Helmet (Revealed smoothly through organic liquid aperture) */}
      <motion.div
        className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none translate-y-4"
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
      >
        <img
          src={bottomImage}
          alt="Charles Helmet Bottom Reveal"
          className="max-h-[95%] object-contain object-bottom filter drop-shadow-[0_15px_35px_rgba(225,6,0,0.35)] scale-[1.04] -translate-y-4"
        />

        {/* Visor Glare Specular Sheen Reflection */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none mix-blend-overlay" />
      </motion.div>
    </div>
  );
}
