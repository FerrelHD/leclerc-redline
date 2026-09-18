import React from 'react';
import { motion } from 'framer-motion';
import { getNextRace } from '../../data/f1Calendar';

export default function MonzaHudCard({ className = "" }) {
  const currentRace = getNextRace();

  return (
    <div className={`relative w-[130px] select-none ${className}`}>
      {/* Top Left Label outside notch */}
      <span className="text-[10px] font-sans font-extrabold tracking-wider text-[#0A0A0B] uppercase block mb-1 pl-1">
        {currentRace.badgeLabel}
      </span>

      {/* Scooped Notch Card Container */}
      <div className="relative w-full bg-[#FFFFFF]/90 backdrop-blur-md p-3 pb-3.5 shadow-md flex flex-col items-center justify-between gap-2.5 rounded-2xl rounded-tr-[32px] border border-[#0A0A0B]/80">
        
        {/* TOP SECTION: Dynamic F1 Circuit Track Map Outline & Name */}
        <div className="w-full flex flex-col items-center pt-1">
          {/* 3D Holographic Orbit Container */}
          <div className="relative w-16 h-7 flex items-center justify-center [perspective:400px]">
            <motion.div
              className="w-full h-full flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ rotateX: 20, rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <svg viewBox={currentRace.viewBox || "0 0 100 55"} className="w-full h-full" fill="none">
                {/* Base Outline: Dynamic Circuit Shape */}
                <path
                  d={currentRace.svgPath}
                  stroke="#0A0A0B"
                  strokeOpacity="0.18"
                  strokeWidth={currentRace.strokeWidth || 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Active Drawing Line: Looping Path Draw & Fade */}
                <motion.path
                  d={currentRace.svgPath}
                  stroke="#0A0A0B"
                  strokeWidth={currentRace.strokeWidth || 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 1, 1],
                    opacity: [0.3, 1, 1, 0],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.68, 0.86, 1],
                  }}
                />
              </svg>
            </motion.div>
          </div>
          <span className="text-[10px] font-sans font-black tracking-tight text-[#0A0A0B] mt-1 uppercase text-center">
            {currentRace.name}
          </span>
        </div>

        {/* Crisp Horizontal Divider Line */}
        <div className="w-full h-[1px] bg-[#0A0A0B]/70" />

        {/* BOTTOM SECTION: Authentic Scuderia Ferrari Helmet & Laurel Emblem */}
        <div className="w-full flex flex-col items-center text-center">
          <div className="relative w-full flex items-center justify-center py-0.5">
            <img
              src="/images/racing helmet laurel emblem.png"
              alt="Scuderia Ferrari Racing Helmet Laurel Emblem"
              className="w-[88px] h-11 object-contain pointer-events-none select-none drop-shadow-sm"
              loading="lazy"
            />
          </div>

          <div className="text-[8px] font-sans font-black tracking-wider text-[#0A0A0B] uppercase leading-tight mt-0.5">
            <div>SCUDERIA FERRARI</div>
            <div className="text-[#0A0A0B]/70 font-bold text-[7.5px]">SINCE 2019</div>
          </div>
        </div>

      </div>
    </div>
  );
}
