
export const audioService = {
  ctx: null as AudioContext | null,

  getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  },

  playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) {
     const ctx = this.getContext();
     if (!ctx) return;
     // Resume context if suspended (browser policy)
     if (ctx.state === 'suspended') ctx.resume().catch(() => {});

     const osc = ctx.createOscillator();
     const gain = ctx.createGain();

     osc.type = type;
     osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

     gain.gain.setValueAtTime(vol, ctx.currentTime + startTime);
     gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

     osc.connect(gain);
     gain.connect(ctx.destination);

     osc.start(ctx.currentTime + startTime);
     osc.stop(ctx.currentTime + startTime + duration);
  },

  playCorrect() {
    // High ping - cheerful
    this.playTone(880, 'sine', 0.1, 0, 0.1);
    this.playTone(1760, 'sine', 0.3, 0.1, 0.05);
  },

  playIncorrect() {
    // Low buzz - error
    this.playTone(150, 'sawtooth', 0.2, 0, 0.1);
    this.playTone(100, 'sawtooth', 0.4, 0.1, 0.1);
  },

  playBattleComplete(scorePercent: number) {
    if (scorePercent >= 60) {
      // Victory Fanfare (Major Arpeggio)
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
         this.playTone(f, 'square', 0.4, i * 0.12, 0.05);
      });
    } else {
      // Defeat / Try Again (Descending Minor)
      [440, 415.30, 392].forEach((f, i) => {
         this.playTone(f, 'triangle', 0.5, i * 0.2, 0.08);
      });
    }
  },

  playLevelUp() {
    // Power Up Scale
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    notes.forEach((f, i) => {
       this.playTone(f, 'sine', 0.1, i * 0.05, 0.05);
    });
    
    // Final Chord
    const now = (notes.length * 0.05) + 0.1;
    this.playTone(1046.50, 'square', 0.8, now, 0.05);
    this.playTone(1318.51, 'square', 0.8, now, 0.05);
    this.playTone(1567.98, 'square', 0.8, now, 0.05);
  }
};
