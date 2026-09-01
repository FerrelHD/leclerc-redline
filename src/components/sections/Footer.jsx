import React, { useRef, useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticEffect from '../ui/MagneticEffect';

gsap.registerPlugin(ScrollTrigger);

const sponsorList = [
  'SHELL',
  'HP',
  'RAY-BAN',
  'RICHARD MILLE',
  'PUMA',
  'PIRELLI',
  'AWS',
  'BELL HELMETS',
  'VGW PLAY',
  'PERONI NASTRO AZZURRO 0.0%',
  'CEVA LOGISTICS',
  'BANCO SANTANDER',
];

const pageLinks = [
  { label: 'HOME', href: '#hero' },
  { label: 'ON TRACK', href: '#story' },
  { label: 'OFF TRACK', href: '#archive-parallax' },
  { label: 'CALENDAR', href: '#podiums' },
  { label: 'STORE', href: 'https://store.ferrari.com/', external: true },
];

const followLinks = [
  { label: 'TIKTOK', href: 'https://www.tiktok.com/@charlesleclerc' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/charles_leclerc/' },
  { label: 'YOUTUBE', href: 'https://www.youtube.com/@charlesleclerc' },
  { label: 'TWITCH', href: 'https://www.twitch.tv/charlesleclerc' },
];

export default function Footer() {
  const footerRef = useRef(null);
  const headingLine1Ref = useRef(null);
  const headingLine2Ref = useRef(null);
  const sigWrapperRef = useRef(null);
  const sigPathRef = useRef(null);
  const numPathRef = useRef(null);

  // Pillar Refs for Cinematic Stagger Rise Reveal Animation
  const driverHeroRef = useRef(null);
  const ctaRef = useRef(null);
  const pagesHeadingRef = useRef(null);
  const pagesListRef = useRef(null);
  const followHeadingRef = useRef(null);
  const followListRef = useRef(null);

  // Sibling Focus Hover State
  const [hoveredPage, setHoveredPage] = useState(null);
  const [hoveredFollow, setHoveredFollow] = useState(null);

  // Duplicate sponsor list 4x for continuous infinite 60fps marquee
  const tickerItems = [
    ...sponsorList,
    ...sponsorList,
    ...sponsorList,
    ...sponsorList,
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sigPathRef.current || !numPathRef.current) return;

      // Calculate path lengths for handwritten draw-in effect
      const lenSig = sigPathRef.current.getTotalLength();
      const lenNum = numPathRef.current.getTotalLength();

      gsap.set(sigPathRef.current, {
        strokeDasharray: lenSig,
        strokeDashoffset: lenSig,
      });
      gsap.set(numPathRef.current, {
        strokeDasharray: lenNum,
        strokeDashoffset: lenNum,
      });

      // Maintain white navbar text throughout Footer
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top 95%',
        end: 'bottom bottom',
        onEnter: () => document.body.classList.add('nav-theme-dark'),
        onEnterBack: () => document.body.classList.add('nav-theme-dark'),
      });

      // Master Footer Entrance Timeline triggered when scrolled into view
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // 1. ✨ Kinetic Editorial Mask Reveal: Lines slide up majestically from behind overflow mask
      tl.fromTo(
        headingLine1Ref.current,
        { yPercent: 125, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
      )
        .fromTo(
          headingLine2Ref.current,
          { yPercent: 125, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.7'
        )
        // 2. 🏁 Driver Hero Rise & Depth Scale (rises together with heading)
        .fromTo(
          driverHeroRef.current,
          { y: 65, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.95, ease: 'power3.out' },
          '-=0.7'
        )
        // 3. ⚡ CTA Button Pop-in with Elastic Bounce
        .fromTo(
          ctaRef.current,
          { scale: 0.75, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)' },
          '-=0.5'
        )
        // 4. 📑 Left Column PAGES Reveal (Cascading Masked Slide-Up)
        .fromTo(
          pagesHeadingRef.current,
          { opacity: 0, y: 15, letterSpacing: '0.55em' },
          { opacity: 1, y: 0, letterSpacing: '0.35em', duration: 0.6, ease: 'power2.out' },
          '-=0.6'
        )
        .fromTo(
          '.pages-nav-item',
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.05, ease: 'power3.out' },
          '-=0.5'
        )
        // 5. 📲 Right Column FOLLOW ON Reveal (Cascading Slide-Up)
        .fromTo(
          followHeadingRef.current,
          { opacity: 0, y: 15, letterSpacing: '0.55em' },
          { opacity: 1, y: 0, letterSpacing: '0.35em', duration: 0.6, ease: 'power2.out' },
          '-=0.7'
        )
        .fromTo(
          '.follow-nav-item',
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.05, ease: 'power3.out' },
          '-=0.5'
        )
        // 6. 🏎️ Live Handwritten Stroke Draw-In (Draws across the revealed scene)
        .to(
          sigPathRef.current,
          {
            strokeDashoffset: 0,
            duration: 1.25,
            ease: 'power2.inOut',
          },
          '-=0.8'
        )
        .to(
          numPathRef.current,
          {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.15'
        )
        .fromTo(
          sigWrapperRef.current,
          { filter: 'drop-shadow(0 0 10px rgba(255,229,0,0.6))' },
          {
            filter: 'drop-shadow(0 0 22px rgba(255,229,0,1))',
            duration: 0.4,
            yoyo: true,
            repeat: 1,
            ease: 'sine.inOut',
          }
        );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative w-full select-none z-10 pt-4 sm:pt-8 md:pt-12 pb-12 sm:pb-20 px-2 sm:px-4 md:px-6 bg-transparent text-white"
    >
      {/* 
        =============================================================================
        DEEP ARCH FOOTER CARD (CATHEDRAL VAULT CANOPY WITH ROUNDED BASE)
        - Dramatic steep arched dome top (rounded-t-[140px] to rounded-t-[220px])
        - Smooth aerodynamic rounded bottom (rounded-b-[40px] to rounded-b-[60px])
        - Solid dark charcoal surface (#0c0c0c)
        =============================================================================
      */}
      <div className="relative z-10 mx-auto w-[calc(100%-16px)] sm:w-[calc(100%-32px)] md:w-[calc(100%-48px)] max-w-[1860px] rounded-t-[140px] sm:rounded-t-[180px] md:rounded-t-[220px] rounded-b-[40px] sm:rounded-b-[50px] md:rounded-b-[60px] bg-[#0c0c0c] border-t border-white/10 shadow-[0_-20px_60px_rgba(220,38,38,0.25)] filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.98)] overflow-hidden">

        {/* SUBTLE INNER GLOW (Highlights the cathedral arch curve from within) */}
        <div className="absolute inset-x-0 top-0 h-44 sm:h-56 rounded-t-[140px] sm:rounded-t-[180px] md:rounded-t-[220px] bg-gradient-to-b from-white/5 via-red-600/[0.03] to-transparent pointer-events-none" />

        {/* Internal Subtle Center Radial Ambience */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] sm:w-[850px] h-[550px] rounded-full opacity-20 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(circle, rgba(225,6,0,0.35) 0%, rgba(255,229,0,0.05) 45%, transparent 70%)',
          }}
        />

        {/* Main Footer Content: Constrained inside max-w-6xl mx-auto px-8 (z-20 in front of ticker) */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 md:pt-28 pb-0 flex flex-col items-center">

          {/* ========================================================================= */}
          {/* CENTER EDITORIAL: SIGNATURE + ARCH CANOPY CENTERED HEADING                */}
          {/* ========================================================================= */}
          <div className="relative w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center mb-0 overflow-visible z-10">
            <div className="relative inline-flex flex-col items-center justify-center text-center overflow-visible">

              {/* 🏎️ Live Handwritten SVG Signature in Glowing Modena Yellow (#FFE500) */}
              <div
                ref={sigWrapperRef}
                className="absolute -top-12 sm:-top-16 md:-top-22 -left-6 sm:-left-12 md:-left-14 w-48 sm:w-64 md:w-80 pointer-events-none z-20 overflow-visible"
              >
                <svg
                  viewBox="80 10 820 720"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto overflow-visible filter drop-shadow-[0_0_14px_rgba(255,229,0,0.85)]"
                >
                  <path
                    ref={sigPathRef}
                    d="M 240 395 C 205 435 180 472 190 495 C 202 510 238 485 285 425 C 335 358 375 295 385 295 C 392 295 355 372 295 488 C 240 595 178 685 150 715 C 145 720 150 715 160 700 C 220 605 365 405 495 155 C 508 128 522 135 512 170 C 490 240 422 398 402 468 C 392 502 404 515 428 495 C 455 468 478 405 480 378 C 482 358 468 362 458 385 C 448 412 452 450 480 432 C 512 410 550 350 580 300 C 590 285 580 305 562 335 C 535 382 508 430 440 472 C 420 482 430 478 465 452 C 518 408 618 295 688 115 C 702 78 715 68 708 95 C 700 145 650 270 602 325 C 588 340 598 332 628 310 C 675 278 725 265 725 265 C 695 272 632 295 542 348 C 452 400 415 430 420 425 C 430 415 502 358 595 298 C 675 248 760 180 828 145 C 852 132 865 142 858 165 C 852 192 845 230 845 245"
                    stroke="#FFE500"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    ref={numPathRef}
                    d="M 680 260 L 685 360 M 670 300 L 710 300 M 740 280 C 755 270 775 285 770 310 C 765 330 750 355 775 355 C 785 355 795 345 795 335"
                    stroke="#FFE500"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* ✨ Kinetic Editorial Mask Reveal Heading */}
              <h2 className="relative z-10 font-racing font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight uppercase leading-[0.92] text-white text-center overflow-visible">
                <div className="overflow-hidden py-1">
                  <span
                    ref={headingLine1Ref}
                    className="block tracking-[-0.03em] will-change-transform"
                  >
                    ALWAYS{' '}
                    <span className="font-editorial italic font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FFE500] tracking-normal lowercase">
                      pushing
                    </span>
                  </span>
                </div>
                <div className="overflow-hidden py-1 mt-1 sm:mt-2">
                  <span
                    ref={headingLine2Ref}
                    className="block tracking-[-0.03em] will-change-transform"
                  >
                    THE LIMIT.
                  </span>
                </div>
              </h2>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3-COLUMN ASSET STACKING: PAGES | DRIVER HERO OVERLAP | FOLLOW ON          */}
          {/* ========================================================================= */}
          <div className="relative w-full grid grid-cols-1 md:grid-cols-3 items-end justify-between min-h-[440px] sm:min-h-[500px] md:min-h-[580px]">

            {/* LEFT COLUMN: PAGES NAVIGATION (Telemetry Focus + Sibling Dimming) */}
            <div className="relative z-20 flex flex-col items-center md:items-start text-center md:text-left mb-12 sm:mb-16 md:mb-24">
              <span
                ref={pagesHeadingRef}
                className="font-mono-telemetry text-xs sm:text-sm tracking-[0.35em] text-neutral-400 font-bold uppercase mb-5 block will-change-transform"
              >
                PAGES
              </span>
              <ul
                ref={pagesListRef}
                className="flex flex-col gap-2.5 sm:gap-3.5 text-base sm:text-lg md:text-xl font-racing font-black tracking-tight uppercase"
              >
                {pageLinks.map((item) => {
                  const isHovered = hoveredPage === item.label;
                  const isOtherHovered = hoveredPage !== null && !isHovered;

                  return (
                    <li key={item.label} className="pages-nav-item overflow-visible py-0.5 pr-8">
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        onMouseEnter={() => setHoveredPage(item.label)}
                        onMouseLeave={() => setHoveredPage(null)}
                        className={`inline-flex items-center gap-2 transition-all duration-300 ease-out will-change-transform ${isHovered
                          ? 'text-[#FFE500] translate-x-3 sm:translate-x-4 scale-[1.03] drop-shadow-[0_0_16px_rgba(255,229,0,0.85)]'
                          : isOtherHovered
                            ? 'text-neutral-600 opacity-30 scale-[0.97] blur-[0.3px]'
                            : item.external
                              ? 'text-[#FFE500] opacity-100 hover:text-white'
                              : 'text-neutral-300 opacity-100'
                          }`}
                      >
                        {/* Telemetry Accent Pip on Hover */}
                        <span
                          className={`font-mono text-xs text-[#E10600] font-bold transition-all duration-300 ${isHovered
                            ? 'opacity-100 inline-block -ml-1 mr-1'
                            : 'opacity-0 w-0 -ml-2 overflow-hidden'
                            }`}
                        >
                          //
                        </span>
                        <span>{item.label}</span>
                        {item.external && (
                          <ArrowUpRight
                            className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-0.5 -translate-y-0.5' : ''
                              }`}
                          />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CENTER COLUMN: FOREGROUND DRIVER HERO */}
            <div className="relative w-full h-full flex flex-col items-center justify-end z-20 -mt-28 sm:-mt-40 md:-mt-52 lg:-mt-64 pointer-events-none">
              {/* Lebar dinaikkan sedikit lagi agar helm & bahu lebih kokoh dan dominan */}
              <div className="relative w-[420px] sm:w-[530px] md:w-[640px] lg:w-[750px] xl:w-[800px] flex flex-col items-center pointer-events-auto">

                {/* Authentic Cutout: Charles Leclerc with Monaco Helmet & Fleece Jacket extending to bottom */}
                <div ref={driverHeroRef} className="w-full will-change-transform">
                  <img
                    src="/images/leclerc-footer.png"
                    alt="Charles Leclerc Monaco Helmet & Signature Jacket"
                    className="w-full h-auto object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] filter contrast-[1.04] relative z-20 transition-transform duration-500 hover:scale-[1.01] block -mb-14 sm:-mb-18 md:-mb-22"
                    loading="eager"
                    decoding="async"
                  />
                </div>

                {/* Pill Button: BUSINESS ENQUIRIES across chest (z-30) with Sheen Sweep */}
                <div
                  ref={ctaRef}
                  className="absolute bottom-14 sm:bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap will-change-transform"
                >
                  <MagneticEffect factor={0.25}>
                    <a
                      href="mailto:business@charlesleclerc.com"
                      className="group relative inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#FFE500] hover:bg-[#fff04d] text-black font-racing font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_10px_30px_rgba(255,229,0,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                    >
                      {/* Diagonal light sheen sweep on hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none" />
                      <span className="relative z-10">BUSINESS ENQUIRIES</span>
                      <ArrowUpRight className="relative z-10 w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </MagneticEffect>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FOLLOW ON (Telemetry Focus + Sibling Dimming) */}
            <div className="relative z-20 flex flex-col items-center md:items-end text-center md:text-right mb-12 sm:mb-16 md:mb-24">
              <span
                ref={followHeadingRef}
                className="font-mono-telemetry text-xs sm:text-sm tracking-[0.35em] text-neutral-400 font-bold uppercase mb-5 block will-change-transform"
              >
                FOLLOW ON
              </span>
              <ul
                ref={followListRef}
                className="flex flex-col gap-2.5 sm:gap-3.5 text-base sm:text-lg md:text-xl font-racing font-black tracking-tight uppercase"
              >
                {followLinks.map((item) => {
                  const isHovered = hoveredFollow === item.label;
                  const isOtherHovered = hoveredFollow !== null && !isHovered;

                  return (
                    <li key={item.label} className="follow-nav-item overflow-visible py-0.5 pl-8">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setHoveredFollow(item.label)}
                        onMouseLeave={() => setHoveredFollow(null)}
                        className={`inline-flex items-center gap-2 transition-all duration-300 ease-out will-change-transform ${isHovered
                          ? 'text-[#FFE500] -translate-x-3 sm:-translate-x-4 scale-[1.03] drop-shadow-[0_0_16px_rgba(255,229,0,0.85)]'
                          : isOtherHovered
                            ? 'text-neutral-600 opacity-30 scale-[0.97] blur-[0.3px]'
                            : 'text-neutral-300 opacity-100'
                          }`}
                      >
                        <span>{item.label}</span>
                        {/* Telemetry Accent Pip on Hover */}
                        <span
                          className={`font-mono text-xs text-[#E10600] font-bold transition-all duration-300 ${isHovered
                            ? 'opacity-100 inline-block -mr-1 ml-1'
                            : 'opacity-0 w-0 -mr-2 overflow-hidden'
                            }`}
                        >
                          //
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>

        </div >

        {/* ========================================================================= */}
        {/* BORDERLESS SPONSOR NEWS TICKER (MASKED BEHIND DRIVER PHOTO, WHITE //)     */}
        {/* ========================================================================= */}
        <div className="absolute bottom-14 sm:bottom-16 md:bottom-20 left-0 right-0 z-10 w-full overflow-hidden select-none pointer-events-none py-2">
          {/* Edge fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#0c0c0c] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#0c0c0c] to-transparent z-10 pointer-events-none" />

          <div className="flex w-[max-content] animate-marquee items-center gap-10 sm:gap-14 text-xs sm:text-sm font-racing uppercase tracking-[0.25em] text-[#dc2626]">
            {tickerItems.map((sponsor, idx) => (
              <div key={idx} className="flex items-center gap-10 sm:gap-14 whitespace-nowrap">
                <span className="font-bold drop-shadow-[0_0_12px_rgba(220,38,38,0.4)]">
                  {sponsor}
                </span>
                <span className="text-white font-mono-telemetry font-bold opacity-80">
                  //
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CLEAN LUXURY LEGAL STRIP AT BASE OF CATHEDRAL CARD (FULL WIDTH CORNERS)   */}
        {/* ========================================================================= */}
        <div className="relative z-30 w-full px-8 sm:px-12 md:px-16 lg:px-24 pt-4 pb-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs font-mono-telemetry text-neutral-400 uppercase tracking-wider">
          <div>
            <span>
              © {new Date().getFullYear()} Charles Leclerc. All rights reserved
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#hero"
              className="hover:text-[#FFE500] transition-colors"
            >
              PRIVACY POLICY
            </a>
            <span>•</span>
            <a
              href="#hero"
              className="hover:text-[#FFE500] transition-colors"
            >
              TERMS
            </a>
          </div>
        </div>

      </div >
    </footer >
  );
}
