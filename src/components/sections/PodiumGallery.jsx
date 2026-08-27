import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextBoxReveal from '../ui/TextBoxReveal';

gsap.registerPlugin(ScrollTrigger);

export default function PodiumGallery() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const getScrollDistance = () =>
        containerRef.current
          ? containerRef.current.scrollWidth - window.innerWidth
          : 0;

      const setHeight = () => {
        if (!sectionRef.current || !containerRef.current) return;
        const dist = getScrollDistance();
        if (dist > 0) {
          sectionRef.current.style.height = `${dist + window.innerHeight}px`;
        }
      };

      setHeight();

      const ro = new ResizeObserver(() => {
        setHeight();
        ScrollTrigger.refresh();
      });
      if (containerRef.current) ro.observe(containerRef.current);

      // CSS STICKY PARALLAX (Native browser sticky, smooth 1:1 scrub)
      gsap.to(containerRef.current, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.to('body', { backgroundColor: '#F8F9FA', color: '#0A0A0B', duration: 0.5 });
            document.body.classList.remove('nav-theme-dark');
          },
          onLeave: () => {
            gsap.to('body', { backgroundColor: '#0A0A0B', color: '#FFFFFF', duration: 0.5 });
            document.body.classList.add('nav-theme-dark');
          },
          onEnterBack: () => {
            gsap.to('body', { backgroundColor: '#F8F9FA', color: '#0A0A0B', duration: 0.5 });
            document.body.classList.remove('nav-theme-dark');
          },
          onLeaveBack: () => {
            gsap.to('body', { backgroundColor: '#0A0A0B', color: '#FFFFFF', duration: 0.5 });
            document.body.classList.add('nav-theme-dark');
          },
        },
      });

      return () => ro.disconnect();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-[#F8F9FA] text-[#0A0A0B] z-10 w-full"
      style={{ minHeight: '350vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        <div 
          ref={containerRef} 
          className="flex h-full w-[max-content] items-center relative will-change-transform pr-0"
        >
          
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

          {/* INITIAL CLEAN 100vw BUFFER: Zero photos visible on initial entrance */}
          <div className="w-[100vw] h-full shrink-0" />

          {/* CLUSTER 1: SPA 2019 */}
          <div className="relative h-full flex items-center justify-center min-w-[50vw] gap-8 md:gap-12">
            <div className="w-[380px] aspect-[3/4] rounded-sm overflow-hidden bg-neutral-200 shadow-2xl">
              <img 
                src="/images/leclerc gallery/SPA 2019 Leclerc Potrait.jpg" 
                alt="Spa 2019 Portrait" 
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
              />
            </div>
          </div>

          {/* CLUSTER 2: MONZA 2019 (CENTERPIECE & QUOTE) */}
          <div className="relative h-full flex flex-col items-center justify-center min-w-[90vw] px-12 gap-8">
            
            <div className="w-full flex items-end justify-center gap-6">
              {/* Photo 1: Curated Editorial Black & White */}
              <div className="w-[280px] aspect-[4/5] rounded-sm overflow-hidden bg-neutral-200 -translate-y-24 shadow-xl">
                 <img 
                   src="/images/leclerc gallery/Monza 2019 Potrait.jpg" 
                   alt="Monza 2019 Portrait (B&W)" 
                   className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                 />
              </div>

              {/* Photo 2: Full Color Epic Centerpiece */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-racing uppercase tracking-widest text-neutral-500 font-bold">ITALIAN GRAND PRIX, 2019</span>
                <div className="w-[650px] aspect-video rounded-sm overflow-hidden bg-neutral-200 shadow-2xl relative group">
                  <img 
                    src="/images/leclerc gallery/Monza 2019.jpg" 
                    alt="Monza 2019 Landscape" 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                  />
                </div>
              </div>

              {/* Photo 3: Full Color Celebration */}
              <div className="w-[240px] aspect-square rounded-sm overflow-hidden bg-neutral-200 translate-y-16 shadow-lg">
                <img 
                  src="/images/leclerc gallery/Monza 2019 2.png" 
                  alt="Monza 2019 Alt" 
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
                />
              </div>
            </div>

            {/* The Embedded Quote */}
            <div className="w-full max-w-[800px] mt-12 mr-auto pl-16 flex flex-col items-start gap-3">
              <h2 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-[#0A0A0B] leading-[1.1] tracking-tight font-medium">
                <TextBoxReveal delay={0.1} duration={0.6}>It doesn't matter <span className="italic font-bold">where</span></TextBoxReveal><br/>
                <TextBoxReveal delay={0.2} duration={0.6}>you start, it's <span className="italic font-bold">how</span> you</TextBoxReveal><br/>
                <TextBoxReveal delay={0.3} duration={0.6}>progress from there.</TextBoxReveal>
              </h2>
            </div>

          </div>

          {/* CLUSTER 3: BAHRAIN & AUSTRIA 2022 */}
          <div className="relative h-full flex items-center justify-center min-w-[90vw] gap-8 px-12">
            
            {/* Photo 1: Full Color */}
            <div className="flex flex-col gap-2 translate-y-24">
              <span className="text-[10px] font-racing uppercase tracking-widest text-neutral-500 text-right font-bold">BAHRAIN GRAND PRIX, 2022</span>
              <div className="w-[320px] aspect-square rounded-sm overflow-hidden bg-neutral-200 shadow-md">
                <img 
                  src="/images/leclerc gallery/Bahrain 2022 Square.jpeg" 
                  alt="Bahrain 2022 Square" 
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
                />
              </div>
            </div>

            {/* Photo 2: Curated Editorial Black & White */}
            <div className="w-[280px] aspect-[4/5] rounded-sm overflow-hidden bg-neutral-200 -translate-y-16 shadow-2xl">
              <img 
                src="/images/leclerc gallery/Bahrain 2022 Potrait.jpg" 
                alt="Bahrain 2022 Portrait (B&W)" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>

            {/* Photo 3: Full Color */}
            <div className="w-[400px] aspect-video rounded-sm overflow-hidden bg-neutral-200 translate-y-8 shadow-xl">
              <img 
                src="/images/leclerc gallery/Austria 2022.jpg" 
                alt="Austria 2022" 
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
              />
            </div>

            {/* Photo 4: Full Color */}
            <div className="flex flex-col gap-2 -translate-y-20">
              <span className="text-[10px] font-racing uppercase tracking-widest text-neutral-500 font-bold">AUSTRIAN GRAND PRIX, 2022</span>
              <div className="w-[260px] aspect-[3/4] rounded-sm overflow-hidden bg-neutral-200 shadow-lg">
                <img 
                  src="/images/leclerc gallery/Austria 2022 Potrait.jpg" 
                  alt="Austria 2022 Portrait" 
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
                />
              </div>
            </div>

          </div>

          {/* CLUSTER 4: MONACO 2024 (THE FINALE) */}
          <div className="relative h-full flex items-center justify-center min-w-[90vw] gap-8">
            
            {/* Photo 1: Curated Editorial Black & White */}
            <div className="w-[300px] aspect-square rounded-sm overflow-hidden bg-neutral-200 -translate-y-16 shadow-lg">
               <img 
                 src="/images/leclerc gallery/Monaco 2024 Square.jpg" 
                 alt="Monaco 2024 Square (B&W)" 
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
               />
            </div>

            {/* Photo 2: Full Color Grand Finale */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-racing uppercase tracking-widest text-neutral-500 text-center font-bold">MONACO GRAND PRIX, 2024</span>
              <div className="w-[450px] md:w-[500px] aspect-[4/5] rounded-sm overflow-hidden bg-neutral-200 shadow-2xl relative group">
                <img 
                  src="/images/leclerc gallery/Monaco 2024.jpg" 
                  alt="Monaco 2024 Finale" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 origin-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </div>

            {/* Photo 3: Full Color */}
            <div className="w-[380px] aspect-video rounded-sm overflow-hidden bg-neutral-200 translate-y-24 shadow-xl">
               <img 
                 src="/images/leclerc gallery/Monaco 2024 Horizontal.jpg" 
                 alt="Monaco 2024 Horizontal" 
                 className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
               />
            </div>

          </div>

          {/* END BUFFER GAP: Calibrated to stop precisely at the Monaco finale composition */}
          <div className="w-[24vw] md:w-[28vw] h-full shrink-0 flex items-center justify-start pl-8 pr-12">
            <div className="flex flex-col gap-2 select-none opacity-40">
              <span className="font-mono-telemetry text-xs tracking-[0.3em] uppercase text-neutral-400 font-bold">
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
