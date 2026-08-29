import React from 'react';
import { motion } from 'framer-motion';

export default function MonzaHudCard({ className = "" }) {
  return (
    <div className={`relative w-[130px] select-none ${className}`}>
      {/* Top Left Label outside notch */}
      <span className="text-[10px] font-sans font-extrabold tracking-wider text-[#0A0A0B] uppercase block mb-1 pl-1">
        NEXT RACE
      </span>

      {/* Scooped Notch Card Container */}
      <div className="relative w-full bg-[#FFFFFF]/90 backdrop-blur-md p-3 pb-3.5 shadow-md flex flex-col items-center justify-between gap-2.5 rounded-2xl rounded-tr-[32px] border border-[#0A0A0B]/80">
        
        {/* TOP SECTION: Monza GP Track Map Outline & Name */}
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
              <svg viewBox="0 0 100 55" className="w-full h-full" fill="none">
                {/* Base Outline: Authentic Monza Circuit Shape */}
                <path
                  d="M 90.3,51.2 L 87.5,51.5 L 84.6,51.5 L 81.8,51.5 L 79.0,51.5 L 76.1,51.3 L 73.3,51.0 L 70.4,50.8 L 67.6,50.5 L 64.8,50.3 L 61.9,50.0 L 59.1,49.8 L 56.2,49.6 L 53.4,49.3 L 50.5,49.1 L 47.7,48.9 L 44.9,48.8 L 42.0,48.5 L 39.2,48.3 L 36.3,47.4 L 33.5,46.7 L 32.1,47.0 L 30.7,47.3 L 29.2,47.5 L 27.8,47.5 L 26.4,47.4 L 25.0,47.4 L 17.8,46.2 L 14.1,43.7 L 11.9,41.3 L 10.5,38.8 L 9.8,36.3 L 9.4,33.8 L 9.2,31.3 L 8.9,28.8 L 8.7,26.3 L 8.5,23.8 L 8.4,22.2 L 8.4,20.9 L 7.5,19.7 L 6.8,18.4 L 6.1,17.2 L 5.7,15.9 L 5.3,14.7 L 4.5,12.6 L 3.7,10.6 L 3.2,8.5 L 3.0,6.4 L 4.1,5.2 L 6.5,4.0 L 8.9,3.8 L 11.2,3.7 L 13.6,3.6 L 16.0,3.5 L 18.3,5.7 L 19.3,7.9 L 22.1,11.7 L 25.0,15.9 L 27.8,19.3 L 30.7,22.0 L 33.5,24.9 L 36.3,27.9 L 39.2,30.7 L 42.0,33.7 L 43.4,35.0 L 44.9,36.1 L 46.3,36.1 L 47.7,36.1 L 49.1,36.4 L 50.5,37.4 L 51.5,38.3 L 54.8,39.1 L 58.1,39.4 L 61.4,39.7 L 64.8,40.0 L 68.1,40.3 L 71.4,40.6 L 74.7,41.0 L 78.0,41.3 L 81.3,41.5 L 84.6,41.9 L 88.0,42.2 L 91.3,42.5 L 93.4,42.5 L 96.3,44.2 L 97.0,45.8 L 96.5,47.5 L 95.0,49.1 L 92.5,50.8 Z"
                  stroke="#0A0A0B"
                  strokeOpacity="0.18"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Active Drawing Line: Looping Path Draw & Fade */}
                <motion.path
                  d="M 90.3,51.2 L 87.5,51.5 L 84.6,51.5 L 81.8,51.5 L 79.0,51.5 L 76.1,51.3 L 73.3,51.0 L 70.4,50.8 L 67.6,50.5 L 64.8,50.3 L 61.9,50.0 L 59.1,49.8 L 56.2,49.6 L 53.4,49.3 L 50.5,49.1 L 47.7,48.9 L 44.9,48.8 L 42.0,48.5 L 39.2,48.3 L 36.3,47.4 L 33.5,46.7 L 32.1,47.0 L 30.7,47.3 L 29.2,47.5 L 27.8,47.5 L 26.4,47.4 L 25.0,47.4 L 17.8,46.2 L 14.1,43.7 L 11.9,41.3 L 10.5,38.8 L 9.8,36.3 L 9.4,33.8 L 9.2,31.3 L 8.9,28.8 L 8.7,26.3 L 8.5,23.8 L 8.4,22.2 L 8.4,20.9 L 7.5,19.7 L 6.8,18.4 L 6.1,17.2 L 5.7,15.9 L 5.3,14.7 L 4.5,12.6 L 3.7,10.6 L 3.2,8.5 L 3.0,6.4 L 4.1,5.2 L 6.5,4.0 L 8.9,3.8 L 11.2,3.7 L 13.6,3.6 L 16.0,3.5 L 18.3,5.7 L 19.3,7.9 L 22.1,11.7 L 25.0,15.9 L 27.8,19.3 L 30.7,22.0 L 33.5,24.9 L 36.3,27.9 L 39.2,30.7 L 42.0,33.7 L 43.4,35.0 L 44.9,36.1 L 46.3,36.1 L 47.7,36.1 L 49.1,36.4 L 50.5,37.4 L 51.5,38.3 L 54.8,39.1 L 58.1,39.4 L 61.4,39.7 L 64.8,40.0 L 68.1,40.3 L 71.4,40.6 L 74.7,41.0 L 78.0,41.3 L 81.3,41.5 L 84.6,41.9 L 88.0,42.2 L 91.3,42.5 L 93.4,42.5 L 96.3,44.2 L 97.0,45.8 L 96.5,47.5 L 95.0,49.1 L 92.5,50.8 Z"
                  stroke="#0A0A0B"
                  strokeWidth="1.8"
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
          <span className="text-[10px] font-sans font-black tracking-tight text-[#0A0A0B] mt-1 uppercase">
            MONZA GP
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
