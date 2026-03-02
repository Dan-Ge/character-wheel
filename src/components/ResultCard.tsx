// ── ResultCard ──
// Animated card that reveals a spin result with rarity styling,
// glow effects, and flip/scale entrance animation.

import { motion } from 'framer-motion';
import type { SpinResult } from '../types';
import { Rarity } from '../types';

// ─── Props ───

interface ResultCardProps {
  result: SpinResult;
  index: number;
  compact?: boolean;
}

// ─── Rarity Theme ───

const RARITY_THEME: Record<Rarity, {
  border: string;
  bg: string;
  label: string;
  glow: string;
  badge: string;
}> = {
  [Rarity.Common]: {
    border: 'border-surface-300',
    bg: 'bg-surface-100',
    label: 'text-gray-400',
    glow: '',
    badge: 'bg-gray-600 text-gray-300',
  },
  [Rarity.Uncommon]: {
    border: 'border-rarity-uncommon/50',
    bg: 'bg-surface-100',
    label: 'text-rarity-uncommon',
    glow: 'glow-uncommon',
    badge: 'bg-rarity-uncommon/20 text-rarity-uncommon',
  },
  [Rarity.Rare]: {
    border: 'border-rarity-rare/50',
    bg: 'bg-surface-100',
    label: 'text-rarity-rare',
    glow: 'glow-rare',
    badge: 'bg-rarity-rare/20 text-rarity-rare',
  },
  [Rarity.Epic]: {
    border: 'border-rarity-epic/50',
    bg: 'bg-surface-100',
    label: 'text-rarity-epic',
    glow: 'glow-epic',
    badge: 'bg-rarity-epic/20 text-rarity-epic',
  },
  [Rarity.Legendary]: {
    border: 'border-rarity-legendary/60',
    bg: 'bg-surface-100',
    label: 'text-rarity-legendary',
    glow: 'glow-legendary',
    badge: 'bg-rarity-legendary/20 text-rarity-legendary',
  },
  [Rarity.Mythic]: {
    border: 'border-rarity-mythic/60',
    bg: 'bg-surface-100',
    label: 'text-rarity-mythic',
    glow: 'glow-mythic',
    badge: 'bg-rarity-mythic/20 text-rarity-mythic',
  },
  [Rarity.Forbidden]: {
    border: 'border-rarity-forbidden/60',
    bg: 'bg-surface-100',
    label: 'text-rarity-forbidden',
    glow: 'glow-forbidden',
    badge: 'bg-rarity-forbidden/20 text-rarity-forbidden',
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  stats: '📊',
  power: '⚡',
  gear: '🛡️',
  companion: '🐾',
  origin: '📜',
  flaw: '💀',
  style: '✨',
};

// ─── Compact Mini Card ───

function MiniCard({ result }: { result: SpinResult }) {
  const theme = RARITY_THEME[result.segment.rarity];
  const icon = CATEGORY_ICONS[result.wheelCategory] ?? '🎯';

  return (
    <motion.div
      className={`shrink-0 w-20 h-24 ${theme.bg} border-2 ${theme.border} rounded-xl flex flex-col items-center justify-center gap-1.5 p-1.5 ${theme.glow}`}
      initial={{ scale: 0, rotateY: 90 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span className="text-xl">{icon}</span>
      <span className={`text-[10px] font-semibold text-center leading-tight ${theme.label}`}>
        {result.segment.label.length > 12
          ? result.segment.label.slice(0, 11) + '…'
          : result.segment.label}
      </span>
    </motion.div>
  );
}

// ─── Full Card ───

export default function ResultCard({ result, index, compact }: ResultCardProps) {
  if (compact) return <MiniCard result={result} />;

  const theme = RARITY_THEME[result.segment.rarity];
  const icon = CATEGORY_ICONS[result.wheelCategory] ?? '🎯';
  const segment = result.segment;

  return (
    <motion.div
      className={`${theme.bg} border-2 ${theme.border} rounded-2xl p-5 space-y-4 ${theme.glow}`}
      initial={{ scale: 0.3, rotateY: 90, opacity: 0 }}
      animate={{ scale: 1, rotateY: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 18,
        delay: index * 0.08,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <div className="text-xs text-surface-600 uppercase tracking-wider">
              {result.wheelName}
            </div>
            <div className={`font-bold text-lg ${theme.label}`}>
              {segment.label}
            </div>
          </div>
        </div>
        <span className={`text-xs font-display uppercase tracking-wider px-2.5 py-1 rounded-full ${theme.badge}`}>
          {segment.rarity}
        </span>
      </div>

      {segment.effects.length > 0 && (
        <div className="space-y-2">
          {segment.effects.map((effect, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-surface-500 shrink-0 text-base">
                {effect.type === 'ability' ? '⚔️' :
                 effect.type === 'passive' ? '🔄' :
                 effect.type === 'stat_boost' ? '📈' :
                 effect.type === 'curse' ? '☠️' :
                 effect.type === 'cosmetic' ? '🎨' : '🔗'}
              </span>
              <span className="text-surface-600 text-sm leading-relaxed">
                {effect.description}
              </span>
            </div>
          ))}
        </div>
      )}

      {segment.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {segment.tags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-surface-300 text-surface-600 px-2 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {segment.lore && (
        <p className="text-sm text-surface-500 italic leading-relaxed border-t border-surface-300/50 pt-3">
          {segment.lore}
        </p>
      )}
    </motion.div>
  );
}

export { MiniCard as ResultMiniCard };
