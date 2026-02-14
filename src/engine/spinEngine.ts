// ── Spin Engine ──
// Core weighted random selection with modifier support.
// spin(wheel, context, options) -> SpinResult
// Supports deterministic results via seed for replay/sharing.

import type {
  WheelModule,
  Segment,
  BuildContext,
  SpinResult,
  SpinOptions,
  Modifier,
} from '../types';
import { Rarity } from '../types';
import { RARITY_CONFIGS } from '../data/rarities';
import { computePityBoost } from './pitySystem';
import { computeOverclockWeights } from './overclock';
import { computeSynergyBias } from './synergyBias';

// ─── Seeded PRNG (Mulberry32) ───

export function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Weight Computation ───

export interface ComputedWeight {
  segment: Segment;
  baseWeight: number;
  adjustedWeight: number;
  modifiers: string[];
}

/**
 * Compute final weights for each segment in a wheel,
 * applying pity, overclock, and synergy bias modifiers.
 */
export function computeWeights(
  wheel: WheelModule,
  context: BuildContext,
  options: SpinOptions = {}
): ComputedWeight[] {
  return wheel.segments.map((segment) => {
    const modifiers: string[] = [];
    let weight = segment.weight;

    // 1. Pity boost (increases Rare+ weights after dry streak)
    const pityBoost = computePityBoost(context.rarityStreak, segment.rarity);
    if (pityBoost > 0) {
      weight += pityBoost;
      modifiers.push(`pity:+${pityBoost.toFixed(1)}`);
    }

    // 2. Overclock modifier (if active)
    if (options.overclock || context.overclockActive) {
      const overclockFactor = computeOverclockWeights(segment.rarity);
      weight *= overclockFactor;
      if (overclockFactor !== 1) {
        modifiers.push(`overclock:x${overclockFactor.toFixed(1)}`);
      }
    }

    // 3. Synergy bias (subtle boost for tags matching current build)
    const collectedTags = Object.entries(context.collectedTags)
      .filter(([, count]) => count > 0)
      .map(([tag]) => tag as import('../types').Tag);

    const synergyBias = computeSynergyBias(segment.tags, collectedTags);
    if (synergyBias > 0) {
      const biasBoost = weight * synergyBias;
      weight += biasBoost;
      modifiers.push(`synergy:+${(synergyBias * 100).toFixed(0)}%`);
    }

    // 4. Season modifiers (if any)
    if (options.seasonModifiers) {
      for (const mod of options.seasonModifiers) {
        if (mod.type === 'season') {
          weight *= mod.value;
          modifiers.push(`season:x${mod.value}`);
        }
      }
    }

    // Ensure minimum weight
    weight = Math.max(weight, 0.01);

    return {
      segment,
      baseWeight: segment.weight,
      adjustedWeight: weight,
      modifiers,
    };
  });
}

// ─── Weighted Selection ───

/**
 * Select a single segment from computed weights using
 * either a seeded PRNG or Math.random.
 */
export function selectSegment(
  weights: ComputedWeight[],
  random: () => number = Math.random
): ComputedWeight {
  const totalWeight = weights.reduce((sum, w) => sum + w.adjustedWeight, 0);
  let roll = random() * totalWeight;

  for (const entry of weights) {
    roll -= entry.adjustedWeight;
    if (roll <= 0) {
      return entry;
    }
  }

  // Fallback: return last segment
  return weights[weights.length - 1];
}

// ─── Main Spin Function ───

/**
 * Perform a single spin on a wheel.
 * Returns the selected segment wrapped in a SpinResult.
 */
export function spin(
  wheel: WheelModule,
  context: BuildContext,
  options: SpinOptions = {}
): SpinResult {
  // Determine random source
  const random = options.seed != null
    ? mulberry32(options.seed)
    : Math.random;

  // Compute weights with all modifiers
  const weights = computeWeights(wheel, context, options);

  // Select segment
  const selected = selectSegment(weights, typeof random === 'function' ? random : Math.random);

  // Build SpinResult
  const result: SpinResult = {
    segment: selected.segment,
    wheelId: wheel.id,
    wheelName: wheel.name,
    wheelCategory: wheel.category,
    timestamp: Date.now(),
    modifiersApplied: selected.modifiers,
  };

  return result;
}

// ─── Context Update ───

/**
 * Update BuildContext after a spin result.
 * Updates tags, rarity streak, score, and flaws.
 */
export function updateContextAfterSpin(
  context: BuildContext,
  result: SpinResult
): BuildContext {
  const newContext = { ...context };

  // Add to history
  newContext.history = [...context.history, result];

  // Update collected tags
  const newTags = { ...context.collectedTags };
  for (const tag of result.segment.tags) {
    newTags[tag] = (newTags[tag] || 0) + 1;
  }
  newContext.collectedTags = newTags;

  // Update rarity streak
  const rarityConfig = RARITY_CONFIGS[result.segment.rarity];
  const isHighTier = [Rarity.Rare, Rarity.Epic, Rarity.Legendary, Rarity.Mythic, Rarity.Forbidden]
    .includes(result.segment.rarity);

  if (isHighTier) {
    newContext.rarityStreak = 0;
  } else {
    newContext.rarityStreak = context.rarityStreak + 1;
  }

  // Update score
  const baseScore = 100;
  newContext.totalScore = context.totalScore + Math.round(baseScore * rarityConfig.scoreMultiplier);

  // Track flaws
  if (result.wheelCategory === 'flaw') {
    newContext.flaws = [...context.flaws, result];
  }

  return newContext;
}

// ─── Fresh Build Context ───

/**
 * Create a fresh BuildContext for a new run.
 */
export function createFreshContext(
  overclockActive: boolean = false,
  draftMode: boolean = false
): BuildContext {
  return {
    history: [],
    collectedTags: {} as Record<import('../types').Tag, number>,
    rarityStreak: 0,
    modifiers: [],
    totalScore: 0,
    synergies: [],
    conflicts: [],
    flaws: [],
    overclockActive,
    draftMode,
  };
}

// ─── Spin Statistics (for debug / UI) ───

export interface SpinStats {
  segmentId: string;
  label: string;
  rarity: Rarity;
  baseWeight: number;
  adjustedWeight: number;
  probability: number; // 0-1
  modifiers: string[];
}

/**
 * Get formatted spin statistics for a wheel in the current context.
 * Useful for debug UI or probability display.
 */
export function getSpinStats(
  wheel: WheelModule,
  context: BuildContext,
  options: SpinOptions = {}
): SpinStats[] {
  const weights = computeWeights(wheel, context, options);
  const totalWeight = weights.reduce((sum, w) => sum + w.adjustedWeight, 0);

  return weights.map((w) => ({
    segmentId: w.segment.id,
    label: w.segment.label,
    rarity: w.segment.rarity,
    baseWeight: w.baseWeight,
    adjustedWeight: w.adjustedWeight,
    probability: w.adjustedWeight / totalWeight,
    modifiers: w.modifiers,
  }));
}
