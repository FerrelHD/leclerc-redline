import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextBoxReveal from '../ui/TextBoxReveal';

gsap.registerPlugin(ScrollTrigger);

export default function PodiumGallery() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const getScrollDistance = () => {
        if (!trackRef.current) return 0;
        return Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
      };

      const setSectionHeight = () => {
        if (!sectionRef.current || !trackRef.current) return;
        const dist = getScrollDistance();
        if (dist > 0) {
          sectionRef.current.style.height = `${dist + window.innerHeight}px`;
        }
      };

      // Set initial height
      setSectionHeight();

      // Ensure PodiumGallery height updates BEFORE any ScrollTrigger calculates positions
      ScrollTrigger.addEventListener('refreshInit', setSectionHeight);

      // CSS Sticky Parallax: 100% immune to GSAP pin boundary bouncing
      gsap.to(trackRef.current, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          onEnter: () => {
            gsap.to('body', { backgroundColor: '#F8F9FA', color: '#0A0A0B', duration: 0.4 });
            document.body.classList.remove('nav-theme-dark');
          },
          onLeave: () => {
            gsap.to('body', { backgroundColor: '#F8F9FA', color: '#0A0A0B', duration: 0.4 });
            document.body.classList.remove('nav-theme-dark');
          },
          onEnterBack: () => {
            gsap.to('body', { backgroundColor: '#F8F9FA', color: '#0A0A0B', duration: 0.4 });
            document.body.classList.remove('nav-theme-dark');
          },
          onLeaveBack: () => {
            gsap.to('body', { backgroundColor: '#0A0A0A', color: '#FFFFFF', duration: 0.4 });
            document.body.classList.add('nav-theme-dark');
          },
        },
      });

      // Recalculate on image loads inside track
      if (trackRef.current) {
        const images = trackRef.current.querySelectorAll('img');
        images.forEach(img => {
          if (!img.complete) {
            img.addEventListener('load', () => {
              setSectionHeight();
              ScrollTrigger.refresh();
            }, { once: true });
          }
        });
      }

      // Observe track resize (e.g. after images decode or fonts load)
      const ro = new ResizeObserver(() => {
        setSectionHeight();
        ScrollTrigger.refresh();
      });
      if (trackRef.current) ro.observe(trackRef.current);

      const t1 = setTimeout(() => {
        setSectionHeight();
        ScrollTrigger.refresh();
      }, 300);

      const t2 = setTimeout(() => {
        setSectionHeight();
        ScrollTrigger.refresh();
      }, 800);

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', setSectionHeight);
        ro.disconnect();
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <section 
      ref={sectionRef} 
      className="relative bg-[#F8F9FA] text-[#0A0A0B] z-10 w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center select-none">
        
        {/* Background Topography Lines (Lando Norris Style) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="topo" width="400" height="400" patternUnits="userSpaceOnUse">
                <path d="M0 200 Q 100 100 200 200 T 400 200 M 0 100 Q 150 50 200 150 T 400 50" fill="none" stroke="#000" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topo)" />
          </svg>
        </div>

        {/* Horizontal Sliding Track with Initial White Gap Buffer & Wide Cluster Spacing */}
        <div 
          ref={trackRef} 
          className="flex h-full w-[max-content] items-center relative will-change-transform pr-16 md:pr-24 gap-32 md:gap-48 lg:gap-60"
        >
          
          {/* INITIAL WHITE ENTRANCE GAP — cinematic breathing room before first card */}
          <div className="w-[35vw] h-full shrink-0 pointer-events-none" />

          {/* CLUSTER 1: SPA 2019 (BELGIUM) */}
          <div className="relative h-full flex flex-col justify-center items-start shrink-0 gap-3">
            <span className="text-[10px] font-racing uppercase tracking-widest text-neutral-500 font-bold -translate-y-8 md:-translate-y-12">
              BELGIAN GRAND PRIX, 2019
            </span>
            <div className="w-[320px] md:w-[360px] aspect-[3/4] rounded-sm overflow-hidden bg-neutral-200 shadow-2xl -translate-y-8 md:-translate-y-12">
              <img 
                src="/images/leclerc gallery/SPA 2019 Leclerc Potrait.jpg" 
                alt="Spa 2019 Portrait" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" 
              />
            </div>
          </div>

          {/* CLUSTER 2: MONZA 2019 (CENTERPIECE & QUOTE) */}
          <div className="relative h-full flex flex-col items-center justify-center shrink-0 px-8 md:px-14 gap-8">
            
            <div className="flex items-end justify-center gap-6 md:gap-8">
              {/* Photo 1: Curated Editorial Black & White (Staggered High) */}
              <div className="w-[260px] md:w-[290px] aspect-[4/5] rounded-sm overflow-hidden bg-neutral-200 -translate-y-24 md:-translate-y-32 shadow-xl">
                 <img 
                   src="/images/leclerc gallery/Monza 2019 Potrait.jpg" 
                   alt="Monza 2019 Portrait (B&W)" 
                   className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                 />
              </div>

              {/* Photo 2: Full Color Epic Centerpiece (Ground Level) */}
              <div className="flex flex-col gap-2 translate-y-2">
                <span className="text-[10px] font-racing uppercase tracking-widest text-neutral-500 font-bold">
                  ITALIAN GRAND PRIX, 2019
                </span>
                <div className="w-[520px] md:w-[660px] aspect-video rounded-sm overflow-hidden bg-neutral-200 shadow-2xl relative group">
                  <img 
                    src="/images/leclerc gallery/Monza 2019.jpg" 
                    alt="Monza 2019 Landscape" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  />
                </div>
              </div>

              {/* Photo 3: Celebration (Staggered Low) */}
              <div className="w-[220px] md:w-[250px] aspect-square rounded-sm overflow-hidden bg-neutral-200 translate-y-16 md:translate-y-24 shadow-lg">
                <img 
                  src="/images/leclerc gallery/Monza 2019 2.png" 
                  alt="Monza 2019 Alt" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                />
              </div>
            </div>

            {/* The Embedded Quote */}
            <div className="w-full max-w-[850px] mt-6 mr-auto pl-8 flex flex-col items-start gap-2">
              <h2 className="font-editorial text-3xl md:text-5xl lg:text-6xl text-[#0A0A0B] leading-[1.1] tracking-tight font-medium">
                <TextBoxReveal delay={0.1} duration={0.6}>It doesn't matter <span className="italic font-bold">where</span></TextBoxReveal><br/>
                <TextBoxReveal delay={0.2} duration={0.6}>you start, it's <span className="italic font-bold">how</span> you</TextBoxReveal><br/>
                <TextBoxReveal delay={0.3} duration={0.6}>progress from there.</TextBoxReveal>
              </h2>
            </div>

          </div>

          {/* CLUSTER 3: BAHRAIN & AUSTRIA 2022 */}
          <div className="relative h-full flex items-center justify-center shrink-0 gap-6 md:gap-10 px-8">
            
            {/* Photo 1 (Staggered Low) */}
            <div className="flex flex-col gap-2 translate-y-24 md:translate-y-32">
              <span className="text-[10px] font-racing uppercase tracking-widest text-neutral-500 text-right font-bold">
                BAHRAIN GRAND PRIX, 2022
              </span>
              <div className="w-[280px] md:w-[320px] aspect-square rounded-sm overflow-hidden bg-neutral-200 shadow-md">
                <img 
                  src="/images/leclerc gallery/Bahrain 2022 Square.jpeg" 
                  alt="Bahrain 2022 Square" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                />
              </div>
            </div>

            {/* Photo 2: Curated Editorial Black & White (Staggered High) */}
            <div className="w-[250px] md:w-[280px] aspect-[4/5] rounded-sm overflow-hidden bg-neutral-200 -translate-y-20 md:-translate-y-28 shadow-2xl">
              <img 
                src="/images/leclerc gallery/Bahrain 2022 Potrait.jpg" 
                alt="Bahrain 2022 Portrait (B&W)" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>

            {/* Photo 3 (Staggered Mid-Low) */}
            <div className="w-[340px] md:w-[420px] aspect-video rounded-sm overflow-hidden bg-neutral-200 translate-y-8 md:translate-y-12 shadow-xl">
              <img 
                src="/images/leclerc gallery/Austria 2022.jpg" 
                alt="Austria 2022" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" 
              />
            </div>

            {/* Photo 4 (Staggered High) */}
            <div className="flex flex-col gap-2 -translate-y-24 md:-translate-y-36">
              <span className="text-[10px] font-racing uppercase tracking-widest text-neutral-500 font-bold">
                AUSTRIAN GRAND PRIX, 2022
              </span>
              <div className="w-[230px] md:w-[260px] aspect-[3/4] rounded-sm overflow-hidden bg-neutral-200 shadow-lg">
                <img 
                  src="/images/leclerc gallery/Austria 2022 Potrait.jpg" 
                  alt="Austria 2022 Portrait" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                />
              </div>
            </div>

          </div>

          {/* CLUSTER 4: MONACO 2024 (THE FINALE) */}
          <div className="relative h-full flex items-center justify-center shrink-0 gap-6 md:gap-10 pr-12">
            
            {/* Photo 1: Curated Editorial Black & White (Staggered High) */}
            <div className="w-[260px] md:w-[300px] aspect-square rounded-sm overflow-hidden bg-neutral-200 -translate-y-16 md:-translate-y-24 shadow-lg">
               <img 
                 src="/images/leclerc gallery/Monaco 2024 Square.jpg" 
                 alt="Monaco 2024 Square (B&W)" 
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
               />
            </div>

            {/* Photo 2: Grand Finale (Monumental Center) */}
            <div className="flex flex-col gap-2 translate-y-2">
              <span className="text-[10px] font-racing uppercase tracking-widest text-neutral-500 text-center font-bold">
                MONACO GRAND PRIX, 2024
              </span>
              <div className="w-[380px] md:w-[480px] aspect-[4/5] rounded-sm overflow-hidden bg-neutral-200 shadow-2xl relative group">
                <img 
                  src="/images/leclerc gallery/Monaco 2024.jpg" 
                  alt="Monaco 2024 Finale" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 origin-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </div>

            {/* Photo 3 (Staggered Low) */}
            <div className="w-[320px] md:w-[380px] aspect-video rounded-sm overflow-hidden bg-neutral-200 translate-y-20 md:translate-y-28 shadow-xl">
               <img 
                 src="/images/leclerc gallery/Monaco 2024 Horizontal.jpg" 
                 alt="Monaco 2024 Horizontal" 
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" 
               />
            </div>

            {/* Final Statement */}
            <div className="flex flex-col gap-2 select-none opacity-50 pl-6 pr-12">
              <span className="font-mono-telemetry text-xs tracking-[0.3em] uppercase text-neutral-500 font-bold">
                MONACO 2024 // THE DREAM REALIZED
              </span>
              <h3 className="font-racing text-2xl md:text-3xl font-black uppercase text-[#0A0A0B]">
                FOREVER IN FERRARI HISTORY
              </h3>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
