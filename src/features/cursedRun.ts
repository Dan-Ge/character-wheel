// ── Cursed Run Mode ──
// Modifies the game rules to add chaos and unpredictability.

import type { Modifier } from '../types';

export interface CursedRunConfig {
  id: string;
  name: string;
  description: string;
  modifiers: Modifier[];
  scoreMultiplier: number;
}

const CURSES: CursedRunConfig[] = [
  {
    id: 'entropy',
    name: 'Entropy Mode',
    description: 'All rarity weights are scrambled. Common can be rare, rare can be common.',
    modifiers: [
      { id: 'curse_entropy', type: 'cursed_run', description: 'Rarity weights inverted', value: -1 },
    ],
    scoreMultiplier: 1.5,
  },
  {
    id: 'glass_cannon',
    name: 'Glass Cannon',
    description: 'Scores are doubled but any Common result halves your total.',
    modifiers: [
      { id: 'curse_glass', type: 'cursed_run', description: 'Score doubled, Common = penalty', value: 2 },
    ],
    scoreMultiplier: 2.0,
  },
  {
    id: 'void_touched',
    name: 'Void-Touched',
    description: 'Every 3rd spin is forced to the Forbidden pool.',
    modifiers: [
      { id: 'curse_void', type: 'cursed_run', description: 'Every 3rd spin forced Forbidden', value: 3 },
    ],
    scoreMultiplier: 1.3,
  },
  {
    id: 'mirror',
    name: 'Mirror Match',
    description: 'Tags are randomly swapped between wheels after spinning.',
    modifiers: [
      { id: 'curse_mirror', type: 'cursed_run', description: 'Tag shuffle active', value: 1 },
    ],
    scoreMultiplier: 1.4,
  },
];

export function getRandomCurse(): CursedRunConfig {
  return CURSES[Math.floor(Math.random() * CURSES.length)];
}

export function getCurseById(id: string): CursedRunConfig | undefined {
  return CURSES.find(c => c.id === id);
}

export function getAllCurses(): readonly CursedRunConfig[] {
  return CURSES;
}
