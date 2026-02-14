// ── Build Finalizer ──
// Takes a completed BuildContext and produces a shareable CharacterBuild.
// Calculates final score, determines signature combo, weak spot,
// meme potential, and generates share code.

import type {
  BuildContext,
  CharacterBuild,
  SignatureCombo,
  SpinResult,
  Tag,
  SynergyRule,
} from '../types';
import { Rarity } from '../types';
import { getRarityConfig, getRarityTier } from '../data/rarities';
import { findMatchingSynergies, calculateSynergyBonus } from '../data/synergies';
import { findMatchingConflicts, calculateConflictPenalty, getParadoxAbilities } from '../data/conflicts';
import { generateBuildName } from '../utils/nameGenerator';

// ─── Main Entry Point ───

/**
 * Finalize a completed run into a shareable CharacterBuild.
 *
 * @param context  The completed BuildContext (all 7 wheels spun)
 * @param season   Season identifier
 * @param seed     Seed string used for the run
 */
export function finalizeBuild(
  context: BuildContext,
  season: string = 'cyber-mythic',
  seed: string = ''
): CharacterBuild {
  const allTags = getAllTags(context);
  const rarityBreakdown = computeRarityBreakdown(context);

  // Synergies & conflicts
  const activeSynergies = findMatchingSynergies(allTags);
  const activeConflicts = findMatchingConflicts(allTags);

  // Score calculation
  const baseScore = context.totalScore;
  const synergyBonus = calculateSynergyBonus(activeSynergies);
  const conflictPenalty = calculateConflictPenalty(activeConflicts);
  const rarityBonus = computeRarityBonus(context);
  const diversityBonus = computeDiversityBonus(allTags);
  const flawPenalty = computeFlawPenalty(context);

  const finalScore = Math.max(
    0,
    baseScore + synergyBonus + conflictPenalty + rarityBonus + diversityBonus + flawPenalty
  );

  // Signature combo (strongest synergy)
  const signatureCombo = determineSignatureCombo(context, activeSynergies);

  // Weak spot (the lowest-rarity or flaw result)
  const weakSpot = determineWeakSpot(context);

  // Meme potential (how absurd/funny is this build?)
  const memePotential = computeMemePotential(context, activeConflicts, allTags);

  // Generate identifiers
  const buildId = generateBuildId();
  const shareCode = generateShareCode(seed, season, context);
  const buildName = generateBuildName(allTags, signatureCombo, context);

  return {
    id: buildId,
    name: buildName,
    results: context.history,
    score: finalScore,
    signatureCombo,
    weakSpot,
    memePotential,
    season,
    seed,
    shareCode,
    createdAt: Date.now(),
    tags: allTags,
    rarityBreakdown,
  };
}

// ─── Score Components ───

/** Bonus for having high-rarity segments */
function computeRarityBonus(context: BuildContext): number {
  let bonus = 0;
  for (const result of context.history) {
    const tier = getRarityTier(result.segment.rarity);
    if (tier >= 4) {
      // Legendary+: extra flat bonus
      bonus += tier * 25;
    }
  }
  return bonus;
}

/** Bonus for tag diversity (unique tags across all wheels) */
function computeDiversityBonus(allTags: Tag[]): number {
  // More unique tags = higher bonus, diminishing returns
  const unique = allTags.length;
  if (unique >= 12) return 200;
  if (unique >= 9) return 120;
  if (unique >= 6) return 60;
  if (unique >= 3) return 20;
  return 0;
}

/** Penalty from flaw wheel results */
function computeFlawPenalty(context: BuildContext): number {
  // Each flaw reduces score, but having exactly 1 is thematic (no extra penalty)
  const flawCount = context.flaws.length;
  if (flawCount <= 1) return 0;
  return (flawCount - 1) * -50; // extra flaws from overclock etc.
}

// ─── Signature Combo ───

