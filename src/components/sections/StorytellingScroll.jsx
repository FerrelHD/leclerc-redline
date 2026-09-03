import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

      // 2. Cutout Frame Entrance (Animates wrapper without altering SVG coordinate geometry)
      gsap.fromTo(
        '.story-frame',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.story-frame',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 3. Header Telemetry Badges Stagger Drop
      gsap.fromTo(
        '.story-badge',
        { opacity: 0, y: -12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.story-frame',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 4. Stats Container Stagger + Numbers Count-Up Animation
      gsap.fromTo(
        '.story-stat-item',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.story-stats-container',
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );

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
            trigger: '.story-stats-container',
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            const current = Math.round(counter.val);
            el.textContent = pad && current < 10 ? `0${current}` : `${current}`;
          },
        });
      });

      // 5. Masked Kinetic Headline Reveal (Lines Slide Up from Mask)
      gsap.fromTo(
        '.story-headline-line',
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.14,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.story-headline-wrap',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 6. Narrative Paragraphs Blur-to-Focus Fade
      gsap.fromTo(
        '.story-para',
        { opacity: 0, y: 20, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          stagger: 0.18,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.story-narrative-block',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 7. Driver Quote Trace Down & Fade In
      const quoteTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.story-quote-box',
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });

      quoteTl
        .fromTo(
          '.story-quote-bar',
          { scaleY: 0, transformOrigin: 'top' },
          { scaleY: 1, duration: 0.65, ease: 'power2.out' }
        )
        .fromTo(
          '.story-quote-text',
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.3'
        );

      // 8. Right Identity Card Slide & CTA Glow Pop
      const driverTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.story-driver-card',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      driverTl
        .fromTo(
          '.story-driver-item',
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        )
        .fromTo(
          '.story-cta-btn',
          { opacity: 0, scale: 0.94, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' },
          '-=0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-center bg-[#080809] text-[#F8F9FA] z-20 scroll-mt-20 pt-24 pb-20 sm:pt-28 sm:pb-24 md:pt-36 md:pb-32 px-4 sm:px-6 md:px-10 lg:px-16 border-t border-white/[0.04] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.95)]"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* ============================================================ */}
        {/* TOP COMPONENT: CUTOUT FRAME WITH INTEGRATED BADGES & STATS   */}
        {/* ============================================================ */}
        <div className="relative">
          {/* Header Bar (Overlaid on Top Notch of Cutout Frame) */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 w-[94%] sm:w-[90%] md:w-[86%] absolute lg:top-4 md:top-2.5 sm:top-2 top-1.5 left-2 sm:left-4 z-10">
            <div className="story-badge flex items-center gap-2">
              <span className="text-[#E10600] animate-spin font-bold text-sm sm:text-base">✱</span>
              <span className="font-mono-telemetry text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.2em] text-neutral-200 uppercase">
                WHO HE IS
              </span>
            </div>

            {/* Right Telemetry Badge (Replaces Social Icons) */}
            <div className="story-badge flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
              <span className="font-mono-telemetry text-[9px] sm:text-[11px] md:text-xs tracking-wider text-neutral-300 uppercase font-semibold">
                #16 • SCUDERIA FERRARI
              </span>
            </div>
          </div>

          {/* Cutout Shape Viewport with /images/f1.png */}
          <figure className="story-frame relative group rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.08] bg-black/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <svg
              className="w-full h-auto block"
              width="100%"
              height="100%"
              viewBox="0 0 100 40"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <clipPath
                  id="clip-inverted"
                  clipPathUnits="objectBoundingBox"
                >
                  <path
                    d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z"
                    fill="#D9D9D9"
                  />
                </clipPath>
              </defs>
              <image
                clipPath="url(#clip-inverted)"
                preserveAspectRatio="xMidYMid slice"
                width="100%"
                height="100%"
                href="/images/f1.png"
                xlinkHref="/images/f1.png"
              />
            </svg>
          </figure>

          {/* Quick Stats Overlay & Under-Frame Highlights */}
          <div className="story-stats-container flex flex-col sm:flex-row sm:items-center justify-between py-4 text-sm gap-3">
            {/* Left Stats */}
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              <div className="story-stat-item flex items-center gap-2 text-xs sm:text-sm">
                <span
                  className="stat-count text-[#E10600] font-racing font-bold text-base sm:text-xl md:text-2xl"
                  data-target="8"
                  data-pad="true"
                >
                  08
                </span>
                <span className="text-neutral-400 font-mono-telemetry uppercase text-[11px] sm:text-xs">
                  Grand Prix Wins
                </span>
                <span className="text-neutral-700 ml-1">/</span>
              </div>
              <div className="story-stat-item flex items-center gap-2 text-xs sm:text-sm">
                <span
                  className="stat-count text-[#E10600] font-racing font-bold text-base sm:text-xl md:text-2xl"
                  data-target="26"
                  data-pad="false"
                >
                  26
                </span>
                <span className="text-neutral-400 font-mono-telemetry uppercase text-[11px] sm:text-xs">
                  Pole Positions
                </span>
              </div>
            </div>

            {/* Right Callouts: On lg screens floats gracefully near notch, on mobile aligns cleanly */}
            <div className="lg:absolute right-3 bottom-12 sm:bottom-14 md:bottom-16 flex items-center lg:items-end justify-between sm:justify-start lg:flex-col gap-3 sm:gap-4 lg:gap-0 text-left lg:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
              <div className="story-stat-item flex items-baseline lg:justify-end gap-1.5 sm:gap-2 mb-0.5">
                <span
                  className="stat-count text-[#E10600] font-racing font-bold text-xl sm:text-2xl lg:text-3xl"
                  data-target="43"
                  data-pad="false"
                >
                  43
                </span>
                <span className="text-white font-racing uppercase tracking-tight text-base sm:text-lg lg:text-xl">
                  PODIUMS
                </span>
              </div>
              <div className="story-stat-item flex items-center lg:justify-end gap-1.5 text-xs text-neutral-400 font-mono-telemetry">
                <span
                  className="stat-count text-white font-bold"
                  data-target="10"
                  data-pad="false"
                >
                  10
                </span>
                <span className="text-neutral-400 uppercase text-[11px] sm:text-xs">
                  Fastest Laps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MAIN EDITORIAL CONTENT: 3-COLUMN RESPONSIVE LAYOUT           */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-8 sm:mt-12 md:mt-16 items-start">
          {/* Left Columns (Col 1 & 2): Symmetrical 2-Line Headline & Storytelling */}
          <div className="md:col-span-2 space-y-6">
            {/* Masked Kinetic Headline Reveal */}
            <div className="story-headline-wrap">
              <h2 className="font-racing font-extrabold uppercase text-white tracking-tight leading-[1.18] text-[clamp(1.02rem,4.2vw,2.6rem)]">
                <span className="block overflow-hidden py-0.5">
                  <span className="story-headline-line block will-change-transform">
                    BORN IN MONTE CARLO.
                  </span>
                </span>
                <span className="block overflow-hidden py-0.5">
                  <span className="story-headline-line block text-[#E10600] will-change-transform">
                    FORGED IN MARANELLO.
                  </span>
                </span>
              </h2>
            </div>

            {/* Soft Focus Flowing Narrative Story */}
            <div className="story-narrative-block space-y-4 text-neutral-300 font-sans text-sm sm:text-base font-light leading-relaxed">
              <p className="story-para text-justify sm:text-left">
                Born on the legendary streets of Monte Carlo, Charles Leclerc was destined for motorsport greatness. From karting on the French Riviera under the guidance of Jules Bianchi to dominant championship runs in GP3 and Formula 2, his trajectory has been forged through blistering qualifying speed and fierce mental resilience.
              </p>
              <p className="story-para text-justify sm:text-left text-neutral-400">
                Now spearheading Scuderia Ferrari in Car #16, Leclerc carries the hopes of millions of Tifosi across the globe. Blending surgical single-lap precision with relentless wheel-to-wheel racecraft, every lap is driven on the absolute limit of physics—guided by one unwavering mission: bringing the World Championship home to Maranello.
              </p>
            </div>

            {/* Driver Authentic Quote with Red Line Trace Animation */}
            <div className="story-quote-box relative pl-4 py-1.5 mt-6 bg-white/[0.01] rounded-r-lg overflow-hidden">
              <div className="story-quote-bar absolute left-0 top-0 bottom-0 w-0.5 bg-[#E10600]" />
              <p className="story-quote-text text-neutral-300 font-sans italic text-xs sm:text-sm md:text-base font-light leading-relaxed">
                &ldquo;Every lap around Monaco is burned into my memory since childhood. Driving for Ferrari is an honor, but the only goal that matters is putting the red car back at the very top.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column (Col 3): Leclerc Identity & Racing CTA */}
          <div className="story-driver-card md:col-span-1 flex flex-col justify-between md:text-right border-t md:border-t-0 md:border-l border-white/[0.08] pt-6 md:pt-0 md:pl-8">
            <div>
              <div className="story-driver-item text-[#E10600] font-racing text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1">
                CHARLES LECLERC
              </div>
              <div className="story-driver-item text-neutral-400 font-mono-telemetry text-xs tracking-wider uppercase mb-5 sm:mb-6">
                Scuderia Ferrari HP • Driver #16
              </div>

              <p className="story-driver-item text-neutral-300 text-xs sm:text-sm font-light leading-relaxed mb-6 sm:mb-8">
                Operating beyond the mathematical boundaries of grip. Dedicated to raw qualifying speed, precision telemetry, and Tifosi pride.
              </p>
            </div>

            <a
              href="#podium"
              className="story-cta-btn inline-flex items-center justify-center md:justify-end gap-2.5 px-6 py-3.5 rounded-lg bg-[#E10600] hover:bg-[#c00500] text-white font-racing text-xs tracking-wider uppercase font-bold transition-all duration-300 shadow-[0_0_25px_rgba(225,6,0,0.35)] hover:shadow-[0_0_35px_rgba(225,6,0,0.55)] group w-full sm:w-auto md:ml-auto cursor-pointer"
            >
              <span>EXPLORE VICTORIES</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
