import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Flag, Clock, CheckCircle2, Zap } from 'lucide-react';
import { F1_CALENDAR } from '../../data/f1Calendar';

gsap.registerPlugin(ScrollTrigger);

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
      <span className="font-mono-telemetry font-bold text-[#E10600] animate-pulse">
        LIGHTS OUT // IN PROGRESS
      </span>
    );
  }

  return (
    <span className="font-mono-telemetry font-bold text-[#FFE500] tracking-wider">
      {pad(hours)}H {pad(minutes)}M {pad(seconds)}S
    </span>
  );
}

export default function F1Calendar() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const now = useMemo(() => new Date(), []);

  // Compute status for all races
  const raceStatuses = useMemo(() => {
    return F1_CALENDAR.map((race) => {
      const raceDate = new Date(race.raceDate);
      const diffMs = raceDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // Past race if more than 4 hours after race start
      if (diffHours < -4) {
        return 'COMPLETED';
      }
      // Today / Race weekend if within 24 hours before or during race
      if (diffHours >= -4 && diffHours <= 24) {
        return 'TODAY';
      }
      return 'UPCOMING';
    });
  }, [now]);

  const completedCount = raceStatuses.filter((s) => s === 'COMPLETED').length;
  const nextRaceIdx = raceStatuses.findIndex((s) => s === 'TODAY' || s === 'UPCOMING');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const getScrollDistance = () => {
        if (!trackRef.current) return 0;
        return Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 80);
      };

      // Native GSAP Horizontal Pin
      gsap.to(trackRef.current, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight + Math.round(getScrollDistance() * 0.7)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          anticipatePin: 0,
          onEnter: () => {
            document.body.classList.add('nav-theme-dark');
          },
          onLeaveBack: () => {
            document.body.classList.remove('nav-theme-dark');
          },
          onEnterBack: () => {
            document.body.classList.add('nav-theme-dark');
          },
          onLeave: () => {
            document.body.classList.remove('nav-theme-dark');
          },
        },
      });

      const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => clearTimeout(timer);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="calendar"
      ref={sectionRef}
      className="relative z-20 w-full h-screen bg-[#080809] text-[#F8F9FA] overflow-hidden flex flex-col justify-center select-none rounded-t-[50px] md:rounded-t-[70px] shadow-[0_-35px_80px_rgba(0,0,0,0.85)] border-t border-white/[0.08]"
    >
      {/* Carbon Grid Background Pattern */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20 bg-carbon-grid z-0" />

      {/* Atmospheric Ambient Glow */}
      <div
        className="absolute top-0 right-1/4 w-[650px] h-[400px] pointer-events-none opacity-25 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(225,6,0,0.3) 0%, transparent 70%)',
        }}
      />

      {/* Horizontal Sliding Track */}
      <div
        ref={trackRef}
        className="flex h-full w-[max-content] items-center pt-16 sm:pt-20 pb-8 relative z-10 will-change-transform px-6 sm:px-12 md:px-16 gap-6 sm:gap-8"
      >
        {/* ================================================================= */}
        {/* INTRO HERO BILLBOARD CARD                                         */}
        {/* ================================================================= */}
        <div className="w-[320px] sm:w-[380px] md:w-[440px] shrink-0 flex flex-col justify-center gap-5 pr-4 pointer-events-none select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
            <span className="font-mono-telemetry text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#E10600] font-bold">
              FIA FORMULA ONE // 2026
            </span>
          </div>

          <h2 className="font-racing font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[0.92] uppercase text-white">
            CHAMPIONSHIP <br />
            <span className="font-editorial italic font-normal text-3xl sm:text-4xl md:text-5xl text-[#FFE500] lowercase">
              calendar
            </span>
          </h2>

          <p className="text-neutral-400 font-sans text-xs sm:text-sm font-light leading-relaxed">
            The full 24-race world tour for Driver #16. Authentic circuit geometry, race status, and telemetry count.
          </p>

          <div className="flex items-center gap-6 pt-2 border-t border-white/[0.08]">
            <div className="flex flex-col">
              <span className="font-racing text-xl sm:text-2xl font-bold text-white leading-none">
                24
              </span>
              <span className="font-mono-telemetry text-[10px] text-neutral-400 uppercase tracking-wider">
                Grands Prix
              </span>
            </div>

            <div className="w-px h-8 bg-white/10" />

            <div className="flex flex-col">
              <span className="font-racing text-xl sm:text-2xl font-bold text-[#E10600] leading-none">
                {completedCount}
              </span>
              <span className="font-mono-telemetry text-[10px] text-neutral-400 uppercase tracking-wider">
                Finished
              </span>
            </div>

            <div className="w-px h-8 bg-white/10" />

            <div className="flex flex-col">
              <span className="font-racing text-xl sm:text-2xl font-bold text-[#FFE500] leading-none">
                {24 - completedCount}
              </span>
              <span className="font-mono-telemetry text-[10px] text-neutral-400 uppercase tracking-wider">
                Remaining
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-neutral-500 font-mono-telemetry text-[10px] tracking-widest uppercase pt-2">
            <span>SCROLL TO EXPLORE</span>
            <span className="text-[#E10600]">→</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 24 RACE CARDS                                                     */}
        {/* ================================================================= */}
        {F1_CALENDAR.map((race, idx) => {
          const status = raceStatuses[idx];
          const isToday = status === 'TODAY';
          const isCompleted = status === 'COMPLETED';
          const isNext = idx === nextRaceIdx && !isToday;

          const roundStr = String(race.round).padStart(2, '0');

          return (
            <div
              key={race.round}
              className={`group relative w-[290px] sm:w-[320px] md:w-[340px] h-[480px] sm:h-[510px] md:h-[540px] shrink-0 rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 pointer-events-auto overflow-hidden ${
                isToday
                  ? 'bg-gradient-to-b from-[#180808] to-[#0D0505] border-2 border-[#E10600] shadow-[0_0_50px_rgba(225,6,0,0.35)] scale-[1.02]'
                  : isNext
                  ? 'bg-[#121318]/90 border border-[#FFE500]/50 shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:border-[#FFE500]'
                  : isCompleted
                  ? 'bg-[#0E0F12]/80 border border-white/[0.06] opacity-65 hover:opacity-100 hover:border-white/20'
                  : 'bg-[#101115]/90 border border-white/[0.08] hover:border-[#E10600]/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)]'
              }`}
            >
              {/* Subtle Card Header Light Streak on Today */}
              {isToday && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E10600] to-transparent animate-pulse" />
              )}

              {/* CARD TOP: Round Number & Status Pill */}
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-mono-telemetry text-[11px] text-neutral-400 font-semibold tracking-wider">
                    ROUND
                  </span>
                  <span
                    className={`font-racing font-black text-xl leading-none ${
                      isToday
                        ? 'text-[#E10600]'
                        : isNext
                        ? 'text-[#FFE500]'
                        : 'text-white'
                    }`}
                  >
                    {roundStr}
                  </span>
                </div>

                {/* Status Badge */}
                {isToday ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.6)]">
                    <Zap className="w-3 h-3 fill-current animate-bounce" />
                    <span className="font-racing font-bold text-[10px] uppercase tracking-wider">
                      RACE DAY
                    </span>
                  </div>
                ) : isNext ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFE500]/15 border border-[#FFE500]/40 text-[#FFE500]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFE500] animate-ping" />
                    <span className="font-mono-telemetry font-bold text-[9px] uppercase tracking-wider">
                      NEXT UP
                    </span>
                  </div>
                ) : isCompleted ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-400">
                    <CheckCircle2 className="w-3 h-3 stroke-[2] text-neutral-400" />
                    <span className="font-mono-telemetry text-[9px] uppercase tracking-wider">
                      DONE
                    </span>
                  </div>
                ) : (
                  <div className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-400 font-mono-telemetry text-[9px] uppercase tracking-wider">
                    UPCOMING
                  </div>
                )}
              </div>

              {/* CARD CENTER: Authentic Circuit SVG Vector */}
              <div className="relative w-full h-[180px] sm:h-[200px] flex items-center justify-center p-3 my-auto overflow-hidden">
                {/* Subtle Grid / Circuit Backlight */}
                <div
                  className={`absolute inset-0 rounded-xl transition-opacity duration-500 ${
                    isToday
                      ? 'opacity-30 bg-gradient-to-b from-[#E10600]/20 to-transparent'
                      : 'opacity-0 group-hover:opacity-20 bg-white/5'
                  }`}
                />

                <svg
                  viewBox={race.viewBox}
                  className="w-full h-full max-h-[160px] object-contain transition-transform duration-500 group-hover:scale-105"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d={race.svgPath}
                    stroke={
                      isToday
                        ? '#E10600'
                        : isNext
                        ? '#FFE500'
                        : isCompleted
                        ? '#555A64'
                        : '#FFFFFF'
                    }
                    strokeWidth={race.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(225,6,0,0.7)]"
                  />
                </svg>
              </div>

              {/* CARD BOTTOM: Race Information & Live Telemetry */}
              <div className="relative z-10 flex flex-col gap-2 pt-3 border-t border-white/[0.08]">
                <div>
                  <h3
                    className={`font-racing font-black text-lg sm:text-xl uppercase tracking-tight leading-tight line-clamp-1 ${
                      isToday ? 'text-white' : 'text-neutral-100'
                    }`}
                  >
                    {race.name}
                  </h3>
                  <p className="font-mono-telemetry text-[11px] text-neutral-400 uppercase tracking-wide truncate mt-0.5">
                    {race.circuit}
                  </p>
                  <div className="flex items-center gap-1.5 text-neutral-400 font-sans text-xs mt-0.5">
                    <Flag className="w-3 h-3 text-[#E10600] shrink-0" />
                    <span className="truncate">{race.location}</span>
                  </div>
                </div>

                {/* Date & Time / Countdown Strip */}
                <div
                  className={`mt-2 p-2.5 rounded-xl flex items-center justify-between text-xs ${
                    isToday
                      ? 'bg-black/60 border border-[#E10600]/40 shadow-inner'
                      : 'bg-black/40 border border-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-mono-telemetry text-[11px] text-neutral-300 font-semibold">
                      {formatRaceDate(race.raceDate)}
                    </span>
                  </div>

                  {isToday ? (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#FFE500] animate-spin" />
                      <CountdownTimer targetDate={race.raceDate} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-neutral-400 font-mono-telemetry text-[10px]">
                      <span>{formatRaceTime(race.raceDate)}</span>
                      <span className="text-neutral-600">LOC</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* ================================================================= */}
        {/* OUTRO SEASON FINALE CARD                                          */}
        {/* ================================================================= */}
        <div className="w-[280px] sm:w-[320px] shrink-0 flex flex-col justify-center items-start gap-4 pl-4 pointer-events-none select-none opacity-70">
          <span className="font-mono-telemetry text-[10px] tracking-[0.3em] uppercase text-[#FFE500] font-bold">
            ABU DHABI 2026
          </span>
          <h3 className="font-racing font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
            THE WORLD <br />
            TITLE HUNT
          </h3>
          <p className="font-sans text-xs text-neutral-400 leading-relaxed">
            Every point, every pole, every fastest lap counts. For Charles Leclerc, the mission remains absolute: bringing the championship trophy home to Maranello.
          </p>
        </div>
      </div>
    </section>
  );
}
