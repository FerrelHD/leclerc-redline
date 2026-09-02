import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const paragraphText =
  "Born on the legendary streets of Monte Carlo and forged in the historic halls of Maranello. Driven by raw qualifying speed, calm precision, and an unyielding commitment to bring the World Championship home with Scuderia Ferrari.";

const statsData = [
  { target: 8, pad: true, label: 'Grand Prix Wins' },
  { target: 26, pad: false, label: 'Pole Positions' },
  { target: 43, pad: false, label: 'Podium Finishes' },
  { target: 10, pad: false, label: 'Fastest Laps' },
];

export default function StorytellingScroll() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Navbar Theme Switcher
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => document.body.classList.add('nav-theme-dark'),
        onLeaveBack: () => document.body.classList.remove('nav-theme-dark'),
        onEnterBack: () => document.body.classList.add('nav-theme-dark'),
        onLeave: () => document.body.classList.remove('nav-theme-dark'),
      });

      // 2. Left Sticky Header Reveal
      gsap.fromTo(
        '.about-header-item',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 3. Smooth Stagger Blur-to-Focus on Story Text
      gsap.fromTo(
        '.about-word',
        { opacity: 0, y: 16, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.55,
          stagger: 0.015,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-bio-text',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 4. Secondary Narrative / Quote Reveal
      gsap.fromTo(
        '.about-quote',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-quote',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 5. Clean Editorial Stats Container Reveal
      gsap.fromTo(
        '.about-stat-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-stats-container',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 6. Interactive Count-up Animation for Statistics Numbers
      const statElements = sectionRef.current.querySelectorAll('.stat-count');
      statElements.forEach((el) => {
        const targetVal = parseInt(el.getAttribute('data-target'), 10);
        const pad = el.getAttribute('data-pad') === 'true';
        const counter = { val: 0 };

        gsap.to(counter, {
          val: targetVal,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-stats-container',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            const current = Math.round(counter.val);
            el.textContent = pad && current < 10 ? `0${current}` : `${current}`;
          },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-center bg-[#080809] text-[#F8F9FA] z-20 pt-28 pb-32 md:pt-36 md:pb-44 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-white/[0.04] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.95)]"
    >
      <div className="w-full max-w-7xl mx-auto">

        {/* Responsive Flex Layout: Dijamin Tidak Akan Bertabrakan */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 xl:gap-20">

          {/* ============================================================ */}
          {/* LEFT COLUMN: Dedicated Width, Sticky, Zero-Collision Header */}
          {/* ============================================================ */}
          <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 lg:sticky lg:top-32 lg:self-start">
            <div className="about-header-item space-y-4">

              {/* Profile Tag */}
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                <p className="font-mono-telemetry text-xs tracking-[0.25em] text-[#E10600] uppercase font-bold">
                  ( PROFILE )
                </p>
              </div>

              {/* Title 2 Baris: ABOUT / LECLERC // */}
              <h2 className="font-racing font-extrabold text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-[2.85rem] tracking-tight uppercase text-white leading-[1.05] select-none">
                <span className="block">ABOUT</span>
                <span className="block mt-1">
                  LECLERC <span className="text-[#E10600] tracking-tighter">//</span>
                </span>
              </h2>

              {/* Clean Editorial Meta */}
              <p className="font-mono-telemetry text-xs text-neutral-400 tracking-widest uppercase pt-2">
                #16 • SCUDERIA FERRARI HP
              </p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Large Editorial Narrative & Count-Up Stats     */}
          {/* ============================================================ */}
          <div className="w-full lg:flex-1 lg:max-w-2xl space-y-12 sm:space-y-14">

            {/* 1. Main Bio Paragraph with Blur-to-Focus Reveal */}
            <div className="about-bio-text">
              <p className="font-sans font-light text-xl sm:text-2xl md:text-3xl lg:text-[2rem] text-[#F8F9FA] leading-snug sm:leading-relaxed tracking-tight text-balance">
                {paragraphText.split(' ').map((word, wIdx) => (
                  <span key={wIdx} className="inline-block mr-[0.28em]">
                    <span className="about-word inline-block will-change-transform">
                      {word}
                    </span>
                  </span>
                ))}
              </p>
            </div>

            {/* 2. Authentic Editorial Statement */}
            <div className="about-quote pl-6 border-l border-[#E10600]/80 py-1">
              <p className="text-neutral-400 font-sans text-base sm:text-lg lg:text-xl font-light leading-relaxed">
                &ldquo;Every lap around Monaco is burned into my memory since childhood. Driving for Ferrari is an honor, but the only goal that matters is putting the red car back at the very top.&rdquo;
              </p>
            </div>

            {/* 3. Pure Typography Stats dengan Animasi Count-Up On-Scroll */}
            <div className="about-stats-container pt-8 border-t border-white/[0.08]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                {statsData.map((stat, idx) => (
                  <div key={idx} className="about-stat-item">
                    <span
                      className="stat-count block font-racing font-bold text-4xl sm:text-5xl text-white tracking-tight"
                      data-target={stat.target}
                      data-pad={stat.pad ? 'true' : 'false'}
                    >
                      {stat.pad ? '00' : '0'}
                    </span>
                    <span className="block font-mono-telemetry text-xs text-neutral-400 tracking-wider uppercase mt-2">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
