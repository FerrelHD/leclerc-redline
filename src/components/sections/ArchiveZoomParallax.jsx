import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ArchiveZoomParallax() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  // Navbar Theme: Switch to Light Theme (black text & icons) on white section
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => document.body.classList.remove('nav-theme-dark'),
        onLeaveBack: () => document.body.classList.add('nav-theme-dark'),
        onEnterBack: () => document.body.classList.remove('nav-theme-dark'),
        onLeave: () => document.body.classList.remove('nav-theme-dark'),
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

  // Subtle natural depth of field
  const blurBackground = useTransform(scrollYProgress, [0, 0.36, 1], ['blur(0px)', 'blur(1.2px)', 'blur(1.2px)'], { clamp: true });
  const blurForeground = useTransform(scrollYProgress, [0, 0.36, 1], ['blur(0px)', 'blur(0.8px)', 'blur(0.8px)'], { clamp: true });

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
      scale: scaleCenter,
      filter: undefined,
      wrapperStyle: { width: '23vw', height: '34vh' },
      imgStyle: 'object-top object-cover',
      zIndex: 25,
      shadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.22)] ring-1 ring-black/5',
    },
    {
      id: 'top',
      src: '/images/pitstop.jpg',
      alt: 'Scuderia Ferrari Pitstop',
      scale: scaleTop,
      filter: blurForeground,
      wrapperStyle: { width: '34vw', height: '28vh', top: '-34vh', left: '0vw' },
      imgStyle: 'object-center object-cover',
      zIndex: 30,
      shadow: 'shadow-[0_20px_45px_rgba(0,0,0,0.16)]',
    },
    {
      id: 'left',
      src: '/images/steering-wheel.jpg',
      alt: 'F1 Steering Wheel Cockpit',
      scale: scaleLeft,
      filter: blurForeground,
      wrapperStyle: { width: '18vw', height: '44vh', top: '-8vh', left: '-31vw' },
      imgStyle: 'object-center object-cover',
      zIndex: 30,
      shadow: 'shadow-[0_20px_45px_rgba(0,0,0,0.16)]',
    },
    {
      id: 'right',
      src: '/images/sparks.jpg',
      alt: 'Ferrari SF-24 Sparks',
      scale: scaleRight,
      filter: blurForeground,
      wrapperStyle: { width: '24vw', height: '26vh', top: '-2vh', left: '32vw' },
      imgStyle: 'object-center object-cover',
      zIndex: 30,
      shadow: 'shadow-[0_20px_45px_rgba(0,0,0,0.16)]',
    },
    {
      id: 'bottom-left',
      src: '/images/monaco-track.jpg',
      alt: 'Ferrari F1 Car Track Action',
      scale: scaleBottomLeft,
      filter: blurBackground,
      wrapperStyle: { width: '32vw', height: '24vh', top: '30vh', left: '-28vw' },
      imgStyle: 'object-[50%_90%] object-cover',
      zIndex: 15,
      shadow: 'shadow-[0_15px_35px_rgba(0,0,0,0.14)]',
    },
    {
      id: 'bottom-center',
      src: '/images/celebration.jpg',
      alt: 'Charles Podium Triumph',
      scale: scaleBottomCenter,
      filter: blurBackground,
      wrapperStyle: { width: '20vw', height: '25vh', top: '31vh', left: '6vw' },
      imgStyle: 'object-center object-cover',
      zIndex: 15,
      shadow: 'shadow-[0_15px_35px_rgba(0,0,0,0.14)]',
    },
    {
      id: 'bottom-right',
      src: '/images/tifosi.jpg',
      alt: 'Tifosi Red Sea Monza',
      scale: scaleBottomRight,
      filter: blurBackground,
      wrapperStyle: { width: '16vw', height: '18vh', top: '25vh', left: '29vw' },
      imgStyle: 'object-center object-cover',
      zIndex: 15,
      shadow: 'shadow-[0_15px_35px_rgba(0,0,0,0.14)]',
    },
  ];

  return (
    <section
      id="archive-parallax"
      ref={sectionRef}
      className="relative bg-[#F9F9FB] w-full text-[#0A0A0A] transition-colors duration-500"
    >
      {/* Clean Editorial Header */}
      <div className="relative min-h-[35vh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-6 overflow-hidden">
        <div className="relative z-10 max-w-xl flex flex-col items-center">
          <p className="font-mono-telemetry text-xs tracking-[0.3em] text-[#E10600] uppercase font-bold mb-2">
            SCUDERIA FERRARI // ARCHIVE
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-racing font-extrabold text-[#0A0A0A] tracking-tight uppercase leading-tight">
            VISUAL LOG
          </h2>
        </div>
      </div>

      {/* Sticky Parallax Container (h-[260vh]) */}
      <div ref={containerRef} className="relative h-[260vh] w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#F9F9FB]">

          <motion.div
            style={{
              opacity: canvasOpacity,
            }}
            className="relative w-full h-full flex items-center justify-center will-change-transform"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {pictures.map((pic) => (
                <motion.div
                  key={pic.id}
                  style={{
                    scale: pic.scale,
                    filter: pic.filter,
                  }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform"
                >
                  <div
                    className={`relative pointer-events-auto overflow-hidden bg-white ${pic.shadow}`}
                    style={{
                      ...pic.wrapperStyle,
                      zIndex: pic.zIndex,
                    }}
                  >
                    <img
                      src={pic.src}
                      alt={pic.alt}
                      className={`w-full h-full ${pic.imgStyle}`}
                      loading="eager"
                    />
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
