import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransparentCutout from './TransparentCutout';
import AnimatedSignature from './AnimatedSignature';

gsap.registerPlugin(ScrollTrigger);

export default function FaceHelmetReveal() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const portraitHeroRef = useRef(null);
  const marqueeTextRef1 = useRef(null);
  const marqueeTextRef2 = useRef(null);
  const messageBadgeRef = useRef(null);

  // Mouse & Hover Liquid states
  const [mousePos, setMousePos] = useState({ x: 50, y: 38 });
  const [isFaceHovered, setIsFaceHovered] = useState(false);
  const [liquidExpand, setLiquidExpand] = useState(0); // 0 (hidden) to 1 (fully open)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  // Smooth lerp / animation loop for liquid ink expansion
  useEffect(() => {
    let animId;
    const updateLiquid = () => {
      setLiquidExpand((prev) => {
        const target = isFaceHovered ? 1 : 0;
        const diff = target - prev;
        if (Math.abs(diff) < 0.01) return target;
        return prev + diff * 0.14; // smooth fluid spring speed
      });
      animId = requestAnimationFrame(updateLiquid);
    };
    animId = requestAnimationFrame(updateLiquid);
    return () => cancelAnimationFrame(animId);
  }, [isFaceHovered]);

  // Mouse move handler for Parallax & Liquid Ink Center
  const handleMouseMove = (e) => {
    if (!portraitHeroRef.current) return;
    const rect = portraitHeroRef.current.getBoundingClientRect();

    const relX = ((e.clientX - rect.left) / rect.width) * 100;
    const relY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if cursor is over the face / head area (Y between 12% and 65%, X between 20% and 80%)
    const overFace = relY >= 12 && relY <= 65 && relX >= 20 && relX <= 80;
    setIsFaceHovered(overFace);

    setMousePos({
      x: Math.max(10, Math.min(90, relX)),
      y: Math.max(15, Math.min(60, relY)),
    });

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const rotateY = ((e.clientX - centerX) / centerX) * 4;
    const rotateX = -((e.clientY - centerY) / centerY) * 4;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsFaceHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // GSAP ScrollTrigger Sequence
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2000',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // Stage A: Background color fades to dark carbon
      tl.to(
        bgRef.current,
        {
          backgroundColor: '#09090b',
          ease: 'power1.inOut',
        },
        0
      );

      // Stage B: Portrait scales down smoothly
      tl.to(
        portraitHeroRef.current,
        {
          scale: 0.82,
          y: 20,
          ease: 'power2.inOut',
        },
        0
      );

      // Stage C: Giant Background Marquee typography scroll
      tl.fromTo(
        marqueeTextRef1.current,
        { x: '35vw' },
        { x: '-55vw', ease: 'none' },
        0
      );

      tl.fromTo(
        marqueeTextRef2.current,
        { x: '-25vw' },
        { x: '45vw', ease: 'none' },
        0
      );

      // Stage D: Message from Charles Badge
      tl.fromTo(
        messageBadgeRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0.35
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isDarkPhase = scrollProgress > 0.35;
  const topoStroke = isDarkPhase ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  // Calculate dynamic liquid ink clip path boundaries
  const currentY = mousePos.y;
  const halfSpan = 14 * liquidExpand;
  const inkTop = Math.max(0, currentY - halfSpan);
  const inkBottom = Math.min(100, currentY + halfSpan + (4 * liquidExpand));

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Dynamic Background Base */}
      <div
        ref={bgRef}
        className="absolute inset-0 transition-colors duration-200 pointer-events-none"
        style={{ backgroundColor: '#f7f7f5' }}
      />

      {/* Topographic Contour Lines Pattern (Lando Norris style) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topo-bg" width="900" height="900" patternUnits="userSpaceOnUse">
              <path
                d="M 50,450 Q 250,200 500,450 T 900,450"
                fill="none"
                stroke={topoStroke}
                strokeWidth="1.5"
              />
              <path
                d="M 100,280 Q 300,80 550,280 T 950,280"
                fill="none"
                stroke={topoStroke}
                strokeWidth="1.5"
              />
              <path
                d="M 0,620 Q 350,820 600,620 T 900,620"
                fill="none"
                stroke={topoStroke}
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo-bg)" />
        </svg>
      </div>

      {/* Translucent Liquid Paint Splatter Trail extending horizontally across background on hover */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-[4] transition-opacity duration-300 ease-out"
        style={{
          top: `${portraitHeroRef.current ? portraitHeroRef.current.offsetTop + (portraitHeroRef.current.offsetHeight * (currentY / 100)) - 55 : 260}px`,
          opacity: liquidExpand * (isDarkPhase ? 0.08 : 0.05),
          transform: `scaleY(${0.6 + liquidExpand * 0.4})`,
        }}
      >
        <svg viewBox="0 0 1400 160" className="w-full h-28" preserveAspectRatio="none">
          <path
            d="M 0,80 Q 220,25 450,75 Q 700,125 950,65 Q 1180,35 1400,80 L 1400,105 Q 1150,140 900,95 Q 650,45 400,100 Q 180,135 0,100 Z"
            fill={isDarkPhase ? '#ffffff' : '#000000'}
          />
        </svg>
      </div>

      {/* Giant Typography (Scroll Marquee) */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none z-[5] overflow-hidden">
        <div
          ref={marqueeTextRef1}
          className="whitespace-nowrap font-racing font-black text-[16vw] md:text-[13vw] leading-none tracking-tighter transition-colors duration-300"
          style={{
            color: isDarkPhase ? 'rgba(255, 229, 0, 0.12)' : 'rgba(225, 6, 0, 0.07)',
          }}
        >
          WE DID IT AT HOME • WE DID IT AT MONACO • FOR FERRARI •
        </div>
        <div
          ref={marqueeTextRef2}
          className="whitespace-nowrap font-racing font-black text-[16vw] md:text-[13vw] leading-none tracking-tighter transition-colors duration-300 -mt-8"
          style={{
            color: isDarkPhase ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          }}
        >
          #16 CHARLES LECLERC • POLE POSITION KING • 2026 REDLINE •
        </div>
      </div>

      {/* Top Monogram Tag (CL 16) */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        <div className="font-racing font-black text-2xl tracking-tighter flex items-center gap-1">
          <span className={isDarkPhase ? 'text-white' : 'text-neutral-900'}>CL</span>
          <span className="text-[#E10600]">16</span>
        </div>

        {/* Dynamic Message From Charles Label */}
        <div
          ref={messageBadgeRef}
          className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono-telemetry text-neutral-300 uppercase tracking-widest"
          style={{ opacity: 0 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#FFE500] animate-ping" />
          <span>MESSAGE FROM CHARLES</span>
        </div>
      </div>

      {/* FULL BACKGROUND HERO PORTRAIT OF CHARLES LECLERC (Cropped Sebahu) */}
      <div className="absolute inset-0 z-[6] flex items-end justify-center pointer-events-auto">
        <div
          ref={portraitHeroRef}
          className="relative w-full max-w-[620px] h-[90vh] flex items-end justify-center origin-bottom transition-transform duration-100 ease-out"
          style={{
            transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* BASE PORTRAIT LAYER: Clean Cutout Sebahu */}
          <div className="relative w-full h-full flex items-end justify-center">
            <TransparentCutout
              src="/images/leclercface.jpe"
              alt="Charles Leclerc"
              className="max-h-full object-contain object-bottom filter brightness-[1.02] contrast-[1.04]"
            />
          </div>

          {/* DYNAMIC LIQUID INK BRUSH SLICE: 3D FRONT HELMET REVEAL ON HOVER */}
          <div
            className="absolute inset-0 z-20 pointer-events-none flex items-end justify-center transition-opacity duration-200"
            style={{
              opacity: liquidExpand > 0.02 ? 1 : 0,
              clipPath: `polygon(
                0% ${inkTop}%, 
                12% ${inkTop - (3 * liquidExpand)}%, 
                30% ${inkTop + (1.5 * liquidExpand)}%, 
                55% ${inkTop - (1.5 * liquidExpand)}%, 
                80% ${inkTop + (2.5 * liquidExpand)}%, 
                100% ${inkTop}%,
                100% ${inkBottom}%, 
                80% ${inkBottom + (2.5 * liquidExpand)}%, 
                55% ${inkBottom - (1.5 * liquidExpand)}%, 
                30% ${inkBottom + (3.5 * liquidExpand)}%, 
                12% ${inkBottom - (2.5 * liquidExpand)}%, 
                0% ${inkBottom}%
              )`,
            }}
          >
            {/* Front-Facing Helmet Layer */}
            <div className="relative w-full h-full flex items-end justify-center">
              <img
                src="/images/charles-helmet-front.jpg"
                alt="Front 3D Helmet"
                className="max-h-[92%] object-contain object-bottom filter drop-shadow-[0_15px_35px_rgba(225,6,0,0.35)] scale-[1.03] -translate-y-4"
              />

              {/* Visor Glare Specular Sheen Reflection */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none mix-blend-overlay" />
            </div>
          </div>

          {/* DYNAMIC NEON AUTOGRAPH (Animated on Scroll) */}
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

      {/* Floating HUD Widget (Next Race - Monaco GP) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 pb-6 flex items-end justify-between pointer-events-none">
        {/* Left: Next Race Telemetry HUD */}
        <div
          className={`p-3.5 rounded-xl border backdrop-blur-xl transition-all duration-300 pointer-events-auto flex flex-col gap-2 ${
            isDarkPhase
              ? 'bg-[#121316]/85 border-white/10 text-white'
              : 'bg-white/90 border-black/10 text-neutral-900 shadow-xl'
          }`}
        >
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
            <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-center p-1">
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
        <div
          className={`hidden sm:flex items-center gap-3 p-3 rounded-xl border backdrop-blur-xl transition-all pointer-events-auto ${
            isDarkPhase
              ? 'bg-[#121316]/85 border-white/10 text-white'
              : 'bg-white/90 border-black/10 text-neutral-900 shadow-xl'
          }`}
        >
          <div className="text-right">
            <span className="text-[10px] font-mono-telemetry uppercase tracking-wider block opacity-70">
              HOVER FACE
            </span>
            <span className="text-xs font-racing font-bold text-[#E10600] block">
              LIQUID HELMET SLICE ⚡
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
