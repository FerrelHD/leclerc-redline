import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

export default function MenuOverlay({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState('HOME');

  const menuItems = [
    { label: 'HOME', href: '#hero' },
    { label: 'ON TRACK', href: '#ontrack-offtrack' },
    { label: 'OFF TRACK', href: '#sound-of-speed' },
    { label: 'CALENDAR', href: '#milestones' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] bg-[#1a1e16] text-[#f8f9fa] overflow-y-auto overflow-x-hidden flex flex-col justify-between p-6 md:p-12 select-none"
        >
          {/* Background Topographic Contour Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="menu-topo-olive" width="900" height="900" patternUnits="userSpaceOnUse">
                  <path d="M 50,450 Q 250,180 500,450 T 950,450" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
                  <path d="M 100,280 Q 300,80 550,280 T 980,280" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
                  <path d="M 0,650 Q 350,850 600,650 T 950,650" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#menu-topo-olive)" />
            </svg>
          </div>

          {/* Top Bar: Brand Typography & Close Button */}
          <div className="relative z-10 w-full flex items-center justify-between">
            {/* Left: Brand Monogram */}
            <div className="flex flex-col">
              <span className="font-editorial text-2xl md:text-3xl tracking-tight leading-none text-white font-medium">
                CHARLES
              </span>
              <span className="font-racing font-black text-2xl md:text-3xl tracking-tight leading-none text-white">
                LECLERC
              </span>
            </div>

            {/* Right: Store Button & Close X Button */}
            <div className="flex items-center gap-3">
              <a
                href="https://store.ferrari.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ccff00] text-black font-racing font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>STORE</span>
              </a>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-all shadow-md active:scale-95 cursor-pointer"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 filter grayscale contrast-[1.08] brightness-90"
              >
                <img
                  src="/images/charles-helmet-front.jpg"
                  alt="Charles Helmet"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#1a1e16]/30 mix-blend-multiply" />
              </motion.div>

              {/* Card 2: Charles Podium Celebration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/40 border border-white/10 filter grayscale contrast-[1.08] brightness-90 -translate-y-4"
              >
                <img
                  src="/images/charles-portrait.jpg"
                  alt="Charles Podium"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#1a1e16]/30 mix-blend-multiply" />
              </motion.div>

              {/* Card 3: Charles Off Track / Piano */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.26 }}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/40 border border-white/10 filter grayscale contrast-[1.08] brightness-90 -translate-y-4"
              >
                <img
                  src="/images/charles-off-track.jpg"
                  alt="Charles Off Track"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#1a1e16]/30 mix-blend-multiply" />
              </motion.div>

              {/* Card 4: Ferrari SF-25 F1 Car On-Track Mist */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.34 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 filter grayscale contrast-[1.08] brightness-90"
              >
                <img
                  src="/images/charles-on-track.jpg"
                  alt="Ferrari F1 On Track"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#1a1e16]/30 mix-blend-multiply" />
              </motion.div>

            </div>

            {/* RIGHT COLUMN: Giant Typography Menu */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center text-center lg:text-right gap-6">
              
              {/* Menu Links */}
              <nav className="flex flex-col gap-2 md:gap-3">
                {menuItems.map((item, index) => {
                  const isActive = activeItem === item.label;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 25 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.12 + index * 0.06 }}
                      className="relative inline-flex items-center justify-center lg:justify-end"
                    >
                      <a
                        href={item.href}
                        onClick={() => {
                          setActiveItem(item.label);
                          onClose();
                        }}
                        onMouseEnter={() => setActiveItem(item.label)}
                        className={`relative font-racing font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-none uppercase transition-colors duration-200 ${
                          isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>

                        {/* Wavy Neon Brush Slash for Active Item */}
                        {isActive && (
                          <motion.div
                            layoutId="menu-wave-stroke"
                            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 pointer-events-none flex items-center"
                          >
                            <svg viewBox="0 0 100 12" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                              <path
                                d="M 0,6 Q 25,1 50,6 T 100,6"
                                stroke="#ccff00"
                                strokeWidth="4.5"
                                strokeLinecap="round"
                                fill="none"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </a>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Formula 1 Laurel Wreath + Helmet Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-col items-center lg:items-end mt-4 text-center lg:text-right"
              >
                <svg viewBox="0 0 60 40" className="w-14 h-9" fill="none">
                  <path d="M 12,28 C 8,22 8,14 14,8 C 15,12 16,16 18,20" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M 48,28 C 52,22 52,14 46,8 C 45,12 44,16 42,20" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round" />
                  <ellipse cx="30" cy="18" rx="10" ry="9" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
                  <path d="M 22,18 C 24,14 36,14 38,18 Z" fill="rgba(255,255,255,0.75)" />
                  <line x1="20" y1="22" x2="40" y2="22" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
                </svg>
                <span className="text-[10px] font-mono-telemetry uppercase tracking-wider text-neutral-400 mt-1">
                  MCLAREN F1 / FERRARI SINCE 2019
                </span>
              </motion.div>

            </div>

          </div>

          {/* Bottom Bar: Business Enquiries & Social Media Links */}
          <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/10 gap-4 text-xs font-racing uppercase tracking-wider text-neutral-400">
            <a
              href="mailto:contact@charlesleclerc.com"
              className="hover:text-white transition-colors"
            >
              BUSINESS ENQUIRIES
            </a>

            <div className="flex items-center gap-6">
              <a href="https://www.tiktok.com/@charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TIKTOK</a>
              <a href="https://www.instagram.com/charles_leclerc/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
              <a href="https://www.youtube.com/@charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YOUTUBE</a>
              <a href="https://www.twitch.tv/charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TWITCH</a>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
