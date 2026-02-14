import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { cyberMythicSeason } from '../data/seasons/cyberMythic';
import type { GameMode } from '../types';

const MODES: { id: GameMode; label: string; icon: string; color: string; hoverBorder: string }[] = [
  { id: 'normal', label: 'Normal', icon: '🎯', color: 'text-white', hoverBorder: 'hover:border-accent/50' },
  { id: 'cursed', label: 'Cursed', icon: '☠️', color: 'text-neon-pink', hoverBorder: 'hover:border-neon-pink/50' },
  { id: 'draft', label: 'Draft', icon: '🃏', color: 'text-neon-cyan', hoverBorder: 'hover:border-neon-cyan/50' },
  { id: 'duo', label: 'Duo', icon: '👥', color: 'text-neon-violet', hoverBorder: 'hover:border-neon-violet/50' },
];

export default function HomeScreen() {
  const { state, dispatch } = useGame();
  const { play } = useSound();

  const season = cyberMythicSeason;

  const totalSegments = useMemo(
    () => season.wheels.reduce((sum, w) => sum + w.segments.length, 0),
    [season.wheels],
  );

  const handleStart = useCallback(() => {
    play('navigate');
    dispatch({ type: 'SELECT_SEASON', season });
    dispatch({ type: 'NAVIGATE', screen: 'spin' });
  }, [dispatch, play, season]);

  const handleModeSelect = useCallback((mode: GameMode) => {
    play('navigate');
    dispatch({ type: 'SET_GAME_MODE', mode });
  }, [dispatch, play]);

  const handleToggleSound = useCallback(() => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { soundEnabled: !state.settings.soundEnabled } });
  }, [dispatch, state.settings.soundEnabled]);

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center p-6 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo / Title */}
      <div className="text-center space-y-3">
        <h1 className="font-display text-5xl md:text-7xl font-black tracking-wider bg-linear-to-r from-accent-light via-neon-cyan to-neon-pink bg-clip-text text-transparent">
          CHARACTER WHEEL
        </h1>
        <p className="text-surface-400 text-lg md:text-xl font-medium">
          Spin your destiny. Build your legend.
        </p>
      </div>

      {/* Season Preview */}
      <div className="w-full max-w-md">
        <div className="bg-surface-100 rounded-2xl border border-surface-300 p-6 text-center space-y-4">
          <div className="text-sm text-neon-cyan font-display uppercase tracking-widest">
            Season 1
          </div>
          <h2 className="text-2xl font-bold">{season.name}</h2>
          <p className="text-surface-400 text-sm">{season.theme}</p>
          <div className="flex justify-center gap-4 text-xs text-surface-400">
            <span>{season.wheels.length} Wheels</span>
            <span>·</span>
            <span>{totalSegments} Segments</span>
            <span>·</span>
            <span>{season.limitedSegments.length} Limited</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 bg-linear-to-r from-accent to-neon-pink rounded-xl font-display font-bold text-lg tracking-wide text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-95 transition-all duration-200"
        >
          START RUN
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => { play('navigate'); dispatch({ type: 'NAVIGATE', screen: 'codex' }); }}
            className="flex-1 py-3 px-4 bg-surface-100 border border-surface-300 rounded-xl font-medium text-sm text-gray-300 hover:border-accent/50 hover:text-white active:scale-95 transition-all duration-200"
          >
            📖 Codex
          </button>
          <button
            onClick={() => { play('navigate'); dispatch({ type: 'NAVIGATE', screen: 'gallery' }); }}
            className="flex-1 py-3 px-4 bg-surface-100 border border-surface-300 rounded-xl font-medium text-sm text-gray-300 hover:border-accent/50 hover:text-white active:scale-95 transition-all duration-200"
          >
            🏆 Gallery
          </button>
        </div>
      </div>

      {/* Game Mode Selector */}
      <div className="flex gap-2 text-xs">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => handleModeSelect(m.id)}
            className={`px-3 py-1 rounded-full border transition-colors ${
              state.gameMode === m.id
                ? `${m.color} border-current bg-surface-200`
                : `text-surface-400 border-surface-300 ${m.hoverBorder} hover:${m.color}`
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Sound Toggle */}
      <button
        onClick={handleToggleSound}
        className="text-sm text-surface-400 hover:text-white transition-colors"
      >
        {state.settings.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
      </button>

      {/* Footer */}
      <div className="text-xs text-surface-400/50 mt-auto pt-8">
        v0.1.0 · Season 1: {season.name}
      </div>
    </motion.div>
  );
}
