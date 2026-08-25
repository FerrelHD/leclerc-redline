import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailerPos, setTrailerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPosition({ x: mouseX, y: mouseY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive elements
      const target = e.target;
      const isInteractive = target.closest('a, button, [role="button"], input, .cursor-pointer, .cursor-crosshair');
      setIsHovered(!!isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);

    // Smooth inertia lerp loop
    let animId;
    const lerpLoop = () => {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      setTrailerPos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(lerpLoop);
    };
    animId = requestAnimationFrame(lerpLoop);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      
      {/* 1. Precise Center Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#E10600] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#E10600]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />

      {/* 2. Smooth Spring Trailer Ring / Mini Helmet HUD */}
      <div
        className={`fixed top-0 left-0 rounded-full border border-[#E10600]/60 -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color] duration-200 flex items-center justify-center ${
          isHovered ? 'w-12 h-12 bg-[#E10600]/10 border-[#E10600]' : 'w-8 h-8 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${trailerPos.x}px, ${trailerPos.y}px, 0)`,
        }}
      >
        {isHovered && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFE500] animate-ping" />
        )}
      </div>

    </div>
  );
}
