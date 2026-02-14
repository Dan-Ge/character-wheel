// ── Conflict Rules ──
// Gameplay-level conflict rules that map incompatible tag pairs to penalties
// and paradox abilities. Evaluated by the Rules Resolver after each spin.

import type { ConflictRule, Tag } from '../types';

// ─── Full Conflict Rule Definitions ───

export const CONFLICT_RULES: ConflictRule[] = [
  {
    id: 'con-fire-ice',
    conflictingItems: ['fire', 'ice'],
    conflictingTags: ['fire', 'ice'] as Tag[],
    penalty: -30,
    paradoxAbility: 'Thermal Paradox – Attacks randomly alternate between scorching and freezing, confusing everyone – including yourself.',
    description: 'Burning and freezing at the same time. Uncomfortable.',
  },
  {
    id: 'con-holy-necro',
    conflictingItems: ['holy', 'necro'],
    conflictingTags: ['holy', 'necro'] as Tag[],
    penalty: -40,
    paradoxAbility: 'Redemption Necromancy – Your undead minions are surprisingly wholesome and apologize before attacking.',
    description: 'Raising the dead while smiting evil. Theology gets complicated.',
  },
  {
    id: 'con-stealth-brute',
    conflictingItems: ['stealth', 'brute'],
    conflictingTags: ['stealth', 'brute'] as Tag[],
    penalty: -25,
    paradoxAbility: 'Gentle Giant Ambush – You hide behind objects half your size. It works because nobody believes what they are seeing.',
    description: 'Sneaking around while being the size of a truck.',
  },
  {
    id: 'con-tech-arcane',
    conflictingItems: ['tech', 'arcane'],
    conflictingTags: ['tech', 'arcane'] as Tag[],
    penalty: -15,
    paradoxAbility: 'Blue Screen of Sorcery – Your spells occasionally crash and need to be rebooted. When they work, they work REALLY well.',
    description: 'Magic and science argue inside your head constantly.',
  },
  {
    id: 'con-shadow-holy',
    conflictingItems: ['shadow', 'holy'],
    conflictingTags: ['shadow', 'holy'] as Tag[],
    penalty: -35,
    paradoxAbility: 'Eclipse Form – You exist in perpetual twilight. Neither fully light nor dark, you make vampires AND angels uncomfortable.',
    description: 'The light casts the darkest shadow. Poetic, but impractical.',
  },
  {
    id: 'con-speed-tank',
    conflictingItems: ['speed', 'tank'],
    conflictingTags: ['speed', 'tank'] as Tag[],
    penalty: -20,
    paradoxAbility: 'Freight Train Mode – You cannot stop once you start moving. Allies learn to dodge when you charge through.',
    description: 'Fast AND indestructible? Physics would like a word.',
  },
  {
    id: 'con-charisma-void',
    conflictingItems: ['charisma', 'void'],
    conflictingTags: ['charisma', 'void'] as Tag[],
    penalty: -30,
    paradoxAbility: 'Existential Magnetism – People are drawn to you despite (because of?) the crushing existential dread you radiate.',
    description: 'You are deeply charming but also an embodiment of nothingness.',
  },
  {
    id: 'con-nature-cyber',
    conflictingItems: ['nature', 'cyber'],
    conflictingTags: ['nature', 'cyber'] as Tag[],
    penalty: -15,
    paradoxAbility: 'Digital Druid – You hack the planet – literally. Trees grow USB ports. Flowers bloom in binary patterns.',
    description: 'Organic growth meets digital precision. Vines in the server room.',
  },
  {
    id: 'con-retro-temporal',
    conflictingItems: ['retro', 'temporal'],
    conflictingTags: ['retro', 'temporal'] as Tag[],
    penalty: -20,
    paradoxAbility: 'Anachronism Engine – You time-travel but only to decades with great aesthetics. Your power peaks in the 1980s.',
    description: 'Stuck between nostalgic past and actual time travel.',
  },
  {
    id: 'con-psychic-beast',
    conflictingItems: ['psychic', 'beast'],
    conflictingTags: ['psychic', 'beast'] as Tag[],
    penalty: -25,
    paradoxAbility: 'Primal Intellect – You solve quantum equations while howling at the moon. Your thesis defense involves biting.',
    description: 'A refined mind trapped in feral instincts.',
  },
];

// ─── Helper Functions ───

/** Find all conflict rules triggered by the current set of collected tags */
export function findMatchingConflicts(collectedTags: Tag[]): ConflictRule[] {
  return CONFLICT_RULES.filter((rule) => {
    if (!rule.conflictingTags || rule.conflictingTags.length < 2) return false;
    return (
      collectedTags.includes(rule.conflictingTags[0]) &&
      collectedTags.includes(rule.conflictingTags[1])
    );
  });
}

/** Check if a specific conflict is newly triggered by adding new tags */
export function isNewConflict(
  rule: ConflictRule,
  previousTags: Tag[],
  currentTags: Tag[]
): boolean {
  if (!rule.conflictingTags || rule.conflictingTags.length < 2) return false;

  const prevHasBoth =
    previousTags.includes(rule.conflictingTags[0]) &&
    previousTags.includes(rule.conflictingTags[1]);
  const currHasBoth =
    currentTags.includes(rule.conflictingTags[0]) &&
    currentTags.includes(rule.conflictingTags[1]);

  return !prevHasBoth && currHasBoth;
}

/** Get the total penalty from active conflicts */
export function calculateConflictPenalty(activeConflicts: ConflictRule[]): number {
  return activeConflicts.reduce((total, rule) => total + rule.penalty, 0);
}

/** Get conflict rule by ID */
export function getConflictRule(id: string): ConflictRule | undefined {
  return CONFLICT_RULES.find((r) => r.id === id);
}

/** Check if a set of tags has any paradox abilities */
export function getParadoxAbilities(collectedTags: Tag[]): string[] {
  return findMatchingConflicts(collectedTags)
    .filter((r) => r.paradoxAbility)
    .map((r) => r.paradoxAbility!);
}
