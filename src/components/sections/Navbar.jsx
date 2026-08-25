import React, { useState } from 'react';
import { Volume2, VolumeX, Menu, X, ShoppingBag } from 'lucide-react';
import { driverProfile } from '../../data/charlesData';

export default function Navbar({ isAudioPlaying, toggleAudio }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080809]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Brand Monogram */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-[#E10600] flex items-center justify-center font-racing font-black text-white text-xl shadow-lg shadow-[#E10600]/30 transition-transform group-hover:scale-105">
            16
          </div>
          <div className="flex flex-col">
            <span className="font-racing font-bold text-base tracking-tight text-white group-hover:text-[#E10600] transition-colors uppercase">
              Charles Leclerc
            </span>
            <span className="text-[10px] font-mono-telemetry text-neutral-400 tracking-wider uppercase">
              Scuderia Ferrari HP 🇲🇨
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-racing uppercase tracking-wider text-neutral-300">
          <a href="#hero" className="hover:text-[#E10600] transition-colors">Overview</a>
          <a href="#ontrack-offtrack" className="hover:text-[#E10600] transition-colors">On / Off Track</a>
          <a href="#helmet-vault" className="hover:text-[#E10600] transition-colors">Helmets Vault</a>
          <a href="#sound-of-speed" className="hover:text-[#E10600] transition-colors">Sound Room</a>
          <a href="#milestones" className="hover:text-[#E10600] transition-colors">Milestones</a>
        </nav>

        {/* Right: Sound Toggle & Official Store Button */}
        <div className="flex items-center gap-4">
          {/* Audio Engine Button */}
          <button
            onClick={toggleAudio}
            className="p-2.5 rounded-full bg-white/[0.06] border border-white/10 hover:border-[#E10600] text-neutral-300 hover:text-white transition-all flex items-center gap-2 text-xs font-mono-telemetry"
            title="Toggle Engine & Piano Ambient Sound"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-[#E10600] animate-pulse" />
                <span className="hidden lg:inline text-[11px] text-[#E10600]">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-neutral-400" />
                <span className="hidden lg:inline text-[11px] text-neutral-400">AUDIO OFF</span>
              </>
            )}
          </button>

          {/* Store CTA Button (Inspired by Lando's Neon button, in Ferrari Red) */}
          <a
            href="https://store.ferrari.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E10600] hover:bg-[#ff1a14] text-white font-racing font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E10600]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080809]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 text-sm font-racing uppercase tracking-wider text-neutral-200">
          <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E10600] py-1">Overview</a>
          <a href="#ontrack-offtrack" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E10600] py-1">On / Off Track</a>
          <a href="#helmet-vault" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E10600] py-1">Helmets Vault</a>
          <a href="#sound-of-speed" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E10600] py-1">Sound Room</a>
          <a href="#milestones" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E10600] py-1">Milestones</a>
          <a
            href="https://store.ferrari.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#E10600] text-white font-bold mt-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Official Store</span>
          </a>
        </div>
      )}
    </header>
  );
}
