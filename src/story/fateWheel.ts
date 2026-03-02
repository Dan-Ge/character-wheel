// ── Fate Wheel ──
// The "Schicksalsrad" — spun at the start of each story event
// to determine what category of event the character faces.
// Weights shift based on region, character traits, and story progress.

import type { FateWheelSlice, StoryCharacter } from '../types/storyTypes';
import type { Tag } from '../types';

// ─── Default Fate Wheel Slices ───

export const FATE_WHEEL_SLICES: FateWheelSlice[] = [
  {
    id: 'fate-combat',
    label: 'Combat',
    category: 'combat',
    weight: 20,
    rarityModifier: 0,
    description: 'Steel meets steel. Or plasma meets face.',
    color: '#ef4444',
  },
  {
    id: 'fate-exploration',
    label: 'Exploration',
    category: 'exploration',
    weight: 18,
    rarityModifier: 0,
    description: 'The unknown beckons. What will you discover?',
    color: '#22c55e',
  },
  {
    id: 'fate-social',
    label: 'Social',
    category: 'social',
    weight: 15,
    rarityModifier: 0,
    description: 'Words are weapons too. Sometimes better ones.',
    color: '#3b82f6',
  },
  {
    id: 'fate-mystery',
    label: 'Mystery',
    category: 'mystery',
    weight: 12,
    rarityModifier: 1,
    description: 'Something does not add up. Investigate.',
    color: '#a855f7',
  },
  {
    id: 'fate-crisis',
    label: 'Crisis!',
    category: 'crisis',
    weight: 10,
    rarityModifier: 1,
    description: 'No time to think. Act NOW or suffer.',
    color: '#f59e0b',
  },
  {
    id: 'fate-trade',
    label: 'Trade',
    category: 'trade',
    weight: 8,
    rarityModifier: 0,
    description: 'A merchant appears. What are you willing to pay?',
    color: '#06b6d4',
  },
  {
    id: 'fate-alliance',
    label: 'Alliance',
    category: 'alliance',
    weight: 7,
    rarityModifier: 0,
    description: 'A potential friend. Or a future betrayer.',
    color: '#10b981',
  },
  {
    id: 'fate-divine',
    label: 'Divine',
    category: 'divine',
    weight: 4,
    rarityModifier: 2,
    description: 'Something beyond mortal comprehension takes notice.',
    color: '#eab308',
  },
  {
    id: 'fate-curse',
    label: 'Curse',
    category: 'curse',
    weight: 3,
    rarityModifier: 2,
    description: 'Darkness finds you. Brace yourself.',
    color: '#7c3aed',
  },
  {
    id: 'fate-blessing',
    label: 'Blessing',
    category: 'blessing',
    weight: 3,
    rarityModifier: 2,
    description: 'Fortune smiles. But nothing is truly free.',
    color: '#f0abfc',
  },
  {
    id: 'fate-training',
    label: 'Training',
    category: 'training',
    weight: 8,
    rarityModifier: 0,
    description: 'Time to grow. Push your limits.',
    color: '#64748b',
  },
  {
    id: 'fate-betrayal',
    label: 'Betrayal',
    category: 'betrayal',
    weight: 3,
    rarityModifier: 2,
    description: 'Trust is a currency. Someone just cashed in.',
    color: '#dc2626',
  },
  {
    id: 'fate-rest',
    label: 'Rest',
    category: 'rest',
    weight: 5,
    rarityModifier: -1,
    description: 'A moment of peace. Heal. Reflect. Prepare.',
    color: '#94a3b8',
  },
  {
    id: 'fate-boss',
    label: 'BOSS',
    category: 'boss',
    weight: 2,
    rarityModifier: 3,
    description: 'A powerful foe blocks your path. This is a defining moment.',
    color: '#b91c1c',
  },
  {
    id: 'fate-pvp',
    label: 'PvP!',
    category: 'pvp',
    weight: 2,
    rarityModifier: 1,
    description: 'Another adventurer crosses your path...',
    color: '#e11d48',
  },
];

// ─── Weight Adjustment Based on Character State ───

export interface AdjustedSlice extends FateWheelSlice {
  adjustedWeight: number;
  adjustmentReasons: string[];
}

/**
 * Compute adjusted fate wheel weights based on character state,
 * region, and story progress.
 */
