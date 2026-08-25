import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import TransparentCutout from './TransparentCutout';

export default function MainVisualStack({
  topImage = "/images/leclercface.jpe",
  bottomImage = "/images/charles-helmet-front.jpg",
  className = "",
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [wobblePhase, setWobblePhase] = useState(0);

  // Mouse position motion values
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Spring physics for ultra-smooth fluid response
  const springConfig = { damping: 28, stiffness: 260, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Mask size spring (Smooth expansion on enter)
  const maskRadius = useMotionValue(0);
  const smoothRadius = useSpring(maskRadius, { damping: 22, stiffness: 200 });

  // Subtle organic fluid pulse/wobble
  useEffect(() => {
    let animId;
    const loop = () => {
      setWobblePhase((prev) => (prev + 0.04) % (Math.PI * 2));
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Dynamic Liquid Radial Mask using clean high-performance CSS radial-gradient
  const maskImage = useTransform(
    [smoothX, smoothY, smoothRadius],
    ([x, y, r]) => {
      const rx = r * (1 + 0.05 * Math.sin(wobblePhase * 2));
      const ry = r * (1 + 0.05 * Math.cos(wobblePhase * 2));
      return `radial-gradient(ellipse ${rx}px ${ry}px at ${x}px ${y}px, black 65%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0.2) 92%, transparent 100%)`;
    }
  );

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    maskRadius.set(165); // Generous liquid aperture
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    maskRadius.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full overflow-hidden select-none cursor-crosshair ${className}`}
      style={{
        WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 4%, black 100%)',
        maskImage: 'linear-gradient(to top, transparent 0%, black 4%, black 100%)',
      }}
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

      {/* 3. ORGANIC LIQUID SPLASH BLOB (Soft background paint halo following cursor) */}
      <motion.div
        className="absolute z-0 pointer-events-none rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          width: useTransform(smoothRadius, (r) => r * 2.2),
          height: useTransform(smoothRadius, (r) => r * 1.9),
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: '#e6e8de',
          opacity: isHovered ? 0.85 : 0,
          filter: 'blur(4px)',
          transition: 'opacity 0.2s ease-out',
        }}
      />
    </div>
  );
}
