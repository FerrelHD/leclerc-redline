import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import TransparentCutout from './TransparentCutout';

export default function MainVisualStack({
  topImage = "/images/leclercface.jpe",
  bottomImage = "/images/charles-helmet-front.jpg",
  className = "",
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse motion values
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Spring physics for smooth liquid elasticity
  const springConfig = { damping: 26, stiffness: 280, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Mask radius expands on hover
  const radius = useMotionValue(0);
  const smoothRadius = useSpring(radius, { damping: 20, stiffness: 200 });

  // Dynamic radial liquid circular mask
  const maskImage = useTransform(
    [smoothX, smoothY, smoothRadius],
    ([x, y, r]) =>
      `radial-gradient(circle ${r}px at ${x}px ${y}px, black 65%, rgba(0,0,0,0.5) 85%, transparent 100%)`
  );

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    radius.set(160); // 160px liquid circular mask radius
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    radius.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full overflow-hidden select-none cursor-crosshair ${className}`}
    >
      {/* 1. TOP LAYER: Charles Leclerc Face Portrait */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none">
        <TransparentCutout
          src={topImage}
          alt="Charles Leclerc Top Face"
          className="max-h-full object-contain object-bottom filter brightness-[1.02] contrast-[1.04]"
        />
      </div>

      {/* 2. BOTTOM LAYER: Front 3D Helmet (Revealed through smooth liquid circular mask) */}
      <motion.div
        className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none"
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
      >
        <img
          src={bottomImage}
          alt="Charles Helmet Bottom Reveal"
          className="max-h-[92%] object-contain object-bottom filter drop-shadow-[0_15px_35px_rgba(225,6,0,0.35)] scale-[1.04] -translate-y-4"
        />

        {/* Visor Glare Specular Sheen Reflection inside the liquid mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none mix-blend-overlay" />
      </motion.div>

      {/* 3. LIQUID CIRCULAR WAVE RIPPLE (Soft background paint blob around cursor) */}
      <motion.div
        className="absolute z-0 pointer-events-none rounded-full blur-[2px]"
        style={{
          x: smoothX,
          y: smoothY,
          width: useTransform(smoothRadius, (r) => r * 2.2),
          height: useTransform(smoothRadius, (r) => r * 1.8),
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: '#e2e4da',
          opacity: isHovered ? 0.75 : 0,
        }}
      />
    </div>
  );
}