function determineSignatureCombo(
  context: BuildContext,
  activeSynergies: SynergyRule[]
): SignatureCombo | null {
  if (activeSynergies.length === 0) return null;

  // Pick the synergy with the highest bonus score
  const bestSynergy = activeSynergies.reduce((best, current) =>
    current.bonusScore > best.bonusScore ? current : best
  );

  // Find contributing results
  const components = context.history.filter((result) =>
    result.segment.tags.some((t) => bestSynergy.requiredTags.includes(t))
  );

  return {
    name: bestSynergy.comboName || bestSynergy.id,
    components,
    description: bestSynergy.effect,
    power: bestSynergy.bonusScore,
  };
}

// ─── Weak Spot ───

function determineWeakSpot(context: BuildContext): string {
  // Find the lowest-tier result
  let weakest: SpinResult | null = null;
  let lowestTier = Infinity;

  for (const result of context.history) {
    const tier = getRarityTier(result.segment.rarity);
    if (tier < lowestTier) {
      lowestTier = tier;
      weakest = result;
    }
  }

  if (!weakest) return 'No weaknesses found. Suspicious.';

  const rarityLabel = getRarityConfig(weakest.segment.rarity).label;
  return `${weakest.segment.label} (${rarityLabel}) from ${weakest.wheelName}`;
}

// ─── Meme Potential ───

/**
 * Meme potential (0-100): how absurd, funny, or share-worthy is this build?
 * High when: many conflicts, paradox abilities, extreme rarity mix, funny
 * tag combos.
 */
function computeMemePotential(
  context: BuildContext,
  activeConflicts: import('../types').ConflictRule[],
  allTags: Tag[]
): number {
  let meme = 0;

  // Conflicts are inherently funny
  meme += activeConflicts.length * 15;

  // Paradox abilities are hilarious
  const paradoxes = getParadoxAbilities(allTags);
  meme += paradoxes.length * 10;

  // Extreme rarity variance is meme-worthy
  const rarities = context.history.map((r) => getRarityTier(r.segment.rarity));
  const minRarity = Math.min(...rarities);
  const maxRarity = Math.max(...rarities);
  if (maxRarity - minRarity >= 4) {
    meme += 15; // Forbidden + Common in same build
  }

  // Having flaws with high-tier items is funny
  if (context.flaws.length > 0 && maxRarity >= 5) {
    meme += 10;
  }

  // Lots of tags = chaotic build
  if (allTags.length >= 10) {
    meme += 10;
  }

  return Math.min(meme, 100);
}

// ─── Rarity Breakdown ───

function computeRarityBreakdown(context: BuildContext): Record<Rarity, number> {
  const breakdown: Record<Rarity, number> = {
    [Rarity.Common]: 0,
    [Rarity.Uncommon]: 0,
    [Rarity.Rare]: 0,
    [Rarity.Epic]: 0,
    [Rarity.Legendary]: 0,
    [Rarity.Mythic]: 0,
    [Rarity.Forbidden]: 0,
  };

  for (const result of context.history) {
    breakdown[result.segment.rarity]++;
  }

  return breakdown;
}

// ─── ID & Share Code Generation ───

function generateBuildId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'build_';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Generate a compact share code that encodes the run.
 * Format: SEASON-SEED-SEGIDS
 * This is a simplified encoding; full replay uses the seed.
 */
function generateShareCode(
  seed: string,
  season: string,
  context: BuildContext
): string {
  const seasonShort = season.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  const seedShort = seed ? seed.slice(0, 6) : Math.random().toString(36).slice(2, 8);
  const segIds = context.history
    .map((r) => r.segment.id.slice(0, 3))
    .join('');

  return `${seasonShort}-${seedShort}-${segIds}`.toUpperCase();
}

// ─── Tag Helpers ───

function getAllTags(context: BuildContext): Tag[] {
  return Object.entries(context.collectedTags)
    .filter(([, count]) => count > 0)
    .map(([tag]) => tag as Tag);
}
