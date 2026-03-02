// ── Synergy Bias ──
// Subtle tag-matching influence on subsequent spins.
// When the player has collected tags that belong to synergy groups,
// segments with matching tags get a small weight boost.
//
// Design principle: bias must NEVER feel deterministic.
// Max boost is capped at ~15%, so it nudges without guaranteeing.

import type { Tag } from '../types';
import { getSynergyBiasForTag, areTagsSynergistic } from '../data/tags';

// ─── Configuration ───

export interface SynergyBiasConfig {
  /** Enable/disable synergy bias */
  enabled: boolean;
  /** Maximum bias boost as a fraction (0.15 = 15%) */
  maxBias: number;
  /** Per-tag boost when a synergistic tag is present (0.05 = 5%) */
  perTagBoost: number;
}

export const SYNERGY_BIAS_DEFAULTS: SynergyBiasConfig = {
  enabled: true,
  maxBias: 0.15,
  perTagBoost: 0.05,
};

/**
 * Compute the synergy bias weight boost for a segment's tags
 * based on already collected tags in the build.
 *
 * @param segmentTags - Tags of the segment being evaluated
 * @param collectedTags - Tags already collected in the current build
 * @param config - Synergy bias configuration
 * @returns Fractional boost (0.0 to maxBias). Multiply against base weight.
 */
export function computeSynergyBias(
  segmentTags: Tag[],
  collectedTags: Tag[],
  config: SynergyBiasConfig = SYNERGY_BIAS_DEFAULTS
): number {
  if (!config.enabled || collectedTags.length === 0 || segmentTags.length === 0) {
    return 0;
  }

  // Sum bias across all segment tags
  let totalBias = 0;
  for (const tag of segmentTags) {
    totalBias += getSynergyBiasForTag(tag, collectedTags);
  }

  // Average across segment tags (so multi-tag segments don't get
  // disproportionately boosted) and cap at max
  const averageBias = totalBias / segmentTags.length;
  return Math.min(averageBias, config.maxBias);
}

/**
 * Get a human-readable synergy bias status for a segment (UI debug info).
 */
export function getSynergyBiasInfo(
  segmentTags: Tag[],
  collectedTags: Tag[],
  config: SynergyBiasConfig = SYNERGY_BIAS_DEFAULTS
): { biasPercent: number; matchingTags: Tag[]; description: string } {
  const bias = computeSynergyBias(segmentTags, collectedTags, config);

  const matchingTags = segmentTags.filter((tag) =>
    collectedTags.some((ct) => areTagsSynergistic(tag, ct))
  );

  const biasPercent = Math.round(bias * 100);

  return {
    biasPercent,
    matchingTags,
    description:
      biasPercent > 0
        ? `+${biasPercent}% boost from synergistic tags: ${matchingTags.join(', ')}`
        : 'No synergy bias active',
  };
}
