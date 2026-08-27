import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper component to split text into individual spans for character-by-character animation
function SplitText({ text, className }) {
  return (
    <div className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="gsap-char inline-block transition-colors duration-75"
          style={{ 
            color: 'transparent', 
            WebkitTextStroke: '2px rgba(248, 249, 250, 0.15)' 
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
      // Get all characters
      const chars = gsap.utils.toArray('.gsap-char');

      // Animate color and stroke character by character based on scroll
      gsap.to(chars, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top', 
          end: 'bottom bottom',
          scrub: 0.5, // slightly less scrub delay for snappier color fill
        },
        color: '#E10600',
        webkitTextStrokeColor: 'transparent',
        textShadow: '0 0 25px rgba(225,6,0,0.5)',
        stagger: 0.1, // Stagger ensures sequential left-to-right, line-by-line fill
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-[#0A0A0A] z-40">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-4 md:px-12 overflow-hidden">
        
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E10600]/5 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
          <div className="relative text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-center leading-[1.1] whitespace-nowrap">
            
            {/* Split Text for Sequential Scroll Fill */}
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <SplitText text="BORN IN MONACO." />
              <SplitText text="FORGED IN MARANELLO." />
            </div>

          </div>

          <p className="mt-16 text-[#F8F9FA]/70 max-w-2xl text-center text-xl md:text-2xl font-light tracking-wide leading-relaxed opacity-80">
            A relentless pursuit of perfection. From the narrow streets of the Principality to the iconic <span className="text-[#E10600] font-semibold">Rosso Corsa</span> of Scuderia Ferrari, Charles Leclerc embodies the pure essence of racing speed.
          </p>
        </div>

      </div>
    </section>
  );
}
