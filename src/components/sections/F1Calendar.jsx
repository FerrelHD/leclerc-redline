import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { F1_CALENDAR } from '../../data/f1Calendar';

gsap.registerPlugin(ScrollTrigger);

/**
 * Essential FIA circuit specs and Charles Leclerc career highlights
 */
const CIRCUIT_SPECS = {
  1: { length: '5.28 KM', laps: 58, turns: 14, stat: 'P1 WIN & POLE (2022)' },
  2: { length: '5.45 KM', laps: 56, turns: 16, stat: 'P4 (2024)' },
  3: { length: '5.81 KM', laps: 53, turns: 18, stat: 'P3 PODIUM (2022)' },
  4: { length: '5.41 KM', laps: 57, turns: 15, stat: 'P1 WIN & POLE (2022)' },
  5: { length: '6.17 KM', laps: 50, turns: 27, stat: 'P2 PODIUM // FL (2022)' },
  6: { length: '5.41 KM', laps: 57, turns: 19, stat: 'POLE POSITION (2022)' },
  7: { length: '4.91 KM', laps: 63, turns: 19, stat: 'P3 PODIUM (2024)' },
  8: { length: '3.34 KM', laps: 78, turns: 19, stat: 'P1 WIN & POLE (2024) 🇲🇨' },
  9: { length: '4.66 KM', laps: 66, turns: 14, stat: 'POLE POSITION (2022)' },
  10: { length: '4.36 KM', laps: 70, turns: 14, stat: 'P3 PODIUM (2019)' },
  11: { length: '4.32 KM', laps: 71, turns: 10, stat: 'P1 WIN (2022)' },
  12: { length: '5.89 KM', laps: 52, turns: 18, stat: 'P2 PODIUM (2021)' },
  13: { length: '7.00 KM', laps: 44, turns: 19, stat: 'P1 FIRST F1 WIN (2019)' },
  14: { length: '4.38 KM', laps: 70, turns: 14, stat: 'P4 (2024)' },
  15: { length: '4.26 KM', laps: 72, turns: 14, stat: 'P3 PODIUM (2024)' },
  16: { length: '5.79 KM', laps: 53, turns: 11, stat: 'P1 WIN (2019, 2024) 🇮🇹' },
  17: { length: '6.00 KM', laps: 51, turns: 20, stat: '4x POLE POSITION (2021-2024)' },
  18: { length: '4.94 KM', laps: 62, turns: 19, stat: 'POLE POSITION (2019, 2022)' },
  19: { length: '5.51 KM', laps: 56, turns: 20, stat: 'P1 WIN & POLE (2024)' },
  20: { length: '4.30 KM', laps: 71, turns: 17, stat: 'POLE POSITION (2019, 2023)' },
  21: { length: '4.31 KM', laps: 71, turns: 15, stat: 'P4 (2022)' },
  22: { length: '6.20 KM', laps: 50, turns: 17, stat: 'P2 PODIUM & POLE (2023)' },
  23: { length: '5.42 KM', laps: 57, turns: 16, stat: 'P2 PODIUM (2024)' },
  24: { length: '5.28 KM', laps: 58, turns: 16, stat: 'P2 PODIUM (2022, 2023)' },
};

function formatRaceDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}

function formatRaceTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    return Math.max(0, diff);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      setTimeLeft(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, '0');

  if (timeLeft <= 0) {
    return (
      <span className="font-mono-telemetry font-bold text-[#E10600]">
        LIGHTS OUT
      </span>
    );
  }

  return (
    <span className="font-mono-telemetry font-bold tracking-wider">
      {pad(hours)}H {pad(minutes)}M {pad(seconds)}S
    </span>
  );
}

