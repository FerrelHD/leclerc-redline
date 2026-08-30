import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const socialCards = [
  {
    id: 0,
    title: 'Monza 2019 Tifosi Triumph',
    tag: '@scuderiaferrari',
    image: '/images/leclerc gallery/Monza 2019 Potrait.jpg',
  },
  {
    id: 1,
    title: 'Maranello Paddock Walk',
    tag: '@scuderiaferrari',
    image: '/images/leclerc2.jpg',
  },
  {
    id: 2,
    title: 'Spielberg Red Bull Ring Win',
    tag: '@charles_leclerc',
    image: '/images/leclerc gallery/Austria 2022 Potrait.jpg',
  },
  {
    id: 3,
    title: 'Gladiator in Red #16',
    tag: '@charles_leclerc',
    image: '/images/leclercmain.jpg',
  },
  {
    id: 4,
    title: 'Monaco GP Home Victory 2024',
    tag: '@charles_leclerc',
    image: '/images/celebration.jpg',
  },
  {
    id: 5,
    title: 'Bahrain Grand Slam Victory',
    tag: '@scuderiaferrari',
    image: '/images/leclerc gallery/Bahrain 2022 Potrait.jpg',
  },
  {
    id: 6,
    title: 'Behind The Visor',
    tag: '@charles_leclerc',
    image: '/images/leclerc3.jpg',
  },
];

export default function SocialsDeck() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sectionRef = useRef(null);

  // Switch navbar back to dark theme (white text/icons) on this black section
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter:     () => document.body.classList.add('nav-theme-dark'),
        onLeaveBack: () => document.body.classList.remove('nav-theme-dark'),
        onEnterBack: () => document.body.classList.add('nav-theme-dark'),
        onLeave:     () => document.body.classList.remove('nav-theme-dark'),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="socials-deck"
      ref={sectionRef}
      className="relative z-30 -mt-[100vh] w-full pt-28 pb-36 px-4 sm:px-8 md:px-12 bg-[#0B0B0A] text-white rounded-t-[50px] md:rounded-t-[70px] shadow-[0_-40px_100px_rgba(0,0,0,0.98)] border-t border-white/[0.08] overflow-hidden"
    >
      {/* 1:1 Exact SVG Grain Filter from User's Portfolio (App.vue) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <svg
          className="h-full w-full object-cover object-center"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="leclerc-portfolio-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="1"
              stitchTiles="stitch"
            />
            <feBlend mode="screen" />
          </filter>
          <rect className="w-full h-full" filter="url(#leclerc-portfolio-noise)" opacity="0.14" />
        </svg>
      </div>

      {/* 2. Atmospheric Scuderia Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{
          background: 'radial-gradient(circle at 50% 15%, rgba(225,6,0,0.22) 0%, transparent 65%)',
        }}
      />

      {/* Editorial Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-12 sm:mb-16">
        <p className="font-racing font-bold text-xs md:text-sm tracking-[0.25em] text-[#E10600] uppercase mb-4">
          CHARLES LECLERC
        </p>
        <h2 className="font-racing font-black text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase leading-[0.88] text-white">
          WHAT&apos;S UP <br />
          <span className="font-editorial italic font-normal text-4xl sm:text-6xl md:text-7xl text-white/80">
            on socials
          </span>
        </h2>
      </div>

      {/* 
        Interactive Fan Deck:
        - Pure 2D GPU Transforms (x, y, rotate, scale): Eliminates 3D clipping and polygon intersection ("saling tembus")
        - Deterministic Layering (zIndex): Hovered card sits on top (zIndex: 50), immediately returns to natural fan order on unhover without delay or glitch
        - Wide Accordion Spread: Neighbor cards push away cleanly
      */}
      <div 
        onMouseLeave={() => setHoveredIndex(null)}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[460px] sm:min-h-[540px] md:min-h-[600px] px-2"
      >
        <div className="relative flex items-center justify-center w-full min-h-[400px] sm:min-h-[480px] md:min-h-[540px]">
          {socialCards.map((card, i) => {
            const offsetFromCenter = i - 3;
            const absOffset = Math.abs(offsetFromCenter);

            const defaultX = offsetFromCenter * 115;
            const defaultRotate = offsetFromCenter * 7.5;
            const defaultY = absOffset * 16;
            const defaultZ = 25 - absOffset * 2;

            const isHovered = hoveredIndex === i;
            const hasHover = hoveredIndex !== null;

            // Wide Accordion shift logic:
            let targetX = defaultX;
            let targetY = defaultY;
            let targetRotate = defaultRotate;
            let targetScale = 1.0;

            if (hasHover) {
              if (isHovered) {
                targetY = defaultY - 36;
                targetRotate = 0;
                targetScale = 1.12;
              } else if (i < hoveredIndex) {
                const pushDistance = (hoveredIndex - i === 1) ? -125 : -70;
                targetX = defaultX + pushDistance;
                targetRotate = defaultRotate - 4;
                targetScale = 0.95;
              } else if (i > hoveredIndex) {
                const pushDistance = (i - hoveredIndex === 1) ? 125 : 70;
                targetX = defaultX + pushDistance;
                targetRotate = defaultRotate + 4;
                targetScale = 0.95;
              }
            }

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setHoveredIndex(i)}
                animate={{
                  x: targetX,
                  y: targetY,
                  rotate: targetRotate,
                  scale: targetScale,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 26,
                  mass: 0.6,
                }}
                className="absolute cursor-pointer select-none origin-bottom will-change-transform"
                style={{
                  zIndex: isHovered ? 50 : defaultZ,
                  width: 'clamp(145px, 16vw, 250px)',
                  aspectRatio: '9/16',
                  transformOrigin: '50% 90%',
                }}
              >
                {/* Card Container: ZERO OUTLINE / ZERO BORDER */}
                <div
                  className={`relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 transition-shadow duration-300 ${
                    isHovered
                      ? 'shadow-[0_35px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/15'
                      : 'shadow-2xl'
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover filter contrast-[1.03]"
                    loading="lazy"
                  />

                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                  {/* Instagram Badge */}
                  <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-none">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>

                  {/* Caption & Tag */}
                  <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                    <p className="font-mono-telemetry text-[9px] tracking-wider text-[#E10600] uppercase font-bold mb-0.5">
                      {card.tag}
                    </p>
                    <p className="font-racing font-bold text-xs sm:text-sm leading-snug line-clamp-1">
                      {card.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Official Follow Button */}
      <div className="relative z-10 mt-8 text-center">
        <a
          href="https://www.instagram.com/charles_leclerc/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-[#E10600] text-[#0A0A0A] hover:text-white font-racing font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-black/40 hover:scale-105 active:scale-95"
        >
          <span>FOLLOW @CHARLES_LECLERC</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
