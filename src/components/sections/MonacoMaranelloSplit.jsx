import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function MonacoMaranelloSplit() {
  const sectionRef   = useRef(null);
  const leftSideRef  = useRef(null);
  const rightSideRef = useRef(null);

  const lLine1Ref = useRef(null);
  const lLine2Ref = useRef(null);
  const lLine3Ref = useRef(null);
  const lBtnRef   = useRef(null);

  const rLine1Ref = useRef(null);
  const rLine2Ref = useRef(null);
  const rLine3Ref = useRef(null);
  const rBtnRef   = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // 1. Navbar Theme
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end:   'bottom 50%',
        onEnter:     () => document.body.classList.remove('nav-theme-dark'),
        onEnterBack: () => document.body.classList.remove('nav-theme-dark'),
      });

      // 2. Horizontal Scrub — GPU-composited, smooth bidirectional
      gsap.set([leftSideRef.current, rightSideRef.current], {
        force3D: true,
        willChange: 'transform',
      });
      gsap.set(leftSideRef.current,  { xPercent: -28 });
      gsap.set(rightSideRef.current, { xPercent:  28 });

      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 90%',  // section barely enters viewport → animation starts
          end:     'top 15%',  // section well in view → animation done
          scrub:   2,
          invalidateOnRefresh: true,
        },
      })
        .to(leftSideRef.current,  { xPercent: 0, overwrite: 'auto' }, 0)
        .to(rightSideRef.current, { xPercent: 0, overwrite: 'auto' }, 0);



    }, sectionRef);
    return () => ctx.revert();
  }, []);


  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[640px] max-h-[1080px] bg-[#F4F5EE] text-[#0A0A0B] z-20 overflow-hidden flex items-center justify-center select-none"
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="split-topo" width="500" height="500" patternUnits="userSpaceOnUse">
              <path d="M0 250 Q 125 125 250 250 T 500 250 M 0 125 Q 200 50 300 200 T 500 75 M 0 375 Q 180 300 320 420 T 500 350" fill="none" stroke="#000" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#split-topo)" />
        </svg>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-between">

        <div ref={leftSideRef} className="relative w-full lg:w-1/2 h-full flex items-center justify-center lg:justify-end px-6 lg:pl-20 lg:pr-12 xl:pr-16 group">
          <div className="absolute left-0 bottom-0 -translate-x-[22%] sm:-translate-x-[16%] md:-translate-x-[10%] h-[74vh] sm:h-[83vh] lg:h-[91vh] max-h-[800px] pointer-events-none transition-transform duration-700 group-hover:scale-105 flex items-end justify-start">
            <img src="/images/leclerc monaco side.png" alt="Monaco Helmet" className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-2xl" onError={e => { e.currentTarget.src = '/images/charles-helmet-monaco.png'; }} />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-[210px] sm:max-w-[230px] -translate-y-6 sm:-translate-y-10 lg:-translate-y-12">
            <div ref={lLine1Ref} className="overflow-hidden">
              <span className="block font-editorial text-3xl sm:text-4xl md:text-[2.8rem] text-[#0A0A0B] leading-none tracking-tight">MONACO</span>
            </div>
            <div ref={lLine2Ref} className="relative overflow-hidden mt-[-3px]">
              <span className="block font-racing font-black text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] text-[#0A0A0B] uppercase tracking-tighter leading-none">HOME</span>
              <span className="absolute inset-0 flex items-center justify-center font-editorial italic font-extrabold text-4xl sm:text-5xl md:text-[3.5rem] text-[#E10600]/80 pointer-events-none rotate-[-8deg]">#16</span>
            </div>
            <div ref={lLine3Ref} className="overflow-hidden mt-4">
              <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-500 font-light leading-relaxed">Winning on the historic streets where his journey began. A lifelong dream fulfilled in front of his home crowd.</p>
            </div>
            <div ref={lBtnRef} className="overflow-visible mt-5 flex justify-center">
              <a href="#hero" className="w-11 h-11 rounded-2xl bg-[#E10600] text-white flex items-center justify-center shadow-lg shadow-[#E10600]/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#ff1a14] active:scale-95" title="Explore Monaco Home Win">
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </a>
            </div>
          </div>
        </div>

        <div ref={rightSideRef} className="relative w-full lg:w-1/2 h-full flex items-center justify-center lg:justify-start px-6 lg:pr-20 lg:pl-12 xl:pl-16 group mt-16 lg:mt-0">
          <div className="relative z-10 flex flex-col items-center text-center max-w-[210px] sm:max-w-[230px] -translate-y-6 sm:-translate-y-10 lg:-translate-y-12">
            <div ref={rLine1Ref} className="overflow-hidden">
              <span className="block font-editorial text-3xl sm:text-4xl md:text-[2.8rem] text-[#0A0A0B] leading-none tracking-tight">FIRST</span>
            </div>
            <div ref={rLine2Ref} className="relative overflow-hidden mt-[-3px]">
              <span className="block font-racing font-black text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] text-[#0A0A0B] uppercase tracking-tighter leading-none">WIN</span>
              <span className="absolute inset-0 flex items-center justify-center font-editorial italic font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#E10600]/80 pointer-events-none rotate-[8deg]">SPA</span>
            </div>
            <div ref={rLine3Ref} className="overflow-hidden mt-4">
              <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-500 font-light leading-relaxed">The emotional maiden Formula 1 victory at Spa-Francorchamps in 2019. The very first step onto the top of the podium.</p>
            </div>
            <div ref={rBtnRef} className="overflow-visible mt-5 flex justify-center">
              <a href="#hero" className="w-11 h-11 rounded-2xl bg-[#E10600] text-white flex items-center justify-center shadow-lg shadow-[#E10600]/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#ff1a14] active:scale-95" title="Discover First Win Spa 2019">
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </a>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-[22%] sm:translate-x-[16%] md:translate-x-[10%] h-[74vh] sm:h-[83vh] lg:h-[91vh] max-h-[800px] pointer-events-none transition-transform duration-700 group-hover:scale-105 flex items-end justify-end">
            <img src="/images/leclerc first win side-Photoroom.png" alt="Spa 2019 Helmet" className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-2xl" onError={e => { e.currentTarget.src = '/images/leclerc first win side.png'; }} />
          </div>
        </div>

      </div>
    </section>
  );
}
