import React, { useState, useEffect, useRef } from 'react';
import { musicTracks } from '../../data/charlesData';
import { Play, Pause, Music, Volume2, Disc, Sparkles } from 'lucide-react';
import TechFrame from '../ui/TechFrame';

export default function SoundOfSpeed({ isGlobalAudioPlaying, toggleGlobalAudio }) {
  const [activeTrack, setActiveTrack] = useState(musicTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  // Synthesize ambient piano chords with Web Audio API for interactive audio demonstration
  const playPianoChord = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Frequencies for a melancholic F minor / Ab major neoclassical chord (Leclerc mood)
      const freqs = [174.61, 220.00, 261.63, 349.23, 440.00, 523.25];
      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + index * 0.15 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.15);
        osc.stop(ctx.currentTime + 3.8);
      });
    } catch (e) {
      console.log('Audio init prevented:', e);
    }
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playPianoChord();
      intervalRef.current = setInterval(playPianoChord, 3800);
    } else {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <section id="sound-of-speed" className="relative w-full py-28 px-6 md:px-12 bg-[#080809] border-b border-white/[0.08] overflow-hidden">
      
      {/* Radial Warm/Gold Glow for Piano Ambience */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#FFE500]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono-telemetry text-[#FFE500] uppercase tracking-widest flex items-center gap-2 mb-2">
              <Music className="w-4 h-4" />
              THE SOUND OF SPEED & SOUL
            </span>
            <h2 className="text-4xl md:text-6xl font-racing font-extrabold text-white uppercase tracking-tight">
              PIANO <span className="text-[#FFE500] font-editorial normal-case">Compositions</span>
            </h2>
          </div>
          <p className="text-sm font-mono-telemetry text-neutral-400 max-w-md">
            “Playing piano is my escape. When I'm in front of the keys, the adrenaline of 300 km/h fades into pure emotion.”
          </p>
        </div>

        {/* Audio Studio Player */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Visualizer & Cover */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-white/10 bg-[#121316]/90 p-8">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 border border-white/10">
              <img 
                src={activeTrack.cover} 
                alt={activeTrack.title}
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Spinning Disc Badge */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono-telemetry text-white">
                <Disc className={`w-4 h-4 text-[#FFE500] ${isPlaying ? 'animate-spin' : ''}`} />
                <span>{activeTrack.album}</span>
              </div>
            </div>

            {/* Audio Wave Visualizer Bars */}
            <div className="flex items-end justify-between h-12 gap-1 px-2 mb-4">
              {[40, 75, 30, 90, 50, 85, 60, 100, 45, 80, 65, 95, 30, 70, 85, 40, 90, 60, 75, 50, 85, 35, 90, 55].map((height, i) => (
                <div
                  key={i}
                  className={`w-full rounded-full transition-all duration-300 ${isPlaying ? 'bg-[#FFE500]' : 'bg-white/20'}`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (height * Math.random()) + 20)}%` : '15%'
                  }}
                />
              ))}
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <h4 className="text-xl font-racing font-bold text-white">{activeTrack.title}</h4>
                <p className="text-xs font-mono-telemetry text-neutral-400">{activeTrack.artist} • {activeTrack.mood}</p>
              </div>

              <button
                onClick={handleTogglePlay}
                className="w-14 h-14 rounded-full bg-[#FFE500] hover:bg-[#fff266] text-black flex items-center justify-center shadow-lg shadow-[#FFE500]/30 transition-all hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
            </div>
          </div>

          {/* Right Column: Tracklist */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {musicTracks.map((track, idx) => {
              const isCurrent = activeTrack.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setActiveTrack(track);
                    if (!isPlaying) handleTogglePlay();
                  }}
                  className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 ${isCurrent ? 'bg-[#18191f] border-[#FFE500]/50 shadow-lg shadow-[#FFE500]/10' : 'bg-[#101114] border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono-telemetry font-bold text-[#FFE500]">0{idx + 1}</span>
                      <h4 className="text-lg font-racing font-bold text-white">{track.title}</h4>
                    </div>
                    <span className="text-xs font-mono-telemetry text-neutral-400">{track.duration}</span>
                  </div>
                  <p className="text-xs font-mono-telemetry text-neutral-400 pl-7 leading-relaxed">
                    {track.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
