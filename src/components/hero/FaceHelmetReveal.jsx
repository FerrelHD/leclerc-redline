import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import MainVisualStack from './MainVisualStack';
import AnimatedSignature from './AnimatedSignature';
import MonzaHudCard from './MonzaHudCard';

gsap.registerPlugin(ScrollTrigger);

export default function FaceHelmetReveal() {
  const sectionRef = useRef(null);
  const heroCardRef = useRef(null);
  const marqueeTrack1Ref = useRef(null);
  const marqueeTrack2Ref = useRef(null);
  const messageBadgeRef = useRef(null);
  const hudWidgetRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Framer Motion spring for the full-screen liquid blob
  const blobX = useMotionValue(-500);
  const blobY = useMotionValue(-500);
  const blobRadius = useMotionValue(0);

  const springConfig = { damping: 26, stiffness: 240, mass: 0.5 };
  const smoothBlobX = useSpring(blobX, springConfig);
  const smoothBlobY = useSpring(blobY, springConfig);
  const smoothBlobRadius = useSpring(blobRadius, { damping: 20, stiffness: 180 });

  const handleMouseMove = (e) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsHovered(true);
    setMousePos({ x: e.clientX, y: e.clientY });

    blobX.set(x);
    blobY.set(y);
    blobRadius.set(175);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: -500, y: -500 });
    blobRadius.set(0);
  };

  // GSAP ScrollTrigger Sequence: Fullscreen to Clean Portrait Crop + Overlapping Signature
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2400',
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // Stage A: Whole Hero Card zooms out & crops horizontally into a clean Portrait Box
      tl.to(
        heroCardRef.current,
        {
          scale: 0.72,
          clipPath: 'inset(0% 26% 0% 26% round 24px)',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 40px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.15)',
          ease: 'power2.inOut',
        },
        0
      );

      // Stage B: HUD Monza Race widget fades out
      tl.to(
        hudWidgetRef.current,
        {
          opacity: 0,
          y: 25,
          ease: 'power1.out',
        },
        0
      );

      // Stage C: "Message from Charles" Badge appears
      tl.fromTo(
        messageBadgeRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0.25
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Signature calculation: animates progressively DURING zoom out (0.12 -> 0.70)
  const signatureProgress = Math.min(1, Math.max(0, (scrollProgress - 0.12) / 0.58));

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden select-none bg-[#101114]"
    >
      {/* ========================================================================= */}
      {/* 1. BACKGROUND LAYER: DEEP INK OBSIDIAN WITH INFINITE RUNNING MARQUEE     */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center pointer-events-none overflow-hidden bg-[#101114]">
        
        {/* Animated Background Topographic Contour Lines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dark-bg-topo" width="900" height="900" patternUnits="userSpaceOnUse">
                <path d="M 50,450 Q 250,150 500,450 T 950,450" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
                <path d="M 100,280 Q 300,50 550,280 T 980,280" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                <path d="M 0,650 Q 350,850 600,650 T 950,650" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                <path d="M 200,150 C 400,350 600,150 800,350" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dark-bg-topo)" />
          </svg>
        </div>

        {/* TOP TRACK: Infinite Continuous Running Marquee (Editorial Italic Monaco Red) */}
        <div className="w-full overflow-hidden whitespace-nowrap flex py-2">
          <motion.div
            className="flex shrink-0 font-editorial italic font-bold text-[16vw] md:text-[14vw] leading-none tracking-tight text-[#E10600]"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 25,
            }}
          >
            <span className="pr-12">WE DID IT AT HOME • WE DID IT AT MONACO • FOR FERRARI • </span>
            <span className="pr-12">WE DID IT AT HOME • WE DID IT AT MONACO • FOR FERRARI • </span>
          </motion.div>
        </div>

        {/* BOTTOM TRACK: Infinite Continuous Running Marquee (Heavyweight Racing White) */}
        <div className="w-full overflow-hidden whitespace-nowrap flex py-2 -mt-8 md:-mt-12">
          <motion.div
            className="flex shrink-0 font-racing font-black text-[16vw] md:text-[14vw] leading-none tracking-tight text-[#F7F7F5]"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 25,
            }}
          >
            <span className="pr-12">I WILL REMEMBER THIS FOREVER • #16 CHARLES LECLERC • </span>
            <span className="pr-12">I WILL REMEMBER THIS FOREVER • #16 CHARLES LECLERC • </span>
          </motion.div>
        </div>

        {/* Dynamic Badge below Navbar */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
          <div
            ref={messageBadgeRef}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181A20]/95 backdrop-blur-md border border-white/20 text-[10px] font-mono-telemetry text-white uppercase tracking-widest shadow-xl"
            style={{ opacity: 0 }}
          >
            <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
            <span>MESSAGE FROM CHARLES</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FOREGROUND LAYER: PURE WHITE CARD WITH OVERLAPPING SIGNATURE          */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-auto">
        
        {/* A. HERO CARD (Clean Crisp White Canvas) */}
        <div
          ref={heroCardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-full overflow-hidden bg-[#FFFFFF] flex flex-col justify-between origin-center cursor-crosshair"
          style={{
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
          }}
        >
          {/* Topographic Contour Lines Background inside Hero Card */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-70">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="card-topo" width="1000" height="1000" patternUnits="userSpaceOnUse">
                  <path d="M 50,500 Q 250,220 500,500 T 950,500" fill="none" stroke="rgba(10,10,11,0.08)" strokeWidth="1.4" />
                  <path d="M 100,300 Q 300,100 550,300 T 980,300" fill="none" stroke="rgba(10,10,11,0.08)" strokeWidth="1.4" />
                  <path d="M 0,650 Q 350,850 600,650 T 950,650" fill="none" stroke="rgba(10,10,11,0.08)" strokeWidth="1.4" />
                  <path d="M 200,150 C 400,350 600,150 800,350" fill="none" stroke="rgba(10,10,11,0.06)" strokeWidth="1.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#card-topo)" />
            </svg>
          </div>

          {/* FULL CARD SEAMLESS ORGANIC LIQUID PAINT BLOB */}
          <motion.div
            className="absolute z-[4] pointer-events-none rounded-full"
            style={{
              x: smoothBlobX,
              y: smoothBlobY,
              width: 360,
              height: 300,
              translateX: '-50%',
              translateY: '-50%',
              backgroundColor: '#E5E3DB',
              opacity: isHovered && scrollProgress < 0.2 ? 0.9 : 0,
              filter: 'blur(20px)',
              transition: 'opacity 0.25s ease-out',
            }}
          />

          {/* FRAMER MOTION: MAIN VISUAL STACK (Clean Cutout) */}
          <div className="relative w-full h-full flex items-end justify-center z-[6] pb-0 pointer-events-none">
            <div className="relative w-full max-w-[880px] md:max-w-[940px] lg:max-w-[1020px] h-full flex items-end justify-center origin-bottom">
              
              {/* Main Visual Stack Component */}
              <MainVisualStack
                topImage="/images/leclercface.jpe"
                bottomImage="/images/charles-helmet-front.jpg"
                className="w-full h-full"
                globalMouse={mousePos}
                isHovered={isHovered}
              />

            </div>
          </div>

          {/* 1:1 AUTHENTIC MONZA GP HUD CARD (Exact Scooped Notch Shape) */}
          <div
            ref={hudWidgetRef}
            className="absolute bottom-8 left-6 md:left-12 z-20 pointer-events-auto select-none"
          >
            <MonzaHudCard />
          </div>

        </div>

        {/* B. GRAND OVERLAPPING SIGNATURE (Stretches Wide Beyond the Cropped Card Bounds) */}
        <div
          className="absolute z-30 pointer-events-none flex items-center justify-center transition-opacity duration-200"
          style={{
            opacity: scrollProgress > 0.1 ? Math.min(1, (scrollProgress - 0.1) * 5) : 0,
            width: '920px',
            maxWidth: '94vw',
            transform: `scale(${0.9 + scrollProgress * 0.25}) translateY(20px)`,
          }}
        >
          <AnimatedSignature
            progress={signatureProgress}
            color="#E10600"
          />
        </div>

      </div>
    </div>
  );
}
