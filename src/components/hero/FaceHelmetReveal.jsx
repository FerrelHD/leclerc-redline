import React, { useState, useRef, useEffect } from 'react';
import { driverProfile } from '../../data/charlesData';
import { Volume2, VolumeX, Shield, Radio, Sparkles, ChevronRight } from 'lucide-react';

export default function FaceHelmetReveal() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 }); // percentage
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [revealMode, setRevealMode] = useState('slice'); // 'slice' | 'full'
  const [activeLivery, setActiveLivery] = useState('season'); // 'season' | 'monaco' | 'monza'

  // Smooth mouse move calculation for 3D Tilt & Helmet Slice
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePos({ x, y });

    // Calculate subtle 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 8; // max 8 deg
    const rotateX = -((e.clientY - rect.top - centerY) / centerY) * 8;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Get helmet image based on active livery
  const getHelmetImage = () => {
    switch (activeLivery) {
      case 'monaco':
        return '/images/helmet-monaco.jpg';
      case 'monza':
        return '/images/helmet-monza.jpg';
      default:
        return '/images/charles-helmet-front.jpg';
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 bg-[#080809]">
      {/* Background Topographic / Carbon Contour Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topo" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0,100 C50,20 150,180 200,100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <path d="M0,50 C60,0 140,120 200,50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <path d="M0,150 C40,110 160,190 200,150" fill="none" stroke="rgba(225,6,0,0.08)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      {/* Radial Red Atmosphere Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E10600]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Giant Parallax Watermark Typography */}
      <div className="absolute top-28 left-0 right-0 flex justify-between px-6 md:px-16 pointer-events-none select-none z-0">
        <div className="text-[14vw] font-racing font-extrabold text-white/[0.03] leading-none">
          CHARLES
        </div>
        <div className="text-[14vw] font-racing font-black text-[#E10600]/[0.05] leading-none">
          16
        </div>
      </div>

      {/* Interactive 3D Face-Helmet Rig Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-[90vw] max-w-[560px] aspect-[4/5] cursor-crosshair perspective-[1000px] select-none"
      >
        {/* 3D Motion Inner Wrapper */}
        <div 
          className="relative w-full h-full transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Wireframe Helmet CAD Mesh (Idle Ghost state above head) */}
          <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-[72%] h-[40%] pointer-events-none transition-opacity duration-700 z-20 ${isHovered ? 'opacity-30' : 'opacity-85'}`}>
            <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
              <ellipse cx="100" cy="60" rx="75" ry="48" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M35,60 Q100,10 165,60" stroke="#E10600" strokeWidth="1.5" />
              <path d="M45,75 Q100,35 155,75" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
              <path d="M55,90 Q100,60 145,90" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
              <line x1="100" y1="12" x2="100" y2="108" stroke="#E10600" strokeWidth="1" strokeDasharray="4 2" />
              <circle cx="100" cy="12" r="3" fill="#E10600" />
            </svg>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-mono-telemetry tracking-widest text-[#E10600] uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-ping" />
              BELL HP77 // CAD MESH
            </div>
          </div>

          {/* BASE LAYER: Portrait of Charles Leclerc */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0d0e11]">
            <img 
              src="/images/charles-portrait.jpg" 
              alt="Charles Leclerc Portrait" 
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
            />
            {/* Subtle vignetting */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent to-transparent opacity-80" />
          </div>

          {/* DYNAMIC 3D HELMET OVERLAY (Revealed by cursor coordinate & hover slice) */}
          <div 
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none transition-opacity duration-300 z-10"
            style={{
              opacity: isHovered || revealMode === 'full' ? 1 : 0,
              clipPath: revealMode === 'full' 
                ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                : `polygon(
                    0% 0%, 
                    ${mousePos.x + 18}% 0%, 
                    ${mousePos.x - 12}% ${mousePos.y + 40}%, 
                    0% ${mousePos.y + 35}%
                  )`
            }}
          >
            <img 
              src={getHelmetImage()} 
              alt="Charles Leclerc 3D Helmet" 
              className="w-full h-full object-cover object-center filter drop-shadow-[0_15px_30px_rgba(225,6,0,0.4)]"
            />

            {/* Glowing Laser Cutline along the slice boundary */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FFE500] via-[#E10600] to-transparent shadow-[0_0_12px_#E10600]"
              style={{
                left: `${mousePos.x}%`,
                display: isHovered && revealMode === 'slice' ? 'block' : 'none'
              }}
            />

            {/* Visor Glare sheen reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
          </div>

          {/* Interactive Prompt / Instruction Pill */}
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono-telemetry text-white/90 flex items-center gap-2 transition-all duration-300 ${isHovered ? 'opacity-0 translate-y-2' : 'opacity-100'}`}>
            <Sparkles className="w-3.5 h-3.5 text-[#E10600]" />
            <span>HOVER TO ENGAGE #16 HELMET</span>
          </div>
        </div>
      </div>

      {/* Livery Switcher Quick Controls */}
      <div className="relative z-20 flex items-center gap-2 mt-6 p-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setActiveLivery('season')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium font-racing transition-all ${activeLivery === 'season' ? 'bg-[#E10600] text-white shadow-lg shadow-[#E10600]/40' : 'text-neutral-400 hover:text-white'}`}
        >
          2025 SEASON
        </button>
        <button
          onClick={() => setActiveLivery('monaco')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium font-racing transition-all ${activeLivery === 'monaco' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/40' : 'text-neutral-400 hover:text-white'}`}
        >
          MONACO SPECIAL
        </button>
        <button
          onClick={() => setActiveLivery('monza')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium font-racing transition-all ${activeLivery === 'monza' ? 'bg-[#008C45] text-white shadow-lg shadow-[#008C45]/40' : 'text-neutral-400 hover:text-white'}`}
        >
          MONZA TRICOLORE
        </button>
      </div>

      {/* Telemetry Left HUD Badge (Matches Lando Norris Next Race box) */}
      <div className="absolute bottom-8 left-6 md:left-12 z-20 hidden sm:flex flex-col gap-2 p-3.5 rounded-lg bg-[#101114]/80 backdrop-blur-md border border-white/10 text-left w-48">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-[10px] font-mono-telemetry uppercase text-neutral-400">NEXT EVENT</span>
          <span className="text-[10px] font-mono-telemetry font-bold text-[#E10600] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            LIVE
          </span>
        </div>
        <div>
          <h4 className="text-sm font-racing font-bold text-white tracking-wide">{driverProfile.nextRace.name}</h4>
          <p className="text-[11px] font-mono-telemetry text-neutral-400">{driverProfile.nextRace.circuit}</p>
        </div>
        <div className="flex items-center justify-between pt-1 text-[10px] font-mono-telemetry text-neutral-500">
          <span>DRIVER #16</span>
          <span className="text-[#FFE500] font-bold">POLE KING</span>
        </div>
      </div>

      {/* Picture-in-Picture Mini Preview (Matches Lando Norris bottom-right PIP widget) */}
      <div className="absolute bottom-8 right-6 md:right-12 z-20 hidden sm:flex items-center gap-3 p-2 rounded-lg bg-[#101114]/90 backdrop-blur-md border border-white/15 shadow-xl">
        <div className="w-12 h-12 rounded overflow-hidden relative border border-[#E10600]/40">
          <img src="/images/charles-on-track.jpg" alt="Mini On Track" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#E10600]/20" />
        </div>
        <div className="text-left pr-2">
          <span className="text-[9px] font-mono-telemetry text-neutral-400 uppercase block">LIVE TELEMETRY</span>
          <span className="text-xs font-racing font-bold text-white block">SF-25 SPEED VAULT</span>
        </div>
      </div>
    </div>
  );
}