export function computeFateWeights(
  character: StoryCharacter,
  regionTags: Tag[]
): AdjustedSlice[] {
  return FATE_WHEEL_SLICES.map((slice) => {
    let weight = slice.weight;
    const reasons: string[] = [];

    // ── HP-based adjustments ──
    const hpPercent = character.hp / character.maxHp;

    if (hpPercent < 0.3) {
      // Low HP: more rest, less combat
      if (slice.category === 'rest') {
        weight *= 2.5;
        reasons.push('Low HP: rest more likely');
      }
      if (slice.category === 'combat' || slice.category === 'boss') {
        weight *= 0.5;
        reasons.push('Low HP: combat less likely');
      }
      if (slice.category === 'crisis') {
        weight *= 1.5;
        reasons.push('Low HP: crisis looms');
      }
    }

    // ── Status-based adjustments ──
    if (character.status === 'injured') {
      if (slice.category === 'blessing') {
        weight *= 1.5;
        reasons.push('Injured: hope beckons');
      }
    }

    if (character.status === 'corrupted') {
      if (slice.category === 'divine') {
        weight *= 2;
        reasons.push('Corrupted: gods take notice');
      }
      if (slice.category === 'curse') {
        weight *= 1.5;
        reasons.push('Corrupted: darkness attracts darkness');
      }
    }

    // ── Power tier adjustments ──
    const tierIndex = POWER_TIER_ORDER.indexOf(character.powerTier);

    if (tierIndex >= 4) {
      // High tier: more boss/pvp/divine encounters
      if (slice.category === 'boss') {
        weight *= 1.5 + tierIndex * 0.2;
        reasons.push('High tier: bosses seek you');
      }
      if (slice.category === 'pvp') {
        weight *= 1.5;
        reasons.push('High tier: rivals notice you');
      }
    }

    if (tierIndex <= 1) {
      // Low tier: more training, less boss
      if (slice.category === 'training') {
        weight *= 1.5;
        reasons.push('Novice: training opportunities');
      }
      if (slice.category === 'boss') {
        weight *= 0.3;
        reasons.push('Novice: bosses ignore you');
      }
    }

    // ── Region tag matching ──
    const characterTags = character.build.tags;
    const tagOverlap = characterTags.filter((t) => regionTags.includes(t)).length;

    if (tagOverlap >= 2) {
      if (slice.category === 'exploration') {
        weight *= 1.3;
        reasons.push('Tag affinity: explore more');
      }
      if (slice.category === 'alliance') {
        weight *= 1.4;
        reasons.push('Tag affinity: kindred spirits nearby');
      }
    }

    if (tagOverlap === 0) {
      if (slice.category === 'crisis') {
        weight *= 1.5;
        reasons.push('Out of element: danger increases');
      }
    }

    // ── Relationship-based adjustments ──
    const hasRivals = character.relationships.some(
      (r) => r.type === 'rival' || r.type === 'enemy'
    );
    if (hasRivals) {
      if (slice.category === 'pvp' || slice.category === 'betrayal') {
        weight *= 1.5;
        reasons.push('Has rivals: conflict brews');
      }
    }

    const hasAllies = character.relationships.some(
      (r) => r.type === 'ally' || r.type === 'mentor'
    );
    if (hasAllies) {
      if (slice.category === 'betrayal') {
        weight *= 1.3;
        reasons.push('Has allies: betrayal possible');
      }
    }

    // ── Chapter count adjustments ──
    if (character.completedChapters.length === 0) {
      // First chapter: gentler introduction
      if (slice.category === 'boss' || slice.category === 'pvp') {
        weight *= 0.2;
        reasons.push('First chapter: easier start');
      }
      if (slice.category === 'exploration' || slice.category === 'social') {
        weight *= 1.5;
        reasons.push('First chapter: world discovery');
      }
    }

    // Ensure minimum weight
    weight = Math.max(weight, 0.1);

    return {
      ...slice,
      adjustedWeight: weight,
      adjustmentReasons: reasons,
    };
  });
}

/**
 * Spin the Fate Wheel — weighted random selection.
 */
export function spinFateWheel(
  character: StoryCharacter,
  regionTags: Tag[],
  random: () => number = Math.random
): AdjustedSlice {
  const slices = computeFateWeights(character, regionTags);
  const totalWeight = slices.reduce((sum, s) => sum + s.adjustedWeight, 0);

  let roll = random() * totalWeight;
  for (const slice of slices) {
    roll -= slice.adjustedWeight;
    if (roll <= 0) return slice;
  }

  return slices[slices.length - 1];
}

// ─── Power Tier Ordering ───

const POWER_TIER_ORDER = [
  'novice', 'adventurer', 'veteran', 'champion',
  'hero', 'legend', 'mythic', 'ascendant',
] as const;
