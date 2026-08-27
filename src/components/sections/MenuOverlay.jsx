import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import TextBoxReveal from '../ui/TextBoxReveal';

function MenuItemLink({ item, isActive, onSelect, onHover }) {
  const [isHovered, setIsHovered] = useState(false);
  const letters = item.label.split('');

  return (
    <a
      href={item.href}
      onClick={onSelect}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative font-racing font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-none uppercase block py-1 transition-colors duration-200 cursor-pointer ${
        isActive ? 'text-white' : 'text-[#8E8E93] hover:text-white'
      }`}
    >
      <div className="relative inline-flex overflow-hidden">
        {/* Base Layer (Slides up and away on hover) */}
        <div className="flex">
          {letters.map((char, i) => (
            <motion.span
              key={`base-${i}`}
              className="inline-block"
              initial={false}
              animate={{
                y: isHovered ? '-115%' : '0%',
                opacity: isHovered ? 0.4 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 14,
                bounce: 0.38,
                delay: i * 0.022,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>

        {/* Duplicate Layer (Bounces up from below with energetic spring overshoot) */}
        <div className="absolute inset-0 flex" aria-hidden="true">
          {letters.map((char, i) => (
            <motion.span
              key={`dup-${i}`}
              className={`inline-block ${isActive ? 'text-white' : 'text-[#E10600]'}`}
              initial={false}
              animate={{
                y: isHovered ? '0%' : '115%',
                opacity: isHovered ? 1 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 14,
                bounce: 0.38,
                delay: i * 0.022,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Monaco Scarlet Red Strike-through Wave on Active Item */}
      {isActive && (
        <motion.div
          layoutId="menu-red-stroke"
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 pointer-events-none flex items-center"
        >
          <svg viewBox="0 0 100 12" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <path
              d="M 0,6 Q 25,1 50,6 T 100,6"
              stroke="#E10600"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </motion.div>
      )}
    </a>
  );
}

export default function MenuOverlay({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState('HOME');

  const menuItems = [
    { label: 'HOME', href: '#hero' },
    { label: 'ON TRACK', href: '#ontrack-offtrack' },
    { label: 'OFF TRACK', href: '#sound-of-speed' },
    { label: 'CALENDAR', href: '#milestones' },
  ];

  // Responsive ease-out for opening, snappy ease-in for closing
  const curveVariants = {
    initial: {
      d: "M 0 0 L 100 0 L 100 0 Q 50 50 0 0 Z",
    },
    animate: {
      d: "M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z",
      transition: {
        duration: 0.65,
        ease: [0.33, 1, 0.68, 1], // Smooth Deceleration (Ease-Out) for opening
      },
    },
    exit: {
      d: "M 0 0 L 100 0 L 100 0 Q 50 50 0 0 Z",
      transition: {
        duration: 0.45,
        ease: [0.32, 0, 0.67, 0], // Acceleration (Ease-In) for snappy closing
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
          
          {/* 1. DEEP INK OBSIDIAN (#101114) CURTAIN */}
          <svg
            className="fixed inset-0 w-full h-full pointer-events-none fill-[#101114] z-[9998]"
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

          {/* 2. MENU CONTENT CONTAINER (Monaco Riviera Palette with Restored Racing Font) */}
          <motion.div
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-[9999] w-full h-screen overflow-hidden flex flex-col justify-between px-8 md:px-16 py-6 md:py-8 text-white max-w-[1700px] mx-auto"
          >
            {/* Top Bar: Brand Typography & Close Button */}
            <div className="w-full flex items-center justify-between z-10">
              {/* Left: Brand Monogram */}
              <div className="flex flex-col">
                <TextBoxReveal delay={0.15} duration={0.35} boxColor="#E10600">
                  <span className="font-editorial text-2xl md:text-3xl tracking-tight leading-none text-white font-medium">
                    CHARLES
                  </span>
                </TextBoxReveal>
                <TextBoxReveal delay={0.2} duration={0.35} boxColor="#E10600">
                  <span className="font-racing font-black text-2xl md:text-3xl tracking-tight leading-none text-white uppercase">
                    LECLERC
                  </span>
                </TextBoxReveal>
              </div>

              {/* Right: Monaco Scarlet Red Store Button & Close Button */}
              <div className="flex items-center gap-3">
                <a
                  href="https://store.ferrari.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#ff1a14] text-white font-racing font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-[#E10600]/30"
                >
                  <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>STORE</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-[#1E2026] text-white hover:bg-[#E10600] border border-white/10 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Center Stage: Masonry Photo Collage (Left) & Restored Racing Menu Navigation (Right) */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-auto">
              
              {/* LEFT COLUMN: 4 Staggered Animated Photography Cards (Lando Norris Editorial Style) */}
              <div className="hidden md:grid lg:col-span-6 grid-cols-2 gap-4 lg:gap-6 max-w-[560px]">
                
                {/* Column 1 (Cards 1 & 3): Drifting gently up & down */}
                <motion.div
                  className="flex flex-col gap-4 lg:gap-6"
                  animate={{
                    y: [-6, 6, -6],
                  }}
                  transition={{
                    duration: 7.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Card 1: Charles Helmet Detail (Tall Portrait) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.18 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#181A20] border border-white/10 hover:border-[#E10600]/60 shadow-xl cursor-pointer group transition-all duration-300 pointer-events-auto"
                  >
                    <img
                      src="/images/leclerc1.jpg"
                      alt="Charles Leclerc Helmet"
                      className="w-full h-full object-cover filter grayscale-[25%] contrast-[1.05] group-hover:grayscale-0 group-hover:scale-108 group-hover:brightness-105 transition-all duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#101114]/25 group-hover:bg-transparent transition-colors duration-300" />
                  </motion.div>

                  {/* Card 3: Charles Cockpit Close-up (Square) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="relative aspect-square rounded-xl overflow-hidden bg-[#181A20] border border-white/10 hover:border-[#E10600]/60 shadow-xl cursor-pointer group transition-all duration-300 pointer-events-auto"
                  >
                    <img
                      src="/images/leclerc3.jpg"
                      alt="Charles Leclerc Cockpit"
                      className="w-full h-full object-cover filter grayscale-[25%] contrast-[1.05] group-hover:grayscale-0 group-hover:scale-108 group-hover:brightness-105 transition-all duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#101114]/25 group-hover:bg-transparent transition-colors duration-300" />
                  </motion.div>
                </motion.div>

                {/* Column 2 (Cards 2 & 4): Staggered Downward Offset & Reverse Drift */}
                <motion.div
                  className="flex flex-col gap-4 lg:gap-6 -translate-y-8"
                  animate={{
                    y: [6, -6, 6],
                  }}
                  transition={{
                    duration: 8.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Card 2: Charles On Track Stand (Square) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.24 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="relative aspect-square rounded-xl overflow-hidden bg-[#181A20] border border-white/10 hover:border-[#E10600]/60 shadow-xl cursor-pointer group transition-all duration-300 pointer-events-auto"
                  >
                    <img
                      src="/images/leclerc2.jpg"
                      alt="Charles Leclerc Cockpit Stand"
                      className="w-full h-full object-cover filter grayscale-[25%] contrast-[1.05] group-hover:grayscale-0 group-hover:scale-108 group-hover:brightness-105 transition-all duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#101114]/25 group-hover:bg-transparent transition-colors duration-300" />
                  </motion.div>

                  {/* Card 4: Charles Helmet Motion (Tall Portrait) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.36 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#181A20] border border-white/10 hover:border-[#E10600]/60 shadow-xl cursor-pointer group transition-all duration-300 pointer-events-auto"
                  >
                    <img
                      src="/images/leclerc4.jpg"
                      alt="Charles Leclerc Helmet Motion"
                      className="w-full h-full object-cover filter grayscale-[25%] contrast-[1.05] group-hover:grayscale-0 group-hover:scale-108 group-hover:brightness-105 transition-all duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#101114]/25 group-hover:bg-transparent transition-colors duration-300" />
                  </motion.div>
                </motion.div>

              </div>

              {/* RIGHT COLUMN: Restored Racing Typography Menu (HOME, ON TRACK, OFF TRACK, CALENDAR) */}
              <div className="lg:col-span-6 flex flex-col items-start lg:items-end justify-center text-left lg:text-right gap-6">
                
                {/* Menu Links with Staggered Per-Character Bouncy Roll-Up Animation */}
                <nav className="flex flex-col gap-2 md:gap-3">
                  {menuItems.map((item, index) => {
                    const isActive = activeItem === item.label;
                    return (
                      <div
                        key={item.label}
                        className="relative inline-flex items-center justify-start lg:justify-end"
                      >
                        <TextBoxReveal delay={0.16 + index * 0.05} duration={0.35} boxColor="#E10600">
                          <MenuItemLink
                            item={item}
                            isActive={isActive}
                            onSelect={() => {
                              setActiveItem(item.label);
                              onClose();
                            }}
                            onHover={() => setActiveItem(item.label)}
                          />
                        </TextBoxReveal>
                      </div>
                    );
                  })}
                </nav>

                {/* Scuderia Ferrari Laurel Wreath + Helmet Badge */}
                <div className="flex flex-col items-start lg:items-end mt-2 text-left lg:text-right">
                  <TextBoxReveal delay={0.42} duration={0.35} boxColor="#E10600">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <svg viewBox="0 0 60 40" className="w-11 h-7" fill="none">
                        <path d="M 12,28 C 8,22 8,14 14,8 C 15,12 16,16 18,20" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M 48,28 C 52,22 52,14 46,8 C 45,12 44,16 42,20" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" />
                        <ellipse cx="30" cy="18" rx="10" ry="9" stroke="#FFFFFF" strokeWidth="1.5" />
                        <path d="M 22,18 C 24,14 36,14 38,18 Z" fill="#E10600" />
                        <line x1="20" y1="22" x2="40" y2="22" stroke="#FFFFFF" strokeWidth="1.4" />
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
            <div className="w-full flex flex-col md:flex-row items-center justify-between pt-4 border-t border-white/10 gap-3 text-xs font-racing uppercase tracking-wider text-neutral-400 z-10">
              <TextBoxReveal delay={0.46} duration={0.35} boxColor="#E10600">
                <a
                  href="mailto:contact@charlesleclerc.com"
                  className="hover:text-white transition-colors"
                >
                  BUSINESS ENQUIRIES
                </a>
              </TextBoxReveal>

              <div className="flex items-center gap-6">
                <TextBoxReveal delay={0.5} duration={0.35} boxColor="#E10600">
                  <a href="https://www.tiktok.com/@charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TIKTOK</a>
                </TextBoxReveal>
                <TextBoxReveal delay={0.54} duration={0.35} boxColor="#E10600">
                  <a href="https://www.instagram.com/charles_leclerc/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
                </TextBoxReveal>
                <TextBoxReveal delay={0.58} duration={0.35} boxColor="#E10600">
                  <a href="https://www.youtube.com/@charlesleclerc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YOUTUBE</a>
                </TextBoxReveal>
                <TextBoxReveal delay={0.62} duration={0.35} boxColor="#E10600">
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