export default function F1Calendar() {
  const sectionRef = useRef(null);
  const listContainerRef = useRef(null);
  const floatingTrackRef = useRef(null);
  const trackSvgInnerRef = useRef(null);

  // User requested default filter to be UPCOMING
  const [activeFilter, setActiveFilter] = useState('UPCOMING');
  const [hoveredRace, setHoveredRace] = useState(null);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  // Mouse tracking coordinates with smooth lerp
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const isPointerInside = useRef(false);

  const now = useMemo(() => new Date(), []);

  // Compute status for all 24 races
  const raceStatuses = useMemo(() => {
    return F1_CALENDAR.map((race) => {
      const raceDate = new Date(race.raceDate);
      const diffMs = raceDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < -4) return 'COMPLETED';
      if (diffHours >= -4 && diffHours <= 24) return 'TODAY';
      return 'UPCOMING';
    });
  }, [now]);

  const completedCount = useMemo(() => raceStatuses.filter((s) => s === 'COMPLETED').length, [raceStatuses]);
  const upcomingCount = useMemo(() => raceStatuses.filter((s) => s === 'UPCOMING' || s === 'TODAY').length, [raceStatuses]);

  const nextRaceIdx = useMemo(() => {
    const idx = raceStatuses.findIndex((s) => s === 'TODAY' || s === 'UPCOMING');
    return idx !== -1 ? idx : 0;
  }, [raceStatuses]);

  // Filtered dataset enriched with specs
  const displayRaces = useMemo(() => {
    return F1_CALENDAR.map((race, originalIndex) => ({
      ...race,
      originalIndex,
      status: raceStatuses[originalIndex],
      specs: CIRCUIT_SPECS[race.round] || {
        length: '5.20 KM',
        laps: 55,
        turns: 16,
        stat: 'SCUDERIA FERRARI #16',
      },
    })).filter((race) => {
      if (activeFilter === 'COMPLETED') return race.status === 'COMPLETED';
      if (activeFilter === 'UPCOMING') return race.status === 'UPCOMING' || race.status === 'TODAY';
      return true;
    });
  }, [activeFilter, raceStatuses]);

  // Touch screen detection
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setIsCoarsePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Smooth lerp mouse-following loop for pure floating track
  useEffect(() => {
    let frameId;
    const LERP_FACTOR = 0.15;

    const tick = () => {
      if (floatingTrackRef.current && isPointerInside.current) {
        currentPos.current.x += (targetPos.current.x - currentPos.current.x) * LERP_FACTOR;
        currentPos.current.y += (targetPos.current.y - currentPos.current.y) * LERP_FACTOR;

        gsap.set(floatingTrackRef.current, {
          x: currentPos.current.x,
          y: currentPos.current.y,
        });
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Animate floating track entry when hovered race changes
  useEffect(() => {
    if (!floatingTrackRef.current) return;

    if (hoveredRace) {
      gsap.to(floatingTrackRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      if (trackSvgInnerRef.current) {
        gsap.fromTo(
          trackSvgInnerRef.current,
          { scale: 0.9, opacity: 0.4 },
          { scale: 1, opacity: 1, duration: 0.28, ease: 'power2.out' }
        );
      }
    } else {
      gsap.to(floatingTrackRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.25,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    }
  }, [hoveredRace?.round]);

  // Navbar Theme Synchronization (White text on Red background)
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 30%',
        end: 'bottom 30%',
        onEnter: () => document.body.classList.add('nav-theme-dark'),
        onLeaveBack: () => document.body.classList.remove('nav-theme-dark'),
        onEnterBack: () => document.body.classList.add('nav-theme-dark'),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    if (isCoarsePointer) return;
    isPointerInside.current = true;
    targetPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleListLeave = () => {
    isPointerInside.current = false;
    setHoveredRace(null);
  };

  return (
    <section
      id="calendar"
      ref={sectionRef}
      className="relative z-20 w-full bg-[#C50500] text-white pt-24 sm:pt-32 pb-28 sm:pb-36 px-6 sm:px-10 md:px-14 lg:px-20 select-none border-t border-white/10"
    >
      <div className="relative z-10 w-full">
        
        {/* ================================================================= */}
        {/* ROSSO CORSA MOTORSPORT HEADER                                     */}
        {/* ================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/20">
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
              <span className="font-mono-telemetry text-xs tracking-[0.28em] uppercase text-white/90 font-bold">
                FIA FORMULA ONE // SEASON 2026
              </span>
            </div>

            <h2 className="font-condensed font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight uppercase leading-none text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              CALENDAR
            </h2>

            <div className="mt-3 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#FFE500]" />
              <span className="font-mono-telemetry text-xs sm:text-sm uppercase tracking-[0.24em] text-white/80 font-medium">
                24 GRAND PRIX // RACING SCHEDULE
              </span>
            </div>
          </div>

          {/* Filter Bar & Season Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-telemetry">
            <div className="flex items-center gap-3 text-white/85">
              <span className="text-[#FFE500] font-bold">{upcomingCount} UPCOMING</span>
              <span className="text-white/30">•</span>
              <span>{completedCount} FINISHED</span>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-black/20 border border-white/20 backdrop-blur-sm">
              {[
                { key: 'UPCOMING', label: 'UPCOMING' },
                { key: 'ALL', label: 'ALL' },
                { key: 'COMPLETED', label: 'FINISHED' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-3.5 py-1.5 rounded font-mono-telemetry text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeFilter === key
                      ? 'bg-white text-[#C50500] font-black shadow-md'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PURE HOLOGRAPHIC FLOATING SVG TRACK (Cardless Minimalist White Vector)   */}
        {/* ========================================================================= */}
        {!isCoarsePointer && (
          <div
            ref={floatingTrackRef}
            className="pointer-events-none fixed top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2 opacity-0 will-change-transform"
            style={{ width: '320px' }}
          >
            {/* Pure Floating Technical Minimalist Track */}
            <div className="relative flex flex-col items-center justify-center p-4">
              
              {/* Subtle diffused shadow backing */}
              <div className="absolute inset-4 -z-10 rounded-full bg-black/30 blur-2xl pointer-events-none" />

              {/* Vektor SVG Sirkuit F1 Asli (Pure White Technical Line) */}
              {hoveredRace && (
                <div ref={trackSvgInnerRef} className="w-full flex flex-col items-center">
                  <div className="w-60 h-60 flex items-center justify-center">
                    <svg
                      viewBox={hoveredRace.viewBox}
                      className="w-full h-full max-h-52 filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                    >
                      <path
                        d={hoveredRace.svgPath}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth={hoveredRace.strokeWidth || 9}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Minimal Floating Telemetry HUD Ribbon */}
                  <div className="mt-2 text-center pointer-events-none">
                    <div className="font-racing font-bold text-xs uppercase tracking-widest text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {hoveredRace.circuit}
                    </div>
                    <div className="font-mono-telemetry text-[10px] text-white/80 tracking-wider mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                      {hoveredRace.specs?.length} • {hoveredRace.specs?.turns} TURNS • {hoveredRace.specs?.laps} LAPS
                    </div>
                    <div className="font-mono-telemetry text-[10px] text-[#FFE500] font-bold tracking-wider mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                      {hoveredRace.specs?.stat}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MASSIVE EDITORIAL LIST (Scuderia Red Editorial Sheet)                     */}
        {/* ========================================================================= */}
        <div
          ref={listContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleListLeave}
          className="relative w-full mt-4 divide-y divide-white/20 group/calendar"
        >
          {displayRaces.map((race) => {
            const isNext = race.originalIndex === nextRaceIdx && race.status !== 'TODAY';
            const isRaceDay = race.status === 'TODAY';
            const isCompleted = race.status === 'COMPLETED';
            const isHovered = hoveredRace?.round === race.round;

            return (
              <div
                key={race.round}
                onMouseEnter={() => setHoveredRace(race)}
                className={`py-5 sm:py-7 md:py-8 transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  hoveredRace !== null && !isHovered
                    ? 'opacity-25'
                    : 'opacity-100'
                }`}
              >
                {/* Sisi Kiri: Round Index & Giant Condensed Typography */}
                <div className="flex items-center gap-4 sm:gap-6 md:gap-10 min-w-0">
                  {/* Round number */}
                  <span className={`font-mono-telemetry text-xs sm:text-sm tracking-widest font-bold shrink-0 transition-colors duration-200 ${
                    isHovered ? 'text-black' : 'text-white/60'
                  }`}>
                    {String(race.round).padStart(2, '0')}
                  </span>

                  {/* Grand Prix Title (Big Shoulders Display Condensed, Always 1 Line) */}
                  <h3
                    className={`font-condensed font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.2rem] uppercase leading-none whitespace-nowrap tracking-tight transition-colors duration-200 ${
                      isHovered
                        ? 'text-black'
                        : 'text-white'
                    }`}
                  >
                    {race.name}
                  </h3>
                </div>

                {/* Sisi Kanan: Clean Minimalist Metadata */}
                <div className="flex items-center gap-6 sm:gap-10 md:gap-14 font-mono-telemetry text-xs sm:text-sm shrink-0 md:ml-auto md:pl-8 text-right justify-between md:justify-end">
                  {/* Circuit & Date */}
                  <div className="text-left md:text-right">
                    <div className="text-white font-semibold text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap">
                      {formatRaceDate(race.raceDate)}
                    </div>
                    <div className="text-white/75 text-[11px] sm:text-xs uppercase tracking-wide mt-0.5 whitespace-nowrap">
                      {race.location}
                    </div>
                  </div>

                  {/* Status / Highlight Pill */}
                  <div className="text-right min-w-[100px] sm:min-w-[125px] whitespace-nowrap">
                    {isRaceDay ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-[#C50500] font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C50500] animate-ping" />
                        LIVE GP
                      </span>
                    ) : isNext ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black text-white font-bold text-[10px] sm:text-[11px] uppercase tracking-wider border border-white/20">
                        NEXT RACE
                      </span>
                    ) : isCompleted ? (
                      <span className="text-white/60 text-[11px] sm:text-xs uppercase tracking-wider font-medium">
                        {race.specs?.stat?.split('(')[0] || 'FINISHED'}
                      </span>
                    ) : (
                      <div className="text-white/80 text-[11px] sm:text-xs">
                        <CountdownTimer targetDate={race.raceDate} />
                      </div>
                    )}
                  </div>

                  {/* Arrow Indicator */}
                  <div className={`hidden sm:block transition-all duration-200 ${
                    isHovered ? 'text-black translate-x-1 -translate-y-1' : 'text-white/40'
                  }`}>
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Mobile Touch Inline SVG Thumbnail */}
                {isCoarsePointer && (
                  <div className="mt-2 w-full flex items-center justify-between pt-3 border-t border-white/15">
                    <span className="font-mono-telemetry text-[11px] text-white/80">
                      {race.circuit} • {race.specs?.stat}
                    </span>
                    <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                      <svg
                        viewBox={race.viewBox}
                        className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                      >
                        <path
                          d={race.svgPath}
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth={race.strokeWidth || 9}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Minimal Indicator */}
        <div className="mt-14 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-white/70 font-mono-telemetry text-xs gap-3">
          <span>SCUDERIA FERRARI HP // CHARLES LECLERC #16</span>
          <span className="uppercase tracking-widest text-[10px]">
            HOVER GRAND PRIX TO REVEAL CIRCUIT TELEMETRY
          </span>
        </div>

      </div>
    </section>
  );
}
