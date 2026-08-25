import React from 'react';
import { Code, Box, Cpu, Sparkles, Terminal, Activity } from 'lucide-react';
import { playMicroSound } from '../../utils/audio';

const CAPABILITIES = [
  {
    index: '01',
    title: 'Creative Engineering',
    icon: Code,
    desc: 'Bespoke micro-interactions, spring physics, dynamic scroll choreography, and tactile DOM elements using GSAP, Lenis, and modern Web APIs.',
    items: ['GSAP & ScrollTrigger', 'Custom Cursor Dynamics', 'Lenis Smooth Engine', 'Fluid Web Animations'],
  },
  {
    index: '02',
    title: 'WebGL & GLSL Optics',
    icon: Box,
    desc: 'Real-time 3D rendering with custom shaders, refraction, volumetric caustics, and procedural geometry generation optimized for 60 FPS.',
    items: ['Three.js & Custom Shaders', 'Transmission & Dispersion', 'Procedural Topologies', 'Draw Call Optimization'],
  },
  {
    index: '03',
    title: 'Systems & Architecture',
    icon: Cpu,
    desc: 'Scalable frontend engineering with zero cumulative layout shift, strict memory management, and rigorous responsive typography systems.',
    items: ['React / Vite Architecture', 'Swiss Typographic Grid', 'A11y & Performance Budget', 'Web Audio API Feedback'],
  },
];

export default function Capabilities({ setIsCapabilitiesHovered, audioEnabled }) {
  return (
    <section
      id="capabilities"
      className="relative min-h-screen w-full px-6 py-24 md:px-16 md:py-32 z-10 select-none"
    >
      {/* Section Header */}
      <div className="reveal-item flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-subtle pb-6 mb-12">
        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-xs uppercase tracking-widest text-muted">
            INDEX 03 // DISCIPLINE
          </span>
          <span className="h-3 w-px bg-border-subtle"></span>
          <h2 className="font-display font-bold text-xl md:text-2xl uppercase tracking-tight">
            Capabilities &amp; Methodology
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono-tech text-xs text-muted mt-2 sm:mt-0">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span>REAL-TIME X-RAY SHADER</span>
        </div>
      </div>

      {/* 3-Column Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CAPABILITIES.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.index}
              data-speed={(idx + 1) * 0.05}
              onMouseEnter={() => {
                setIsCapabilitiesHovered(true);
                playMicroSound('hover', audioEnabled);
              }}
              onMouseLeave={() => setIsCapabilitiesHovered(false)}
              className="reveal-item p-8 rounded-2xl border border-subtle glass-panel hover:border-strong transition-all duration-300 group pointer-events-auto flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-muted">({cap.index})</span>
                  <div className="p-2.5 rounded-full border border-subtle group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </div>

                <h3 className="font-display font-bold text-2xl uppercase mt-6 tracking-tight">
                  {cap.title}
                </h3>
                <p className="mt-3 text-sm text-muted leading-relaxed font-light">
                  {cap.desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-subtle">
                <span className="font-mono-tech text-[11px] uppercase tracking-wider text-muted block mb-3">
                  Core Technologies:
                </span>
                <ul className="space-y-2">
                  {cap.items.map((item, i) => (
                    <li
                      key={i}
                      className="font-mono-tech text-xs text-primary/80 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
