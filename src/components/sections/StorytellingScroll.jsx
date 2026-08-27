import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StorytellingScroll() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // 1. Navbar Theme Switcher
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter:     () => document.body.classList.add('nav-theme-dark'),
        onLeaveBack: () => document.body.classList.remove('nav-theme-dark'),
      });

      // 2. Horizontal Scrub Reveal — headlines fly in tied to scroll position
      //    Line 1: slides in from LEFT  (x: -25vw → 0)
      //    Line 2: slides in from RIGHT (x: +25vw → 0)
      //    Both lines start slightly transparent and become fully visible
      gsap.set([line1Ref.current, line2Ref.current], { opacity: 0 });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end:   'top 30%',
          scrub: 1.2,          // tied directly to scroll, 1.2s lag for smoothness
        },
      })
        .fromTo(line1Ref.current,
          { x: '-28vw', opacity: 0 },
          { x: '0vw',   opacity: 1, ease: 'none' },
          0
        )
        .fromTo(line2Ref.current,
          { x: '28vw',  opacity: 0 },
          { x: '0vw',   opacity: 1, ease: 'none' },
          0
        );

      // 3. Line-by-Line Red Text Box Wipe Reveal — paragraph
      const items = gsap.utils.toArray('.story-reveal-item');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 75%',
          toggleActions: 'restart none none reset',
        },
      });

      items.forEach((item, index) => {
        const wipe = item.querySelector('.story-wipe');
        const text = item.querySelector('.story-text');

        gsap.set(wipe, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(text, { opacity: 0 });

        const itemTl = gsap.timeline();
        itemTl
          .to(wipe, { scaleX: 1, duration: 0.38, ease: 'power3.inOut' })
          .set(text, { opacity: 1 })
          .set(wipe, { transformOrigin: 'right center' })
          .to(wipe, { scaleX: 0, duration: 0.38, ease: 'power3.inOut' });

        tl.add(itemTl, index * 0.13);
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

    }, sectionRef);
    return () => ctx.revert();
  }, []);


  return (
    <section 
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
