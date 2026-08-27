import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // Window size for SVG curved liquid path
    const w = window.innerWidth;
    const h = window.innerHeight;
    const curve = h * (w < 768 ? 0.18 : 0.28);

    const initialPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + curve} 0 ${h} L0 0`;
    const flatPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`;
    const exitPath = `M0 0 L${w} 0 L${w} 0 Q${w / 2} -${curve} 0 0 L0 0`;

    if (pathRef.current) {
      pathRef.current.setAttribute('d', initialPath);
    }

    // Number counter animation (0 to 100%)
    const counterObj = { val: 0 };
    const counterTl = gsap.to(counterObj, {
      val: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        setProgress(Math.round(counterObj.val));
      },
    });

    // Reveal sequence
    const tl = gsap.timeline({
      delay: 2.1,
      onComplete: () => {
        setIsCompleted(true);
        document.body.style.overflow = '';
        if (onLoaded) onLoaded();
      },
    });

    // 1. Fade out text
    tl.to(textRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.45,
      ease: 'power2.in',
    });

    // 2. Liquid curve wipe exit to top
    tl.to(
      containerRef.current,
      {
        yPercent: -100,
        duration: 0.9,
        ease: 'power3.inOut',
      },
      '-=0.1'
    );

    if (pathRef.current) {
      tl.to(
        pathRef.current,
        {
          attr: { d: flatPath },
          duration: 0.45,
          ease: 'power2.inOut',
        },
        '<10%'
      );
    }

    return () => {
      counterTl.kill();
      tl.kill();
      document.body.style.overflow = '';
    };
  }, []);

  if (isCompleted) return null;

  return (
    <div
      ref={containerRef}
      id="loading-screen"
      className="fixed inset-0 z-[9999] w-full h-full bg-[#080809] flex flex-col items-center justify-center select-none pointer-events-auto cursor-wait"
    >
      {/* Background SVG Liquid Path */}
      <svg className="absolute inset-0 w-full h-[120%] pointer-events-none fill-[#080809]">
        <path ref={pathRef} />
      </svg>

      {/* Center Content */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
      >
        {/* Monogram Badge */}
        <div className="flex items-center gap-2 mb-6 font-mono-telemetry text-xs uppercase tracking-[0.35em] text-[#E10600]">
          <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
          <span>SCUDERIA FERRARI // #16</span>
        </div>

        {/* Brand Typography */}
        <h1 className="font-racing font-black text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase text-white leading-none mb-3">
          CHARLES <span className="text-[#E10600]">LECLERC</span>
        </h1>

        <p className="font-editorial italic text-lg sm:text-2xl text-neutral-400 font-light mb-10">
          The Pursuit of Pure Speed
        </p>

        {/* Live Counter & Telemetry Bar */}
        <div className="w-64 sm:w-80 flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono-telemetry text-xs text-neutral-400">
            <span>INITIALIZING TELEMETRY...</span>
            <span className="text-white font-bold">{progress}%</span>
          </div>

          {/* Progress Line */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E10600] transition-all duration-75 ease-out shadow-[0_0_12px_#E10600]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-mono-telemetry text-[10px] text-neutral-500 mt-1">
            <span>MONACO 🇲🇨 / MARANELLO 🇮🇹</span>
            <span>2026 RACE READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
