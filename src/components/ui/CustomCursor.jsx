import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    // Check if device supports fine hover (desktop only)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);

      // Check if hovering interactive element
      const target = e.target;
      const isInteractive = target && target.closest('a, button, [role="button"], input, textarea, .cursor-pointer, .group');
      setIsHovered(!!isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } hidden md:block`}
    >
      {/* Center Precision Dot */}
      <div
        ref={cursorDotRef}
        className="fixed -left-1.5 -top-1.5 size-3 rounded-full bg-[#E10600] shadow-[0_0_12px_#E10600]"
        style={{ willChange: 'transform' }}
      />

      {/* Trailing Racing Ring */}
      <div
        ref={cursorRingRef}
        className={`fixed -left-4 -top-4 rounded-full border border-[#E10600]/60 transition-all duration-200 ${
          isHovered
            ? 'size-12 -left-6 -top-6 bg-[#E10600]/15 border-[#E10600] scale-110'
            : 'size-8 scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
