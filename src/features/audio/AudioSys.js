import { Logger } from '../../shared/utils/logger.js';

export const AudioSys = (() => {
  let ctx = null; let muted = false; let bgmInterval = null; let bgmNoteIdx = 0;
  const init = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); };
  const playTone = (freqs, type = 'sine', dur = 0.1, vol = 0.1, slide = 0) => {
    if (muted) return;
    try {
      init(); const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      masterGain.connect(ctx.destination);
      freqs.forEach(f => {
        const osc = ctx.createOscillator(); osc.type = type;
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        if (slide !== 0) osc.frequency.linearRampToValueAtTime(Math.max(10, f + slide), ctx.currentTime + dur);
        osc.connect(masterGain); osc.start(); osc.stop(ctx.currentTime + dur);
      });
    } catch(e) {
      Logger.warn('AudioSys', 'playTone failed', { err: e.message });
    }
  };
  let t = 'bleu';
  const SFX = {
    default: {
      click: () => playTone([800], 'sine', 0.05, 0.02),
      draw: () => playTone([300, 400], 'triangle', 0.1, 0.03, -100),
      playCard: () => playTone([500, 700], 'sine', 0.15, 0.04),
      attack: () => playTone([100, 80], 'sawtooth', 0.5, 0.1, -40),
      error: () => playTone([150], 'sawtooth', 0.2, 0.08, -50),
      vol: () => playTone([900, 1200], 'triangle', 0.2, 0.05, 500),
      buy: () => playTone([600, 800, 1200], 'sine', 0.3, 0.05),
      npcIntro: () => { playTone([400, 600], 'sine', 0.2, 0.05); setTimeout(()=>playTone([800, 1200], 'sine', 0.3, 0.05), 200); },
      event: () => { playTone([300, 600, 900], 'sine', 0.5, 0.05, 200); setTimeout(()=>playTone([400, 800], 'sine', 0.8, 0.05, -300), 200); },
      success: () => { playTone([440], 'sine', 0.1, 0.05); setTimeout(()=>playTone([554], 'sine', 0.1, 0.05), 80); setTimeout(()=>playTone([659], 'sine', 0.2, 0.05), 160); },
      cf: () => { playTone([440, 554, 659, 880], 'square', 1.0, 0.08); setTimeout(()=>playTone([880, 1108], 'square', 0.8, 0.08), 200); },
      win: () => {
        if(bgmInterval) clearInterval(bgmInterval);
        [0, 200, 400].forEach((d, i) => setTimeout(() => playTone([523.25 * (i+1)], 'triangle', 0.3, 0.08), d));
        setTimeout(() => playTone([1046.5, 1318.5, 1567.98], 'square', 1.0, 0.1), 600);
      }
    },
    space_marine_2: {
      click: () => playTone([150], 'square', 0.1, 0.05, -20),
      draw: () => playTone([200, 250], 'sawtooth', 0.15, 0.05, -50),
      playCard: () => playTone([100, 150], 'square', 0.2, 0.08, -50),
      attack: () => playTone([80, 50], 'sawtooth', 0.6, 0.15, -40),
      error: () => playTone([100], 'sawtooth', 0.3, 0.1, -20),
      vol: () => playTone([250, 300], 'sawtooth', 0.2, 0.08, 100),
      buy: () => playTone([200, 300, 400], 'square', 0.4, 0.08, 0),
      npcIntro: () => { playTone([100, 150], 'sawtooth', 0.3, 0.08); setTimeout(()=>playTone([200, 150], 'sawtooth', 0.4, 0.08), 300); },
      event: () => { playTone([150, 100], 'square', 0.6, 0.1, -50); setTimeout(()=>playTone([100, 80], 'sawtooth', 0.8, 0.1, -50), 300); },
      success: () => { playTone([300], 'square', 0.2, 0.08); setTimeout(()=>playTone([400], 'square', 0.2, 0.08), 150); },
      cf: () => { playTone([200, 250, 300, 350], 'sawtooth', 0.8, 0.1, 50); },
      win: () => {
        if(bgmInterval) clearInterval(bgmInterval);
        [0, 300, 600].forEach((d, i) => setTimeout(() => playTone([200 * (i+1)], 'sawtooth', 0.4, 0.1, 50), d));
        setTimeout(() => playTone([800, 900, 1000], 'square', 1.0, 0.15), 900);
      }
    }
  };
  return {
    setTheme: theme => { t = SFX[theme] ? theme : 'default'; },
    click: () => SFX[t].click(),
    draw: () => SFX[t].draw(),
    playCard: () => SFX[t].playCard(),
    attack: () => SFX[t].attack(),
    error: () => SFX[t].error(),
    vol: () => SFX[t].vol(),
    buy: () => SFX[t].buy(),
    npcIntro: () => SFX[t].npcIntro(),
    event: () => SFX[t].event(),
    success: () => SFX[t].success(),
    cf: () => SFX[t].cf(),
    win: () => SFX[t].win(),
    toggleMute: () => { muted = !muted; return muted; },
    isMuted: () => muted,
    stopBGM: () => { if (bgmInterval) { clearInterval(bgmInterval); bgmInterval = null; } }
  };
})();