import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const AnimatedSignature = forwardRef(({ color = "#E10600" }, ref) => {
  const pathRef = useRef(null);
  const lengthRef = useRef(3000);

  // Measure exact pixel length of the SVG path on mount
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      if (len > 0) {
        lengthRef.current = len;
        pathRef.current.style.strokeDasharray = len;
        pathRef.current.style.strokeDashoffset = len;
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    setProgress: (p) => {
      if (pathRef.current) {
        const clamped = Math.min(1, Math.max(0, p));
        pathRef.current.style.strokeDashoffset = lengthRef.current * (1 - clamped);
      }
    }
  }));

  return (
    <div className="relative w-full h-full pointer-events-none select-none flex items-center justify-center">
      <svg
        viewBox="0 0 950 720"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_4px_20px_rgba(225,6,0,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grand Sweeping Vector Reproduction of the Charles Leclerc Autograph */}
        <path
          ref={pathRef}
          d={`
            M 240 395
            C 205 435 180 472 190 495
            C 202 510 238 485 285 425
            C 335 358 375 295 385 295
            C 392 295 355 372 295 488
            C 240 595 178 685 150 715
            C 145 720 150 715 160 700
            C 220 605 365 405 495 155
            C 508 128 522 135 512 170
            C 490 240 422 398 402 468
            C 392 502 404 515 428 495
            C 455 468 478 405 480 378
            C 482 358 468 362 458 385
            C 448 412 452 450 480 432
            C 512 410 550 350 580 300
            C 590 285 580 305 562 335
            C 535 382 508 430 440 472
            C 420 482 430 478 465 452
            C 518 408 618 295 688 115
            C 702 78 715 68 708 95
            C 700 145 650 270 602 325
            C 588 340 598 332 628 310
            C 675 278 725 265 725 265
            C 695 272 632 295 542 348
            C 452 400 415 430 420 425
            C 430 415 502 358 595 298
            C 675 248 760 180 828 145
            C 852 132 865 142 858 165
            C 852 192 845 230 845 245
          `}
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 3000,
            strokeDashoffset: 3000,
          }}
        />
      </svg>
    </div>
  );
});

export default AnimatedSignature;
