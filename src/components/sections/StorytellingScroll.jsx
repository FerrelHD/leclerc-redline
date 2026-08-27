import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper to split text into sequential word/char spans for lyric-style progressive reveal
function LyricLine({ text, lineIndex, className }) {
  return (
    <div className={`lyric-line-${lineIndex} ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`lyric-char-${lineIndex} inline-block transition-colors duration-75`}
          style={{ 
            color: 'transparent',
            WebkitTextStroke: '2px rgba(248, 249, 250, 0.18)',
            textShadow: 'none',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

export default function StorytellingScroll() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const line1Chars = gsap.utils.toArray('.lyric-char-1');
      const line2Chars = gsap.utils.toArray('.lyric-char-2');

      // Sequential Lyric Timeline: Line 1 -> Line 2
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top', 
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 1. Line 1 Progressive Lyric Fill
      tl.fromTo(line1Chars, 
        {
          color: 'transparent',
          webkitTextStrokeColor: 'rgba(248, 249, 250, 0.18)',
          textShadow: 'none',
        },
        {
          color: '#E10600',
          webkitTextStrokeColor: 'transparent',
          textShadow: '0 0 35px rgba(225,6,0,0.85), 0 0 12px rgba(225,6,0,0.5)',
          stagger: 0.04,
          ease: 'none',
        }
      );

      // 2. Line 2 Progressive Lyric Fill (starts sequentially after Line 1)
      tl.fromTo(line2Chars, 
        {
          color: 'transparent',
          webkitTextStrokeColor: 'rgba(248, 249, 250, 0.18)',
          textShadow: 'none',
        },
        {
          color: '#E10600',
          webkitTextStrokeColor: 'transparent',
          textShadow: '0 0 35px rgba(225,6,0,0.85), 0 0 12px rgba(225,6,0,0.5)',
          stagger: 0.04,
          ease: 'none',
        }, 
        '+=0.02'
      );

      // Small holding rest so full text is visible before section scrolls off
      tl.to({}, { duration: 0.08 });

      // Dedicated ScrollTrigger for Navbar Theme Toggle
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => document.body.classList.add('nav-theme-dark'),
        onLeave: () => document.body.classList.remove('nav-theme-dark'),
        onEnterBack: () => document.body.classList.add('nav-theme-dark'),
        onLeaveBack: () => document.body.classList.remove('nav-theme-dark'),
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[200vh] w-full bg-[#0A0A0A] text-white z-30 shadow-2xl"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-4 md:px-12 overflow-hidden">
        
        {/* Subtle Background Radial Glow */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E10600]/10 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center select-none">
          
          {/* Editorial Sub-badge */}
          <div className="flex items-center gap-3 mb-8 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
            <span className="font-mono-telemetry text-xs tracking-[0.3em] uppercase text-neutral-400 font-bold">
              THE DRIVER'S CREED
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
          </div>

          {/* Lyric-Style Headlines */}
          <div className="relative text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-center leading-[1.1] whitespace-nowrap">
            <div className="flex flex-col items-center gap-2 md:gap-3">
              <LyricLine text="BORN IN MONACO." lineIndex={1} />
              <LyricLine text="FORGED IN MARANELLO." lineIndex={2} />
            </div>
          </div>

          {/* Static Storytelling Paragraph */}
          <p className="mt-14 max-w-2xl text-center text-xl md:text-2xl font-light tracking-wide leading-relaxed text-neutral-300">
            A relentless pursuit of perfection. From the narrow streets of the Principality to the iconic{' '}
            <span className="font-semibold text-[#E10600]">Rosso Corsa</span> of Scuderia Ferrari, Charles Leclerc embodies the pure essence of racing speed.
          </p>

        </div>

      </div>
    </section>
  );
}
