import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Moon, Sun, Sparkles } from 'lucide-react';
import { playMicroSound, toggleAmbientSound } from '../../utils/audio';

export default function Navbar({ isDark, setIsDark, audioEnabled, setAudioEnabled }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcStr = now.toLocaleTimeString('en-US', {
        timeZone: 'UTC',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTime(`${utcStr} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    toggleAmbientSound(nextState);
    playMicroSound('switch', true);
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    playMicroSound('switch', audioEnabled);
  };

  const scrollTo = (id) => {
    playMicroSound('click', audioEnabled);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-12 md:py-6 flex items-center justify-between pointer-events-none">
      {/* Brand & Telemetry */}
      <div className="pointer-events-auto flex items-center gap-4">
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
          onMouseEnter={() => playMicroSound('hover', audioEnabled)}
          className="group flex items-center gap-2 font-display text-lg tracking-tight font-semibold uppercase"
        >
          <span className="inline-block transition-transform duration-300 group-hover:rotate-45">✦</span>
          <span>Form & Matter</span>
        </a>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono-tech text-muted px-2.5 py-1 rounded-full border border-subtle glass-panel">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{time || 'LIVE'}</span>
        </div>
      </div>

      {/* Nav Actions & Controls */}
      <div className="pointer-events-auto flex items-center gap-2 md:gap-4">
        <nav className="hidden md:flex items-center gap-1 font-mono-tech text-xs tracking-wider uppercase px-3 py-1.5 rounded-full border border-subtle glass-panel">
          <button
            onClick={() => scrollTo('works')}
            onMouseEnter={() => playMicroSound('hover', audioEnabled)}
            className="px-3 py-1 rounded-full hover:text-primary transition-colors text-muted"
          >
            (01) Works
          </button>
          <button
            onClick={() => scrollTo('capabilities')}
            onMouseEnter={() => playMicroSound('hover', audioEnabled)}
            className="px-3 py-1 rounded-full hover:text-primary transition-colors text-muted"
          >
            (02) Capabilities
          </button>
          <button
            onClick={() => scrollTo('contact')}
            onMouseEnter={() => playMicroSound('hover', audioEnabled)}
            className="px-3 py-1 rounded-full hover:text-primary transition-colors text-muted"
          >
            (03) Contact
          </button>
        </nav>

        {/* Audio Toggle */}
        <button
          onClick={handleAudioToggle}
          onMouseEnter={() => playMicroSound('hover', audioEnabled)}
          aria-label="Toggle Sound"
          className="p-2.5 rounded-full border border-subtle glass-panel hover:scale-105 transition-transform"
          title={audioEnabled ? 'Audio On (Ambient & UI)' : 'Audio Muted'}
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 text-primary" />
          ) : (
            <VolumeX className="w-4 h-4 text-muted" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          onMouseEnter={() => playMicroSound('hover', audioEnabled)}
          aria-label="Toggle Color Theme"
          className="p-2.5 rounded-full border border-subtle glass-panel hover:scale-105 transition-transform"
          title={isDark ? 'Switch to Studio Off-White' : 'Switch to Deep Obsidian'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-primary" />
          )}
        </button>
      </div>
    </header>
  );
}
