import React from 'react';

export default function TechFrame({ children, className = "", color = "#E10600", active = false }) {
  return (
    <div className={`relative p-[1px] group ${className}`}>
      {/* SVG Chamfered Border */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path
            d="M 6 0 L 94 0 L 100 6 L 100 94 L 94 100 L 6 100 L 0 94 L 0 6 Z"
            fill="none"
            stroke={active ? color : "rgba(255, 255, 255, 0.12)"}
            strokeWidth="1.2"
            className="transition-colors duration-300 group-hover:stroke-[#E10600]"
          />
        </svg>

        {/* Technical Corner Brackets */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#E10600] opacity-80" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#E10600] opacity-80" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#E10600] opacity-80" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#E10600] opacity-80" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-0 h-full w-full bg-[#101114] rounded-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}
