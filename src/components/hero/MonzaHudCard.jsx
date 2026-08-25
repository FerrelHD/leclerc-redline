import React from 'react';

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
          <svg viewBox="0 0 100 45" className="w-16 h-7" fill="none">
            {/* Authentic Monza Circuit Silhouette */}
            <path
              d="M 15,28 C 12,25 18,18 25,18 C 35,18 42,10 52,10 C 58,10 60,18 68,20 C 78,22 88,26 92,30 C 95,33 90,36 82,36 C 65,36 45,34 30,34 C 20,34 16,30 15,28 Z"
              stroke="#0A0A0B"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[10px] font-sans font-black tracking-tight text-[#0A0A0B] mt-1 uppercase">
            MONZA GP
          </span>
        </div>

        {/* Crisp Horizontal Divider Line */}
        <div className="w-full h-[1px] bg-[#0A0A0B]/70" />

        {/* BOTTOM SECTION: Detailed Helmet + Laurel Wreath Leaf Branches */}
        <div className="w-full flex flex-col items-center text-center">
          <div className="relative w-full flex items-center justify-center">
            <svg viewBox="0 0 90 48" className="w-20 h-10" fill="none">
              {/* Left Laurel Wreath Branch with Leaves */}
              <g stroke="#0A0A0B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 18,36 C 12,28 12,16 22,8" strokeWidth="1.4" />
                <path d="M 14,30 C 8,28 8,24 13,22" />
                <path d="M 15,22 C 10,20 10,16 16,14" />
                <path d="M 17,15 C 13,12 14,8 19,8" />
                <path d="M 21,9 C 18,6 20,2 25,3" />
                <path d="M 18,34 C 18,38 22,40 24,36" />
                <path d="M 16,26 C 18,28 22,29 20,25" />
                <path d="M 18,18 C 20,20 23,20 22,17" />
              </g>

              {/* Right Laurel Wreath Branch with Leaves */}
              <g stroke="#0A0A0B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 72,36 C 78,28 78,16 68,8" strokeWidth="1.4" />
                <path d="M 76,30 C 82,28 82,24 77,22" />
                <path d="M 75,22 C 80,20 80,16 74,14" />
                <path d="M 73,15 C 77,12 76,8 71,8" />
                <path d="M 69,9 C 72,6 70,2 65,3" />
                <path d="M 72,34 C 72,38 68,40 66,36" />
                <path d="M 74,26 C 72,28 68,29 70,25" />
                <path d="M 72,18 C 70,20 67,20 68,17" />
              </g>

              {/* Center Detailed CAD Wireframe Grid Helmet */}
              <g stroke="#0A0A0B" strokeWidth="1.1" fill="none">
                {/* Outer Helmet Dome */}
                <ellipse cx="45" cy="22" rx="14" ry="15" />
                {/* Horizontal Shell Ribs */}
                <path d="M 33,18 Q 45,14 57,18" />
                <path d="M 32,24 Q 45,20 58,24" />
                <path d="M 34,29 Q 45,26 56,29" />
                {/* Vertical Shell Ribs */}
                <path d="M 39,9 Q 40,22 38,34" strokeWidth="0.8" />
                <path d="M 45,7 L 45,36" strokeWidth="0.9" />
                <path d="M 51,9 Q 50,22 52,34" strokeWidth="0.8" />
                {/* Visor Area Cutout */}
                <rect x="35" y="19" width="20" height="7" rx="2" fill="#0A0A0B" />
                <line x1="37" y1="22.5" x2="53" y2="22.5" stroke="#FFFFFF" strokeWidth="0.9" />
              </g>
            </svg>
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
