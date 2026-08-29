import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import MainVisualStack from './MainVisualStack';
import AnimatedSignature from './AnimatedSignature';
import MonzaHudCard from './MonzaHudCard';
import WavesBackground from '../ui/WavesBackground';

gsap.registerPlugin(ScrollTrigger);

export default function FaceHelmetReveal() {
  const sectionRef = useRef(null);
  const heroCardRef = useRef(null);
  const messageBadgeRef = useRef(null);
  const hudWidgetRef = useRef(null);
  const signatureRef = useRef(null);
  const signatureWrapperRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isHoveredRef = useRef(false);
  const rafMouseRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroCardRef.current) return;
    if (!isHoveredRef.current) {
      isHoveredRef.current = true;
      setIsHovered(true);
    }
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (!rafMouseRef.current) {
      rafMouseRef.current = requestAnimationFrame(() => {
        setMousePos({ x: clientX, y: clientY });
        rafMouseRef.current = null;
      });
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsHovered(false);
    if (rafMouseRef.current) {
      cancelAnimationFrame(rafMouseRef.current);
      rafMouseRef.current = null;
    }
    setMousePos({ x: -500, y: -500 });
  };

  // GSAP ScrollTrigger Sequence: Fullscreen to Clean Portrait Crop + Overlapping Signature
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=800', // Reduced from 1400 so it unpins faster
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            if (self.progress > 0.08) {
              document.body.classList.add('nav-theme-dark');
            } else {
              document.body.classList.remove('nav-theme-dark');
            }
          },
          onLeaveBack: () => {
            document.body.classList.remove('nav-theme-dark');
          },
          onEnterBack: () => {
            document.body.classList.remove('nav-theme-dark');
          },
        },
      });

      const getCropInset = () => {
        const w = window.innerWidth;
        if (w < 640) return 'inset(0% 4% 0% 4% round 16px)';
        if (w < 1024) return 'inset(0% 14% 0% 14% round 20px)';
        return 'inset(0% 26% 0% 26% round 24px)';
      };

      const getZoomScale = () => {
        const w = window.innerWidth;
        if (w < 640) return 0.88;
        if (w < 1024) return 0.80;
        return 0.72;
      };

      // Stage A: Whole Hero Card zooms out & crops horizontally into a Portrait Box
      tl.to(
        heroCardRef.current,
        {
          scale: getZoomScale(),
          clipPath: getCropInset(),
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
        0
      );
      // Stage D: Signature drawing (Syncs exactly with Stage A zoom out)
      const sigProxy = { p: 0 };
      tl.to(
        sigProxy,
        {
          p: 1,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (signatureRef.current) {
              signatureRef.current.setProgress(sigProxy.p);
            }
          }
        },
        0 // Exact same start time and default duration (0.5) as the card zoom out
      );

      // Stage E: Signature wrapper opacity and scale (Syncs exactly with Stage A zoom out)
      tl.fromTo(
        signatureWrapperRef.current,
        { opacity: 0, scale: 0.92, y: 16 },
        { opacity: 1, scale: 1.12, y: 16, ease: 'power2.inOut' },
        0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden select-none bg-[#0A0A0A]"
    >
      {/* ========================================================================= */}
      {/* 1. BACKGROUND LAYER: SLEEK SOLID MOTORSPORT BLACK WITH CONTINUOUS MARQUEE */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center pointer-events-none overflow-hidden bg-[#0A0A0A]">

        {/* TOP TRACK: Infinite Continuous Running Marquee (Editorial Italic Monaco Red) */}
        <div className="w-full overflow-hidden whitespace-nowrap flex py-1 relative z-10 opacity-90">
          <motion.div
            className="flex shrink-0 font-bold text-[5vw] md:text-[3.8vw] leading-tight tracking-tight text-[#E10600]"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 32,
            }}
          >
            <span className="pr-16 flex items-center gap-4">
              <span className="font-racing">WE DID IT AT HOME</span>
              <span className="font-racing"> • WE DID IT AT MONACO • FOR FERRARI • </span>
            </span>
            <span className="pr-16 flex items-center gap-4">
              <span className="font-racing">WE DID IT AT HOME</span>
              <span className="font-racing"> • WE DID IT AT MONACO • FOR FERRARI • </span>
            </span>
          </motion.div>
        </div>

        {/* BOTTOM TRACK: Infinite Continuous Running Marquee (Heavyweight Racing White) */}
        <div className="w-full overflow-hidden whitespace-nowrap flex py-1 relative z-10 opacity-90">
          <motion.div
            className="flex shrink-0 font-racing font-black text-[5vw] md:text-[3.8vw] leading-tight tracking-tight text-[#F7F7F5]"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 32,
            }}
          >
            <span className="pr-16">I WILL REMEMBER THIS FOREVER • #16 CHARLES LECLERC • </span>
            <span className="pr-16">I WILL REMEMBER THIS FOREVER • #16 CHARLES LECLERC • </span>
          </motion.div>
        </div>

        {/* Minimalist Editorial Badge below Navbar */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none overflow-hidden py-1">
          <div
            ref={messageBadgeRef}
            className="flex items-center gap-3 font-racing font-bold text-xs md:text-sm uppercase tracking-[0.28em] text-white/90 drop-shadow-md"
            style={{ opacity: 0 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
            <span>MESSAGE FROM CHARLES</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FOREGROUND LAYER: PURE WHITE CARD WITH INTERACTIVE WAVES BACKGROUND    */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-auto">

        {/* A. HERO CARD (Interactive Fluid Waves Grid) */}
        <div
          ref={heroCardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-full overflow-hidden bg-[#FFFFFF] flex flex-col justify-between origin-center cursor-crosshair"
          style={{
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
          }}
        >
          {/* Interactive Simplex-Noise Fluid Wave Grid inside Hero Card */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
            <WavesBackground
              strokeColor="rgba(10, 10, 11, 0.08)"
              spacing={20}
              strokeWidth={1.2}
              globalMouse={mousePos}
            />
          </div>

          {/* FRAMER MOTION: MAIN VISUAL STACK (Portrait + Monaco GP Helmet Reveal) */}
          <div className="relative w-full h-full flex items-end justify-center z-[6] pb-0 pointer-events-none">
            <div className="relative w-full max-w-[960px] md:max-w-[1060px] lg:max-w-[1180px] h-full flex items-end justify-center origin-bottom">

              {/* Main Visual Stack Component */}
              <MainVisualStack
                topImage="/images/leclercnewimage.png"
                bottomImage="/images/charles-helmet-monaco.png"
                className="w-full h-full"
                globalMouse={mousePos}
                isHovered={isHovered && scrollProgress < 0.25}
              />

            </div>
          </div>

          {/* 1:1 AUTHENTIC MONZA GP HUD CARD */}
          <div
            ref={hudWidgetRef}
            className="absolute bottom-4 sm:bottom-8 left-3 sm:left-6 md:left-12 z-20 pointer-events-auto select-none scale-[0.8] sm:scale-100 origin-bottom-left"
          >
            <MonzaHudCard />
          </div>

        </div>

        {/* B. GRAND OVERLAPPING SIGNATURE (Bold Prominent Breakout Beyond Card Box) */}
        <div
          ref={signatureWrapperRef}
          className="absolute z-30 pointer-events-none flex items-center justify-center will-change-transform"
          style={{ width: '860px', maxWidth: '92vw' }}
        >
          <AnimatedSignature ref={signatureRef} color="#E10600" />
        </div>

      </div>
    </div>
  );
}
