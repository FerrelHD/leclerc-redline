import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flag, Zap, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { F1_CALENDAR } from '../../data/f1Calendar';

gsap.registerPlugin(ScrollTrigger);

const ACTIVE_ROW_TEXT_COLOR = '#000000';
const INACTIVE_ROW_TEXT_COLOR = '#ffffff';

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
  const tableRef = useRef(null);
  const highlightRef = useRef(null);
  const trackSvgRef = useRef(null);
  const rowRefs = useRef({});
  const activeIndexRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('ALL');

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
  const nextRaceIdx = useMemo(() => {
    const idx = raceStatuses.findIndex((s) => s === 'TODAY' || s === 'UPCOMING');
    return idx !== -1 ? idx : 0;
  }, [raceStatuses]);

  // Filtered dataset enriched with essential specs
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

  // Active race projected on the right stage
  const [activeStageRace, setActiveStageRace] = useState(() => {
    const defaultIdx = nextRaceIdx !== -1 ? nextRaceIdx : 0;
    const defaultRace = F1_CALENDAR[defaultIdx];
    return {
      ...defaultRace,
      originalIndex: defaultIdx,
      status: raceStatuses[defaultIdx],
      specs: CIRCUIT_SPECS[defaultRace.round],
    };
  });

  // Track vector transition animation when active race changes
  useEffect(() => {
    if (trackSvgRef.current) {
      gsap.fromTo(
        trackSvgRef.current,
        { opacity: 0.35, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeStageRace.round]);

  // Navbar Theme Synchronization
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

  // Initialize highlight bar
  useEffect(() => {
    if (highlightRef.current) {
      gsap.set(highlightRef.current, {
        opacity: 0,
        y: 0,
        height: 0,
      });
    }
  }, [displayRaces]);

  const setRowTextColor = (index, color) => {
    const rowEl = rowRefs.current[index];
    if (!rowEl) return;

    gsap.to(rowEl.querySelectorAll('td'), {
      color,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    gsap.to(rowEl.querySelectorAll('.sub-text'), {
      color: color === ACTIVE_ROW_TEXT_COLOR ? '#555555' : 'rgba(255, 255, 255, 0.45)',
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const moveHighlightToRow = (rowEl) => {
    const tableEl = tableRef.current;
    const highlightEl = highlightRef.current;
    if (!tableEl || !highlightEl || !rowEl) return;

    const tableBounds = tableEl.getBoundingClientRect();
    const rowBounds = rowEl.getBoundingClientRect();

    gsap.to(highlightEl, {
      y: rowBounds.top - tableBounds.top,
      height: rowBounds.height,
      opacity: 1,
      duration: 0.28,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const onRowEnter = (rowEl, index, race) => {
    const prevIndex = activeIndexRef.current;
    rowRefs.current[index] = rowEl;

    if (prevIndex !== null && prevIndex !== index) {
      setRowTextColor(prevIndex, INACTIVE_ROW_TEXT_COLOR);
    }

    activeIndexRef.current = index;
    setRowTextColor(index, ACTIVE_ROW_TEXT_COLOR);
    moveHighlightToRow(rowEl);
    setActiveStageRace(race);
  };

  const onTableLeave = () => {
    if (activeIndexRef.current !== null) {
      setRowTextColor(activeIndexRef.current, INACTIVE_ROW_TEXT_COLOR);
      activeIndexRef.current = null;
    }

    if (!highlightRef.current) return;
    gsap.to(highlightRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  return (
    <section
      id="calendar"
      ref={sectionRef}
      className="relative z-20 w-full bg-[#080809] text-[#F8F9FA] pt-24 sm:pt-32 pb-28 sm:pb-36 px-4 sm:px-8 md:px-12 lg:px-16 select-none border-t border-white/[0.08]"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* ================================================================= */}
        {/* CLEAN HEADER                                                      */}
        {/* ================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-white/[0.08]">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#E10600]" />
              <span className="font-mono-telemetry text-xs tracking-[0.25em] uppercase text-[#E10600] font-bold">
                FIA FORMULA ONE // 2026
              </span>
            </div>

            <h2 className="font-racing font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase text-white leading-none">
              CHAMPIONSHIP <br />
              <span className="font-editorial italic font-normal text-3xl sm:text-4xl md:text-5xl text-[#FFE500] lowercase">
                calendar index
              </span>
            </h2>
          </div>

          {/* Filter Bar & Season Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-telemetry">
            <div className="flex items-center gap-3 text-neutral-400">
              <span>{completedCount} FINISHED</span>
              <span className="text-white/20">•</span>
              <span>{24 - completedCount} REMAINING</span>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              {[
                { key: 'ALL', label: 'ALL' },
                { key: 'UPCOMING', label: 'UPCOMING' },
                { key: 'COMPLETED', label: 'FINISHED' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-3 py-1 rounded font-mono-telemetry text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                    activeFilter === key
                      ? 'bg-white text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SPLIT LAYOUT: Left Table (7 cols) + Right Clean Stage (5 cols)           */}
        {/* ========================================================================= */}
        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-10 items-start">
          
          {/* SISI KIRI (7 COLS): Swiss Minimalist Table */}
          <div className="lg:col-span-7 hidden lg:block">
            <div className="relative w-full overflow-hidden font-mono">
              {/* Sliding White Row Highlight Pill */}
              <div
                ref={highlightRef}
                className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-white rounded-md shadow-lg"
              />

              {/* Table */}
              <div
                ref={tableRef}
                className="relative w-full"
                onMouseLeave={onTableLeave}
              >
                <table className="relative z-20 w-full table-fixed border-collapse">
                  <colgroup>
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '38%' }} />
                    <col style={{ width: '24%' }} />
                    <col style={{ width: '16%' }} />
                  </colgroup>

                  <thead>
                    <tr className="border-b border-white/[0.06] text-neutral-500 font-mono-telemetry text-[10px] uppercase tracking-widest">
                      <th className="text-left px-3 py-3 font-normal">RND / DATE</th>
                      <th className="text-left px-3 py-3 font-normal">GRAND PRIX</th>
                      <th className="text-left px-3 py-3 font-normal">LOCATION</th>
                      <th className="text-right px-3 py-3 font-normal">STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayRaces.map((race, index) => {
                      const isNext = race.originalIndex === nextRaceIdx && race.status !== 'TODAY';
                      const isRaceDay = race.status === 'TODAY';
                      const isCompleted = race.status === 'COMPLETED';
                      const isSelected = activeStageRace.round === race.round;

                      return (
                        <tr
                          key={race.round}
                          ref={(el) => { if (el) rowRefs.current[index] = el; }}
                          onMouseEnter={(e) => onRowEnter(e.currentTarget, index, race)}
                          onClick={() => setActiveStageRace(race)}
                          className={`border-b border-white/[0.05] cursor-pointer group ${
                            isSelected ? 'bg-white/[0.02]' : ''
                          }`}
                        >
                          {/* Round & Date */}
                          <td className="whitespace-nowrap px-3 py-3.5 font-mono-telemetry text-xs font-semibold">
                            <span>R{String(race.round).padStart(2, '0')}</span>
                            <span className="sub-text block text-[10px] text-neutral-400 mt-0.5">
                              {formatRaceDate(race.raceDate)}
                            </span>
                          </td>

                          {/* Grand Prix Title */}
                          <td className="whitespace-nowrap px-3 py-3.5 font-racing font-bold text-base uppercase tracking-tight">
                            {race.name}
                          </td>

                          {/* Location */}
                          <td className="whitespace-nowrap px-3 py-3.5 font-sans text-xs">
                            <span className="sub-text block truncate text-neutral-300">
                              {race.location}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="whitespace-nowrap px-3 py-3.5 text-right font-mono-telemetry text-xs">
                            {isRaceDay ? (
                              <span className="text-[#E10600] font-bold text-[10px] uppercase">
                                LIVE
                              </span>
                            ) : isNext ? (
                              <span className="text-[#FFE500] font-bold text-[10px] uppercase">
                                NEXT
                              </span>
                            ) : isCompleted ? (
                              <span className="text-neutral-500 text-[10px] uppercase">
                                DONE
                              </span>
                            ) : (
                              <span className="sub-text text-[10px] text-neutral-400 uppercase">
                                {formatRaceTime(race.raceDate)}
                              </span>
                            )}
                            <ArrowUpRight className="w-3 h-3 ml-1.5 text-neutral-500 inline-block opacity-0 group-hover:opacity-100 transition-opacity" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SISI KANAN (5 COLS): Sticky Preview Stage (Clean & Minimalist) */}
          <div className="lg:col-span-5 hidden lg:block sticky top-28 self-start">
            <div className="relative w-full rounded-2xl bg-[#0C0C0E] border border-white/[0.08] p-6 shadow-xl">
              
              {/* Header: Round & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] font-mono-telemetry text-xs">
                <span className="text-neutral-400 uppercase tracking-widest text-[10px]">
                  CIRCUIT PREVIEW • R{String(activeStageRace.round).padStart(2, '0')}
                </span>
                <div>
                  {activeStageRace.status === 'TODAY' ? (
                    <span className="text-[#E10600] font-bold text-[10px] uppercase tracking-wider">
                      ● RACE DAY
                    </span>
                  ) : activeStageRace.status === 'COMPLETED' ? (
                    <span className="text-neutral-500 text-[10px] uppercase">
                      COMPLETED
                    </span>
                  ) : (
                    <span className="text-[#FFE500] font-bold text-[10px] uppercase tracking-wider">
                      UPCOMING
                    </span>
                  )}
                </div>
              </div>

              {/* Clean Vector Projection Chamber (No Crosshairs, No Watermarks) */}
              <div className="w-full h-60 my-5 flex items-center justify-center p-4">
                <div ref={trackSvgRef} className="w-full h-full flex items-center justify-center">
                  <svg
                    viewBox={activeStageRace.viewBox}
                    className="w-full h-full max-h-52 filter drop-shadow-[0_0_10px_rgba(225,6,0,0.4)]"
                  >
                    <path
                      d={activeStageRace.svgPath}
                      fill="none"
                      stroke="#E10600"
                      strokeWidth={activeStageRace.strokeWidth || 9}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Grand Prix Name & Circuit */}
              <div className="pt-2 border-t border-white/[0.06]">
                <h3 className="font-racing font-black text-2xl uppercase tracking-tight text-white leading-none">
                  {activeStageRace.name}
                </h3>
                <p className="font-sans text-xs text-neutral-400 mt-1">
                  {activeStageRace.circuit} — {activeStageRace.location}
                </p>
              </div>

              {/* Single Clean Line Telemetry Specs */}
              <div className="mt-4 py-2.5 px-3 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-between font-mono-telemetry text-[11px] text-neutral-300">
                <span>{activeStageRace.specs?.length}</span>
                <span className="text-neutral-600">•</span>
                <span>{activeStageRace.specs?.laps} LAPS</span>
                <span className="text-neutral-600">•</span>
                <span>{activeStageRace.specs?.turns} TURNS</span>
                <span className="text-neutral-600">•</span>
                <span className="text-[#E10600] font-semibold">{activeStageRace.specs?.stat}</span>
              </div>

              {/* Schedule & Countdown Footer */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono-telemetry text-xs">
                <div className="text-neutral-400 text-[11px]">
                  {formatRaceDate(activeStageRace.raceDate)} • {formatRaceTime(activeStageRace.raceDate)} LOCAL
                </div>

                <div>
                  {activeStageRace.status === 'COMPLETED' ? (
                    <span className="text-neutral-500 text-[11px]">POINTS SECURED</span>
                  ) : (
                    <CountdownTimer targetDate={activeStageRace.raceDate} />
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (< LG): Clean List with Minimal Track SVG                     */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full font-mono text-white mt-6 divide-y divide-white/[0.06]">
          {displayRaces.map((race) => (
            <div key={race.round} className="py-4 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1 max-w-[70%]">
                <div className="flex items-center gap-2 font-mono-telemetry text-xs">
                  <span className="text-[#E10600] font-bold">
                    R{String(race.round).padStart(2, '0')}
                  </span>
                  <span className="text-neutral-400 text-[11px]">
                    {formatRaceDate(race.raceDate)}
                  </span>
                </div>

                <h3 className="font-racing font-bold text-base uppercase text-white tracking-tight">
                  {race.name}
                </h3>

                <p className="text-xs text-neutral-400 truncate">
                  {race.circuit}
                </p>

                <p className="text-[10px] text-neutral-500 font-mono-telemetry mt-0.5">
                  {race.specs?.length} • {race.specs?.turns} TURNS • {race.specs?.stat}
                </p>
              </div>

              {/* Minimal SVG Track Vector */}
              <div className="w-18 h-18 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center p-2 shrink-0">
                <svg
                  viewBox={race.viewBox}
                  className="w-full h-full filter drop-shadow-[0_0_6px_rgba(225,6,0,0.4)]"
                >
                  <path
                    d={race.svgPath}
                    fill="none"
                    stroke="#E10600"
                    strokeWidth={race.strokeWidth || 9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
