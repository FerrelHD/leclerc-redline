import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/sections/Navbar';
import FaceHelmetReveal from './components/hero/FaceHelmetReveal';
import StorytellingScroll from './components/sections/StorytellingScroll';
import PodiumGallery from './components/sections/PodiumGallery';
import MonacoMaranelloSplit from './components/sections/MonacoMaranelloSplit';
import ArchiveZoomParallax from './components/sections/ArchiveZoomParallax';
import SocialsDeck from './components/sections/SocialsDeck';
import Footer from './components/sections/Footer';
import CustomCursor from './components/ui/CustomCursor';
import LoadingScreen from './components/ui/LoadingScreen';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function App() {
  useEffect(() => {
    // Prevent browser from restoring scroll to middle of page before GSAP/Lenis calculates heights
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      infinite: false,
    });

    // Tick Lenis inside GSAP's RAF so both share the same frame loop
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Push scroll position to ScrollTrigger on every Lenis tick
    lenis.on('scroll', ScrollTrigger.update);

    // Global load handler to guarantee accurate ScrollTrigger positions across all sections
    const handleGlobalRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleGlobalRefresh);

    if (document.fonts) {
      document.fonts.ready.then(handleGlobalRefresh);
    }

    // Recalculate as images finish decoding
    const imgs = document.querySelectorAll('img');
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', handleGlobalRefresh, { once: true });
        img.addEventListener('error', handleGlobalRefresh, { once: true });
      }
    });

    const t1 = setTimeout(handleGlobalRefresh, 150);
    const t2 = setTimeout(handleGlobalRefresh, 500);
    const t3 = setTimeout(handleGlobalRefresh, 1200);

    return () => {
      window.removeEventListener('load', handleGlobalRefresh);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#080809] text-[#F8F9FA]">
      {/* Luxury Motorsport Telemetry Preloader */}
      <LoadingScreen />

      {/* Precision Dynamic Cursor */}
      <CustomCursor />

      {/* Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Floating HUD Navigation Bar */}
      <Navbar />

      {/* Main Experience Flow */}
      <main className="relative z-10 bg-[#0A0A0A]">
        {/* Section 1: Hero & Signature 3D Face-Helmet Slice Reveal */}
        <section id="hero">
          <FaceHelmetReveal />
        </section>

        {/* Section 2: Cinematic Storytelling with Kinetic Scroll Fill */}
        <StorytellingScroll />

        {/* Section 3: The Glory - Horizontal Podium Gallery */}
        <PodiumGallery />

        {/* Section 4: Dual Identity - Monaco Roots vs Maranello Spirit */}
        <MonacoMaranelloSplit />

        {/* Section 5: The Raw Archive - 3D Editorial Zoom Parallax */}
        <ArchiveZoomParallax />

      </main>

      {/* ========================================================================= */}
      {/* UNIFIED SOCIALS & MOTORSPORT LUXURY FOOTER                                */}
      {/* ========================================================================= */}
      <div className="relative z-30 -mt-[100vh] w-full bg-[#050000] text-white rounded-t-[50px] md:rounded-t-[70px] shadow-[0_-40px_100px_rgba(0,0,0,0.98)] border-t border-white/[0.08] overflow-hidden">

        {/* SUBTLE FLAT DOME + FULL-BLEED RED FLOW TO BOTTOM */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{
            background: `
              /* 1. Lengkungan merah SANGAT LANDAI di puncak kartu (lebar 240% biar ga ngebulet) */
              radial-gradient(ellipse 240% 700px at 50% 640px, rgba(225, 6, 0, 0.46) 0%, rgba(185, 12, 12, 0.28) 45%, transparent 75%),

              /* 2. Merah pekat mengalir penuh sampai ke paling bawah (TIDAK balik ke hitam) */
              linear-gradient(to bottom, transparent 0%, transparent 480px, rgba(160, 10, 10, 0.35) 650px, rgba(145, 8, 8, 0.48) 950px, rgba(115, 6, 6, 0.52) 100%)
            `,
          }}
        />

        {/* Section 6: What's Up On Socials - Fanned Cards Deck */}
        <SocialsDeck />

        {/* Section 7: Official Motorsport Luxury Footer */}
        <Footer />
      </div>
    </div>
  );
}
