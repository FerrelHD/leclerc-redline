import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MainVisualStack from './MainVisualStack';
import AnimatedSignature from './AnimatedSignature';

gsap.registerPlugin(ScrollTrigger);

export default function FaceHelmetReveal() {
  const sectionRef = useRef(null);
  const heroCardRef = useRef(null);
  const marqueeTrack1Ref = useRef(null);
  const marqueeTrack2Ref = useRef(null);
  const messageBadgeRef = useRef(null);
  const hudWidgetRef = useRef(null);

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  // 3D Parallax Tilt calculation
  const handleMouseMove = (e) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 3.5;
    const rotateX = -((y - centerY) / centerY) * 3.5;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // GSAP ScrollTrigger Sequence: Whole Hero Zoom-Out
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2200',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // Stage A: Whole Hero Section Card zooms out & shrinks to center card
      tl.to(
        heroCardRef.current,
        {
          scale: 0.68,
          borderRadius: '18px',
          boxShadow: '0 35px 90px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.1)',
          ease: 'power2.inOut',
        },
        0
      );

      // Stage B: HUD Next Race widgets fade out as card turns into floating frame
      tl.to(
        hudWidgetRef.current,
        {
          opacity: 0,
          y: 20,
          ease: 'power1.out',
        },
        0
      );

      // Stage C: Giant Background Marquee typography slides horizontally
      tl.fromTo(
        marqueeTrack1Ref.current,
        { x: '40vw' },
        { x: '-60vw', ease: 'none' },
        0
      );

      tl.fromTo(
        marqueeTrack2Ref.current,
        { x: '-30vw' },
        { x: '50vw', ease: 'none' },
        0
      );

      // Stage D: "Message from Charles" Badge appears
      tl.fromTo(
        messageBadgeRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0.35
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden select-none bg-[#09090b]"
    >
      {/* ========================================================================= */}
      {/* 1. BACKGROUND LAYER (SECTION 2: DARK CARBON WITH GIANT MARQUEE TYPOGRAPHY) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center pointer-events-none overflow-hidden bg-[#09090b]">
        
        {/* Subtle Background Radial Carbon Glow */}
        <div className="absolute inset-0 bg-radial-glow opacity-40 pointer-events-none" />

        {/* Top Text Track */}
        <div
          ref={marqueeTrack1Ref}
          className="whitespace-nowrap font-racing font-black text-[17vw] md:text-[14vw] leading-none tracking-tighter text-[#FFE500]/15"
        >
          WE DID IT AT HOME • WE DID IT AT MONACO • FOR FERRARI •
        </div>

        {/* Bottom Text Track */}
        <div
          ref={marqueeTrack2Ref}
          className="whitespace-nowrap font-racing font-black text-[17vw] md:text-[14vw] leading-none tracking-tighter text-white/10 -mt-8"
        >
          #16 CHARLES LECLERC • POLE POSITION KING • 2026 REDLINE •
        </div>

        {/* Dynamic Top Badge: Message from Charles */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
          <div className="font-racing font-black text-2xl tracking-tighter text-white flex items-center gap-1">
            <span>CL</span>
            <span className="text-[#E10600]">16</span>
          </div>

          <div
            ref={messageBadgeRef}
            className="flex items-center gap-2 mt-2 px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono-telemetry text-neutral-300 uppercase tracking-widest"
            style={{ opacity: 0 }}
          >
            <span className="w-2 h-2 rounded-full bg-[#FFE500] animate-ping" />
            <span>MESSAGE FROM CHARLES</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FOREGROUND LAYER (HERO SECTION: LIGHT TOPOGRAPHIC ZOOM-OUT CARD)       */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-auto">
        <div
          ref={heroCardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-full overflow-hidden bg-[#f7f7f5] flex flex-col justify-between origin-center transition-transform duration-75 ease-out"
          style={{
            transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Topographic Contour Lines Background inside Hero Card */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="card-topo" width="900" height="900" patternUnits="userSpaceOnUse">
                  <path
                    d="M 50,450 Q 250,200 500,450 T 900,450"
                    fill="none"
                    stroke="rgba(0,0,0,0.06)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 100,280 Q 300,80 550,280 T 950,280"
                    fill="none"
                    stroke="rgba(0,0,0,0.06)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 0,620 Q 350,820 600,620 T 900,620"
                    fill="none"
                    stroke="rgba(0,0,0,0.06)"
                    strokeWidth="1.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#card-topo)" />
            </svg>
          </div>

          {/* Center Monogram Logo (Hero state) */}
          <div
            className="absolute top-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-opacity duration-300"
            style={{ opacity: scrollProgress < 0.2 ? 1 : 0 }}
          >
            <div className="font-racing font-black text-2xl tracking-tighter text-neutral-900 flex items-center gap-1">
              <span>CL</span>
              <span className="text-[#E10600]">16</span>
            </div>
          </div>

          {/* FRAMER MOTION: MAIN VISUAL STACK (Two Stacked Cover Images with Liquid Circular Mask) */}
          <div className="relative w-full h-full flex items-end justify-center z-[6] pb-0">
            <div className="relative w-full max-w-[560px] h-[88vh] flex items-end justify-center origin-bottom">
              
              {/* Main Visual Stack Component */}
              <MainVisualStack
                topImage="/images/leclercface.jpe"
                bottomImage="/images/charles-helmet-front.jpg"
                className="w-full h-full"
              />

              {/* Dynamic Neon Autograph (Animated on Scroll across the Card) */}
              <div
                className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: scrollProgress > 0.4 ? Math.min(1, (scrollProgress - 0.4) * 3) : 0,
                }}
              >
                <AnimatedSignature
                  progress={Math.min(1, Math.max(0, (scrollProgress - 0.4) / 0.5))}
                  color="#FFE500"
                />
              </div>

            </div>
          </div>

          {/* Floating HUD Widget (Next Race - Monaco GP in Hero state) */}
          <div
            ref={hudWidgetRef}
            className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 pb-6 flex items-end justify-between pointer-events-none"
          >
            {/* Left: Next Race Telemetry HUD */}
            <div className="p-3.5 rounded-xl border bg-white/90 border-black/10 text-neutral-900 shadow-xl backdrop-blur-xl pointer-events-auto flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4 border-b border-current/10 pb-1.5">
                <span className="text-[10px] font-mono-telemetry uppercase tracking-wider opacity-70">
                  NEXT RACE
                </span>
                <span className="text-[10px] font-mono-telemetry font-bold text-[#E10600] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-ping" />
                  LIVE
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-black/5 border border-current/10 flex items-center justify-center p-1">
                  <svg viewBox="0 0 100 60" className="w-full h-full" fill="none">
                    <path
                      d="M 15,30 Q 30,10 60,15 T 85,35 Q 70,55 40,50 T 15,30"
                      stroke="#E10600"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-racing font-bold tracking-tight">MONACO GP</h4>
                  <p className="text-[10px] font-mono-telemetry opacity-60">CIRCUIT DE MONACO</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-current/10 text-[9px] font-mono-telemetry opacity-60">
                <span>SCUDERIA FERRARI</span>
                <span className="text-[#E10600] font-bold">#16</span>
              </div>
            </div>

            {/* Right: Interactive Hover Prompt */}
            <div className="hidden sm:flex items-center gap-3 p-3 rounded-xl border bg-white/90 border-black/10 text-neutral-900 shadow-xl backdrop-blur-xl pointer-events-auto">
              <div className="text-right">
                <span className="text-[10px] font-mono-telemetry uppercase tracking-wider block opacity-70">
                  HOVER CURSOR
                </span>
                <span className="text-xs font-racing font-bold text-[#E10600] block">
                  LIQUID MASK REVEAL ⚡
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
