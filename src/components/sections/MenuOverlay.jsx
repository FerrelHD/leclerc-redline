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

  // Snappy, instant Formula-1 style easeOut curve (Starts FAST immediately on click, settles smoothly)
  const curveVariants = {
    initial: {
      d: "M 0 0 L 100 0 L 100 0 Q 50 90 0 0 Z",
    },
    animate: {
      d: "M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z",
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1], // Instant acceleration, smooth landing
      },
    },
    exit: {
      d: "M 0 0 L 100 0 L 100 0 Q 50 90 0 0 Z",
      transition: {
        duration: 0.45,
        ease: [0.7, 0, 0.84, 0], // Snappy exit
      },
    },
  };

  const contentVariants = {
    initial: {
      opacity: 0,
      y: -20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        delay: 0.15,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] select-none">
          
          {/* 1. SOLID FERRARI RED CURTAIN (Snappy Immediate Launch) */}
          <svg
            className="fixed inset-0 w-full h-full pointer-events-none fill-[#E10600] z-[9998]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.path
              variants={curveVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
          </svg>

          {/* 2. MENU CONTENT CONTAINER */}
          <motion.div
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-[9999] w-full h-full overflow-y-auto overflow-x-hidden flex flex-col justify-between p-6 md:p-12 text-white"
          >
            {/* Top Bar: Brand Typography & Close Button */}
            <div className="relative z-10 w-full flex items-center justify-between">
              {/* Left: Brand Monogram */}
              <div className="flex flex-col">
                <TextBoxReveal delay={0.18} duration={0.4} boxColor="#000000">
                  <span className="font-editorial text-2xl md:text-3xl tracking-tight leading-none text-white font-medium">
                    CHARLES
                  </span>
                </TextBoxReveal>
                <TextBoxReveal delay={0.24} duration={0.4} boxColor="#000000">
                  <span className="font-racing font-black text-2xl md:text-3xl tracking-tight leading-none text-white">
                    LECLERC
                  </span>
                </TextBoxReveal>
              </div>

              {/* Right: Black Store Button & Close X Button */}
              <div className="flex items-center gap-3">
                <a
                  href="https://store.ferrari.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-900 text-white font-racing font-bold text-xs uppercase tracking-wider transition-all hover:scale-105"
                >
                  <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>STORE</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white text-black hover:bg-black hover:text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Center Stage: Masonry Photo Collage (Left) & Menu Navigation (Right) */}
            <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* LEFT COLUMN: 4 Staggered Photography Cards */}
              <div className="hidden md:grid lg:col-span-6 grid-cols-2 gap-4 lg:gap-6 pointer-events-none">
                
                {/* Card 1: Charles in #16 Helmet */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-white/20"
                >
                  <img
                    src="/images/charles-helmet-front.jpg"
                    alt="Charles Helmet"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Card 2: Charles Podium Celebration */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.26 }}
                  className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-white/20 -translate-y-4"
                >
                  <img
                    src="/images/charles-portrait.jpg"
                    alt="Charles Podium"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Card 3: Charles Off Track / Piano */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.32 }}
                  className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-white/20 -translate-y-4"
                >
                  <img
                    src="/images/charles-off-track.jpg"
                    alt="Charles Off Track"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Card 4: Ferrari SF-25 F1 Car On-Track */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.38 }}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-white/20"
                >
                  <img
                    src="/images/charles-on-track.jpg"
                    alt="Ferrari F1 On Track"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

              </div>

              {/* RIGHT COLUMN: Giant Typography Menu */}
              <div className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center text-center lg:text-right gap-6">
                
                {/* Menu Links */}
                <nav className="flex flex-col gap-2 md:gap-3">
                  {menuItems.map((item, index) => {
                    const isActive = activeItem === item.label;
                    return (
                      <div
                        key={item.label}
                        className="relative inline-flex items-center justify-center lg:justify-end"
                      >
                        <TextBoxReveal delay={0.2 + index * 0.06} duration={0.4} boxColor="#000000">
                          <a
                            href={item.href}
                            onClick={() => {
                              setActiveItem(item.label);
                              onClose();
                            }}
                            onMouseEnter={() => setActiveItem(item.label)}
                            className={`relative font-racing font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-none uppercase transition-colors duration-150 block py-1 ${
                              isActive ? 'text-white' : 'text-white/60 hover:text-white'
                            }`}
                          >
                            <span>{item.label}</span>

                            {/* Crisp Solid White Wave Slash */}
                            {isActive && (
                              <motion.div
                                layoutId="menu-white-stroke"
                                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 pointer-events-none flex items-center"
                              >
                                <svg viewBox="0 0 100 12" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                  <path
                                    d="M 0,6 Q 25,1 50,6 T 100,6"
                                    stroke="#FFFFFF"
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
                  <TextBoxReveal delay={0.48} duration={0.4} boxColor="#000000">
                    <div className="flex items-center gap-2 text-white">
                      <svg viewBox="0 0 60 40" className="w-12 h-8" fill="none">
                        <path d="M 12,28 C 8,22 8,14 14,8 C 15,12 16,16 18,20" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M 48,28 C 52,22 52,14 46,8 C 45,12 44,16 42,20" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                        <ellipse cx="30" cy="18" rx="10" ry="9" stroke="#FFFFFF" strokeWidth="1.5" />
                        <path d="M 22,18 C 24,14 36,14 38,18 Z" fill="#FFFFFF" />
                        <line x1="20" y1="22" x2="40" y2="22" stroke="#FFFFFF" strokeWidth="1.4" />
                      </svg>
                      <span className="text-[10px] font-mono-telemetry uppercase tracking-wider text-white font-bold">
                        SCUDERIA FERRARI SINCE 2019
                      </span>
                    </div>
                  </TextBoxReveal>
                </div>

              </div>

            </div>

            {/* Bottom Bar: Business Enquiries & Social Media Links */}
            <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/20 gap-4 text-xs font-racing uppercase tracking-wider text-white/80">
              <TextBoxReveal delay={0.52} duration={0.4} boxColor="#000000">
                <a
                  href="mailto:contact@charlesleclerc.com"
                  className="hover:text-white transition-colors"
                >
                  BUSINESS ENQUIRIES
                </a>
              </TextBoxReveal>

              <div className="flex items-center gap-6">
                <TextBoxReveal delay={0.56} duration={0.4} boxColor="#000000">
                  <a href="https://www.tiktok.com/@charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TIKTOK</a>
                </TextBoxReveal>
                <TextBoxReveal delay={0.6} duration={0.4} boxColor="#000000">
                  <a href="https://www.instagram.com/charles_leclerc/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
                </TextBoxReveal>
                <TextBoxReveal delay={0.64} duration={0.4} boxColor="#000000">
                  <a href="https://www.youtube.com/@charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YOUTUBE</a>
                </TextBoxReveal>
                <TextBoxReveal delay={0.68} duration={0.4} boxColor="#000000">
                  <a href="https://www.twitch.tv/charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TWITCH</a>
                </TextBoxReveal>
              </div>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
