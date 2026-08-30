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
        return Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 40);
      };

      // Native GSAP Horizontal Pin with brisk, responsive scrub ratio
      gsap.to(trackRef.current, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${Math.round(getScrollDistance() * 0.65)}`, // Fast, fluid 1:1 scroll responsiveness (no dead scroll)
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onEnter: () => {
            gsap.to(document.body, { backgroundColor: '#F8F9FA', color: '#0A0A0B', duration: 0.3 });
            document.body.classList.remove('nav-theme-dark');
          },
          onLeave: () => {
            gsap.to(document.body, { backgroundColor: '#F8F9FA', color: '#0A0A0B', duration: 0.3 });
            document.body.classList.remove('nav-theme-dark');
          },
          onEnterBack: () => {
            gsap.to(document.body, { backgroundColor: '#F8F9FA', color: '#0A0A0B', duration: 0.3 });
            document.body.classList.remove('nav-theme-dark');
          },
          onLeaveBack: () => {
            gsap.to(document.body, { backgroundColor: '#0A0A0A', color: '#FFFFFF', duration: 0.3 });
            document.body.classList.add('nav-theme-dark');
          },
        },
      });

      // Recalculate as images finish decoding inside track
      if (trackRef.current) {
        const images = trackRef.current.querySelectorAll('img');
        images.forEach(img => {
          if (!img.complete) {
            img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
          }
        });
      }

      const t = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => clearTimeout(t);
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <section 
      id="podiums"
      ref={sectionRef} 
      className="relative bg-[#F8F9FA] text-[#0A0A0B] z-10 w-full h-screen overflow-hidden flex flex-col justify-center select-none"
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

      {/* Horizontal Sliding Track with Lando Norris Asymmetrical Scattered Layout */}
      <div 
        ref={trackRef} 
        className="flex h-full w-[max-content] items-center pt-16 sm:pt-20 pb-8 relative will-change-transform pr-16 md:pr-24 gap-32 sm:gap-44 md:gap-60 lg:gap-72"
      >

          {/* MINIMALIST WHITE ENTRANCE BUFFER (Clean Visual Breathing Room on Section Enter) */}
          <div className="w-[65vw] sm:w-[72vw] lg:w-[78vw] h-full shrink-0 flex items-center justify-start pl-8 sm:pl-16 md:pl-24 pointer-events-none select-none">
            <div className="flex flex-col gap-2.5 opacity-40">
              <span className="font-mono-telemetry text-[11px] sm:text-xs tracking-[0.35em] uppercase text-neutral-500 font-bold">
                SCUDERIA FERRARI // #16 ARCHIVE
              </span>
              <span className="font-editorial italic text-2xl sm:text-3xl md:text-4xl text-neutral-600 font-light">
                The Pursuit of Victory
              </span>
            </div>
          </div>

          {/* CLUSTER 1: SPA 2019 (BELGIUM) — High Scatter */}
          <div className="relative h-full flex flex-col justify-center items-start shrink-0">
            <div className="flex flex-col gap-2 -translate-y-6 md:-translate-y-10">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                SPA-FRANCORCHAMPS, 2019
              </span>
              <div className="w-[210px] sm:w-[240px] md:w-[270px] aspect-[3/4] rounded-[2px] overflow-hidden bg-neutral-200 shadow-xl group">
                <img 
                  src="/images/leclerc gallery/SPA 2019 Leclerc Potrait.jpg" 
                  alt="Spa 2019 Portrait" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
              </div>
            </div>
          </div>

          {/* CLUSTER 2: MONZA 2019 (FLOATING QUOTE & ASYMMETRICAL PHOTOS) */}
          <div className="relative h-full flex items-center justify-center shrink-0 gap-16 sm:gap-24 md:gap-36 px-8">
            
            {/* Photo 1: B&W Portrait (Deep Low Scatter) */}
            <div className="flex flex-col gap-2 translate-y-20 md:translate-y-28">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                MONZA, 2019 // P1
              </span>
              <div className="w-[180px] sm:w-[210px] md:w-[240px] aspect-[4/5] rounded-[2px] overflow-hidden bg-neutral-200 shadow-lg group">
                <img 
                  src="/images/leclerc gallery/Monza 2019 Potrait.jpg" 
                  alt="Monza 2019 Portrait (B&W)" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
              </div>
            </div>

            {/* Floating Editorial Quote & Signature (Nestled high in negative space) */}
            <div className="flex flex-col gap-3 -translate-y-12 md:-translate-y-16 max-w-[260px] sm:max-w-[300px] select-none shrink-0">
              <span className="font-editorial text-2xl sm:text-3xl md:text-[2rem] text-[#0A0A0B] leading-[1.2] font-light tracking-tight">
                It doesn't matter <span className="italic font-bold text-[#E10600]">where</span> you start, it's <span className="italic font-bold">how</span> you progress from there.
              </span>
              <span className="font-editorial italic font-extrabold text-sm sm:text-base text-neutral-500">
                — Charles Leclerc #16
              </span>
            </div>

            {/* Photo 2: Color Centerpiece Landscape (Ground Level) */}
            <div className="flex flex-col gap-2 translate-y-6 md:translate-y-10">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                ITALIAN GRAND PRIX, 2019
              </span>
              <div className="w-[280px] sm:w-[330px] md:w-[380px] aspect-video rounded-[2px] overflow-hidden bg-neutral-200 shadow-2xl group">
                <img 
                  src="/images/leclerc gallery/Monza 2019.jpg" 
                  alt="Monza 2019 Landscape" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
              </div>
            </div>

            {/* Photo 3: Celebration Square (High Scatter) */}
            <div className="flex flex-col gap-2 -translate-y-8 md:-translate-y-12">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                TIFOSI CELEBRATION
              </span>
              <div className="w-[170px] sm:w-[190px] md:w-[210px] aspect-square rounded-[2px] overflow-hidden bg-neutral-200 shadow-md group">
                <img 
                  src="/images/leclerc gallery/Monza 2019 2.png" 
                  alt="Monza 2019 Alt" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
              </div>
            </div>

          </div>

          {/* CLUSTER 3: BAHRAIN & AUSTRIA 2022 */}
          <div className="relative h-full flex items-center justify-center shrink-0 gap-16 sm:gap-24 md:gap-36 px-6">
            
            {/* Photo 1: Square (Deep Low Scatter) */}
            <div className="flex flex-col gap-2 translate-y-24 md:translate-y-32">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 font-bold text-right">
                BAHRAIN GP, 2022
              </span>
              <div className="w-[190px] sm:w-[220px] md:w-[250px] aspect-square rounded-[2px] overflow-hidden bg-neutral-200 shadow-md group">
                <img 
                  src="/images/leclerc gallery/Bahrain 2022 Square.jpeg" 
                  alt="Bahrain 2022 Square" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
              </div>
            </div>

            {/* Photo 2: B&W Portrait (High Scatter) */}
            <div className="flex flex-col gap-2 -translate-y-8 md:-translate-y-12">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                DESERT POLE // SAKHIR
              </span>
              <div className="w-[180px] sm:w-[200px] md:w-[230px] aspect-[4/5] rounded-[2px] overflow-hidden bg-neutral-200 shadow-xl group">
                <img 
                  src="/images/leclerc gallery/Bahrain 2022 Potrait.jpg" 
                  alt="Bahrain 2022 Portrait (B&W)" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
              </div>
            </div>

            {/* Photo 3: Austria Landscape (Mid Level) */}
            <div className="flex flex-col gap-2 translate-y-10 md:translate-y-14">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                RED BULL RING, 2022
              </span>
              <div className="w-[250px] sm:w-[290px] md:w-[330px] aspect-video rounded-[2px] overflow-hidden bg-neutral-200 shadow-xl group">
                <img 
                  src="/images/leclerc gallery/Austria 2022.jpg" 
                  alt="Austria 2022" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
              </div>
            </div>

            {/* Photo 4: Austria Portrait (High Scatter) */}
            <div className="flex flex-col gap-2 -translate-y-6 md:-translate-y-10">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                SPIELBERG VICTORY
              </span>
              <div className="w-[170px] sm:w-[190px] md:w-[220px] aspect-[3/4] rounded-[2px] overflow-hidden bg-neutral-200 shadow-lg group">
                <img 
                  src="/images/leclerc gallery/Austria 2022 Potrait.jpg" 
                  alt="Austria 2022 Portrait" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
              </div>
            </div>

          </div>

          {/* CLUSTER 4: MONACO 2024 (THE FINALE) */}
          <div className="relative h-full flex items-center justify-center shrink-0 gap-16 sm:gap-24 md:gap-36 pr-8">
            
            {/* Photo 1: B&W Square (High Scatter) */}
            <div className="flex flex-col gap-2 -translate-y-6 md:-translate-y-10">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                MONACO GP, 2024
              </span>
              <div className="w-[190px] sm:w-[220px] md:w-[250px] aspect-square rounded-[2px] overflow-hidden bg-neutral-200 shadow-md group">
                 <img 
                   src="/images/leclerc gallery/Monaco 2024 Square.jpg" 
                   alt="Monaco 2024 Square (B&W)" 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                 />
              </div>
            </div>

            {/* Photo 2: Grand Finale Car (Elevated Centerpiece Safe) */}
            <div className="flex flex-col gap-2 -translate-y-2 md:-translate-y-5">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 text-center font-bold">
                HOME TRIUMPH // P1
              </span>
              <div className="w-[230px] sm:w-[270px] md:w-[310px] aspect-[4/5] rounded-[2px] overflow-hidden bg-neutral-200 shadow-2xl relative group">
                <img 
                  src="/images/leclerc gallery/Monaco 2024.jpg" 
                  alt="Monaco 2024 Finale" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 origin-center" 
                />
              </div>
            </div>

            {/* Photo 3: Crowd Celebration Horizontal (Deep Low Scatter) */}
            <div className="flex flex-col gap-2 translate-y-20 md:translate-y-28">
              <span className="font-mono-telemetry text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                MONTE CARLO HARBOR
              </span>
              <div className="w-[230px] sm:w-[270px] md:w-[310px] aspect-video rounded-[2px] overflow-hidden bg-neutral-200 shadow-xl group">
                 <img 
                   src="/images/leclerc gallery/Monaco 2024 Horizontal.jpg" 
                   alt="Monaco 2024 Horizontal" 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                 />
              </div>
            </div>

            {/* Final Statement */}
            <div className="flex flex-col gap-2 select-none opacity-60 pl-2 pr-6 shrink-0 max-w-[220px]">
              <span className="font-mono-telemetry text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-bold">
                MONACO 2024
              </span>
              <h3 className="font-racing text-lg md:text-xl font-black uppercase text-[#0A0A0B] leading-tight">
                FOREVER IN FERRARI HISTORY
              </h3>
            </div>

          </div>

        </div>
    </section>
  );
}
