import React from 'react';
import TextBoxReveal from '../ui/TextBoxReveal';

export default function StorytellingScroll() {
  return (
    <section className="relative w-full bg-[#0A0A0A] text-white z-30 py-32 md:py-48 px-6 md:px-12 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
      
      {/* Subtle Background Radial Glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E10600]/10 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center select-none">

        {/* 1. Headlines with Red Text Box Wipe Reveal */}
        <div className="flex flex-col items-center gap-2 md:gap-3 text-center">
          <TextBoxReveal delay={0.1} duration={0.6} className="py-0.5">
            <span className="font-racing font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-[#E10600] uppercase whitespace-nowrap block">
              BORN IN MONACO.
            </span>
          </TextBoxReveal>

          <TextBoxReveal delay={0.25} duration={0.6} className="py-0.5">
            <span className="font-racing font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-[#E10600] uppercase whitespace-nowrap block">
              FORGED IN MARANELLO.
            </span>
          </TextBoxReveal>
        </div>

        {/* 2. Storytelling Paragraph with Natural Clean Centered Typography */}
        <TextBoxReveal delay={0.45} duration={0.7} className="mt-10 md:mt-12 max-w-2xl text-center">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light tracking-wide leading-relaxed text-neutral-300 text-center">
            A relentless pursuit of perfection. From the narrow streets of the Principality to the iconic{' '}
            <span className="font-semibold text-[#E10600]">Rosso Corsa</span> of Scuderia Ferrari, Charles Leclerc embodies the pure essence of racing speed.
          </p>
        </TextBoxReveal>

      </div>
    </section>
  );
}
