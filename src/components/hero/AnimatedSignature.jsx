import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedSignature({ progress = 1, color = "#FFE500" }) {
  const pathRef1 = useRef(null);
  const pathRef2 = useRef(null);
  const pathRef3 = useRef(null);

  return (
    <div className="relative w-full h-full pointer-events-none select-none flex items-center justify-center">
      <svg
        viewBox="0 0 500 350"
        className="w-full h-full filter drop-shadow-[0_0_15px_rgba(255,229,0,0.8)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Autograph Stroke: "Charles Leclerc" cursive flourish */}
        <path
          ref={pathRef1}
          d="M 120 220 C 100 160, 140 100, 220 80 C 310 60, 360 140, 290 200 C 230 250, 160 260, 110 240 C 70 220, 150 140, 250 120 C 350 100, 420 180, 370 240 C 320 300, 260 270, 280 210 C 300 150, 390 130, 440 160"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1200,
            strokeDashoffset: Math.max(0, 1200 * (1 - progress)),
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />

        {/* Slanted Bold "16" Racing Tag */}
        <path
          ref={pathRef2}
          d="M 230 60 L 250 40 L 250 110 M 270 50 C 290 40, 310 50, 310 70 C 310 90, 280 105, 270 105 L 320 105"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 500,
            strokeDashoffset: Math.max(0, 500 * (1 - Math.max(0, (progress - 0.3) / 0.7))),
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />

        {/* Dynamic Underline Slash */}
        <path
          ref={pathRef3}
          d="M 90 270 Q 260 310 430 250"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: Math.max(0, 400 * (1 - Math.max(0, (progress - 0.5) / 0.5))),
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />
      </svg>
    </div>
  );
}
