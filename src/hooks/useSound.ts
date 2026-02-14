// ── useSound ──
// Lightweight SFX system using the Web Audio API.
// No external audio files — generates tones procedurally.

import { useCallback, useRef } from 'react';
import { useGame } from '../context/GameContext';

// ─── Types ───

type SoundEffect =
  | 'spin-start'
  | 'spin-tick'
  | 'spin-land'
  | 'reveal'
  | 'synergy'
  | 'conflict'
  | 'legendary'
  | 'mythic'
  | 'forbidden'
  | 'draft-pick'
  | 'navigate'
  | 'overclock-on'
  | 'overclock-off';

// ─── Tone Definitions ───

interface ToneParams {
  frequency: number;
  duration: number;
  type: OscillatorType;
  gain: number;
  ramp?: number;
  delay?: number;
}

const TONES: Record<SoundEffect, ToneParams[]> = {
  'spin-start': [
    { frequency: 400, duration: 0.15, type: 'sine', gain: 0.3, ramp: 800 },
  ],
  'spin-tick': [
    { frequency: 600, duration: 0.04, type: 'square', gain: 0.08 },
  ],
  'spin-land': [
    { frequency: 500, duration: 0.2, type: 'sine', gain: 0.4 },
    { frequency: 700, duration: 0.15, type: 'sine', gain: 0.3, delay: 0.1 },
    { frequency: 900, duration: 0.3, type: 'sine', gain: 0.2, delay: 0.2 },
  ],
  'reveal': [
    { frequency: 440, duration: 0.12, type: 'triangle', gain: 0.3, ramp: 880 },
    { frequency: 660, duration: 0.2, type: 'triangle', gain: 0.25, delay: 0.12 },
  ],
  'synergy': [
    { frequency: 523, duration: 0.15, type: 'sine', gain: 0.3 },
    { frequency: 659, duration: 0.15, type: 'sine', gain: 0.3, delay: 0.12 },
    { frequency: 784, duration: 0.25, type: 'sine', gain: 0.35, delay: 0.24 },
  ],
  'conflict': [
    { frequency: 200, duration: 0.3, type: 'sawtooth', gain: 0.2 },
    { frequency: 180, duration: 0.3, type: 'sawtooth', gain: 0.15, delay: 0.1 },
  ],
  'legendary': [
    { frequency: 440, duration: 0.15, type: 'sine', gain: 0.3 },
    { frequency: 554, duration: 0.15, type: 'sine', gain: 0.3, delay: 0.1 },
    { frequency: 659, duration: 0.15, type: 'sine', gain: 0.35, delay: 0.2 },
    { frequency: 880, duration: 0.4, type: 'sine', gain: 0.4, delay: 0.3 },
  ],
  'mythic': [
    { frequency: 523, duration: 0.1, type: 'sine', gain: 0.25 },
    { frequency: 659, duration: 0.1, type: 'sine', gain: 0.3, delay: 0.08 },
    { frequency: 784, duration: 0.1, type: 'sine', gain: 0.3, delay: 0.16 },
    { frequency: 1047, duration: 0.5, type: 'sine', gain: 0.4, delay: 0.24 },
    { frequency: 1319, duration: 0.3, type: 'triangle', gain: 0.2, delay: 0.4 },
  ],
  'forbidden': [
    { frequency: 150, duration: 0.4, type: 'sawtooth', gain: 0.2 },
    { frequency: 300, duration: 0.3, type: 'square', gain: 0.1, delay: 0.15 },
    { frequency: 100, duration: 0.6, type: 'sawtooth', gain: 0.25, delay: 0.3 },
  ],
  'draft-pick': [
    { frequency: 600, duration: 0.1, type: 'triangle', gain: 0.25 },
    { frequency: 800, duration: 0.15, type: 'triangle', gain: 0.3, delay: 0.08 },
  ],
  'navigate': [
    { frequency: 500, duration: 0.08, type: 'sine', gain: 0.15 },
  ],
  'overclock-on': [
    { frequency: 300, duration: 0.15, type: 'square', gain: 0.2, ramp: 900 },
  ],
  'overclock-off': [
    { frequency: 900, duration: 0.15, type: 'square', gain: 0.2, ramp: 300 },
  ],
};

// ─── Hook ───

export function useSound() {
  const { state } = useGame();
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((params: ToneParams, ctx: AudioContext) => {
    const startTime = ctx.currentTime + (params.delay ?? 0);

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = params.type;
    osc.frequency.setValueAtTime(params.frequency, startTime);

    if (params.ramp) {
      osc.frequency.linearRampToValueAtTime(params.ramp, startTime + params.duration);
    }

    gainNode.gain.setValueAtTime(params.gain, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + params.duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + params.duration + 0.05);
  }, []);

  const play = useCallback((effect: SoundEffect) => {
    if (!state.settings.soundEnabled) return;

    try {
      const ctx = getAudioContext();
      const tones = TONES[effect];
      for (const tone of tones) {
        playTone(tone, ctx);
      }
    } catch {
      // Audio not available — fail silently
    }
  }, [state.settings.soundEnabled, getAudioContext, playTone]);

  return { play };
}
