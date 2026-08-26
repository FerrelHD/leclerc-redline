import React, { useState } from 'react';
import { helmetsCollection } from '../../data/charlesData';
import TechFrame from '../ui/TechFrame';
import { Shield, Sparkles, Layers, Info } from 'lucide-react';

export default function HelmetVault() {
  const [selectedHelmet, setSelectedHelmet] = useState(helmetsCollection[0]);

  return (
    <section id="helmet-vault" className="relative w-full py-28 px-6 md:px-12 bg-[#080809] border-b border-white/[0.08] overflow-hidden">

      {/* Background Decorative Tech Lines */}
      <div className="absolute inset-0 bg-carbon-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header Layout (Matches Lando Norris Helmets Hall of Fame) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-telemetry text-[#E10600] tracking-widest uppercase mb-2">
              <Shield className="w-4 h-4" />
              <span>THE VAULT ARCHIVE</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-racing font-extrabold text-white uppercase tracking-tight">
              HELMETS <br />
              <span className="text-[#E10600] font-editorial normal-case">Hall of Fame</span>
            </h2>
          </div>
          <p className="text-sm font-mono-telemetry text-neutral-400 max-w-md">
            From the emotional tributes honoring his father Hervé and Jules Bianchi, to the triumphal Rosso Corsa worn at Monza and Monaco.
          </p>
        </div>

        {/* Main Interactive Stage: Showcase Viewer & Selected Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">

          {/* Left Column: Interactive Showcase Box */}
          <div className="lg:col-span-7 bg-[#101114]/90 rounded-2xl p-8 border border-white/10 relative overflow-hidden backdrop-blur-xl group">
            {/* Dynamic Ambient Glow Behind Helmet */}
            <div
              className="absolute inset-0 opacity-20 blur-3xl transition-all duration-700 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${selectedHelmet.color}, transparent 70%)` }}
            />

            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono-telemetry text-neutral-400 z-10">
              <span className="w-2 h-2 rounded-full bg-[#E10600]" />
              <span>OFFICIAL TELEMETRY ARCHIVE</span>
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 rounded bg-[#E10600]/20 text-[#E10600] text-xs font-mono-telemetry font-bold z-10">
              {selectedHelmet.tag}
            </div>

            {/* Showcase Image Display */}
            <div className="py-6 flex flex-col items-center justify-center relative z-10">
              <div className="w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] relative flex items-center justify-center">
                <img
                  key={selectedHelmet.id}
                  src={selectedHelmet.image}
                  alt={selectedHelmet.title}
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="text-[10px] font-mono-telemetry text-neutral-400 tracking-wider uppercase mt-2 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                BELL RACING HP77 // CARBON COMPOSITE // {selectedHelmet.year}
              </div>
            </div>

            {/* Bottom Status bar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono-telemetry text-neutral-400 z-10 relative">
              <span>MODEL: BELL HP77 FIA 8860</span>
              <span>LIVERY: {selectedHelmet.title}</span>
            </div>
          </div>

          {/* Right Column: Detailed Story & Specs Card */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#121316]/70 rounded-2xl p-8 border border-white/10 backdrop-blur-md">
            <div>
              <span className="text-xs font-mono-telemetry text-[#FFE500] uppercase tracking-wider block mb-1">
                SEASON // {selectedHelmet.year}
              </span>
              <h3 className="text-3xl font-racing font-bold text-white mb-4">
                {selectedHelmet.title}
              </h3>
              <p className="text-sm font-mono-telemetry text-neutral-300 leading-relaxed mb-6">
                {selectedHelmet.description}
              </p>
            </div>

            {/* Technical Specs List */}
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-xs font-mono-telemetry text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#E10600]" />
                ENGINEERING SPECIFICATIONS
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {selectedHelmet.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono-telemetry text-neutral-300 bg-white/[0.03] p-2 rounded border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Helmet Collection Cards Grid (Matches Lando's Gallery) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {helmetsCollection.map((helm) => {
            const isSelected = selectedHelmet.id === helm.id;
            return (
              <div
                key={helm.id}
                onClick={() => setSelectedHelmet(helm)}
                className="cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                <TechFrame active={isSelected} color={helm.color}>
                  <div className="p-6 flex flex-col justify-between h-full bg-[#101114] relative group">
                    {/* Top tag & Year */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-mono-telemetry text-[#E10600] font-bold uppercase">
                        {helm.tag}
                      </span>
                      <span className="text-xs font-mono-telemetry text-neutral-400 font-bold">
                        {helm.year}
                      </span>
                    </div>

                    {/* Image Preview with Hover Visor Glow */}
                    <div className="relative aspect-square rounded-lg overflow-hidden my-4 bg-black/40 border border-white/5">
                      <img
                        src={helm.image}
                        alt={helm.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-lg font-racing font-bold text-white group-hover:text-[#E10600] transition-colors">
                        {helm.title}
                      </h4>
                      <p className="text-xs font-mono-telemetry text-neutral-400 mt-1 line-clamp-2">
                        {helm.description}
                      </p>
                    </div>

                    {/* Active Indicator */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono-telemetry">
                      <span className={isSelected ? 'text-[#E10600] font-bold' : 'text-neutral-500'}>
                        {isSelected ? '● ACTIVE SHOWCASE' : 'SELECT TO VIEW'}
                      </span>
                      <span className="text-neutral-400">#16</span>
                    </div>
                  </div>
                </TechFrame>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
