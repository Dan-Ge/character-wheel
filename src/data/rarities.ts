// ── Rarity Configuration ──
// Weights, colors, visual effects, reveal animation tiers per rarity.
// These are the default drop rates – can be overridden per Wheel or Season.

import { Rarity } from '../types';

// ─── Rarity Config Interface ───

export interface RarityConfig {
  rarity: Rarity;
  label: string;
  /** Default weight (higher = more likely). Sum of all weights = total pool. */
  defaultWeight: number;
  /** Drop rate as percentage (for display) */
  dropRate: number;
  /** Tailwind color class name */
  color: string;
  /** Hex color for SVG / Canvas rendering */
  hex: string;
  /** Secondary hex for gradient effects */
  hexSecondary: string;
  /** CSS glow class from index.css */
  glowClass: string;
  /** Border style for cards */
  borderClass: string;
  /** Background style for cards */
  bgClass: string;
  /** Badge / text style */
  textClass: string;
  /** Reveal animation intensity (0-3): 0=none, 1=fade, 2=flip+glow, 3=flip+glow+shake+particles */
  revealIntensity: 0 | 1 | 2 | 3;
  /** Duration of reveal animation in ms */
  revealDuration: number;
  /** Icon / emoji for quick identification */
  icon: string;
  /** Score multiplier for build score calculation */
  scoreMultiplier: number;
}

// ─── Rarity Configurations ───

export const RARITY_CONFIGS: Record<Rarity, RarityConfig> = {
  [Rarity.Common]: {
    rarity: Rarity.Common,
    label: 'Common',
    defaultWeight: 40,
    dropRate: 40,
    color: 'rarity-common',
    hex: '#9ca3af',
    hexSecondary: '#6b7280',
    glowClass: 'glow-common',
    borderClass: 'border-rarity-common/30',
    bgClass: 'bg-rarity-common/10',
    textClass: 'text-rarity-common',
    revealIntensity: 0,
    revealDuration: 400,
    icon: '⚪',
    scoreMultiplier: 1.0,
  },

  [Rarity.Uncommon]: {
    rarity: Rarity.Uncommon,
    label: 'Uncommon',
    defaultWeight: 25,
    dropRate: 25,
    color: 'rarity-uncommon',
    hex: '#22c55e',
    hexSecondary: '#16a34a',
    glowClass: 'glow-uncommon',
    borderClass: 'border-rarity-uncommon/40',
    bgClass: 'bg-rarity-uncommon/10',
    textClass: 'text-rarity-uncommon',
    revealIntensity: 1,
    revealDuration: 500,
    icon: '🟢',
    scoreMultiplier: 1.5,
  },

  [Rarity.Rare]: {
    rarity: Rarity.Rare,
    label: 'Rare',
    defaultWeight: 18,
    dropRate: 18,
    color: 'rarity-rare',
    hex: '#3b82f6',
    hexSecondary: '#2563eb',
    glowClass: 'glow-rare',
    borderClass: 'border-rarity-rare/50',
    bgClass: 'bg-rarity-rare/10',
    textClass: 'text-rarity-rare',
    revealIntensity: 1,
    revealDuration: 550,
    icon: '🔵',
    scoreMultiplier: 2.5,
  },

  [Rarity.Epic]: {
    rarity: Rarity.Epic,
    label: 'Epic',
    defaultWeight: 10,
    dropRate: 10,
    color: 'rarity-epic',
    hex: '#a855f7',
    hexSecondary: '#9333ea',
    glowClass: 'glow-epic',
    borderClass: 'border-rarity-epic/50',
    bgClass: 'bg-rarity-epic/15',
    textClass: 'text-rarity-epic',
    revealIntensity: 2,
    revealDuration: 650,
    icon: '🟣',
    scoreMultiplier: 4.0,
  },

  [Rarity.Legendary]: {
    rarity: Rarity.Legendary,
    label: 'Legendary',
    defaultWeight: 5,
    dropRate: 5,
    color: 'rarity-legendary',
    hex: '#eab308',
    hexSecondary: '#ca8a04',
    glowClass: 'glow-legendary',
    borderClass: 'border-rarity-legendary/60',
    bgClass: 'bg-rarity-legendary/15',
    textClass: 'text-rarity-legendary',
    revealIntensity: 3,
    revealDuration: 800,
    icon: '🟡',
    scoreMultiplier: 7.0,
  },

  [Rarity.Mythic]: {
    rarity: Rarity.Mythic,
    label: 'Mythic',
    defaultWeight: 1.5,
    dropRate: 1.5,
    color: 'rarity-mythic',
    hex: '#ec4899',
    hexSecondary: '#a855f7',
    glowClass: 'glow-mythic',
    borderClass: 'border-rarity-mythic/70',
    bgClass: 'bg-rarity-mythic/20',
    textClass: 'text-rarity-mythic',
    revealIntensity: 3,
    revealDuration: 1000,
    icon: '💎',
    scoreMultiplier: 12.0,
  },

  [Rarity.Forbidden]: {
    rarity: Rarity.Forbidden,
    label: 'Forbidden',
    defaultWeight: 0.5,
    dropRate: 0.5,
    color: 'rarity-forbidden',
    hex: '#ef4444',
    hexSecondary: '#000000',
    glowClass: 'glow-forbidden',
    borderClass: 'border-rarity-forbidden/80',
    bgClass: 'bg-rarity-forbidden/20',
    textClass: 'text-rarity-forbidden',
    revealIntensity: 3,
    revealDuration: 1200,
    icon: '🔴',
    scoreMultiplier: 15.0,
  },
};

