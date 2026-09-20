import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ArchiveZoomParallax() {
  const sectionRef = useRef(null);
  const irisTriggerRef = useRef(null);
  const whiteCanvasRef = useRef(null);
  const hudOverlayRef = useRef(null);
  const flashRef = useRef(null);
  const apertureRingRef = useRef(null);
  const centerReticleRef = useRef(null);
  const hudDataRef = useRef(null);
  const bracketTL = useRef(null);
  const bracketTR = useRef(null);
  const bracketBL = useRef(null);
  const bracketBR = useRef(null);

  const containerRef = useRef(null);

  // Fullscreen Aperture Iris Motion Graphic Transition & Theme Synchronization
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Aperture Iris Dilation: Expands circular aperture to reveal white Archive canvas
      ScrollTrigger.create({
        trigger: irisTriggerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          // ClipPath dilation: from 0% to 135% of viewport
          const radius = p * 135;
          if (whiteCanvasRef.current) {
            whiteCanvasRef.current.style.clipPath = `circle(${radius}% at 50% 50%)`;
            whiteCanvasRef.current.style.webkitClipPath = `circle(${radius}% at 50% 50%)`;
          }

          // Redline Aperture Ring scale & rotation
          if (apertureRingRef.current) {
            const ringScale = 1 + p * 14;
            const ringRotate = p * 45; // 45deg rotation
            const ringOpacity = p > 0.7 ? Math.max(0, (0.95 - p) / 0.25) : 1;
            apertureRingRef.current.style.transform = `scale(${ringScale}) rotate(${ringRotate}deg)`;
            apertureRingRef.current.style.opacity = ringOpacity;
          }

          // Center #16 reticle fades out early (0 to 0.18)
          if (centerReticleRef.current) {
            const reticleOpacity = Math.max(0, 1 - p * 5.5);
            centerReticleRef.current.style.opacity = reticleOpacity;
          }

          // Viewfinder HUD data text fades out (0 to 0.35)
          if (hudDataRef.current) {
            const hudOpacity = Math.max(0, 1 - p * 2.8);
            hudDataRef.current.style.opacity = hudOpacity;
          }

          // 4 Corner Viewfinder brackets translate outward and fade
          if (bracketTL.current && bracketTR.current && bracketBL.current && bracketBR.current) {
            const offset = p * 70;
            const bOpacity = Math.max(0, 1 - p * 2.5);
            bracketTL.current.style.transform = `translate(${-offset}px, ${-offset}px)`;
            bracketTL.current.style.opacity = bOpacity;
            bracketTR.current.style.transform = `translate(${offset}px, ${-offset}px)`;
            bracketTR.current.style.opacity = bOpacity;
            bracketBL.current.style.transform = `translate(${-offset}px, ${offset}px)`;
            bracketBL.current.style.opacity = bOpacity;
            bracketBR.current.style.transform = `translate(${offset}px, ${offset}px)`;
            bracketBR.current.style.opacity = bOpacity;
          }

          // Exposure Light Flash pulse (peaks around 0.32 to 0.44)
          if (flashRef.current) {
            let flashOp = 0;
            if (p >= 0.22 && p <= 0.36) {
              flashOp = ((p - 0.22) / 0.14) * 0.65;
            } else if (p > 0.36 && p <= 0.52) {
              flashOp = (1 - (p - 0.36) / 0.16) * 0.65;
            }
            flashRef.current.style.opacity = flashOp;
          }

          // Navbar Theme Switch:
          if (p >= 0.65) {
            document.body.classList.remove('nav-theme-dark');
          } else {
            document.body.classList.add('nav-theme-dark');
          }
        },
        onLeave: () => {
          document.body.classList.remove('nav-theme-dark');
        },
        onLeaveBack: () => {
          document.body.classList.add('nav-theme-dark');
        },
      });

      // 2. Navbar Theme for Zoom Parallax stage & exit to Socials/Footer
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onEnter: () => document.body.classList.remove('nav-theme-dark'),
        onLeaveBack: () => document.body.classList.remove('nav-theme-dark'),
        onLeave: () => document.body.classList.add('nav-theme-dark'),
        onEnterBack: () => document.body.classList.remove('nav-theme-dark'),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Center Hero (Charles Leclerc): Zooms in, pauses, then shrinks back into the distance
  const scaleCenter = useTransform(
    scrollYProgress,
    [0, 0.36, 0.42, 0.72, 1],
    [1, 1.45, 1.45, 0.75, 0.75],
    { clamp: true }
  );

  // Outer photos scale outward during zoom, then recede during exit
  const scaleTop = useTransform(scrollYProgress, [0, 0.36, 0.42, 0.72, 1], [1, 3.2, 3.2, 2.0, 2.0], { clamp: true });
  const scaleRight = useTransform(scrollYProgress, [0, 0.36, 0.42, 0.72, 1], [1, 3.2, 3.2, 2.0, 2.0], { clamp: true });
  const scaleLeft = useTransform(scrollYProgress, [0, 0.36, 0.42, 0.72, 1], [1, 2.8, 2.8, 1.8, 1.8], { clamp: true });

  const scaleBottomLeft = useTransform(scrollYProgress, [0, 0.36, 0.42, 0.72, 1], [1, 2.3, 2.3, 1.5, 1.5], { clamp: true });
  const scaleBottomCenter = useTransform(scrollYProgress, [0, 0.36, 0.42, 0.72, 1], [1, 2.6, 2.6, 1.7, 1.7], { clamp: true });
  const scaleBottomRight = useTransform(scrollYProgress, [0, 0.36, 0.42, 0.72, 1], [1, 2.5, 2.5, 1.6, 1.6], { clamp: true });

  // Smooth Fade Out synced with the overlap rise (0.42 to 0.72)
  const canvasOpacity = useTransform(
    scrollYProgress,
    [0, 0.42, 0.72, 1],
    [1, 1, 0, 0],
    { clamp: true }
  );

  const pictures = [
    {
      id: 'center',
      src: '/images/leclercmain.jpg',
      alt: 'Charles Leclerc Center Focus',
      label: 'CHARLES LECLERC // #16',
      scale: scaleCenter,
      wrapperStyle: { width: '23vw', height: '34vh' },
      imgStyle: 'object-top object-cover',
      zIndex: 25,
      shadow: 'shadow-[0_20px_35px_rgba(0,0,0,0.18)] ring-1 ring-black/5',
    },
    {
      id: 'top',
      src: '/images/pitstop.jpg',
      alt: 'Scuderia Ferrari Pitstop',
      label: 'SF PIT CREW // MARANELLO',
      scale: scaleTop,
      wrapperStyle: { width: '34vw', height: '28vh', top: '-34vh', left: '0vw' },
      imgStyle: 'object-center object-cover',
      zIndex: 30,
      shadow: 'shadow-[0_16px_30px_rgba(0,0,0,0.14)]',
    },
    {
      id: 'left',
      src: '/images/steering-wheel.jpg',
      alt: 'F1 Steering Wheel Cockpit',
      label: 'COCKPIT // STEERING WHEEL',
      scale: scaleLeft,
      wrapperStyle: { width: '18vw', height: '44vh', top: '-8vh', left: '-31vw' },
      imgStyle: 'object-center object-cover',
      zIndex: 30,
      shadow: 'shadow-[0_16px_30px_rgba(0,0,0,0.14)]',
    },
    {
      id: 'right',
      src: '/images/sparks.jpg',
      alt: 'Ferrari SF-24 Sparks',
      label: 'FERRARI SF-24 // SPARKS',
      scale: scaleRight,
      wrapperStyle: { width: '24vw', height: '26vh', top: '-2vh', left: '32vw' },
      imgStyle: 'object-center object-cover',
      zIndex: 30,
      shadow: 'shadow-[0_16px_30px_rgba(0,0,0,0.14)]',
    },
    {
      id: 'bottom-left',
      src: '/images/monaco-track.jpg',
      alt: 'Ferrari F1 Car Track Action',
      label: 'MONACO // ON TRACK',
      scale: scaleBottomLeft,
      wrapperStyle: { width: '32vw', height: '24vh', top: '30vh', left: '-28vw' },
      imgStyle: 'object-[50%_90%] object-cover',
      zIndex: 15,
      shadow: 'shadow-[0_12px_24px_rgba(0,0,0,0.12)]',
    },
    {
      id: 'bottom-center',
      src: '/images/celebration.jpg',
      alt: 'Charles Podium Triumph',
      label: 'PODIUM // MONACO 2024',
      scale: scaleBottomCenter,
      wrapperStyle: { width: '20vw', height: '25vh', top: '31vh', left: '6vw' },
      imgStyle: 'object-center object-cover',
      zIndex: 15,
      shadow: 'shadow-[0_12px_24px_rgba(0,0,0,0.12)]',
    },
    {
      id: 'bottom-right',
      src: '/images/tifosi.jpg',
      alt: 'Tifosi Red Sea Monza',
      label: 'TIFOSI // MONZA',
      scale: scaleBottomRight,
      wrapperStyle: { width: '16vw', height: '18vh', top: '25vh', left: '29vw' },
      imgStyle: 'object-center object-cover',
      zIndex: 15,
      shadow: 'shadow-[0_12px_24px_rgba(0,0,0,0.12)]',
    },
  ];

  return (
    <section
      id="archive-parallax"
      ref={sectionRef}
      className="relative z-30 w-full text-[#0A0A0A] bg-[#0A0A0A]"
    >
      {/* ========================================================================= */}
      {/* PHASE 1: FULLSCREEN APERTURE IRIS MOTION GRAPHIC TRANSITION (140vh)       */}
      {/* ========================================================================= */}
      <div ref={irisTriggerRef} className="relative h-[140vh] w-full bg-[#0A0A0A]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* 1. Revealed White Canvas (Visual Log Editorial Entrance) */}
          <div
            ref={whiteCanvasRef}
            className="absolute inset-0 bg-[#F9F9FB] flex flex-col items-center justify-center text-[#0A0A0A] z-10 will-change-[clip-path]"
            style={{ clipPath: 'circle(0% at 50% 50%)', WebkitClipPath: 'circle(0% at 50% 50%)' }}
          >
            {/* Subtle Horizon Vignette */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/[0.04] to-transparent pointer-events-none" />

            <div className="max-w-5xl text-center px-4 sm:px-6 flex flex-col items-center select-none">
              <p className="font-mono-telemetry text-xs sm:text-sm tracking-[0.3em] text-[#E10600] uppercase font-bold mb-3">
                SCUDERIA FERRARI // RAW ARCHIVE
              </p>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-racing font-extrabold text-[#0A0A0A] tracking-tight uppercase leading-none whitespace-nowrap">
                VISUAL LOG
              </h2>
              <p className="mt-4 font-mono-telemetry text-[10px] sm:text-xs text-neutral-500 uppercase tracking-[0.25em] whitespace-nowrap">
                HIGH-SPEED EXPOSURE · 1/8000s // ON-TRACK TELEMETRY
              </p>
            </div>

            {/* Scroll Cue Indicator */}
            <div className="absolute bottom-10 flex flex-col items-center gap-1.5 opacity-60 pointer-events-none">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-semibold">
                SCROLL TO ZOOM ARCHIVE
              </span>
              <div className="w-px h-6 bg-[#E10600]" />
            </div>
          </div>

          {/* 2. The Optical Viewfinder HUD & Aperture Ring Overlay */}
          <div
            ref={hudOverlayRef}
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center select-none overflow-hidden"
          >
            {/* Exposure Flash layer */}
            <div
              ref={flashRef}
              className="absolute inset-0 bg-white pointer-events-none z-30 opacity-0 will-change-opacity"
            />

            {/* 4 Optical Corner Viewfinder Brackets */}
            <div
              ref={bracketTL}
              className="absolute top-6 left-6 sm:top-10 sm:left-10 w-7 h-7 sm:w-9 sm:h-9 border-t-2 border-l-2 border-[#E10600] will-change-transform z-20"
            />
            <div
              ref={bracketTR}
              className="absolute top-6 right-6 sm:top-10 sm:right-10 w-7 h-7 sm:w-9 sm:h-9 border-t-2 border-r-2 border-[#E10600] will-change-transform z-20"
            />
            <div
              ref={bracketBL}
              className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-7 h-7 sm:w-9 sm:h-9 border-b-2 border-l-2 border-[#E10600] will-change-transform z-20"
            />
            <div
              ref={bracketBR}
              className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-7 h-7 sm:w-9 sm:h-9 border-b-2 border-r-2 border-[#E10600] will-change-transform z-20"
            />

            {/* Telemetry HUD Data Blocks (Spaced comfortably inside viewfinder brackets) */}
            <div
              ref={hudDataRef}
              className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between pointer-events-none z-20 will-change-transform text-[9px] sm:text-[11px] font-mono-telemetry tracking-[0.25em] text-neutral-400"
            >
              {/* Top Telemetry Row */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5 pl-5 pt-2 sm:pl-8 sm:pt-3">
                  <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
                  <span className="text-white font-bold tracking-[0.28em]">REC [RAW 4K // 120 FPS]</span>
                </div>
                <div className="text-right pr-5 pt-2 sm:pr-8 sm:pt-3">
                  <span className="text-[#E10600] font-bold">APERTURE:</span> ƒ/1.2 → ƒ/16<br />
                  <span className="text-neutral-500 text-[8px] sm:text-[9px]">SHUTTER 1/8000s · ISO 50</span>
                </div>
              </div>

              {/* Bottom Telemetry Row */}
              <div className="flex justify-between items-end">
                <div className="pl-5 pb-2 sm:pl-8 sm:pb-3">
                  <span className="text-[#E10600] font-bold">TRACKING:</span> AF-C LOCKED<br />
                  <span className="text-white font-semibold">CHARLES LECLERC // #16</span>
                </div>
                <div className="text-right pr-5 pb-2 sm:pr-8 sm:pb-3">
                  <span className="text-neutral-400">FRAME #016</span><br />
                  <span className="text-[#E10600] font-bold">EXP ARMED</span>
                </div>
              </div>
            </div>

            {/* Center Aperture Iris Ring & Diaphragm Reticle */}
            <div
              ref={apertureRingRef}
              className="absolute z-25 flex items-center justify-center will-change-transform pointer-events-none"
            >
              {/* Glowing Red Aperture Outline */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-[#E10600] shadow-[0_0_30px_#E10600,inset_0_0_15px_rgba(225,6,0,0.4)] flex items-center justify-center relative">
                {/* Radial Mechanical Blade Ticks (8 ticks) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <div
                      key={deg}
                      className="absolute w-full h-px bg-transparent flex justify-between px-1"
                      style={{ transform: `rotate(${deg}deg)` }}
                    >
                      <span className="w-2 h-0.5 bg-[#E10600]" />
                      <span className="w-2 h-0.5 bg-[#E10600]" />
                    </div>
                  ))}
                </div>

                {/* Center Targeting Reticle */}
                <div
                  ref={centerReticleRef}
                  className="flex flex-col items-center justify-center select-none"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/30 border-dashed flex items-center justify-center">
                    <span className="font-mono-telemetry text-sm sm:text-base font-extrabold text-white tracking-widest">
                      16
                    </span>
                  </div>
                  <div className="absolute -bottom-7 px-2.5 py-0.5 rounded bg-black/90 border border-[#E10600]/60 whitespace-nowrap">
                    <span className="font-mono-telemetry text-[8px] sm:text-[9px] tracking-[0.28em] text-[#FFE500] font-bold">
                      IRIS // ARMED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 2: 3D EDITORIAL ZOOM PARALLAX GALLERY (260vh)                       */}
      {/* ========================================================================= */}
      <div ref={containerRef} className="relative h-[260vh] w-full bg-[#F9F9FB]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#F9F9FB]">
          <motion.div
            style={{
              opacity: canvasOpacity,
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {pictures.map((pic) => (
                <motion.div
                  key={pic.id}
                  style={{
                    scale: pic.scale,
                  }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div
                    className={`group relative pointer-events-auto overflow-hidden bg-white ${pic.shadow}`}
                    style={{
                      ...pic.wrapperStyle,
                      zIndex: pic.zIndex,
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <img
                      src={pic.src}
                      alt={pic.alt}
                      className={`w-full h-full ${pic.imgStyle}`}
                      loading="eager"
                      decoding="async"
                    />
                    {/* Telemetry label — fades in on hover */}
                    <div className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="font-mono-telemetry text-[8px] text-white/85 uppercase tracking-widest leading-none">
                        {pic.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
