import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CustomCursor from './components/ui/CustomCursor';
import Navbar from './components/sections/Navbar';
import FaceHelmetReveal from './components/hero/FaceHelmetReveal';
import HelmetVault from './components/sections/HelmetVault';
import OnTrackOffTrack from './components/sections/OnTrackOffTrack';
import Footer from './components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Initialize Lenis Smooth Inertia Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#080809] text-[#F8F9FA] overflow-x-hidden">

      {/* Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Spring Physics Precision Cursor */}
      <CustomCursor />

      {/* Floating HUD Navigation Bar */}
      <Navbar isAudioPlaying={isAudioPlaying} toggleAudio={toggleAudio} />

      {/* Main Experience Flow */}
      <main className="relative z-10 bg-[#0A0A0A]">

        {/* Section 1: Hero & Signature 3D Face-Helmet Slice Reveal */}
        <section id="hero">
          <FaceHelmetReveal />
        </section>

      </main>

      {/* Section 6: Official Motorsport Luxury Footer */}
      <Footer />

    </div>
  );
}
