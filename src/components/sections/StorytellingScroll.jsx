import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StorytellingScroll() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

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

      // 2. Horizontal Scrub Reveal — headlines fly in tied to scroll position (bidirectional)
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          end:   'top 35%',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(line1Ref.current,
          { x: '-25vw', opacity: 0 },
          { x: '0vw',   opacity: 1, ease: 'none' },
          0
        )
        .fromTo(line2Ref.current,
          { x: '25vw',  opacity: 0 },
          { x: '0vw',   opacity: 1, ease: 'none' },
          0
        );

      // 3. Line-by-Line Red Text Box Wipe Reveal — paragraph (bidirectional)
      const items = gsap.utils.toArray('.story-reveal-item');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 75%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse',
          invalidateOnRefresh: true,
        },
      });

      items.forEach((item, index) => {
        const wipe = item.querySelector('.story-wipe');
        const text = item.querySelector('.story-text');

        gsap.set(wipe, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(text, { opacity: 0 });

        const itemTl = gsap.timeline();
        itemTl
          .to(wipe, { scaleX: 1, duration: 0.35, ease: 'power3.inOut' })
          .set(text, { opacity: 1 })
          .set(wipe, { transformOrigin: 'right center' })
          .to(wipe, { scaleX: 0, duration: 0.35, ease: 'power3.inOut' });

        tl.add(itemTl, index * 0.12);
      });

      const t = setTimeout(() => ScrollTrigger.refresh(), 250);
      return () => clearTimeout(t);
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <section 
      id="story"
      ref={sectionRef}
      className="relative w-full bg-[#0A0A0A] text-white z-30 py-32 md:py-48 px-6 md:px-12 overflow-hidden shadow-2xl flex flex-col items-center justify-center"
    >
      {/* Subtle Background Radial Glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E10600]/10 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />

      <div 
        ref={contentRef}
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center select-none"
      >

        {/* 1. Headlines — Horizontal Scrub Reveal (no box wipe, scrub handles motion) */}
        <div className="flex flex-col items-center gap-2 md:gap-3 text-center overflow-hidden">
          
          <div ref={line1Ref} className="inline-block py-0.5 px-2">
            <span className="font-racing font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-[#E10600] uppercase whitespace-nowrap block">
              BORN IN MONACO.
            </span>
          </div>

          <div ref={line2Ref} className="inline-block py-0.5 px-2">
            <span className="font-racing font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-[#E10600] uppercase whitespace-nowrap block">
              FORGED IN MARANELLO.
            </span>
          </div>

        </div>

        {/* 2. Storytelling Paragraph (Line-by-Line Sequential Red Box Reveal) */}
        <div className="mt-12 md:mt-14 max-w-3xl mx-auto flex flex-col items-center gap-1.5 md:gap-2 text-center text-base sm:text-lg md:text-xl lg:text-2xl font-light tracking-wide leading-relaxed text-neutral-300">
          
          {/* Line 1 */}
          <div className="story-reveal-item relative inline-block overflow-hidden py-0.5 px-1.5">
            <span className="story-text block">
              A relentless pursuit of perfection.
            </span>
            <div className="story-wipe absolute inset-0 bg-[#E10600] z-20 pointer-events-none" />
          </div>

          {/* Line 2 */}
          <div className="story-reveal-item relative inline-block overflow-hidden py-0.5 px-1.5">
            <span className="story-text block">
              From the narrow streets of the Principality
            </span>
            <div className="story-wipe absolute inset-0 bg-[#E10600] z-20 pointer-events-none" />
          </div>

          {/* Line 3 */}
          <div className="story-reveal-item relative inline-block overflow-hidden py-0.5 px-1.5">
            <span className="story-text block">
              to the iconic <span className="font-semibold text-[#E10600]">Rosso Corsa</span> of Scuderia Ferrari,
            </span>
            <div className="story-wipe absolute inset-0 bg-[#E10600] z-20 pointer-events-none" />
          </div>

          {/* Line 4 */}
          <div className="story-reveal-item relative inline-block overflow-hidden py-0.5 px-1.5">
            <span className="story-text block">
              Charles Leclerc embodies the pure essence of racing speed.
            </span>
            <div className="story-wipe absolute inset-0 bg-[#E10600] z-20 pointer-events-none" />
          </div>

        </div>

      </div>
    </section>
  );
}
