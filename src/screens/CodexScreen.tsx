// ── CodexScreen ──
// Shows all discovered segments organized by wheel category.

import { useMemo, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { cyberMythicSeason } from '../data/seasons/cyberMythic';
import { Rarity } from '../types';
import type { WheelCategory, WheelModule, Segment } from '../types';

const RARITY_BADGE: Record<Rarity, string> = {
  [Rarity.Common]:    'bg-gray-600/30 text-gray-400 border-gray-600/40',
  [Rarity.Uncommon]:  'bg-rarity-uncommon/10 text-rarity-uncommon border-rarity-uncommon/30',
  [Rarity.Rare]:      'bg-rarity-rare/10 text-rarity-rare border-rarity-rare/30',
  [Rarity.Epic]:      'bg-rarity-epic/10 text-rarity-epic border-rarity-epic/30',
  [Rarity.Legendary]: 'bg-rarity-legendary/10 text-rarity-legendary border-rarity-legendary/30',
  [Rarity.Mythic]:    'bg-rarity-mythic/10 text-rarity-mythic border-rarity-mythic/30',
  [Rarity.Forbidden]: 'bg-rarity-forbidden/10 text-rarity-forbidden border-rarity-forbidden/30',
};

const CATEGORY_ICONS: Record<WheelCategory, string> = {
  stats: '📊', power: '⚡', gear: '🛡️', companion: '🐾',
  origin: '📜', flaw: '💀', style: '✨',
};

function SegmentEntry({ segment, discovered }: { segment: Segment; discovered: boolean }) {
  const style = RARITY_BADGE[segment.rarity];

  if (!discovered) {
    return (
      <div className="bg-surface-200/50 border border-surface-300/50 rounded-lg p-3 flex items-center gap-2 opacity-40">
        <span className="text-surface-400 text-sm">❓</span>
        <span className="text-xs text-surface-400 italic">Undiscovered</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`${style} border rounded-lg p-3 space-y-1`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{segment.label}</span>
        <span className="text-[9px] font-display uppercase tracking-wider opacity-70">
          {segment.rarity}
        </span>
      </div>
      {segment.effects.length > 0 && (
        <p className="text-[10px] opacity-60 leading-relaxed">
          {segment.effects[0].description}
        </p>
      )}
      {segment.tags.length > 0 && (
        <div className="flex flex-wrap gap-0.5 pt-0.5">
          {segment.tags.map(tag => (
            <span key={tag} className="text-[8px] bg-surface-200/50 px-1 py-0.5 rounded-full opacity-50">{tag}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function WheelSection({ wheel, discovered }: { wheel: WheelModule; discovered: Set<string> }) {
  const [expanded, setExpanded] = useState(false);
  const icon = CATEGORY_ICONS[wheel.category] ?? '🎯';
  const discoveredCount = wheel.segments.filter(s => discovered.has(s.id)).length;
  const totalCount = wheel.segments.length;
  const pct = Math.round((discoveredCount / totalCount) * 100);

  return (
    <div className="bg-surface-100 border border-surface-300 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-surface-200/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div className="text-left">
            <div className="text-sm font-medium text-white">{wheel.name}</div>
            <div className="text-[10px] text-surface-400 uppercase tracking-wider">{wheel.category}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-white font-medium">
              {discoveredCount}/{totalCount}
            </div>
            <div className="w-16 h-1.5 bg-surface-300 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-neon-cyan rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <span className={`text-surface-400 text-xs transition-transform ${expanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 grid grid-cols-2 gap-2">
              {wheel.segments.map(seg => (
                <SegmentEntry
                  key={seg.id}
                  segment={seg}
                  discovered={discovered.has(seg.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CodexScreen() {
  const { state, dispatch } = useGame();
  const { play } = useSound();

  const discoveredSet = useMemo(
    () => new Set(state.codexDiscovered),
    [state.codexDiscovered],
  );

  const season = cyberMythicSeason;
  const totalSegments = season.wheels.reduce((sum, w) => sum + w.segments.length, 0);
  const totalDiscovered = state.codexDiscovered.length;
  const overallPct = Math.round((totalDiscovered / totalSegments) * 100);

  const handleBack = useCallback(() => {
    play('navigate');
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  }, [dispatch, play]);

  return (
    <motion.div
      className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="text-surface-400 hover:text-white transition-colors p-2">
          ← Back
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold">Codex</h1>
          <p className="text-surface-400 text-sm">
            {totalDiscovered}/{totalSegments} segments discovered ({overallPct}%)
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="max-w-md mx-auto w-full">
        <div className="bg-surface-100 border border-surface-300 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-400">Collection Progress</span>
            <span className="font-display font-bold text-neon-cyan">{overallPct}%</span>
          </div>
          <div className="w-full h-3 bg-surface-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-accent to-neon-cyan rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-surface-400">
            <span>{totalDiscovered} discovered</span>
            <span>{totalSegments - totalDiscovered} remaining</span>
          </div>
        </div>
      </div>

      {/* Wheel Sections */}
      <div className="max-w-md mx-auto w-full space-y-3">
        {season.wheels.map(wheel => (
          <WheelSection
            key={wheel.id}
            wheel={wheel}
            discovered={discoveredSet}
          />
        ))}
      </div>
    </motion.div>
  );
}
