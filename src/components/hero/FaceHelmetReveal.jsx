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
    const rotateY = ((x - centerX) / centerX) * 3;
    const rotateX = -((y - centerY) / centerY) * 3;
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
          <div className="font-racing font-black italic text-3xl md:text-4xl tracking-tighter text-white flex items-center leading-none">
            <span>C</span>
            <span className="-ml-0.5">L</span>
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
          className="relative w-full h-full overflow-hidden bg-[#ffffff] flex flex-col justify-between origin-center transition-transform duration-75 ease-out"
          style={{
            transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Topographic Contour Lines Background inside Hero Card */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="card-topo" width="1000" height="1000" patternUnits="userSpaceOnUse">
                  <path
                    d="M 50,500 Q 250,220 500,500 T 950,500"
                    fill="none"
                    stroke="rgba(0,0,0,0.06)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 100,300 Q 300,100 550,300 T 980,300"
                    fill="none"
                    stroke="rgba(0,0,0,0.06)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 0,650 Q 350,850 600,650 T 950,650"
                    fill="none"
                    stroke="rgba(0,0,0,0.06)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 200,150 C 400,350 600,150 800,350"
                    fill="none"
                    stroke="rgba(0,0,0,0.04)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#card-topo)" />
            </svg>
          </div>

          {/* Ghost Wireframe CAD Helmet Mesh Outline (Behind Charles' Head) */}
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] pointer-events-none opacity-25 z-[3]">
            <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
              <ellipse cx="100" cy="95" rx="72" ry="65" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" strokeDasharray="3 2" />
              <path d="M 35,95 C 35,45 165,45 165,95" stroke="rgba(0,0,0,0.5)" strokeWidth="0.8" />
              <path d="M 45,120 C 45,75 155,75 155,120" stroke="rgba(0,0,0,0.4)" strokeWidth="0.7" />
              <line x1="100" y1="30" x2="100" y2="160" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" strokeDasharray="4 2" />
              <ellipse cx="100" cy="55" rx="40" ry="20" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
            </svg>
          </div>

          {/* FRAMER MOTION: MAIN VISUAL STACK (Two Stacked Cover Images with Liquid Circular Mask) */}
          <div className="relative w-full h-full flex items-end justify-center z-[6] pb-0">
            <div className="relative w-full max-w-[620px] h-[90vh] flex items-end justify-center origin-bottom">
              
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

          {/* Exact HUD Widget (Next Race - Monza GP with Chamfered Corner) */}
          <div
            ref={hudWidgetRef}
            className="absolute bottom-8 left-6 md:left-12 z-20 pointer-events-auto select-none"
          >
            <div className="w-36 bg-white/95 border border-neutral-300/80 rounded-2xl rounded-tl-[24px] p-3 shadow-lg backdrop-blur-md flex flex-col gap-2 relative">
              {/* Top Chamfer Accent Notch */}
              <div className="text-[9px] font-mono-telemetry uppercase tracking-wider text-neutral-500 font-bold border-b border-neutral-200 pb-1.5 flex items-center justify-between">
                <span>NEXT RACE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black/60" />
              </div>

              {/* Circuit Outline & Name */}
              <div className="flex flex-col items-center py-1 border-b border-neutral-200">
                <svg viewBox="0 0 100 40" className="w-20 h-7" fill="none">
                  {/* Monza Circuit Silhouette */}
                  <path
                    d="M 10,25 C 20,25 30,10 50,12 C 70,14 85,18 90,20 C 95,22 92,30 80,30 C 65,30 40,28 20,28 C 12,28 8,26 10,25 Z"
                    stroke="#111111"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[11px] font-racing font-black text-black tracking-tight mt-1 uppercase">
                  MONZA GP
                </span>
              </div>

              {/* Formula 1 Laurel Wreath + Helmet */}
              <div className="flex flex-col items-center pt-0.5 text-center">
                <div className="flex items-center justify-center gap-1 text-neutral-800">
                  <svg viewBox="0 0 60 40" className="w-12 h-8" fill="none">
                    {/* Laurel Wreath Left */}
                    <path d="M 12,28 C 8,22 8,14 14,8 C 15,12 16,16 18,20" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" />
                    {/* Laurel Wreath Right */}
                    <path d="M 48,28 C 52,22 52,14 46,8 C 45,12 44,16 42,20" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" />
                    {/* Center Helmet Icon */}
                    <ellipse cx="30" cy="18" rx="10" ry="9" stroke="#111111" strokeWidth="1.5" />
                    <path d="M 22,18 C 24,14 36,14 38,18 Z" fill="#111111" />
                    <line x1="20" y1="22" x2="40" y2="22" stroke="#111111" strokeWidth="1.2" />
                  </svg>
                </div>
                <div className="text-[8px] font-mono-telemetry font-bold text-neutral-700 tracking-wider uppercase leading-tight -mt-1">
                  <div>FORMULA 1</div>
                  <div className="text-neutral-400 font-normal">SINCE 2018</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
