import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const paragraphText =
  "Born on the legendary streets of Monte Carlo and forged in the historic halls of Maranello. Driven by raw qualifying speed, calm precision, and an unyielding commitment to bring the World Championship home with Scuderia Ferrari.";

export default function StorytellingScroll() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Navbar Theme Switcher
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter:     () => document.body.classList.add('nav-theme-dark'),
        onLeaveBack: () => document.body.classList.remove('nav-theme-dark'),
        onEnterBack: () => document.body.classList.add('nav-theme-dark'),
        onLeave:     () => document.body.classList.remove('nav-theme-dark'),
      });

      // 2. Headline Reveal (Staggered upward reveal)
      gsap.fromTo(
        '.about-title-item',
        { yPercent: 110, opacity: 0, rotateZ: 2 },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 3. Tag Reveal
      gsap.fromTo(
        '.about-tag',
        { opacity: 0, x: -25 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: 0.25,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 4. Description Paragraph Words Staggered Reveal
      gsap.fromTo(
        '.about-word',
        { opacity: 0, y: 18, filter: 'blur(3px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.5,
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 5. Telemetry Footer Reveal
      gsap.fromTo(
        '.about-meta',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="story"
      ref={sectionRef}
      className="relative w-full bg-[#080809] text-[#F8F9FA] z-30 pt-28 pb-32 md:pt-36 md:pb-44 px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden border-t border-white/[0.04]"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        
        {/* Big Heading 1 (persis WHAT I DO / dengan mask slide-up) */}
        <h2 className="font-racing font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-tight uppercase text-white leading-none select-none flex flex-wrap gap-x-4 sm:gap-x-6 overflow-hidden py-2">
          <span className="inline-block overflow-hidden">
            <span className="about-title-item inline-block will-change-transform">ABOUT</span>
          </span>
          <span className="inline-block overflow-hidden">
            <span className="about-title-item inline-block will-change-transform">LECLERC</span>
          </span>
          <span className="inline-block overflow-hidden">
            <span className="about-title-item inline-block will-change-transform text-[#E10600]">/</span>
          </span>
        </h2>

        {/* 12-Column Editorial Grid (1:1 dengan portfolio Services.vue layout) */}
        <div className="mt-12 sm:mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-y-6 md:gap-x-8 items-start">
          
          {/* Middle Column: ( PROFILE ) label */}
          <div className="md:col-span-4 md:col-start-1 lg:col-span-3">
            <p className="about-tag font-mono-telemetry text-xs sm:text-sm tracking-[0.25em] text-[#E10600] uppercase font-bold will-change-transform">
              ( PROFILE )
            </p>
          </div>

          {/* Right Column: Clean Editorial Narrative with Word-by-Word Motion */}
          <div className="md:col-span-8 lg:col-span-7">
            <p className="font-sans font-light text-xl sm:text-2xl md:text-3xl lg:text-[2rem] text-[#F8F9FA]/90 leading-snug md:leading-relaxed tracking-tight text-balance">
              {paragraphText.split(' ').map((word, wIdx) => (
                <span key={wIdx} className="inline-block mr-[0.28em] overflow-hidden">
                  <span className="about-word inline-block will-change-transform">
                    {word}
                  </span>
                </span>
              ))}
            </p>

            {/* Meta tags */}
            <div className="about-meta mt-8 sm:mt-10 flex items-center gap-4 text-xs sm:text-sm font-mono-telemetry text-neutral-500 uppercase tracking-widest will-change-transform">
              <span className="text-[#E10600] font-bold">#16</span>
              <span>•</span>
              <span>SCUDERIA FERRARI HP</span>
              <span>•</span>
              <span>MONTE CARLO, MONACO</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
