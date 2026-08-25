// Minimal Web Audio API sound synthesis engine for tactile UI micro-feedback
let audioCtx = null;
let ambientOsc = null;
let ambientGain = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playMicroSound = (type = 'click', isEnabled = true) => {
  if (!isEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'hover') {
    // Subtle high-frequency blip
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.04);
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'click') {
    // Tactile acoustic pop
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc.start(now);
    osc.stop(now + 0.07);
  } else if (type === 'modal') {
    // Ethereal chime
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18); // C6
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.start(now);
    osc.stop(now + 0.23);
  } else if (type === 'switch') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.09);
  }
};

export const toggleAmbientSound = (shouldPlay) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (shouldPlay) {
    if (!ambientOsc) {
      ambientOsc = ctx.createOscillator();
      ambientGain = ctx.createGain();
      
      ambientOsc.type = 'sine';
      ambientOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A drone
      
      ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.012, ctx.currentTime + 2.0);

      ambientOsc.connect(ambientGain);
      ambientGain.connect(ctx.destination);
      ambientOsc.start();
    }
  } else {
    if (ambientGain && ambientOsc) {
      ambientGain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      setTimeout(() => {
        if (ambientOsc) {
          ambientOsc.stop();
          ambientOsc.disconnect();
          ambientOsc = null;
          ambientGain = null;
        }
      }, 600);
    }
  }
};
