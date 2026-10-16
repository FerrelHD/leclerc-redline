import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import MainVisualStack from './MainVisualStack';
import AnimatedSignature from './AnimatedSignature';
import MonzaHudCard from './MonzaHudCard';
import InteractiveNeuralVortex from '../ui/interactive-neural-vortex-background';

gsap.registerPlugin(ScrollTrigger);

export default function FaceHelmetReveal() {
  const sectionRef = useRef(null);
  const heroCardRef = useRef(null);
  const messageBadgeRef = useRef(null);
  const hudWidgetRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const signatureRef = useRef(null);
  const signatureWrapperRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);
  const [mobileHelmetActive, setMobileHelmetActive] = useState(false);
  const [canReveal, setCanReveal] = useState(true);
  const canRevealRef = useRef(true);
  const isDarkRef = useRef(false);
  const isHeroActiveRef = useRef(true);
  const isHoveredRef = useRef(false);
  const rafMouseRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroCardRef.current || !isHeroActiveRef.current) return;
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

  const handleTouchStart = (e) => {
    if (!heroCardRef.current || !isHeroActiveRef.current || e.touches.length === 0) return;
    isHoveredRef.current = true;
    setIsHovered(true);
    const touch = e.touches[0];
    setMousePos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!heroCardRef.current || !isHeroActiveRef.current || e.touches.length === 0) return;
    if (!isHoveredRef.current) {
      isHoveredRef.current = true;
      setIsHovered(true);
    }
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    if (!rafMouseRef.current) {
      rafMouseRef.current = requestAnimationFrame(() => {
        setMousePos({ x: clientX, y: clientY });
        rafMouseRef.current = null;
      });
    }
  };

  const handleTouchEnd = () => {
    isHoveredRef.current = false;
    setIsHovered(false);
    if (rafMouseRef.current) {
      cancelAnimationFrame(rafMouseRef.current);
      rafMouseRef.current = null;
    }
    setTimeout(() => {
      if (!isHoveredRef.current) {
        setMousePos({ x: -500, y: -500 });
      }
    }, 450);
  };

  // GSAP ScrollTrigger Sequence: Fullscreen to Clean Portrait Crop + Overlapping Signature
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1400',
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Theme toggle: only touch DOM when crossing 0.08 threshold
            const isDark = self.progress > 0.08;
            if (isDark !== isDarkRef.current) {
              isDarkRef.current = isDark;
              if (isDark) {
                document.body.classList.add('nav-theme-dark');
              } else {
                document.body.classList.remove('nav-theme-dark');
              }
            }

            // Can reveal helmet: only set React state when crossing 0.28 threshold
            const active = self.progress < 0.28;
            if (active !== canRevealRef.current) {
              canRevealRef.current = active;
              setCanReveal(active);
            }
            isHeroActiveRef.current = self.progress < 0.95;
          },
          onLeaveBack: () => {
            isDarkRef.current = false;
            document.body.classList.remove('nav-theme-dark');
            canRevealRef.current = true;
            setCanReveal(true);
            isHeroActiveRef.current = true;
          },
          onEnterBack: () => {
            isHeroActiveRef.current = true;
          },
        },
      });

      const getCropInset = () => {
        const w = window.innerWidth;
        if (w < 640) return 'inset(0% 6% 0% 6% round 18px)';
        if (w < 768) return 'inset(0% 16% 0% 16% round 20px)';
        return 'inset(0% 26% 0% 26% round 24px)';
      };

      const getZoomScale = () => {
        const w = window.innerWidth;
        if (w < 640) return 0.82;
        if (w < 768) return 0.76;
        return 0.72;
      };

      // Stage A: Whole Hero Card zooms out & crops horizontally into a Portrait Box
      tl.to(
        heroCardRef.current,
        {
          scale: () => getZoomScale(),
          clipPath: () => getCropInset(),
          backgroundColor: '#FFFFFF',
          boxShadow: '0 40px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.15)',
          ease: 'power2.inOut',
        },
        0
      );

      // Stage B: HUD Monza Race widget and Mobile Reveal Toggle fade out
      tl.to(
        [hudWidgetRef.current, mobileToggleRef.current].filter(Boolean),
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
      className="relative w-full h-screen min-h-[100dvh] overflow-hidden select-none bg-[#0A0A0A]"
    >
      {/* ========================================================================= */}
      {/* 1. BACKGROUND LAYER: SLEEK SOLID MOTORSPORT BLACK WITH CONTINUOUS MARQUEE */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center pointer-events-none overflow-hidden bg-[#0A0A0A]">

        {/* TOP TRACK: Infinite Continuous Running Marquee (Editorial Italic Monaco Red) */}
        <div className="w-full overflow-hidden whitespace-nowrap flex py-1 relative z-10 opacity-90">
          <motion.div
            className="flex shrink-0 font-bold text-[clamp(1.5rem,5.2vw,3rem)] md:text-[3.8vw] leading-tight tracking-tight text-[#E10600]"
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
            className="flex shrink-0 font-racing font-black text-[clamp(1.5rem,5.2vw,3rem)] md:text-[3.8vw] leading-tight tracking-tight text-[#F7F7F5]"
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
        <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none overflow-hidden py-1 w-full px-4 text-center">
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
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-full overflow-hidden bg-[#FFFFFF] flex flex-col justify-between origin-center touch-pan-y"
          style={{
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
          }}
        >
          {/* Interactive WebGL Neural Vortex Fluid Background inside Hero Card */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <InteractiveNeuralVortex className="absolute inset-0 w-full h-full pointer-events-none z-0" />
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
                isHovered={isHovered && canReveal}
                forceFullReveal={mobileHelmetActive && canReveal}
              />

            </div>
          </div>

          {/* 1:1 AUTHENTIC MONZA GP HUD CARD */}
          <div
            ref={hudWidgetRef}
            className="absolute bottom-3 sm:bottom-8 left-3 sm:left-6 md:left-12 z-20 pointer-events-auto select-none scale-[0.72] xs:scale-[0.8] sm:scale-100 origin-bottom-left"
          >
            <MonzaHudCard />
          </div>

          {/* MOBILE HELMET REVEAL INTERACTIVE TOGGLE */}
          <div
            ref={mobileToggleRef}
            className="absolute bottom-3 sm:bottom-8 right-3 sm:right-6 z-20 pointer-events-auto select-none sm:hidden"
          >
            <button
              type="button"
              onClick={() => setMobileHelmetActive((prev) => !prev)}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A0A0B]/85 backdrop-blur-md border border-white/20 text-white shadow-lg active:scale-95 transition-all duration-200"
              aria-label="Toggle Charles Leclerc Helmet Reveal"
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  mobileHelmetActive
                    ? 'bg-[#E10600] animate-pulse shadow-[0_0_8px_#E10600]'
                    : 'bg-white/40'
                }`}
              />
              <span className="font-racing text-[10px] tracking-wider uppercase">
                {mobileHelmetActive ? 'SHOW PORTRAIT' : 'REVEAL HELMET'}
              </span>
            </button>
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
