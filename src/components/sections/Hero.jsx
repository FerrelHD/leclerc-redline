import React from 'react';
import { ArrowDownRight, Compass, Sparkles } from 'lucide-react';
import { playMicroSound } from '../../utils/audio';

export default function Hero({ audioEnabled }) {
  const scrollToWorks = () => {
    playMicroSound('click', audioEnabled);
    const el = document.getElementById('works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between px-6 py-24 md:px-16 md:py-28 z-10 select-none"
    >
      {/* Top Section Metadata */}
      <div className="reveal-item flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 md:pt-4 border-b border-subtle pb-6">
        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-xs uppercase tracking-widest text-muted">
            INDEX 01 // OVERTURE
          </span>
          <span className="h-3 w-px bg-border-subtle hidden sm:inline-block"></span>
          <span className="font-mono-tech text-xs text-muted">
            CREATIVE DEV &amp; 3D INTERACTION
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono-tech text-xs text-muted">
          <Compass className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '10s' }} />
          <span>EST. 2026 / TACTILE LAB</span>
        </div>
      </div>

      {/* Main Massive Editorial Title with Clean Editorial Hierarchy */}
      <div className="my-auto py-8 sm:py-12 flex flex-col justify-center max-w-7xl">
        <div className="reveal-item mb-4 sm:mb-6">
          <p className="font-mono-tech text-xs uppercase tracking-widest text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            AESTHETIC PHYSICALITY IN THE BROWSER
          </p>
        </div>

        <div className="space-y-1 sm:space-y-3">
          <h1
            data-speed="0.1"
            className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight uppercase leading-none"
          >
            Form &amp;
          </h1>
          <h2
            data-speed="-0.08"
            className="italic font-serif-editorial text-iridescent text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none"
          >
            Matter
          </h2>
        </div>

        <div className="reveal-item mt-8 sm:mt-10 max-w-lg">
          <p className="text-xs sm:text-sm md:text-base text-muted font-light leading-relaxed">
            Exploring the friction between weightless digital code and tactile, physical materials. Real-time GLSL optics, procedural 3D sculpture, and editorial Swiss precision.
          </p>
        </div>
      </div>

      {/* Bottom Telemetry & Scroll Cue */}
      <div className="reveal-item flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-6 border-t border-subtle">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono-tech text-xs">
          <div>
            <span className="block text-muted">FRAMEWORK</span>
            <span className="font-medium text-primary">THREE.JS / SHADERS</span>
          </div>
          <div>
            <span className="block text-muted">AESTHETIC</span>
            <span className="font-medium text-primary">SWISS MONOLITH</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-muted">PHYSICS</span>
            <span className="font-medium text-primary">INERTIAL / TACTILE</span>
          </div>
        </div>

        {/* Scroll CTA */}
        <button
          onClick={scrollToWorks}
          onMouseEnter={() => playMicroSound('hover', audioEnabled)}
          className="group self-start sm:self-auto flex items-center gap-3 px-5 py-3 rounded-full border border-subtle glass-panel hover:border-strong transition-all duration-300 pointer-events-auto"
        >
          <span className="font-mono-tech text-xs uppercase tracking-wider">Explore Selected Works</span>
          <ArrowDownRight className="w-4 h-4 text-primary transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
        </button>
      </div>
    </section>
  );
}
