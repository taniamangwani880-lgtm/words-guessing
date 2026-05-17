class SoundManager {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playCorrect() { this.playTone(880, 'sine', 0.2); }
  playIncorrect() { this.playTone(220, 'square', 0.1); }
  playWin() { 
    this.playTone(523.25, 'sine', 0.1);
    setTimeout(() => this.playTone(659.25, 'sine', 0.1), 100);
    setTimeout(() => this.playTone(783.99, 'sine', 0.3), 200);
  }
  playLoss() {
    this.playTone(220, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(110, 'sawtooth', 0.4), 200);
  }
  playTick() { this.playTone(440, 'sine', 0.05, 0.02); }
}

export const sounds = new SoundManager();
