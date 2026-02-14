// ── Overclock System ──
// Risk/Reward modifier: player opts in before a spin for
// better high-tier chances at the cost of guaranteed flaws/curses.
//
// When active:
// - Epic+ weights are multiplied (more likely to hit)
// - Common/Uncommon weights are reduced
// - At least 1 guaranteed flaw is added to the run

import { Rarity } from '../types';
import { OVERCLOCK_DEFAULTS, getRarityTier } from '../data/rarities';

// ─── Overclock Configuration ───

export interface OverclockConfig {
  /** Multiplier for Epic+ (tier >= 3) weights */
  highTierMultiplier: number;
  /** Multiplier for Common/Uncommon (tier <= 1) weights – reduces them */
  lowTierMultiplier: number;
  /** Minimum guaranteed flaws when overclock was used in a run */
  guaranteedFlaws: number;
}

/**
 * Compute the weight multiplier for a segment's rarity when overclock is active.
 *
 * - Common/Uncommon: reduced (x0.5 by default)
 * - Rare: unchanged (x1.0)
 * - Epic+: boosted (x2.5 by default)
 *
 * @param segmentRarity - The rarity of the segment being evaluated
 * @param config - Overclock configuration
 * @returns Weight multiplier (1.0 = no change)
 */
export function computeOverclockWeights(
  segmentRarity: Rarity,
  config: OverclockConfig = OVERCLOCK_DEFAULTS
): number {
  const tier = getRarityTier(segmentRarity);

  if (tier <= 1) {
    // Common (0) and Uncommon (1) – reduce weight
    return config.lowTierMultiplier;
  }

  if (tier === 2) {
    // Rare – neutral
    return 1.0;
  }

  // Epic (3), Legendary (4), Mythic (5), Forbidden (6) – boost
  return config.highTierMultiplier;
}

/**
 * Check if a run with overclock has met its flaw requirement.
 * Used by the run manager to enforce guaranteed flaws.
 *
 * @param flawCount - Number of flaws collected so far
 * @param wheelsRemaining - Number of wheels left in the run
 * @param config - Overclock configuration
 * @returns Whether a flaw must be forced on the next flaw wheel
 */
export function mustForceFlawOnNext(
  flawCount: number,
  wheelsRemaining: number,
  config: OverclockConfig = OVERCLOCK_DEFAULTS
): boolean {
  const flawsNeeded = config.guaranteedFlaws - flawCount;
  return flawsNeeded > 0 && wheelsRemaining <= flawsNeeded;
}

/**
 * Get overclock status for UI display.
 */
export function getOverclockStatus(
  isActive: boolean,
  config: OverclockConfig = OVERCLOCK_DEFAULTS
): {
  active: boolean;
  highTierBoost: string;
  lowTierReduction: string;
  flawGuarantee: number;
} {
  return {
    active: isActive,
    highTierBoost: `${Math.round((config.highTierMultiplier - 1) * 100)}%`,
    lowTierReduction: `${Math.round((1 - config.lowTierMultiplier) * 100)}%`,
    flawGuarantee: config.guaranteedFlaws,
  };
}
