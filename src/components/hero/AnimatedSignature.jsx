import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedSignature({ progress = 0, color = "#E10600" }) {
  const pathRef = useRef(null);
  const [totalLength, setTotalLength] = useState(3000);

  // Measure exact pixel length of the SVG path on mount
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      if (len > 0) {
        setTotalLength(len);
      }
    }
  }, []);

  const clampedProgress = Math.min(1, Math.max(0, progress));
  // Exact stroke dash offset calculation for continuous pen drawing
  const currentOffset = totalLength * (1 - clampedProgress);

  return (
    <div className="relative w-full h-full pointer-events-none select-none flex items-center justify-center">
      <svg
        viewBox="0 0 850 450"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_4px_16px_rgba(225,6,0,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Continuous Single-Stroke Handwritten Signature of Charles Leclerc */}
        <path
          ref={pathRef}
          d={`
            M 60 320
            C 20 340 10 370 40 375
            C 90 380 200 300 290 240
            C 380 180 540 80 620 35
            C 655 15 675 30 640 75
            C 580 145 480 205 380 240
            C 280 275 160 310 70 335
            C 15 350 5 325 50 295
            C 120 245 250 195 380 160
            C 490 130 580 120 640 145
            C 670 160 660 185 630 200
            C 590 220 540 230 490 235
            C 420 245 370 230 385 200
            C 400 170 450 180 470 210
            C 485 235 450 260 410 270
            C 370 280 340 260 360 230
            C 380 200 430 190 460 215
            C 480 235 460 265 420 280
            C 370 300 320 290 310 260
            C 300 230 350 210 400 225
            C 450 240 430 280 380 300
            C 310 330 210 345 120 360
            C 50 375 30 395 70 400
            C 130 405 240 385 360 345
            C 480 305 600 255 720 215
            C 790 190 830 205 805 235
            C 755 285 620 320 470 340
            C 320 360 160 385 30 405
          `}
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: totalLength,
            strokeDashoffset: currentOffset,
          }}
        />
      </svg>
    </div>
  );
}
