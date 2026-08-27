import React from 'react';

const telemetryItems = [
  { text: 'SCUDERIA FERRARI HP', highlight: true },
  { text: '#16 IL PREDESTINATO', highlight: false },
  { text: '26 POLE POSITIONS', highlight: true },
  { text: '8 GRAND PRIX WINS', highlight: false },
  { text: '43 PODIUM FINISHES', highlight: true },
  { text: 'MONACO GP WINNER 2024', highlight: false },
  { text: 'MONZA GP WINNER 2019 & 2024', highlight: true },
  { text: 'SPA-FRANCORCHAMPS WINNER 2019', highlight: false },
  { text: 'MONTE CARLO 🇲🇨', highlight: true },
  { text: 'MARANELLO 🇮🇹', highlight: false },
  { text: 'BELL RACING HP77', highlight: true },
  { text: 'RICHARD MILLE', highlight: false },
  { text: 'RAY-BAN', highlight: true },
];

export default function TelemetryMarquee({ className = '' }) {
  // Duplicate for seamless infinite loop
  const displayItems = [...telemetryItems, ...telemetryItems, ...telemetryItems];

  return (
    <div className={`relative w-full overflow-hidden bg-[#0A0A0B] py-5 border-y border-white/10 select-none ${className}`}>
      {/* Subtle Glow Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0A0B] to-transparent z-10 pointer-events-none" />

      <div className="flex w-[max-content] animate-marquee hover:[animation-play-state:paused] items-center gap-12 text-sm font-racing uppercase tracking-[0.25em]">
        {displayItems.map((item, index) => (
          <div key={index} className="flex items-center gap-12 whitespace-nowrap">
            <span
              className={`transition-colors duration-300 font-bold ${
                item.highlight ? 'text-[#E10600]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {item.text}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]/60 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
