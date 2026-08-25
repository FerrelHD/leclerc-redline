import React, { useState } from 'react';
import { ArrowUpRight, Flag, Music, Sparkles, Activity } from 'lucide-react';
import TechFrame from '../ui/TechFrame';

export default function OnTrackOffTrack() {
  const [activeSide, setActiveSide] = useState('on'); // 'on' | 'off'

  return (
    <section id="ontrack-offtrack" className="relative w-full min-h-screen py-24 px-6 md:px-12 bg-[#080809] flex flex-col justify-center overflow-hidden border-t border-b border-white/[0.08]">

      {/* Dynamic Background Image Cross-Fade */}
      <div className="absolute inset-0 z-0">
        {/* ON TRACK Background (Ferrari Cockpit / Racing Speed) */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeSide === 'on' ? 'opacity-40 scale-100' : 'opacity-0 scale-105'} transition-transform duration-1000`}
        >
          <img
            src="/images/charles-on-track.jpg"
            alt="Charles Leclerc On Track"
            className="w-full h-full object-cover filter contrast-125 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080809] via-[#080809]/60 to-[#080809]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent to-[#080809]" />
        </div>

        {/* OFF TRACK Background (Piano / Armani Lifestyle) */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeSide === 'off' ? 'opacity-40 scale-100' : 'opacity-0 scale-105'} transition-transform duration-1000`}
        >
          <img
            src="/images/charles-off-track.jpg"
            alt="Charles Leclerc Off Track"
            className="w-full h-full object-cover filter contrast-110 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080809] via-[#080809]/60 to-[#080809]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent to-[#080809]" />
        </div>
      </div>

      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto w-full mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono-telemetry uppercase tracking-widest text-[#E10600] flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#E10600]" />
            DUAL IDENTITY PARADIGM
          </span>
          <h2 className="text-4xl md:text-6xl font-racing font-extrabold tracking-tight text-white uppercase">
            THE TWO WORLDS OF <span className="text-[#E10600]">#16</span>
          </h2>
        </div>
        <p className="text-sm font-mono-telemetry text-neutral-400 max-w-md">
          Between 340 km/h apexes in Maranello red and classical piano compositions in Monte Carlo.
        </p>
      </div>

      {/* Interactive Dual Split Cards Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* CARD 1: ON TRACK */}
        <div
          onMouseEnter={() => setActiveSide('on')}
          className={`cursor-pointer transition-all duration-500 transform ${activeSide === 'on' ? 'scale-[1.02]' : 'opacity-70 scale-95'}`}
        >
          <TechFrame active={activeSide === 'on'} color="#E10600">
            <div className="p-8 md:p-12 min-h-[420px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#121316]/90 to-[#0c0d10]/95 backdrop-blur-xl">

              {/* Card Top Pill */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded bg-[#E10600]/20 border border-[#E10600]/40 text-[#E10600] text-xs font-mono-telemetry font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5" />
                  MOTORSPORT APEX
                </span>
                <span className="text-xs font-mono-telemetry text-neutral-500">
                  FERRARI SF-25
                </span>
              </div>

              {/* Massive Title */}
              <div className="my-8">
                <h3 className="text-5xl md:text-7xl font-racing font-black text-white leading-none uppercase tracking-tighter">
                  ON <br />
                  <span className="text-[#E10600]">TRACK</span>
                </h3>
                <p className="text-sm text-neutral-300 font-mono-telemetry mt-4 leading-relaxed max-w-sm">
                  Pole position masterclasses, Monaco GP street warfare, and the relentless quest for Scuderia Ferrari world championship glory.
                </p>
              </div>

              {/* Action Button & Telemetry Preview */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs font-mono-telemetry text-neutral-400">
                  <span>POLES: <strong className="text-white">26</strong></span>
                  <span>WINS: <strong className="text-white">8</strong></span>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#E10600] text-white flex items-center justify-center shadow-lg shadow-[#E10600]/40 transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </TechFrame>
        </div>

        {/* CARD 2: OFF TRACK */}
        <div
          onMouseEnter={() => setActiveSide('off')}
          className={`cursor-pointer transition-all duration-500 transform ${activeSide === 'off' ? 'scale-[1.02]' : 'opacity-70 scale-95'}`}
        >
          <TechFrame active={activeSide === 'off'} color="#FFE500">
            <div className="p-8 md:p-12 min-h-[420px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#121316]/90 to-[#0c0d10]/95 backdrop-blur-xl">

              {/* Card Top Pill */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded bg-[#FFE500]/20 border border-[#FFE500]/40 text-[#FFE500] text-xs font-mono-telemetry font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  ART & CULTURE
                </span>
                <span className="text-xs font-mono-telemetry text-neutral-500">
                  PIANO & LIFESTYLE
                </span>
              </div>

              {/* Massive Title */}
              <div className="my-8">
                <h3 className="text-5xl md:text-7xl font-racing font-black text-white leading-none uppercase tracking-tighter">
                  OFF <br />
                  <span className="text-[#FFE500] font-editorial normal-case">Track</span>
                </h3>
                <p className="text-sm text-neutral-300 font-mono-telemetry mt-4 leading-relaxed max-w-sm">
                  Neoclassical piano compositions (*AUS23, DREAMERS*), Giorgio Armani ambassadorship, LEC ice cream creation, and Leo the dachshund.
                </p>
              </div>

              {/* Action Button & Culture Preview */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs font-mono-telemetry text-neutral-400">
                  <span>STREAMING: <strong className="text-white">TOP 50</strong></span>
                  <span>FASHION: <strong className="text-white">ARMANI</strong></span>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#FFE500] text-black flex items-center justify-center shadow-lg shadow-[#FFE500]/40 transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </TechFrame>
        </div>

      </div>
    </section>
  );
}
