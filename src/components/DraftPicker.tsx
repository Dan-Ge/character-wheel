// ── DraftPicker ──
// Overlay that shows N draft options for the player to choose from.
// Displays segment cards side by side with pick animation.

import { motion } from 'framer-motion';
import type { DraftResult } from '../engine/draftSystem';
import { Rarity } from '../types';

// ─── Props ───

interface DraftPickerProps {
  draft: DraftResult;
  onPick: (index: number) => void;
}

// ─── Rarity Styles ───

const RARITY_STYLE: Record<Rarity, { border: string; glow: string; label: string }> = {
  [Rarity.Common]:    { border: 'border-surface-300', glow: '', label: 'text-gray-400' },
  [Rarity.Uncommon]:  { border: 'border-rarity-uncommon/60', glow: 'glow-uncommon', label: 'text-rarity-uncommon' },
  [Rarity.Rare]:      { border: 'border-rarity-rare/60', glow: 'glow-rare', label: 'text-rarity-rare' },
  [Rarity.Epic]:      { border: 'border-rarity-epic/60', glow: 'glow-epic', label: 'text-rarity-epic' },
  [Rarity.Legendary]: { border: 'border-rarity-legendary/60', glow: 'glow-legendary', label: 'text-rarity-legendary' },
  [Rarity.Mythic]:    { border: 'border-rarity-mythic/60', glow: 'glow-mythic', label: 'text-rarity-mythic' },
  [Rarity.Forbidden]: { border: 'border-rarity-forbidden/60', glow: 'glow-forbidden', label: 'text-rarity-forbidden' },
};

// ─── Component ───

export default function DraftPicker({ draft, onPick }: DraftPickerProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div
        className="mb-6 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="font-display text-xs text-neon-cyan uppercase tracking-widest">
          Draft Mode
        </div>
        <h2 className="font-display text-2xl font-bold text-white mt-1">
          Choose Your Fate
        </h2>
        <p className="text-sm text-surface-400 mt-1">
          Pick one. The rest are lost forever.
        </p>
      </motion.div>

      {/* Options */}
      <div className="flex gap-3 max-w-2xl w-full justify-center">
        {draft.options.map((option, i) => {
          const seg = option.result.segment;
          const style = RARITY_STYLE[seg.rarity];

          return (
            <motion.button
              key={seg.id || i}
              className={`flex-1 max-w-60 bg-surface-100 border-2 ${style.border} rounded-2xl p-5 text-left space-y-3 hover:bg-surface-200 transition-colors ${style.glow}`}
              initial={{ y: 40, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 20,
                delay: 0.2 + i * 0.1,
              }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(i)}
            >
              {/* Rarity badge */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-display uppercase tracking-wider ${style.label}`}>
                  {seg.rarity}
                </span>
                <span className="text-sm text-surface-500">#{i + 1}</span>
              </div>

              {/* Name */}
              <div className={`font-bold text-base ${style.label}`}>
                {seg.label}
              </div>

              {/* Top effect */}
              {seg.effects.length > 0 && (
                <p className="text-sm text-surface-600 leading-relaxed line-clamp-3">
                  {seg.effects[0].description}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {seg.tags.map(tag => (
                  <span key={tag} className="text-xs bg-surface-300 text-surface-600 px-1.5 py-0.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
