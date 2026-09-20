import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const containerRef = useRef(null);
  const apertureRingRef = useRef(null);
  const centerContentRef = useRef(null);
  const progressCircleRef = useRef(null);
  const flashRef = useRef(null);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // Circumference for r=38 is 2 * PI * 38 ≈ 238.76
    const CIRCUMFERENCE = 238.76;

    // Number counter animation (0 to 100%) with micro-pause on Charles's #16
    const counterObj = { val: 0 };
    const counterTl = gsap.timeline();

    // Stage 1: 0 to 16
    counterTl.to(counterObj, {
      val: 16,
      duration: 0.5,
      ease: 'power1.in',
      onUpdate: () => {
        const v = Math.round(counterObj.val);
        setProgress(v);
        if (progressCircleRef.current) {
          const offset = CIRCUMFERENCE - (v / 100) * CIRCUMFERENCE;
          progressCircleRef.current.style.strokeDashoffset = String(offset);
        }
      },
    });

    // Stage 2: Micro-pause at #16
    counterTl.to({}, { duration: 0.18 });

    // Stage 3: 16 to 100
    counterTl.to(counterObj, {
      val: 100,
      duration: 0.95,
      ease: 'power2.out',
      onUpdate: () => {
        const v = Math.round(counterObj.val);
        setProgress(v);
        if (progressCircleRef.current) {
          const offset = CIRCUMFERENCE - (v / 100) * CIRCUMFERENCE;
          progressCircleRef.current.style.strokeDashoffset = String(offset);
        }
      },
    });

    // Exit Iris Opening Sequence at 100%
    const exitTl = gsap.timeline({
      delay: 1.8,
      onStart: () => {
        if (onLoaded) onLoaded();
      },
      onComplete: () => {
        setIsCompleted(true);
        document.body.style.overflow = '';
      },
    });

    // 1. Soft exposure flash
    if (flashRef.current) {
      exitTl.to(flashRef.current, { opacity: 0.6, duration: 0.1, ease: 'power2.in' }, 0);
      exitTl.to(flashRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0.1);
    }

    // 2. Fade center content (#16 & percentage)
    if (centerContentRef.current) {
      exitTl.to(centerContentRef.current, { opacity: 0, scale: 0.85, duration: 0.25, ease: 'power2.in' }, 0.05);
    }

    // 3. Aperture ring expands and rotates outwards
    if (apertureRingRef.current) {
      exitTl.to(
        apertureRingRef.current,
        {
          scale: 12,
          rotation: 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.inOut',
        },
        0.08
      );
    }

    // 4. Iris Aperture expands from center to 150vmax using universal radial-gradient mask
    const radiusProxy = { r: 0 };
    const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 1.4;

    exitTl.to(
      radiusProxy,
      {
        r: maxRadius,
        duration: 0.85,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (containerRef.current) {
            const hole = radiusProxy.r;
            const maskVal = `radial-gradient(circle at 50% 50%, transparent ${hole}px, black ${hole + 2}px)`;
            containerRef.current.style.webkitMaskImage = maskVal;
            containerRef.current.style.maskImage = maskVal;
          }
        },
      },
      0.08
    );

    return () => {
      counterTl.kill();
      exitTl.kill();
      document.body.style.overflow = '';
    };
  }, [onLoaded]);

  if (isCompleted) return null;

  return (
    <div
      ref={containerRef}
      id="loading-screen"
      className="fixed inset-0 z-[9999] w-full h-full bg-[#080809] flex flex-col items-center justify-center select-none pointer-events-auto cursor-wait overflow-hidden"
    >
      {/* Exposure Flash */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-white pointer-events-none z-30 opacity-0"
      />

      {/* Top Telemetry Header */}
      <div className="absolute top-8 sm:top-12 inset-x-0 px-8 sm:px-12 flex items-center justify-between font-mono-telemetry text-[11px] text-neutral-500 uppercase tracking-widest pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
          <span className="text-white font-medium">SCUDERIA FERRARI HP</span>
        </div>
        <span>CAR #16 // CHARLES LECLERC</span>
      </div>

      {/* Center Iris Assembly */}
      <div ref={centerContentRef} className="relative z-20 flex flex-col items-center justify-center">
        
        {/* Aperture Reticle Ring */}
        <div
          ref={apertureRingRef}
          className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center"
        >
          {/* Circular Progress Stroke */}
          <svg className="w-24 h-24 sm:w-28 sm:h-28 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="38"
              className="stroke-white/10 fill-none stroke-[2]"
            />
            <circle
              ref={progressCircleRef}
              cx="50%"
              cy="50%"
              r="38"
              className="stroke-[#E10600] fill-none stroke-[2.5] transition-all"
              strokeDasharray="238.76"
              strokeDashoffset="238.76"
              strokeLinecap="round"
            />
          </svg>

          {/* Center Driver Number Badge */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-racing font-black text-2xl sm:text-3xl text-white leading-none">
              16
            </span>
          </div>
        </div>

        {/* Status Percentage Counter */}
        <div className="mt-5 flex flex-col items-center justify-center text-center">
          <span className="font-mono-telemetry text-xs sm:text-sm text-neutral-300 font-bold uppercase tracking-[0.25em]">
            SYSTEM READY // <span className="text-[#E10600]">{progress}%</span>
          </span>
          <span className="mt-1 font-mono-telemetry text-[9px] text-neutral-500 uppercase tracking-[0.2em]">
            APERTURE EXPOSURE INITIALIZING
          </span>
        </div>

      </div>

      {/* Bottom Telemetry Footer */}
      <div className="absolute bottom-8 sm:bottom-12 inset-x-0 px-8 sm:px-12 flex items-center justify-between font-mono-telemetry text-[10px] text-neutral-600 uppercase tracking-widest pointer-events-none">
        <span>MONACO 🇲🇨 / MARANELLO 🇮🇹</span>
        <span>STATUS: ARMED</span>
      </div>
    </div>
  );
}
