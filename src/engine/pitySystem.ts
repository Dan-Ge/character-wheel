// ── Pity System ──
// Progressive rarity boost after consecutive dry streaks.
// After X spins without Rare+ result, the chance for higher
// tiers increases gradually until a Rare+ hit resets the counter.

import { Rarity } from '../types';
import { PITY_DEFAULTS, getRarityTier } from '../data/rarities';

// ─── Pity Configuration ───

export interface PityConfig {
  /** Spins without Rare+ before pity kicks in */
  threshold: number;
  /** Weight boost added per spin beyond threshold */
  boostPerSpin: number;
  /** Maximum total pity boost */
  maxBoost: number;
  /** Whether pity resets after a Rare+ hit */
  resetsOnHit: boolean;
}

/**
 * Compute the pity weight boost for a segment based on current streak.
 *
 * How it works:
 * - If rarityStreak < threshold: no boost (returns 0)
 * - If rarityStreak >= threshold: boost = (streak - threshold) * boostPerSpin
 * - Boost only applies to Rare+ segments (tier >= 2)
 * - Higher tiers get proportionally more boost
 * - Capped at maxBoost
 *
 * @param rarityStreak - Number of consecutive spins without Rare+ result
 * @param segmentRarity - The rarity of the segment being evaluated
 * @param config - Pity configuration (uses defaults if not provided)
 * @returns Weight boost to add to the segment's base weight
 */
export function computePityBoost(
  rarityStreak: number,
  segmentRarity: Rarity,
  config: PityConfig = PITY_DEFAULTS
): number {
  // No boost if streak hasn't reached threshold
  if (rarityStreak < config.threshold) {
    return 0;
  }

  // Only boost Rare+ segments (tier index >= 2)
  const tier = getRarityTier(segmentRarity);
  if (tier < 2) {
    return 0;
  }

  // Calculate base boost
  const spinsOverThreshold = rarityStreak - config.threshold;
  const baseBoost = spinsOverThreshold * config.boostPerSpin;

  // Higher tiers get proportionally more boost
  // Rare (tier 2) = 1x, Epic (3) = 1.3x, Legendary (4) = 1.6x, Mythic (5) = 2x, Forbidden (6) = 2.5x
  const tierMultiplier = 1 + (tier - 2) * 0.3;
  const scaledBoost = baseBoost * tierMultiplier;

  // Cap at max
  return Math.min(scaledBoost, config.maxBoost);
}

/**
 * Check if pity system is currently active (streak exceeded threshold).
 */
export function isPityActive(
  rarityStreak: number,
  config: PityConfig = PITY_DEFAULTS
): boolean {
  return rarityStreak >= config.threshold;
}

/**
 * Get a human-readable pity status for UI display.
 */
export function getPityStatus(
  rarityStreak: number,
  config: PityConfig = PITY_DEFAULTS
): { active: boolean; streak: number; threshold: number; boostPercent: number } {
  const active = isPityActive(rarityStreak, config);
  const boostPercent = active
    ? Math.min(
        ((rarityStreak - config.threshold) * config.boostPerSpin) / config.maxBoost * 100,
        100
      )
    : 0;

  return {
    active,
    streak: rarityStreak,
    threshold: config.threshold,
    boostPercent: Math.round(boostPercent),
  };
}
