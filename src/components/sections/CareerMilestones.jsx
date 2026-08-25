import React from 'react';
import { careerMilestones, driverProfile } from '../../data/charlesData';
import { Trophy, Radio, Activity, Zap } from 'lucide-react';
import TechFrame from '../ui/TechFrame';

export default function CareerMilestones() {
  return (
    <section id="milestones" className="relative w-full py-28 px-6 md:px-12 bg-[#080809] border-b border-white/[0.08] overflow-hidden">

      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-[#E10600]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono-telemetry text-[#E10600] uppercase tracking-widest flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4" />
              RACE VICTORIES & TEAM RADIO
            </span>
            <h2 className="text-4xl md:text-6xl font-racing font-extrabold text-white uppercase tracking-tight">
              HISTORIC <span className="text-[#E10600]">Milestones</span>
            </h2>
          </div>
          <div className="flex items-center gap-6 text-sm font-mono-telemetry text-neutral-400">
            <div>
              <span className="text-2xl font-racing font-bold text-white block">{driverProfile.stats.poles}</span>
              <span className="text-[10px] uppercase">Pole Positions</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <span className="text-2xl font-racing font-bold text-[#E10600] block">{driverProfile.stats.wins}</span>
              <span className="text-[10px] uppercase">Grand Prix Wins</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <span className="text-2xl font-racing font-bold text-[#FFE500] block">{driverProfile.stats.podiums}</span>
              <span className="text-[10px] uppercase">Podium Finishes</span>
            </div>
          </div>
        </div>

        {/* Milestone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {careerMilestones.map((milestone, idx) => (
            <TechFrame key={idx} color="#E10600">
              <div className="p-8 h-full flex flex-col justify-between bg-[#111215] relative group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono-telemetry font-bold text-[#E10600] bg-[#E10600]/10 px-2.5 py-1 rounded">
                      {milestone.year}
                    </span>
                    <span className="text-xs font-mono-telemetry text-neutral-500 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-[#E10600]" />
                      LIVE RADIO
                    </span>
                  </div>

                  <h3 className="text-2xl font-racing font-bold text-white mb-4 group-hover:text-[#E10600] transition-colors">
                    {milestone.event}
                  </h3>

                  <blockquote className="text-sm font-editorial text-neutral-300 italic mb-6 leading-relaxed bg-white/[0.02] p-4 rounded-lg border-l-2 border-[#E10600]">
                    {milestone.quote}
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col gap-1 text-[11px] font-mono-telemetry text-neutral-400">
                  <span className="text-neutral-500">{milestone.radio}</span>
                  <span className="text-[#FFE500]">{milestone.telemetry}</span>
                </div>
              </div>
            </TechFrame>
          ))}
        </div>

      </div>
    </section>
  );
}
