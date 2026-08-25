import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import TextBoxReveal from '../ui/TextBoxReveal';

export default function MenuOverlay({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState('HOME');

  const menuItems = [
    { label: 'HOME', href: '#hero' },
    { label: 'ON TRACK', href: '#ontrack-offtrack' },
    { label: 'OFF TRACK', href: '#sound-of-speed' },
    { label: 'CALENDAR', href: '#milestones' },
  ];

  // Overlapping menu slide down transition variants
  const menuVariants = {
    initial: {
      y: '-100%',
    },
    animate: {
      y: '0%',
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      y: '-100%',
      transition: {
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  // Deep Circular Bowl Curve SVG Path Morphing (matching Canva reference)
  const initialCurve = `M0 0 L${typeof window !== 'undefined' ? window.innerWidth : 1920} 0 L${typeof window !== 'undefined' ? window.innerWidth : 1920} 0 Q${typeof window !== 'undefined' ? window.innerWidth / 2 : 960} 380 0 0 Z`;
  const targetCurve = `M0 0 L${typeof window !== 'undefined' ? window.innerWidth : 1920} 0 L${typeof window !== 'undefined' ? window.innerWidth : 1920} 0 Q${typeof window !== 'undefined' ? window.innerWidth / 2 : 960} 0 0 0 Z`;

  const curveVariants = {
    initial: {
      d: initialCurve,
    },
    animate: {
      d: targetCurve,
      transition: {
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      d: initialCurve,
      transition: {
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[9999] bg-[#09090b] text-[#f8f9fa] overflow-y-auto overflow-x-hidden flex flex-col justify-between p-6 md:p-12 select-none shadow-[0_35px_120px_rgba(225,6,0,0.45)] border-b border-[#E10600]/30"
        >
          {/* Deep Rounded Bowl Bottom Morphing Curve */}
          <svg className="absolute top-[99.5%] left-0 w-full h-[260px] pointer-events-none fill-[#09090b] z-[9999] overflow-visible">
            <motion.path
              variants={curveVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
          </svg>

          {/* Background Ferrari Carbon Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="menu-ferrari-carbon" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 0,30 L 60,30 M 30,0 L 30,60" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <path d="M 0,0 L 60,60 M 0,60 L 60,0" stroke="rgba(225,6,0,0.1)" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#menu-ferrari-carbon)" />
            </svg>
          </div>

          {/* Top Bar: Brand Typography & Close Button */}
          <div className="relative z-10 w-full flex items-center justify-between">
            {/* Left: Brand Monogram with Text Box Reveal */}
            <div className="flex flex-col">
              <TextBoxReveal delay={0.3} boxColor="#E10600">
                <span className="font-editorial text-2xl md:text-3xl tracking-tight leading-none text-white font-medium">
                  CHARLES
                </span>
              </TextBoxReveal>
              <TextBoxReveal delay={0.4} boxColor="#E10600">
                <span className="font-racing font-black text-2xl md:text-3xl tracking-tight leading-none text-white">
                  LECLERC
                </span>
              </TextBoxReveal>
            </div>

            {/* Right: Ferrari Red Store Button & Close X Button */}
            <div className="flex items-center gap-3">
              <a
                href="https://store.ferrari.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#ff1a14] text-white font-racing font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E10600]/40 hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>STORE</span>
              </a>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white text-black hover:bg-[#E10600] hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                title="Close Menu"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Center Stage: Masonry Photo Collage (Left) & Menu Navigation (Right) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: 4 Staggered Editorial Photography Cards */}
            <div className="hidden md:grid lg:col-span-6 grid-cols-2 gap-4 lg:gap-6 pointer-events-none">
              
              {/* Card 1: Charles in #16 Helmet */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-black/60 border border-[#E10600]/30 shadow-xl"
              >
                <img
                  src="/images/charles-helmet-front.jpg"
                  alt="Charles Helmet"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>

              {/* Card 2: Charles Podium Celebration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.38 }}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/60 border border-[#E10600]/30 shadow-xl -translate-y-4"
              >
                <img
                  src="/images/charles-portrait.jpg"
                  alt="Charles Podium"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>

              {/* Card 3: Charles Off Track / Piano */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.46 }}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/60 border border-[#E10600]/30 shadow-xl -translate-y-4"
              >
                <img
                  src="/images/charles-off-track.jpg"
                  alt="Charles Off Track"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>

              {/* Card 4: Ferrari SF-25 F1 Car On-Track Mist */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.54 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-black/60 border border-[#E10600]/30 shadow-xl"
              >
                <img
                  src="/images/charles-on-track.jpg"
                  alt="Ferrari F1 On Track"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>

            </div>

            {/* RIGHT COLUMN: Giant Typography Menu with Option A TextBoxReveal */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center text-center lg:text-right gap-6">
              
              {/* Menu Links with Ferrari Red Box Reveal */}
              <nav className="flex flex-col gap-2 md:gap-3">
                {menuItems.map((item, index) => {
                  const isActive = activeItem === item.label;
                  return (
                    <div
                      key={item.label}
                      className="relative inline-flex items-center justify-center lg:justify-end"
                    >
                      <TextBoxReveal delay={0.25 + index * 0.1} boxColor="#E10600">
                        <a
                          href={item.href}
                          onClick={() => {
                            setActiveItem(item.label);
                            onClose();
                          }}
                          onMouseEnter={() => setActiveItem(item.label)}
                          className={`relative font-racing font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-none uppercase transition-colors duration-200 block py-1 ${
                            isActive ? 'text-white' : 'text-neutral-500 hover:text-white'
                          }`}
                        >
                          <span>{item.label}</span>

                          {/* Ferrari Rosso Corsa Wave Slash for Active Item */}
                          {isActive && (
                            <motion.div
                              layoutId="menu-ferrari-stroke"
                              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 pointer-events-none flex items-center"
                            >
                              <svg viewBox="0 0 100 12" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <path
                                  d="M 0,6 Q 25,1 50,6 T 100,6"
                                  stroke="#E10600"
                                  strokeWidth="5"
                                  strokeLinecap="round"
                                  fill="none"
                                />
                              </svg>
                            </motion.div>
                          )}
                        </a>
                      </TextBoxReveal>
                    </div>
                  );
                })}
              </nav>

              {/* Scuderia Ferrari Laurel Wreath + Helmet Badge */}
              <div className="flex flex-col items-center lg:items-end mt-4 text-center lg:text-right">
                <TextBoxReveal delay={0.7} boxColor="#FFDE00">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <svg viewBox="0 0 60 40" className="w-12 h-8" fill="none">
                      <path d="M 12,28 C 8,22 8,14 14,8 C 15,12 16,16 18,20" stroke="#FFDE00" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M 48,28 C 52,22 52,14 46,8 C 45,12 44,16 42,20" stroke="#FFDE00" strokeWidth="1.4" strokeLinecap="round" />
                      <ellipse cx="30" cy="18" rx="10" ry="9" stroke="#FFDE00" strokeWidth="1.5" />
                      <path d="M 22,18 C 24,14 36,14 38,18 Z" fill="#FFDE00" />
                      <line x1="20" y1="22" x2="40" y2="22" stroke="#FFDE00" strokeWidth="1.2" />
                    </svg>
                    <span className="text-[10px] font-mono-telemetry uppercase tracking-wider text-neutral-300 font-bold">
                      SCUDERIA FERRARI SINCE 2019
                    </span>
                  </div>
                </TextBoxReveal>
              </div>

            </div>

          </div>

          {/* Bottom Bar: Business Enquiries & Social Media Links */}
          <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/10 gap-4 text-xs font-racing uppercase tracking-wider text-neutral-400">
            <TextBoxReveal delay={0.75} boxColor="#E10600">
              <a
                href="mailto:contact@charlesleclerc.com"
                className="hover:text-[#E10600] transition-colors"
              >
                BUSINESS ENQUIRIES
              </a>
            </TextBoxReveal>

            <div className="flex items-center gap-6">
              <TextBoxReveal delay={0.8} boxColor="#E10600">
                <a href="https://www.tiktok.com/@charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-[#E10600] transition-colors">TIKTOK</a>
              </TextBoxReveal>
              <TextBoxReveal delay={0.85} boxColor="#E10600">
                <a href="https://www.instagram.com/charles_leclerc/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E10600] transition-colors">INSTAGRAM</a>
              </TextBoxReveal>
              <TextBoxReveal delay={0.9} boxColor="#E10600">
                <a href="https://www.youtube.com/@charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-[#E10600] transition-colors">YOUTUBE</a>
              </TextBoxReveal>
              <TextBoxReveal delay={0.95} boxColor="#E10600">
                <a href="https://www.twitch.tv/charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-[#E10600] transition-colors">TWITCH</a>
              </TextBoxReveal>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