// ─── Helper Functions ───

/** Get config for a specific rarity */
export function getRarityConfig(rarity: Rarity): RarityConfig {
  return RARITY_CONFIGS[rarity];
}

/** Get ordered list of rarities from common to forbidden */
export function getRaritiesOrdered(): Rarity[] {
  return [
    Rarity.Common,
    Rarity.Uncommon,
    Rarity.Rare,
    Rarity.Epic,
    Rarity.Legendary,
    Rarity.Mythic,
    Rarity.Forbidden,
  ];
}

/** Get the rarity tier index (0=Common, 6=Forbidden) */
export function getRarityTier(rarity: Rarity): number {
  return getRaritiesOrdered().indexOf(rarity);
}

/** Check if a rarity is considered "high tier" (Rare or above) */
export function isHighTier(rarity: Rarity): boolean {
  return getRarityTier(rarity) >= 2;
}

/** Check if a rarity is considered "ultra" (Legendary or above) */
export function isUltraTier(rarity: Rarity): boolean {
  return getRarityTier(rarity) >= 4;
}

/** Get default weights as a map for spin engine */
export function getDefaultWeights(): Map<Rarity, number> {
  const weights = new Map<Rarity, number>();
  for (const config of Object.values(RARITY_CONFIGS)) {
    weights.set(config.rarity, config.defaultWeight);
  }
  return weights;
}

// ─── Pity System Defaults ───

export const PITY_DEFAULTS = {
  /** Number of spins without Rare+ before pity kicks in */
  threshold: 5,
  /** Boost per spin beyond threshold (added to Rare+ weight) */
  boostPerSpin: 3,
  /** Maximum pity boost cap */
  maxBoost: 30,
  /** Resets after hitting Rare+ */
  resetsOnHit: true,
} as const;

// ─── Overclock Defaults ───

export const OVERCLOCK_DEFAULTS = {
  /** Multiplier for Epic+ weights when overclock is active */
  highTierMultiplier: 2.5,
  /** Multiplier for Common/Uncommon weights (reduces them) */
  lowTierMultiplier: 0.5,
  /** Guarantees at least this many flaws in the run */
  guaranteedFlaws: 1,
} as const;
