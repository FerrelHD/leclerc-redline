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
  const [wobble, setWobble] = useState(0);

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
      maskRadius.set(160);
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
      const rx = r * (1 + 0.04 * Math.sin(wobble * 2));
      const ry = r * (1 + 0.04 * Math.cos(wobble * 2));
      return `radial-gradient(ellipse ${rx}px ${ry}px at ${x}px ${y}px, black 65%, rgba(0,0,0,0.75) 82%, transparent 100%)`;
    }
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none pointer-events-none ${className}`}
    >
      {/* 1. TOP LAYER: Charles Leclerc Clean Cutout */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none translate-y-4">
        <TransparentCutout
          src={topImage}
          alt="Charles Leclerc Top Face"
          className="max-h-[102%] object-contain object-bottom filter brightness-[1.02] contrast-[1.04]"
        />
      </div>

      {/* 2. BOTTOM LAYER: Front 3D Helmet Cutout (Alpha transparent without any rectangular border) */}
      <motion.div
        className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none translate-y-4"
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
      >
        <div className="w-full h-full flex items-end justify-center">
          <TransparentCutout
            src={bottomImage}
            alt="Charles Helmet Bottom Reveal"
            className="max-h-[100%] object-contain object-bottom filter drop-shadow-[0_15px_35px_rgba(225,6,0,0.3)] scale-[1.03] -translate-y-6"
          />
        </div>
      </motion.div>
    </div>
  );
}
