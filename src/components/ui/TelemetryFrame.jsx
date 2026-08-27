import React from 'react';

export default function TelemetryFrame({
  title = 'SCUDERIA FERRARI // TELEMETRY LINK',
  sector = 'SECTOR 1-2-3 OK',
  delta = '-0.248s',
  status = 'TRACK ACTIVE',
  children,
  className = '',
}) {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-[#0D0D10] border border-white/10 shadow-2xl backdrop-blur-md ${className}`}>
      {/* Top Motorsport Status Bar (macOS / Pit Wall Hybrid Frame) */}
      <div className="h-10 px-4 bg-[#141418] border-b border-white/10 flex items-center justify-between select-none">
        {/* Left: 3 Racing Status LED Dots (Green Track, Yellow Warning, Ferrari Red Box) */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D26A] shadow-[0_0_8px_rgba(0,210,106,0.6)]" title="FIA Green Track Flag" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD000] opacity-80" title="Sector Caution" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E10600] opacity-80" title="Pit Lane Delta" />
        </div>

        {/* Center: Monospace Title */}
        <div className="flex items-center gap-2 font-mono-telemetry text-[10px] sm:text-xs tracking-[0.2em] text-neutral-400 uppercase font-semibold">
          <span className="text-[#E10600]">●</span>
          <span>{title}</span>
        </div>

        {/* Right: Live Delta / Sector Indicator */}
        <div className="hidden sm:flex items-center gap-3 font-mono-telemetry text-[10px] text-neutral-500">
          <span>{sector}</span>
          <span className="text-[#00D26A] font-bold">{delta}</span>
        </div>
      </div>

      {/* Frame Content */}
      <div className="relative w-full">
        {children}
      </div>
    </div>
  );
}
