import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import KineticText from '../ui/KineticText';

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
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 sm:gap-12 lg:gap-16 xl:gap-20 select-none px-4 sm:px-8 md:px-12"
      >
        {/* Kolom Kiri: Headlines & Identity (50%) */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 font-mono-telemetry text-xs tracking-[0.3em] uppercase text-[#E10600]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            <span>01 // DRIVER MANIFESTO</span>
          </div>

          <div className="flex flex-col gap-1 sm:gap-2">
            <KineticText
              text="BORN IN MONACO."
              className="font-racing font-black text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.5rem] tracking-tighter text-[#E10600] uppercase leading-[0.95]"
              stagger={0.025}
            />
            <KineticText
              text="FORGED IN MARANELLO."
              className="font-racing font-black text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.5rem] tracking-tighter text-white uppercase leading-[0.95]"
              delay={0.15}
              stagger={0.025}
            />
          </div>

          <div className="mt-5 sm:mt-6 flex items-center gap-3 text-[11px] font-mono-telemetry text-neutral-500 uppercase tracking-widest">
            <span>SCUDERIA FERRARI HP</span>
            <span>•</span>
            <span>#16 CAR NUMBER</span>
          </div>
        </div>

        {/* Kolom Kanan: Manifesto Narrative & Signature (50%) */}
        <div className="w-full lg:w-1/2 flex flex-col items-start border-l-2 border-[#E10600]/50 pl-5 sm:pl-8 lg:pl-10">
          <div className="flex flex-col gap-2.5 sm:gap-3 text-left text-sm sm:text-base md:text-lg lg:text-[1.05rem] xl:text-[1.15rem] font-light tracking-wide leading-relaxed text-neutral-300">
            {/* Line 1 */}
            <div className="story-reveal-item relative inline-block overflow-hidden py-0.5">
              <span className="story-text block">
                A relentless pursuit of perfection.
              </span>
              <div className="story-wipe absolute inset-0 bg-[#E10600] z-20 pointer-events-none" />
            </div>

            {/* Line 2 */}
            <div className="story-reveal-item relative inline-block overflow-hidden py-0.5">
              <span className="story-text block">
                From the narrow streets of the Principality
              </span>
              <div className="story-wipe absolute inset-0 bg-[#E10600] z-20 pointer-events-none" />
            </div>

            {/* Line 3 */}
            <div className="story-reveal-item relative inline-block overflow-hidden py-0.5">
              <span className="story-text block">
                to the iconic <span className="font-semibold text-[#E10600]">Rosso Corsa</span> of Scuderia Ferrari,
              </span>
              <div className="story-wipe absolute inset-0 bg-[#E10600] z-20 pointer-events-none" />
            </div>

            {/* Line 4 */}
            <div className="story-reveal-item relative inline-block overflow-hidden py-0.5">
              <span className="story-text block">
                Charles Leclerc embodies the pure essence of racing speed.
              </span>
              <div className="story-wipe absolute inset-0 bg-[#E10600] z-20 pointer-events-none" />
            </div>
          </div>

          {/* Signature & Location Tag */}
          <div className="mt-6 sm:mt-8 flex flex-col gap-1 border-t border-white/10 pt-4 w-full">
            <span className="font-editorial italic font-bold text-lg text-white">
              Charles Leclerc
            </span>
            <span className="font-mono-telemetry text-[10px] text-neutral-500 tracking-widest uppercase">
              MONTE CARLO 🇲🇨 // SF-24 COCKPIT
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
