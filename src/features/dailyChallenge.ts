// ── Daily Challenge System ──
// Generates deterministic daily/weekly challenges using date-based seeds.

import type { ChallengeModifier, DailyChallenge, GameMode } from '../types';

// ─── Deterministic hash from string ───

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// ─── Challenge Templates ───

const CHALLENGE_TITLES = [
  'Neon Gauntlet',
  'Shadow Protocol',
  'Frost Circuit',
  'Ember Trial',
  'Void Convergence',
  'Chrono Flux',
  'Arcane Surge',
  'Mecha Uprising',
  'Cosmic Drift',
  'Primal Rift',
  'Quantum Cascade',
  'Techno Pulse',
  'Nebula Run',
  'Crimson Circuit',
];

const CHALLENGE_DESCS = [
  'Navigate the neon-lit corridors of fate.',
  'Only the sharpest builds survive the shadows.',
  'Frozen odds, heated competition.',
  'The embers of destiny burn bright today.',
  'The void beckons with strange gifts.',
  'Time bends around every spin.',
  'Ancient power flows through the wheels.',
  'Steel and circuitry define your path.',
  'Stars align for those who dare.',
  'Raw, untamed energy awaits.',
  'Reality fractures with each choice.',
  'The digital pulse quickens.',
  'Drift among the cosmic wheels.',
  'Blood-red circuits light the way.',
];

const MODIFIER_POOL: ChallengeModifier[] = [
  { type: 'rarity_boost', label: 'Lucky Day', description: 'Rare+ chance increased', value: 15 },
  { type: 'rarity_boost', label: 'Golden Hour', description: 'Legendary chance doubled', value: 25 },
  { type: 'score_multiplier', label: 'Double Points', description: 'Score multiplied by 1.5x', value: 1.5 },
  { type: 'score_multiplier', label: 'Triple Threat', description: 'Score multiplied by 2x', value: 2 },
  { type: 'tag_focus', label: 'Fire Focus', description: 'Fire tags more common', value: 20 },
  { type: 'tag_focus', label: 'Tech Surge', description: 'Tech tags more common', value: 20 },
  { type: 'tag_focus', label: 'Shadow Realm', description: 'Shadow & Void tags boosted', value: 15 },
  { type: 'tag_focus', label: 'Nature\'s Call', description: 'Nature & Beast tags boosted', value: 15 },
  { type: 'restriction', label: 'No Rerolls', description: 'Draft mode disabled', value: 0 },
  { type: 'restriction', label: 'Speed Run', description: 'Each wheel auto-picks after 5s', value: 5 },
];

const MODES: GameMode[] = ['normal', 'normal', 'normal', 'cursed', 'draft'];

// ─── Date Helpers ───

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getWeekString(): string {
  const d = new Date();
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

// ─── Generator ───

export function generateDailyChallenge(dateOverride?: string): DailyChallenge {
  const date = dateOverride ?? getTodayString();
  const hash = hashString(`daily-challenge-${date}`);
  const rand = seededRandom(hash);

  const titleIdx = Math.floor(rand() * CHALLENGE_TITLES.length);
  const descIdx = Math.floor(rand() * CHALLENGE_DESCS.length);
  const modeIdx = Math.floor(rand() * MODES.length);

  // Pick 1-2 modifiers
  const modCount = rand() > 0.5 ? 2 : 1;
  const modifiers: ChallengeModifier[] = [];
  const usedMods = new Set<number>();
  for (let i = 0; i < modCount; i++) {
    let idx = Math.floor(rand() * MODIFIER_POOL.length);
    while (usedMods.has(idx)) idx = (idx + 1) % MODIFIER_POOL.length;
    usedMods.add(idx);
    modifiers.push(MODIFIER_POOL[idx]);
  }

  // Target score varies by day
  const baseTarget = 2000 + Math.floor(rand() * 4000);
  const targetScore = Math.round(baseTarget / 500) * 500;

  const seed = `cw-${date}-${hash.toString(36)}`;

  return {
    id: `daily-${date}`,
    date,
    seed,
    title: CHALLENGE_TITLES[titleIdx],
    description: CHALLENGE_DESCS[descIdx],
    modifiers,
    targetScore,
    gameMode: MODES[modeIdx],
  };
}

export function generateWeeklyChallenge(): DailyChallenge {
  const week = getWeekString();
  const hash = hashString(`weekly-challenge-${week}`);
  const rand = seededRandom(hash);

  const titleIdx = Math.floor(rand() * CHALLENGE_TITLES.length);
  const descIdx = Math.floor(rand() * CHALLENGE_DESCS.length);

  // Weekly always has 2 modifiers and higher target
  const modifiers: ChallengeModifier[] = [];
  const usedMods = new Set<number>();
  for (let i = 0; i < 2; i++) {
    let idx = Math.floor(rand() * MODIFIER_POOL.length);
    while (usedMods.has(idx)) idx = (idx + 1) % MODIFIER_POOL.length;
    usedMods.add(idx);
    modifiers.push(MODIFIER_POOL[idx]);
  }

  const baseTarget = 4000 + Math.floor(rand() * 4000);
  const targetScore = Math.round(baseTarget / 500) * 500;

  const seed = `cw-weekly-${week}-${hash.toString(36)}`;

  return {
    id: `weekly-${week}`,
    date: week,
    seed,
    title: `⭐ ${CHALLENGE_TITLES[titleIdx]}`,
    description: `Weekly Challenge: ${CHALLENGE_DESCS[descIdx]}`,
    modifiers,
    targetScore,
    gameMode: 'normal',
  };
}

export function isChallengeCompleted(
  challengeId: string,
  completedChallenges: { challengeId: string }[]
): boolean {
  return completedChallenges.some(c => c.challengeId === challengeId);
}

export function getTodayDate(): string {
  return getTodayString();
}
