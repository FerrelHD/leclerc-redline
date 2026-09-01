import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const socialCards = [
  {
    id: 0,
    title: 'Spa 2019 First F1 Victory',
    tag: '@scuderiaferrari',
    image: '/images/leclerc gallery/SPA 2019 Leclerc Potrait.jpg',
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
  const [isFanned, setIsFanned] = useState(false);
  const sectionRef = useRef(null);
  const deckContainerRef = useRef(null);

  // Switch navbar to dark theme and trigger deck fan-out on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Maintain white navbar text throughout this section and into footer
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom bottom',
        onEnter:     () => document.body.classList.add('nav-theme-dark'),
        onLeaveBack: () => document.body.classList.remove('nav-theme-dark'),
        onEnterBack: () => document.body.classList.add('nav-theme-dark'),
      });

      // 2. Fanned Deck Deal: Triggers right when the cards deck is clearly inside the screen
      ScrollTrigger.create({
        trigger: deckContainerRef.current,
        start: 'top 60%', // Mengipas saat tumpukan kartu sudah benar-benar masuk dan terlihat di layar
        onEnter:     () => setIsFanned(true),
        onLeaveBack: () => setIsFanned(false),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="socials-deck"
      ref={sectionRef}
      className="relative z-10 w-full pt-28 pb-8 sm:pb-12 px-4 sm:px-8 md:px-12 bg-transparent text-white"
    >
      {/* Atmospheric Scuderia Radial Glow */}
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
        - Fan-Out Deal on Enter: Starts as 1 card in center, fans out smoothly when clearly scrolled into view
        - Mobile Responsive: Tight spread on mobile so all 7 cards remain visible within the screen
        - Consistent natural deck stacking order (zIndex = defaultZ)
        - Wide Accordion Spread: Neighbor cards push away cleanly and return directly without overlapping/glitching
        - Subpixel Anti-Aliasing Lock: isolate + WebKit backface fix prevents border flickering
      */}
      <div 
        ref={deckContainerRef}
        onMouseLeave={() => setHoveredIndex(null)}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[440px] sm:min-h-[540px] md:min-h-[600px] px-2"
      >
        <div className="relative flex items-center justify-center w-full min-h-[380px] sm:min-h-[480px] md:min-h-[540px]">
          {socialCards.map((card, i) => {
            const offsetFromCenter = i - 3;
            const absOffset = Math.abs(offsetFromCenter);

            // Responsive spacing: adapt spread so all 7 cards remain visible on mobile viewports
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
            const spreadDistance = isMobile ? 38 : 115;
            const defaultX = offsetFromCenter * spreadDistance;
            const defaultRotate = offsetFromCenter * (isMobile ? 5.5 : 7.5);
            const defaultY = absOffset * (isMobile ? 10 : 16);
            const defaultZ = 25 - absOffset * 2;

            const isHovered = isFanned && hoveredIndex === i;
            const hasHover = isFanned && hoveredIndex !== null;

            // Target coordinates: if not fanned yet, stay stacked as 1 card at center
            let targetX = isFanned ? defaultX : 0;
            let targetY = isFanned ? defaultY : 0;
            let targetRotate = isFanned ? defaultRotate : 0;
            let targetScale = 1.0;

            if (hasHover) {
              if (isHovered) {
                targetY = defaultY - (isMobile ? 24 : 36);
                targetRotate = 0;
                targetScale = isMobile ? 1.08 : 1.12;
              } else if (i < hoveredIndex) {
                const pushDistance = isMobile
                  ? ((hoveredIndex - i === 1) ? -48 : -24)
                  : ((hoveredIndex - i === 1) ? -125 : -70);
                targetX = defaultX + pushDistance;
                targetRotate = defaultRotate - (isMobile ? 2 : 4);
                targetScale = isMobile ? 0.94 : 0.95;
              } else if (i > hoveredIndex) {
                const pushDistance = isMobile
                  ? ((i - hoveredIndex === 1) ? 48 : 24)
                  : ((i - hoveredIndex === 1) ? 125 : 70);
                targetX = defaultX + pushDistance;
                targetRotate = defaultRotate + (isMobile ? 2 : 4);
                targetScale = isMobile ? 0.94 : 0.95;
              }
            }

            // Elegant, unhurried fan-out stagger from inside to outside
            const staggerDelay = (!hasHover && hoveredIndex === null) ? absOffset * 0.075 : 0;

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => isFanned && setHoveredIndex(i)}
                onClick={() => isFanned && setHoveredIndex(hoveredIndex === i ? null : i)}
                animate={{
                  x: targetX,
                  y: targetY,
                  rotate: targetRotate,
                  scale: targetScale,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 180, // Lebih tenang dan halus, tidak terburu-buru
                  damping: 26,
                  mass: 0.8,
                  delay: staggerDelay,
                }}
                className="absolute cursor-pointer select-none origin-bottom will-change-transform"
                style={{
                  zIndex: defaultZ,
                  width: 'clamp(115px, 25vw, 250px)',
                  aspectRatio: '9/16',
                  transformOrigin: '50% 90%',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
              >
                {/* Card Container: ZERO OUTLINE / ZERO BORDER / ISOLATED STACK */}
                <div
                  className={`relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0A0A] isolate transition-shadow duration-300 ${
                    isHovered
                      ? 'shadow-[0_35px_80px_rgba(0,0,0,0.9)]'
                      : 'shadow-2xl'
                  }`}
                  style={{
                    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                    maskImage: 'radial-gradient(white, black)',
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover filter contrast-[1.03]"
                    loading="eager"
                    decoding="async"
                  />

                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent pointer-events-none" />

                  {/* Instagram Badge */}
                  <div className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-none">
                    <svg
                      className="w-3 sm:w-3.5 h-3 sm:h-3.5"
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
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white pointer-events-none">
                    <p className="font-mono-telemetry text-[8px] sm:text-[9px] tracking-wider text-[#E10600] uppercase font-bold mb-0.5">
                      {card.tag}
                    </p>
                    <p className="font-racing font-bold text-[11px] sm:text-xs md:text-sm leading-snug line-clamp-1">
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
      <div className="relative z-10 mt-10 sm:mt-14 mb-10 sm:mb-14 text-center">
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
