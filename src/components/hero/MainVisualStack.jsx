import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import TransparentCutout from './TransparentCutout';

export default function MainVisualStack({
  topImage = "/images/leclercface.jpe",
  bottomImage = "/images/charles-helmet-front.jpg",
  className = "",
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [filterSeed, setFilterSeed] = useState(1);

  // Mouse position motion values
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Velocity tracking for organic liquid stretching
  const xVelocity = useVelocity(mouseX);
  const yVelocity = useVelocity(mouseY);

  // Spring physics for smooth liquid lag & elasticity
  const springConfig = { damping: 24, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Mask size spring
  const maskSize = useMotionValue(0);
  const smoothSize = useSpring(maskSize, { damping: 18, stiffness: 160 });

  // Dynamic liquid stretch & angle based on mouse velocity
  const liquidScaleX = useTransform([xVelocity, yVelocity], ([vx, vy]) => {
    const speed = Math.sqrt(vx * vx + vy * vy);
    return Math.min(1.45, 1 + speed * 0.00035);
  });

  const liquidScaleY = useTransform([xVelocity, yVelocity], ([vx, vy]) => {
    const speed = Math.sqrt(vx * vx + vy * vy);
    return Math.max(0.75, 1 - speed * 0.00025);
  });

  const liquidRotate = useTransform([xVelocity, yVelocity], ([vx, vy]) => {
    return Math.atan2(vy, vx) * (180 / Math.PI);
  });

  // Dynamic SVG liquid mask generator
  const maskImage = useTransform(
    [smoothX, smoothY, smoothSize],
    ([x, y, s]) =>
      `radial-gradient(ellipse ${s * 1.15}px ${s * 0.95}px at ${x}px ${y}px, black 55%, rgba(0,0,0,0.6) 80%, transparent 100%)`
  );

  // Subtle turbulent ripple animation for living fluid effect
  useEffect(() => {
    let animId;
    let count = 0;
    const rippleLoop = () => {
      count++;
      if (count % 8 === 0) {
        setFilterSeed((prev) => (prev % 100) + 1);
      }
      animId = requestAnimationFrame(rippleLoop);
    };
    animId = requestAnimationFrame(rippleLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    maskSize.set(160);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    maskSize.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full overflow-hidden select-none cursor-crosshair ${className}`}
      style={{
        // Soft bottom gradient mask to ensure zero visible bottom cut line
        WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 4%, black 100%)',
        maskImage: 'linear-gradient(to top, transparent 0%, black 4%, black 100%)',
      }}
    >
      {/* SVG Liquid Displacement Filter Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="smooth-liquid-distortion" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018"
              numOctaves="3"
              seed={filterSeed}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="1.5" result="smoothed" />
            <feMerge>
              <feMergeNode in="smoothed" />
              <feMergeNode in="SourceGraphic" opacity="0.4" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* 1. TOP LAYER: Charles Leclerc Face Portrait */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none translate-y-4">
        <TransparentCutout
          src={topImage}
          alt="Charles Leclerc Top Face"
          className="max-h-[102%] object-contain object-bottom filter brightness-[1.02] contrast-[1.04]"
        />
      </div>

      {/* 2. BOTTOM LAYER: Front 3D Helmet (Revealed through organic liquid mask) */}
      <motion.div
        className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none translate-y-4"
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
          filter: 'url(#smooth-liquid-distortion)',
        }}
      >
        <img
          src={bottomImage}
          alt="Charles Helmet Bottom Reveal"
          className="max-h-[95%] object-contain object-bottom filter drop-shadow-[0_15px_35px_rgba(225,6,0,0.35)] scale-[1.04] -translate-y-4"
        />

        {/* Visor Glare Specular Sheen Reflection inside the liquid mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none mix-blend-overlay" />
      </motion.div>

      {/* 3. ORGANIC LIQUID BLOB RIPPLE (Soft background paint droplet following cursor) */}
      <motion.div
        className="absolute z-0 pointer-events-none rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          width: useTransform(smoothSize, (s) => s * 2.2),
          height: useTransform(smoothSize, (s) => s * 1.8),
          translateX: '-50%',
          translateY: '-50%',
          scaleX: liquidScaleX,
          scaleY: liquidScaleY,
          rotate: liquidRotate,
          backgroundColor: '#e2e4da',
          opacity: isHovered ? 0.75 : 0,
          filter: 'url(#smooth-liquid-distortion)',
        }}
      />
    </div>
  );
}
