import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import MagneticEffect from '../ui/MagneticEffect';

gsap.registerPlugin(ScrollTrigger);

export default function MonacoMaranelloSplit() {
  const [activeTab, setActiveTab] = useState('monaco');
  const sectionRef = useRef(null);
  const leftImgRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightImgRef = useRef(null);
  const rightTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Navbar Theme Switcher & Background Synchronization
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          gsap.to(document.body, { backgroundColor: '#F8F9FA', color: '#0A0A0B', duration: 0.3 });
          document.body.classList.remove('nav-theme-dark');
        },
        onEnterBack: () => {
          gsap.to(document.body, { backgroundColor: '#F8F9FA', color: '#0A0A0B', duration: 0.3 });
          document.body.classList.remove('nav-theme-dark');
        },
      });

      const mm = gsap.matchMedia();

      // 2. Desktop (>= 1024px): Split side-by-side slide in/out animations
      mm.add('(min-width: 1024px)', () => {
        gsap.set(leftImgRef.current, { xPercent: -100, opacity: 0 });
        gsap.set(rightImgRef.current, { xPercent: 100, opacity: 0 });
        gsap.set(leftTextRef.current, { x: -50, opacity: 0 });
        gsap.set(rightTextRef.current, { x: 50, opacity: 0 });

        const enterTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 10%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        enterTl
          .to(leftImgRef.current, { xPercent: -28, opacity: 1, ease: 'power2.out' }, 0)
          .to(leftTextRef.current, { x: 0, opacity: 1, ease: 'power2.out' }, 0)
          .to(rightImgRef.current, { xPercent: 28, opacity: 1, ease: 'power2.out' }, 0)
          .to(rightTextRef.current, { x: 0, opacity: 1, ease: 'power2.out' }, 0);

        const nextTarget = document.getElementById('calendar') || document.getElementById('archive-parallax');
        if (nextTarget) {
          const exitTl = gsap.timeline({
            scrollTrigger: {
              trigger: nextTarget,
              start: 'top bottom',
              end: 'top 50%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          exitTl
            .to(
              leftImgRef.current,
              { xPercent: -100, opacity: 0, ease: 'power2.in', immediateRender: false },
              0
            )
            .to(
              leftTextRef.current,
              { x: -80, opacity: 0, ease: 'power2.in', immediateRender: false },
              0
            )
            .to(
              rightImgRef.current,
              { xPercent: 100, opacity: 0, ease: 'power2.in', immediateRender: false },
              0
            )
            .to(
              rightTextRef.current,
              { x: 80, opacity: 0, ease: 'power2.in', immediateRender: false },
              0
            );
        }
      });

      // 3. Mobile / Tablet (< 1024px): Reset transforms so content stays cleanly visible
      mm.add('(max-width: 1023px)', () => {
        gsap.set([leftImgRef.current, rightImgRef.current], { xPercent: 0, opacity: 1, clearProps: 'transform' });
        gsap.set([leftTextRef.current, rightTextRef.current], { x: 0, opacity: 1, clearProps: 'transform' });
      });

      const t = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => clearTimeout(t);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="monaco-maranello"
      ref={sectionRef}
      className="sticky top-0 w-full h-[100dvh] min-h-[580px] bg-[#F8F9FA] text-[#0A0A0B] z-10 overflow-hidden flex flex-col items-center justify-center select-none pt-20 pb-6 lg:py-0"
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="split-topo" width="500" height="500" patternUnits="userSpaceOnUse">
              <path d="M0 250 Q 125 125 250 250 T 500 250 M 0 125 Q 200 50 300 200 T 500 75 M 0 375 Q 180 300 320 420 T 500 350" fill="none" stroke="#000" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#split-topo)" />
        </svg>
      </div>

      {/* Mobile Identity Segment Switcher (Hidden on desktop) */}
      <div className="lg:hidden absolute top-20 sm:top-24 z-30 flex items-center justify-center p-1 rounded-full bg-black/[0.06] border border-black/10 backdrop-blur-md shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('monaco')}
          className={`px-4 sm:px-5 py-1.5 rounded-full font-mono-telemetry text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
            activeTab === 'monaco'
              ? 'bg-[#E10600] text-white shadow-md shadow-[#E10600]/30'
              : 'text-neutral-600 hover:text-black'
          }`}
        >
          01 MONACO
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('spa')}
          className={`px-4 sm:px-5 py-1.5 rounded-full font-mono-telemetry text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
            activeTab === 'spa'
              ? 'bg-[#E10600] text-white shadow-md shadow-[#E10600]/30'
              : 'text-neutral-600 hover:text-black'
          }`}
        >
          02 FIRST WIN SPA
        </button>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-between">
        {/* Sisi Kiri: Monaco Home */}
        <div className={`relative w-full lg:w-1/2 h-full items-center justify-center lg:justify-end px-6 lg:pr-20 xl:pr-28 group transition-opacity duration-300 ${activeTab === 'monaco' ? 'flex' : 'hidden lg:flex'}`}>
          <div
            ref={leftImgRef}
            className="absolute left-0 bottom-0 h-[48vh] sm:h-[55vh] lg:h-[80vh] max-h-[700px] pointer-events-none flex items-end justify-start will-change-transform z-0 opacity-80 lg:opacity-100"
          >
            <img
              src="/images/leclerc monaco side.png"
              alt="Monaco Helmet"
              className="h-full w-auto max-w-none object-contain object-bottom filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.12)]"
              onError={e => { e.currentTarget.src = '/images/charles-helmet-monaco.png'; }}
            />
          </div>

          <div
            ref={leftTextRef}
            className="relative z-10 flex flex-col items-center text-center max-w-[240px] sm:max-w-[260px] lg:max-w-[220px] -translate-y-2 sm:-translate-y-6 lg:-translate-y-12 will-change-transform"
          >
            <div className="overflow-hidden">
              <span className="block font-editorial text-2xl sm:text-3xl md:text-4xl md:text-[2.8rem] text-[#0A0A0B] leading-none tracking-tight">MONACO</span>
            </div>
            <div className="relative overflow-hidden mt-[-3px]">
              <span className="block font-racing font-black text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] text-[#0A0A0B] uppercase tracking-tighter leading-none">HOME</span>
              <span className="absolute inset-0 flex items-center justify-center font-editorial italic font-extrabold text-3xl sm:text-4xl md:text-[3.5rem] text-[#E10600]/80 pointer-events-none rotate-[-8deg]">#16</span>
            </div>
            <div className="overflow-hidden mt-3 sm:mt-4">
              <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-500 font-light leading-relaxed">Winning on the historic streets where his journey began. A lifelong dream fulfilled in front of his home crowd.</p>
            </div>
            <div className="overflow-visible mt-4 sm:mt-5 flex justify-center">
              <MagneticEffect factor={0.25}>
                <a href="#podiums" className="w-10 sm:w-11 h-10 sm:h-11 rounded-2xl bg-[#E10600] text-white flex items-center justify-center shadow-lg shadow-[#E10600]/30 transition-all duration-300 hover:scale-110 hover:bg-[#ff1a14] active:scale-95" title="Explore Monaco Home Win">
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </a>
              </MagneticEffect>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: First Win Spa */}
        <div className={`relative w-full lg:w-1/2 h-full items-center justify-center lg:justify-start px-6 lg:pl-20 xl:pl-28 group transition-opacity duration-300 ${activeTab === 'spa' ? 'flex' : 'hidden lg:flex'}`}>
          <div
            ref={rightTextRef}
            className="relative z-10 flex flex-col items-center text-center max-w-[240px] sm:max-w-[260px] lg:max-w-[220px] -translate-y-2 sm:-translate-y-6 lg:-translate-y-12 will-change-transform"
          >
            <div className="overflow-hidden">
              <span className="block font-editorial text-2xl sm:text-3xl md:text-4xl md:text-[2.8rem] text-[#0A0A0B] leading-none tracking-tight">FIRST</span>
            </div>
            <div className="relative overflow-hidden mt-[-3px]">
              <span className="block font-racing font-black text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] text-[#0A0A0B] uppercase tracking-tighter leading-none">WIN</span>
              <span className="absolute inset-0 flex items-center justify-center font-editorial italic font-extrabold text-2xl sm:text-3xl md:text-5xl text-[#E10600]/80 pointer-events-none rotate-[8deg]">SPA</span>
            </div>
            <div className="overflow-hidden mt-3 sm:mt-4">
              <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-500 font-light leading-relaxed">The emotional maiden Formula 1 victory at Spa-Francorchamps in 2019. The very first step onto the top of the podium.</p>
            </div>
            <div className="overflow-visible mt-4 sm:mt-5 flex justify-center">
              <MagneticEffect factor={0.25}>
                <a href="#podiums" className="w-10 sm:w-11 h-10 sm:h-11 rounded-2xl bg-[#E10600] text-white flex items-center justify-center shadow-lg shadow-[#E10600]/30 transition-all duration-300 hover:scale-110 hover:bg-[#ff1a14] active:scale-95" title="Discover First Win Spa 2019">
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </a>
              </MagneticEffect>
            </div>
          </div>

          <div
            ref={rightImgRef}
            className="absolute right-0 bottom-0 h-[48vh] sm:h-[55vh] lg:h-[80vh] max-h-[700px] pointer-events-none flex items-end justify-end will-change-transform z-0 opacity-85 lg:opacity-100"
          >
            <img
              src="/images/leclerc first win side-Photoroom.png"
              alt="Spa 2019 Helmet"
              className="h-full w-auto max-w-none object-contain object-bottom filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.12)]"
              onError={e => { e.currentTarget.src = '/images/leclerc first win side.png'; }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}