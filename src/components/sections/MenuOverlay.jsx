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
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0c0e0b] text-[#f8f9fa] overflow-y-auto overflow-x-hidden flex flex-col justify-between p-6 md:p-12 select-none"
        >
          {/* Background Topographic Contour Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="menu-topo" width="800" height="800" patternUnits="userSpaceOnUse">
                  <path d="M 50,400 Q 250,150 500,400 T 900,400" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
                  <path d="M 100,250 Q 300,50 550,250 T 950,250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
                  <path d="M 0,600 Q 350,800 600,600 T 900,600" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#menu-topo)" />
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
                className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-all shadow-md active:scale-95"
                title="Close Menu"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Center Stage: Masonry Photo Collage (Left) & Giant Menu Navigation (Right) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: 4 Masonry Editorial Photography Cards */}
            <div className="hidden md:grid lg:col-span-7 grid-cols-2 gap-4 lg:gap-6 pointer-events-none">
              
              {/* Card 1: Charles in #16 Helmet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/10 filter grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
              >
                <img
                  src="/images/charles-helmet-front.jpg"
                  alt="Charles Helmet"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0c0e0b]/20" />
              </motion.div>

              {/* Card 2: Charles Podium Celebration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative aspect-[4/5] rounded-lg overflow-hidden bg-black/40 border border-white/10 filter grayscale contrast-110 -translate-y-4"
              >
                <img
                  src="/images/charles-portrait.jpg"
                  alt="Charles Podium"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0c0e0b]/20" />
              </motion.div>

              {/* Card 3: Charles Off Track / Piano */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative aspect-[4/5] rounded-lg overflow-hidden bg-black/40 border border-white/10 filter grayscale contrast-110 -translate-y-4"
              >
                <img
                  src="/images/charles-off-track.jpg"
                  alt="Charles Off Track"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0c0e0b]/20" />
              </motion.div>

              {/* Card 4: Ferrari SF-25 F1 Car On-Track Mist */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/10 filter grayscale contrast-110"
              >
                <img
                  src="/images/charles-on-track.jpg"
                  alt="Ferrari F1 On Track"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0c0e0b]/20" />
              </motion.div>

            </div>

            {/* RIGHT COLUMN: Giant Typography Menu & Footer Badges */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center text-center lg:text-right gap-8">
              
              {/* Menu Links */}
              <nav className="flex flex-col gap-2 md:gap-4">
                {menuItems.map((item, index) => {
                  const isActive = activeItem === item.label;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        setActiveItem(item.label);
                        onClose();
                      }}
                      onMouseEnter={() => setActiveItem(item.label)}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                      className="relative group font-racing font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none uppercase transition-colors duration-200"
                    >
                      <span className={isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}>
                        {item.label}
                      </span>

                      {/* Neon Green/Yellow Strike-through Wave for Active Item */}
                      {isActive && (
                        <motion.span
                          layoutId="menu-active-slash"
                          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[5px] bg-[#ccff00] rounded-full shadow-[0_0_12px_#ccff00] pointer-events-none"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </motion.a>
                  );
                })}
              </nav>

              {/* Formula 1 Laurel Wreath + Helmet Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col items-center lg:items-end mt-4 text-center lg:text-right"
              >
                <svg viewBox="0 0 60 40" className="w-14 h-9" fill="none">
                  <path d="M 12,28 C 8,22 8,14 14,8 C 15,12 16,16 18,20" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M 48,28 C 52,22 52,14 46,8 C 45,12 44,16 42,20" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" />
                  <ellipse cx="30" cy="18" rx="10" ry="9" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                  <path d="M 22,18 C 24,14 36,14 38,18 Z" fill="rgba(255,255,255,0.7)" />
                  <line x1="20" y1="22" x2="40" y2="22" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                </svg>
                <span className="text-[10px] font-mono-telemetry uppercase tracking-wider text-neutral-400 mt-1">
                  SCUDERIA FERRARI SINCE 2019
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
