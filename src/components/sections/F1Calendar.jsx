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
  1: { length: '5.28 KM', laps: 58, turns: 14, stat: 'WINNER: G. RUSSELL' },
  2: { length: '5.45 KM', laps: 56, turns: 16, stat: 'WINNER: K. ANTONELLI' },
  3: { length: '5.81 KM', laps: 53, turns: 18, stat: 'WINNER: K. ANTONELLI' },
  4: { length: '5.41 KM', laps: 57, turns: 19, stat: 'WINNER: K. ANTONELLI' },
  5: { length: '4.36 KM', laps: 70, turns: 14, stat: 'WINNER: K. ANTONELLI' },
  6: { length: '3.34 KM', laps: 78, turns: 19, stat: 'WINNER: K. ANTONELLI' },
  7: { length: '4.66 KM', laps: 66, turns: 14, stat: 'WINNER: L. HAMILTON' },
  8: { length: '4.32 KM', laps: 71, turns: 10, stat: 'WINNER: G. RUSSELL' },
  9: { length: '5.89 KM', laps: 52, turns: 18, stat: 'P1 WIN: C. LECLERC 🏆' },
  10: { length: '7.00 KM', laps: 44, turns: 19, stat: 'WINNER: K. ANTONELLI' },
  11: { length: '4.38 KM', laps: 70, turns: 14, stat: 'WINNER: L. NORRIS' },
  12: { length: '4.26 KM', laps: 72, turns: 14, stat: 'WINNER: L. NORRIS' },
  13: { length: '5.79 KM', laps: 53, turns: 11, stat: 'WINNER: K. ANTONELLI' },
  14: { length: '5.47 KM', laps: 55, turns: 20, stat: 'WINNER: K. ANTONELLI' },
  15: { length: '6.00 KM', laps: 51, turns: 20, stat: 'WINNER: G. RUSSELL' },
  16: { length: '5.54 KM', laps: 56, turns: 15, stat: 'WINNER: M. VERSTAPPEN' },
  17: { length: '4.94 KM', laps: 62, turns: 19, stat: 'MARINA BAY STREET CIRCUIT' },
  18: { length: '5.51 KM', laps: 56, turns: 20, stat: 'CIRCUIT OF THE AMERICAS' },
  19: { length: '4.30 KM', laps: 71, turns: 17, stat: 'AUTÓDROMO HERMANOS RODRÍGUEZ' },
  20: { length: '4.31 KM', laps: 71, turns: 15, stat: 'AUTÓDROMO JOSÉ CARLOS PACE' },
  21: { length: '6.20 KM', laps: 50, turns: 17, stat: 'LAS VEGAS STRIP CIRCUIT' },
  22: { length: '5.42 KM', laps: 57, turns: 16, stat: 'LUSAIL INTERNATIONAL CIRCUIT' },
  23: { length: '5.28 KM', laps: 58, turns: 16, stat: 'YAS MARINA CIRCUIT' },
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
  const thumbnailRef = useRef(null);
  const xToRef = useRef(null);
  const yToRef = useRef(null);

  // User requested default filter to be UPCOMING
  const [activeFilter, setActiveFilter] = useState('UPCOMING');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredRace, setHoveredRace] = useState(null);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  const now = useMemo(() => new Date(), []);

  // Compute status for all 24 races
  const raceStatuses = useMemo(() => {
    return F1_CALENDAR.map((race) => {
      if (race.winner) return 'COMPLETED';
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

  // Initialize GSAP quickTo mouse following for thumbnail wrapper
  useEffect(() => {
    if (!thumbnailRef.current || isCoarsePointer) return;

    gsap.set(thumbnailRef.current, { scale: 0, xPercent: -50, yPercent: -50 });

    xToRef.current = gsap.quickTo(thumbnailRef.current, "x", {
      duration: 0.4,
      ease: "power3.out",
    });
    yToRef.current = gsap.quickTo(thumbnailRef.current, "y", {
      duration: 0.4,
      ease: "power3.out",
    });
  }, [isCoarsePointer]);

  // Reset thumbnail state on filter change
  useEffect(() => {
    if (thumbnailRef.current) {
      gsap.set(thumbnailRef.current, { scale: 0 });
      const thumbnails = thumbnailRef.current.querySelectorAll('.hover-img-thumbnail');
      if (thumbnails.length > 0) {
        gsap.set(thumbnails, { yPercent: 0 });
      }
    }
    setHoveredIndex(null);
    setHoveredRace(null);
  }, [activeFilter]);

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
    xToRef.current?.(e.clientX);
    yToRef.current?.(e.clientY);
  };

  const handleListLeave = () => {
    setHoveredIndex(null);
    setHoveredRace(null);
    if (thumbnailRef.current) {
      gsap.to(thumbnailRef.current, {
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleRowEnter = (race, index) => {
    if (isCoarsePointer) return;
    setHoveredIndex(index);
    setHoveredRace(race);

    if (thumbnailRef.current) {
      gsap.to(thumbnailRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });

      const thumbnails = thumbnailRef.current.querySelectorAll('.hover-img-thumbnail');
      if (thumbnails.length > 0) {
        gsap.to(thumbnails, {
          yPercent: -100 * index,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }
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
                {F1_CALENDAR.length} GRAND PRIX // RACING SCHEDULE
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
        {/* OBSIDIAN UI FLOATING HOVER TRACK SVG SLIDING STACK                        */}
        {/* ========================================================================= */}
        {!isCoarsePointer && (
          <div
            ref={thumbnailRef}
            className="hover-img-thumbnail-wrapper pointer-events-none fixed top-0 left-0 z-50 w-[260px] sm:w-[300px] h-[240px] sm:h-[270px] flex flex-col overflow-hidden will-change-transform"
            style={{ transformOrigin: "center center" }}
          >
            {displayRaces.map((race) => (
              <div
                key={race.round}
                className="hover-img-thumbnail relative w-full h-full flex-shrink-0 flex flex-col items-center justify-center p-2 select-none"
              >
                {/* Vektor Sirkuit Murni dengan Ambient Drop Shadow */}
                <div className="w-full h-44 sm:h-52 flex items-center justify-center pointer-events-none">
                  <svg
                    viewBox={race.viewBox}
                    className="w-full h-full max-h-40 sm:max-h-48 filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
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

                {/* Nama Sirkuit Minimalis dengan Text Shadow */}
                <div className="mt-2 text-center pointer-events-none">
                  <div className="font-racing font-bold text-xs sm:text-sm uppercase tracking-widest text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    {race.circuit}
                  </div>
                </div>
              </div>
            ))}
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
          {displayRaces.map((race, index) => {
            const isNext = race.originalIndex === nextRaceIdx && race.status !== 'TODAY';
            const isRaceDay = race.status === 'TODAY';
            const isCompleted = race.status === 'COMPLETED';
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={race.round}
                onMouseEnter={() => handleRowEnter(race, index)}
                className={`group/row py-5 sm:py-7 md:py-8 transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  hoveredIndex !== null && !isHovered
                    ? 'opacity-25'
                    : 'opacity-100'
                }`}
              >
                {/* Sisi Kiri: Round Index & Giant Condensed Typography with Slide Animation */}
                <div className={`flex items-center gap-4 sm:gap-6 md:gap-10 min-w-0 flex-1 overflow-hidden transition-transform duration-300 ease-out ${
                  isHovered ? '-translate-x-2 sm:-translate-x-4' : 'translate-x-0'
                }`}>
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

                {/* Sisi Kanan: Clean Minimalist Metadata with Slide Animation */}
                <div className={`flex items-center gap-6 sm:gap-10 md:gap-14 font-mono-telemetry text-xs sm:text-sm shrink-0 md:ml-auto md:pl-8 text-right justify-between md:justify-end transition-transform duration-300 ease-out ${
                  isHovered ? 'translate-x-2 sm:translate-x-4' : 'translate-x-0'
                }`}>
                  {/* Circuit & Date */}
                  <div className="text-left md:text-right">
                    <div className="text-white font-semibold text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap">
                      {formatRaceDate(race.raceDate)}
                    </div>
                    <div className="text-white/75 text-[11px] sm:text-xs uppercase tracking-wide mt-0.5 whitespace-nowrap">
                      {race.location}
                    </div>
                  </div>

                  {/* Status / Highlight (Minimalist Next Race without black card) */}
                  <div className="text-right min-w-[100px] sm:min-w-[125px] whitespace-nowrap">
                    {isRaceDay ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-[#C50500] font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C50500] animate-ping" />
                        LIVE GP
                      </span>
                    ) : isNext ? (
                      <div className="inline-flex items-center gap-2 justify-end">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFE500] opacity-80" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFE500]" />
                        </span>
                        <span className="font-mono-telemetry font-bold text-xs sm:text-[13px] uppercase tracking-widest text-[#FFE500] drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                          NEXT RACE
                        </span>
                      </div>
                    ) : isCompleted ? (
                      <span className="text-white/80 text-[11px] sm:text-xs uppercase tracking-wider font-semibold">
                        {race.winner ? `P1: ${race.winner}` : (race.specs?.stat || 'SELESAI')}
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

                {/* Mobile Touch Inline Thumbnail */}
                {isCoarsePointer && (
                  <div className="mt-3 w-full flex items-center justify-between pt-3 border-t border-white/15">
                    <div>
                      <div className="font-condensed font-bold text-base text-white uppercase leading-tight">
                        {race.circuit}
                      </div>
                      <div className="font-mono-telemetry text-[11px] text-[#FFE500] mt-0.5">
                        {race.specs?.stat}
                      </div>
                    </div>
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
            HOVER GRAND PRIX TO REVEAL CIRCUIT SVG & TELEMETRY
          </span>
        </div>

      </div>
    </section>
  );
}
