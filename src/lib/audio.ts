// ============================================================================
// SISTEMA DE ÁUDIO HÍBRIDO (ARQUIVOS EM /src/assets/sounds/ + WEB AUDIO API)
// Funciona 100% de imediato com sintetizador Web Audio API estilo arcade/slot
// e também tenta tocar arquivos personalizados caso você coloque em /src/assets/sounds/
// ============================================================================

export type SoundEffect =
  | 'click'
  | 'spin'
  | 'reelStop'
  | 'nearMiss'
  | 'wildExpand'
  | 'winNormal'
  | 'winBig'
  | 'coins';

class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public play(effect: SoundEffect, reelIndex = 0) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (effect) {
      case 'click': {
        this.playTone(ctx, 520, 680, 0.06, 'sine', 0.12, now);
        break;
      }

      case 'spin': {
        // Som alegre de partida dos rolos (arpejo ascendente rápido)
        const notes = [330, 440, 554.37, 659.25];
        notes.forEach((freq, idx) => {
          this.playTone(ctx, freq, freq * 1.05, 0.08, 'triangle', 0.14, now + idx * 0.045);
        });
        break;
      }

      case 'reelStop': {
        // Impacto percussivo com "bounce" quando cada coluna para
        const baseFreq = 160 + reelIndex * 35;
        this.playTone(ctx, baseFreq, 75, 0.11, 'triangle', 0.25, now);
        this.playTone(ctx, baseFreq * 2.2, baseFreq * 1.8, 0.05, 'sine', 0.1, now + 0.02);
        break;
      }

      case 'nearMiss': {
        // Suspense crescente quando as 2 primeiras colunas têm Wild ou grande chance
        for (let i = 0; i < 8; i++) {
          const freq = 300 + i * 55;
          this.playTone(ctx, freq, freq + 40, 0.12, 'sawtooth', 0.09, now + i * 0.11);
        }
        break;
      }

      case 'wildExpand': {
        // Rugido / brilho dourado quando o Wild do Igor expande na coluna!
        const chord = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
        chord.forEach((freq, i) => {
          this.playTone(ctx, freq * 0.9, freq, 0.35, 'sawtooth', 0.11, now + i * 0.055);
        });
        break;
      }

      case 'winNormal': {
        // Fanfarra oriental alegre de vitória
        const melody = [523.25, 659.25, 783.99, 1046.5];
        melody.forEach((freq, i) => {
          this.playTone(ctx, freq, freq, 0.18, 'triangle', 0.18, now + i * 0.09);
        });
        break;
      }

      case 'winBig': {
        // Fanfarra épica para GRANDE VITÓRIA / IGOR MASTER
        const fanfare = [
          523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5, 1567.98,
        ];
        fanfare.forEach((freq, i) => {
          this.playTone(ctx, freq, freq * 1.02, 0.22, 'sawtooth', 0.15, now + i * 0.1);
          this.playTone(ctx, freq * 0.5, freq * 0.5, 0.22, 'triangle', 0.15, now + i * 0.1);
        });
        break;
      }

      case 'coins': {
        // Tilintar metálico de moedas subindo no contador
        const coinFreq = 1200 + Math.random() * 600;
        this.playTone(ctx, coinFreq, coinFreq * 1.25, 0.07, 'sine', 0.09, now);
        break;
      }
    }
  }

  private playTone(
    ctx: AudioContext,
    startFreq: number,
    endFreq: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    startTime: number
  ) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    } catch {
      // Ignora erros caso o navegador bloqueie áudio antes de interação
    }
  }
}

export const soundManager = new SoundManager();

