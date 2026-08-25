import React, { useRef } from 'react';

export default function AnimatedSignature({ progress = 0, color = "#E10600" }) {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  // Stroke 1: Sharp rising diagonal loop & high apex (Charles signature start)
  const stroke1Progress = Math.min(1, Math.max(0, clampedProgress / 0.4));
  const dash1 = 1200;
  const offset1 = dash1 * (1 - stroke1Progress);

  // Stroke 2: Cursive text loops and middle flourishes
  const stroke2Progress = Math.min(1, Math.max(0, (clampedProgress - 0.25) / 0.45));
  const dash2 = 1400;
  const offset2 = dash2 * (1 - stroke2Progress);

  // Stroke 3: Wide sweeping lower bowl loop and horizontal underline slash
  const stroke3Progress = Math.min(1, Math.max(0, (clampedProgress - 0.5) / 0.5));
  const dash3 = 1000;
  const offset3 = dash3 * (1 - stroke3Progress);

  return (
    <div className="relative w-full h-full pointer-events-none select-none flex items-center justify-center p-6">
      <svg
        viewBox="0 0 700 380"
        className="w-full max-w-[580px] h-auto overflow-visible filter drop-shadow-[0_2px_12px_rgba(225,6,0,0.4)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ========================================================================= */}
        {/* 1. INITIAL RISING STROKE & SHARP APEX LOOP (Charles Leclerc 'C' & 'L' Slant) */}
        {/* ========================================================================= */}
        <path
          d="M 50 280 C 15 295 10 320 35 325 C 75 330 180 260 260 210 C 340 160 480 80 540 40 C 570 20 590 30 560 70 C 510 130 420 180 340 210 C 260 240 160 270 80 290 C 30 305 20 285 55 260 C 120 215 230 170 340 140 C 440 110 520 100 570 120"
          stroke={color}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: dash1,
            strokeDashoffset: offset1,
            transition: 'stroke-dashoffset 0.08s linear',
          }}
        />

        {/* ========================================================================= */}
        {/* 2. CURSIVE LETTER FLOURISHES ("e-c-l-e-r-c" loops in the middle)          */}
        {/* ========================================================================= */}
        <path
          d="M 320 180 C 350 160 380 150 400 160 C 420 170 410 195 380 205 C 345 215 365 185 410 175 C 445 165 470 150 485 130 C 500 110 520 80 545 60 C 555 50 565 60 550 85 C 525 130 480 175 435 205 C 390 235 440 205 490 185 C 530 170 560 175 580 195 C 600 215 570 235 520 240"
          stroke={color}
          strokeWidth="4.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: dash2,
            strokeDashoffset: offset2,
            transition: 'stroke-dashoffset 0.08s linear',
          }}
        />

        {/* ========================================================================= */}
        {/* 3. WIDE LOWER LOOP & SHARP HORIZONTAL UNDERLINE SLASH                      */}
        {/* ========================================================================= */}
        <path
          d="M 520 240 C 450 250 340 265 240 280 C 140 295 90 310 110 330 C 135 350 220 340 310 300 C 400 260 490 220 580 190 C 640 170 670 180 650 205 C 610 240 500 265 380 280 C 260 295 120 315 25 330"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: dash3,
            strokeDashoffset: offset3,
            transition: 'stroke-dashoffset 0.08s linear',
          }}
        />
      </svg>
    </div>
  );
}
