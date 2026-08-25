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

  // Mouse pixel coordinates inside section
  const [mouseCoord, setMouseCoord] = useState({ x: -500, y: -500 });
  const [smoothMouse, setSmoothMouse] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  // Smooth fluid spring lerp for the liquid wave position
  useEffect(() => {
    let animId;
    const lerpLoop = () => {
      setSmoothMouse((prev) => {
        const dx = mouseCoord.x - prev.x;
        const dy = mouseCoord.y - prev.y;
        if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) return mouseCoord;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animId = requestAnimationFrame(lerpLoop);
    };
    animId = requestAnimationFrame(lerpLoop);
    return () => cancelAnimationFrame(animId);
  }, [mouseCoord]);

  // Track cursor anywhere in the hero section
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsHovered(true);
    setMouseCoord({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 4;
    const rotateX = -((y - centerY) / centerY) * 4;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseCoord({ x: -500, y: -500 });
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

  // Calculate mouse position relative to portrait container for helmet masking
  const getPortraitRelativeMouse = () => {
    if (!portraitHeroRef.current) return { x: -500, y: -500 };
    const pRect = portraitHeroRef.current.getBoundingClientRect();
    const sRect = sectionRef.current ? sectionRef.current.getBoundingClientRect() : { left: 0, top: 0 };
    
    // Position of portrait relative to section
    const pLeft = pRect.left - sRect.left;
    const pTop = pRect.top - sRect.top;

    return {
      x: smoothMouse.x - pLeft,
      y: smoothMouse.y - pTop,
    };
  };

  const portraitMouse = getPortraitRelativeMouse();

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen overflow-hidden select-none flex flex-col justify-between"
    >
      {/* SVG Mask Definition for Localized Liquid Wave Reveal */}
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="liquid-cursor-mask" clipPathUnits="userSpaceOnUse">
            {/* Localized organic liquid wave shape centered at portraitMouse */}
            <path
              d={`
                M ${portraitMouse.x - 170} ${portraitMouse.y}
                C ${portraitMouse.x - 110} ${portraitMouse.y - 45}, ${portraitMouse.x - 40} ${portraitMouse.y - 35}, ${portraitMouse.x} ${portraitMouse.y - 40}
                C ${portraitMouse.x + 50} ${portraitMouse.y - 45}, ${portraitMouse.x + 110} ${portraitMouse.y - 25}, ${portraitMouse.x + 180} ${portraitMouse.y}
                C ${portraitMouse.x + 120} ${portraitMouse.y + 45}, ${portraitMouse.x + 50} ${portraitMouse.y + 40}, ${portraitMouse.x} ${portraitMouse.y + 45}
                C ${portraitMouse.x - 50} ${portraitMouse.y + 50}, ${portraitMouse.x - 110} ${portraitMouse.y + 35}, ${portraitMouse.x - 170} ${portraitMouse.y}
                Z
              `}
            />
          </clipPath>
        </defs>
      </svg>

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

      {/* LOCALIZED LIQUID INK WAVE (Renders around the cursor on the background) */}
      <div
        className="absolute inset-0 pointer-events-none z-[4] transition-opacity duration-200"
        style={{
          opacity: isHovered ? (isDarkPhase ? 0.25 : 0.9) : 0,
        }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Main organic liquid wave blob around the cursor */}
          <path
            d={`
              M ${smoothMouse.x - 170} ${smoothMouse.y}
              C ${smoothMouse.x - 110} ${smoothMouse.y - 45}, ${smoothMouse.x - 40} ${smoothMouse.y - 35}, ${smoothMouse.x} ${smoothMouse.y - 40}
              C ${smoothMouse.x + 50} ${smoothMouse.y - 45}, ${smoothMouse.x + 110} ${smoothMouse.y - 25}, ${smoothMouse.x + 180} ${smoothMouse.y}
              C ${smoothMouse.x + 120} ${smoothMouse.y + 45}, ${smoothMouse.x + 50} ${smoothMouse.y + 40}, ${smoothMouse.x} ${smoothMouse.y + 45}
              C ${smoothMouse.x - 50} ${smoothMouse.y + 50}, ${smoothMouse.x - 110} ${smoothMouse.y + 35}, ${smoothMouse.x - 170} ${smoothMouse.y}
              Z
            `}
            fill={isDarkPhase ? 'rgba(255, 255, 255, 0.08)' : '#e2e4da'}
          />

          {/* Organic satellite droplets / liquid splash accents */}
          <circle
            cx={smoothMouse.x - 195}
            cy={smoothMouse.y - 10}
            r="8"
            fill={isDarkPhase ? 'rgba(255, 255, 255, 0.06)' : '#dcdfd4'}
          />
          <circle
            cx={smoothMouse.x + 205}
            cy={smoothMouse.y + 8}
            r="10"
            fill={isDarkPhase ? 'rgba(255, 255, 255, 0.06)' : '#dcdfd4'}
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

      {/* FULL HERO PORTRAIT OF CHARLES LECLERC (Strictly Cropped Sebahu) */}
      <div className="absolute inset-0 z-[6] flex items-end justify-center pointer-events-auto">
        <div
          ref={portraitHeroRef}
          className="relative w-full max-w-[560px] h-[88vh] flex items-end justify-center origin-bottom transition-transform duration-100 ease-out"
          style={{
            transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* BASE PORTRAIT LAYER: Clean Sebahu Cutout */}
          <div className="relative w-full h-full flex items-end justify-center">
            <TransparentCutout
              src="/images/leclercface.jpe"
              alt="Charles Leclerc"
              className="max-h-full object-contain object-bottom filter brightness-[1.02] contrast-[1.04]"
            />
          </div>

          {/* DYNAMIC LIQUID INK WAVE: 3D FRONT HELMET REVEAL AROUND THE CURSOR */}
          <div
            className="absolute inset-0 z-20 pointer-events-none flex items-end justify-center transition-opacity duration-150"
            style={{
              opacity: isHovered ? 1 : 0,
              clipPath: 'url(#liquid-cursor-mask)',
            }}
          >
            {/* Front-Facing 3D Helmet Layer */}
            <div className="relative w-full h-full flex items-end justify-center">
              <img
                src="/images/charles-helmet-front.jpg"
                alt="Front 3D Helmet"
                className="max-h-[92%] object-contain object-bottom filter drop-shadow-[0_15px_35px_rgba(225,6,0,0.35)] scale-[1.04] -translate-y-4"
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
              MOVE CURSOR
            </span>
            <span className="text-xs font-racing font-bold text-[#E10600] block">
              LIQUID WAVE SLICE ⚡
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
