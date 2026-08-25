import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import MenuOverlay from './MenuOverlay';

export default function Navbar({ isAudioPlaying, toggleAudio }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 select-none pointer-events-none">
        <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between pointer-events-auto">
          
          {/* Left: Editorial CHARLES LECLERC Brand Typography */}
          <a href="#" className="flex flex-col group leading-tight">
            <span className="font-editorial text-2xl md:text-3xl tracking-tight leading-none text-black font-semibold">
              CHARLES
            </span>
            <span className="font-racing font-black text-2xl md:text-3xl tracking-tight leading-none text-black">
              LECLERC
            </span>
          </a>

          {/* Center: Modern Slanted CL Monogram */}
          <div className="absolute left-1/2 -translate-x-1/2 top-5 flex items-center justify-center pointer-events-none">
            <div className="font-racing font-black italic text-3xl md:text-4xl tracking-tighter text-black flex items-center leading-none">
              <span>C</span>
              <span className="-ml-0.5">L</span>
            </div>
          </div>

          {/* Right: Ferrari Red Store Button & Dual-Bar Menu */}
          <div className="flex items-center gap-3">
            {/* Official Store Ferrari Red Button */}
            <a
              href="https://store.ferrari.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#ff1a14] text-white font-racing font-bold text-xs uppercase tracking-wider shadow-md shadow-[#E10600]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>STORE</span>
            </a>

            {/* Minimalist Dual-Bar Hamburger Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 rounded-xl bg-white border border-neutral-300 hover:border-[#E10600] hover:shadow-md flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Open Navigation Menu"
            >
              <span className="w-4 h-[2px] bg-black rounded-full" />
              <span className="w-4 h-[2px] bg-black rounded-full" />
            </button>
          </div>

        </div>
      </header>

      {/* Fullscreen Interactive Menu Drawer Overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
