import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import MenuOverlay from './MenuOverlay';
import MagneticEffect from '../ui/MagneticEffect';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 select-none pointer-events-none">
        <div className="w-full px-4 sm:px-6 md:px-12 h-16 sm:h-20 flex items-center justify-between pointer-events-auto">
          
          {/* Left: Editorial CHARLES LECLERC Brand Typography (Auto Contrast via CSS) */}
          <a href="#" className="flex flex-col group leading-tight nav-text transition-colors duration-500">
            <span className="font-editorial text-lg sm:text-2xl md:text-3xl tracking-tight leading-none font-semibold">
              CHARLES
            </span>
            <span className="font-racing font-black text-lg sm:text-2xl md:text-3xl tracking-tight leading-none">
              LECLERC
            </span>
          </a>

          {/* Center: Modern Slanted CL Monogram (Auto Contrast) */}
          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-4 sm:top-5 items-center justify-center pointer-events-none nav-text transition-colors duration-500">
            <div className="font-racing font-black italic text-2xl sm:text-3xl md:text-4xl tracking-tighter flex items-center leading-none">
              <span>C</span>
              <span className="-ml-0.5">L</span>
            </div>
          </div>

          {/* Right: Monaco Scarlet Red Store Button & Contrast Hamburger Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Official Store Button */}
            <MagneticEffect factor={0.2}>
              <a
                href="https://store.ferrari.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#E10600] hover:bg-[#ff1a14] text-white font-racing font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-md shadow-[#E10600]/30 transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="w-3 sm:w-3.5 h-3 sm:h-3.5 stroke-[2.5]" />
                <span>STORE</span>
              </a>
            </MagneticEffect>

            {/* Minimalist Dual-Bar Hamburger Button (Auto Contrast) */}
            <MagneticEffect factor={0.3}>
              <button
                onClick={() => setMenuOpen(true)}
                className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer hover:opacity-70"
                title="Open Navigation Menu"
              >
                <span className="w-5 sm:w-6 h-[2px] rounded-full nav-burger transition-colors duration-500" />
                <span className="w-5 sm:w-6 h-[2px] rounded-full nav-burger transition-colors duration-500" />
              </button>
            </MagneticEffect>
          </div>

        </div>
      </header>

      {/* Fullscreen Interactive Menu Drawer Overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
