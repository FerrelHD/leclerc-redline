import React, { useState, useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import MenuOverlay from './MenuOverlay';

export default function Navbar({ isAudioPlaying, toggleAudio }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolledDark, setIsScrolledDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // When user scrolls past 100px (entering the dark hero zoom-out sequence)
      if (window.scrollY > 80) {
        setIsScrolledDark(true);
      } else {
        setIsScrolledDark(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 select-none pointer-events-none transition-colors duration-300">
        <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between pointer-events-auto">
          
          {/* Left: Editorial CHARLES LECLERC Brand Typography (Auto Contrast) */}
          <a href="#" className="flex flex-col group leading-tight transition-colors duration-300">
            <span
              className={`font-editorial text-2xl md:text-3xl tracking-tight leading-none font-semibold transition-colors duration-300 ${
                isScrolledDark ? 'text-white' : 'text-[#0A0A0B]'
              }`}
            >
              CHARLES
            </span>
            <span
              className={`font-racing font-black text-2xl md:text-3xl tracking-tight leading-none transition-colors duration-300 ${
                isScrolledDark ? 'text-white' : 'text-[#0A0A0B]'
              }`}
            >
              LECLERC
            </span>
          </a>

          {/* Center: Modern Slanted CL Monogram (Auto Contrast) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-5 flex items-center justify-center pointer-events-none">
            <div
              className={`font-racing font-black italic text-3xl md:text-4xl tracking-tighter flex items-center leading-none transition-colors duration-300 ${
                isScrolledDark ? 'text-white' : 'text-[#0A0A0B]'
              }`}
            >
              <span>C</span>
              <span className="-ml-0.5">L</span>
            </div>
          </div>

          {/* Right: Monaco Scarlet Red Store Button & Contrast Hamburger Menu */}
          <div className="flex items-center gap-3">
            {/* Official Store Button */}
            <a
              href="https://store.ferrari.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#ff1a14] text-white font-racing font-bold text-xs uppercase tracking-wider shadow-md shadow-[#E10600]/30 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>STORE</span>
            </a>

            {/* Minimalist Dual-Bar Hamburger Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className={`w-10 h-10 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                isScrolledDark
                  ? 'bg-[#181A20] border-white/20 hover:border-white text-white'
                  : 'bg-white border-neutral-300 hover:border-black text-black'
              }`}
              title="Open Navigation Menu"
            >
              <span
                className={`w-4 h-[2px] rounded-full transition-colors duration-300 ${
                  isScrolledDark ? 'bg-white' : 'bg-black'
                }`}
              />
              <span
                className={`w-4 h-[2px] rounded-full transition-colors duration-300 ${
                  isScrolledDark ? 'bg-white' : 'bg-black'
                }`}
              />
            </button>
          </div>

        </div>
      </header>

      {/* Fullscreen Interactive Menu Drawer Overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
