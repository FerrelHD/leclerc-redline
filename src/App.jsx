import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/sections/Navbar';
import FaceHelmetReveal from './components/hero/FaceHelmetReveal';
import StorytellingScroll from './components/sections/StorytellingScroll';
import PodiumGallery from './components/sections/PodiumGallery';
import MonacoMaranelloSplit from './components/sections/MonacoMaranelloSplit';
import HelmetVault from './components/sections/HelmetVault';
import OnTrackOffTrack from './components/sections/OnTrackOffTrack';
import Footer from './components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

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





  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#080809] text-[#F8F9FA]">

      {/* Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Floating HUD Navigation Bar */}
      <Navbar isAudioPlaying={isAudioPlaying} toggleAudio={toggleAudio} />

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

      </main>

      {/* Section 6: Official Motorsport Luxury Footer */}
      <Footer />

    </div>
  );
}
