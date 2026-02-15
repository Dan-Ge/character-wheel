// ── Achievement Definitions ──
// All unlockable achievements for Character Wheel.

import type { Achievement, AchievementContext } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // ─── Runs ───
  {
    id: 'first_spin',
    name: 'First Steps',
    description: 'Complete your first run.',
    icon: '🎯',
    category: 'runs',
    check: (ctx: AchievementContext) => ctx.totalRuns >= 1,
  },
  {
    id: 'spin_veteran',
    name: 'Spin Veteran',
    description: 'Complete 10 runs.',
    icon: '🎰',
    category: 'runs',
    check: (ctx: AchievementContext) => ctx.totalRuns >= 10,
  },
  {
    id: 'wheel_warrior',
    name: 'Wheel Warrior',
    description: 'Complete 25 runs.',
    icon: '⚔️',
    category: 'runs',
    check: (ctx: AchievementContext) => ctx.totalRuns >= 25,
  },
  {
    id: 'eternal_spinner',
    name: 'Eternal Spinner',
    description: 'Complete 50 runs.',
    icon: '♾️',
    category: 'runs',
    check: (ctx: AchievementContext) => ctx.totalRuns >= 50,
  },
  {
    id: 'hundred_spins',
    name: 'Centrifuge',
    description: 'Spin the wheel 100 times total.',
    icon: '🌀',
    category: 'runs',
    check: (ctx: AchievementContext) => ctx.totalSpins >= 100,
  },

  // ─── Score ───
  {
    id: 'score_1k',
    name: 'Getting Started',
    description: 'Reach a score of 1,000 or more.',
    icon: '📈',
    category: 'score',
    check: (ctx: AchievementContext) => ctx.bestScore >= 1000,
  },
  {
    id: 'score_3k',
    name: 'B-Tier Builder',
    description: 'Reach a score of 3,000 or more.',
    icon: '🅱️',
    category: 'score',
    check: (ctx: AchievementContext) => ctx.bestScore >= 3000,
  },
  {
    id: 'score_6k',
    name: 'S-Rank Achiever',
    description: 'Reach S-rank with 6,000+ points.',
    icon: '🏅',
    category: 'score',
    check: (ctx: AchievementContext) => ctx.bestScore >= 6000,
  },
  {
    id: 'score_8k',
    name: 'Ascended',
    description: 'Reach S+ rank with 8,000+ points.',
    icon: '👑',
    category: 'score',
    check: (ctx: AchievementContext) => ctx.bestScore >= 8000,
  },
  {
    id: 'score_10k',
    name: 'Beyond Mortal',
    description: 'Break the 10,000 point barrier.',
    icon: '💎',
    category: 'score',
    check: (ctx: AchievementContext) => ctx.bestScore >= 10000,
  },

  // ─── Rarity ───
  {
    id: 'first_legendary',
    name: 'Legendary Find',
    description: 'Discover your first Legendary segment.',
    icon: '✨',
    category: 'rarity',
    check: (ctx: AchievementContext) => ctx.legendaryCount >= 1,
  },
  {
    id: 'mythic_hunter',
    name: 'Mythic Hunter',
    description: 'Find 3 Mythic segments.',
    icon: '🦄',
    category: 'rarity',
    check: (ctx: AchievementContext) => ctx.mythicCount >= 3,
  },
  {
    id: 'forbidden_touch',
    name: 'Forbidden Knowledge',
    description: 'Encounter a Forbidden segment.',
    icon: '🔮',
    category: 'rarity',
    check: (ctx: AchievementContext) => ctx.forbiddenCount >= 1,
  },
  {
    id: 'rarity_collector',
    name: 'Rarity Collector',
    description: 'Find 10 Legendary+ segments.',
    icon: '💰',
    category: 'rarity',
    check: (ctx: AchievementContext) =>
      ctx.legendaryCount + ctx.mythicCount + ctx.forbiddenCount >= 10,
  },

  // ─── Collection ───
  {
    id: 'codex_10',
    name: 'Curious Mind',
    description: 'Discover 10 unique segments in the Codex.',
    icon: '📖',
    category: 'collection',
    check: (ctx: AchievementContext) => ctx.codexCount >= 10,
  },
  {
    id: 'codex_25',
    name: 'Scholar',
    description: 'Discover 25 unique segments.',
    icon: '🎓',
    category: 'collection',
    check: (ctx: AchievementContext) => ctx.codexCount >= 25,
  },
  {
    id: 'codex_50',
    name: 'Archivist',
    description: 'Discover 50 unique segments.',
    icon: '📚',
    category: 'collection',
    check: (ctx: AchievementContext) => ctx.codexCount >= 50,
  },
  {
    id: 'codex_master',
    name: 'Codex Master',
    description: 'Discover every segment in the game.',
    icon: '🏛️',
    category: 'collection',
    check: (ctx: AchievementContext) =>
      ctx.totalSegments > 0 && ctx.codexCount >= ctx.totalSegments,
  },
  {
    id: 'gallery_5',
    name: 'Collector',
    description: 'Save 5 builds in the Gallery.',
    icon: '🖼️',
    category: 'collection',
    check: (ctx: AchievementContext) => ctx.buildCount >= 5,
  },

  // ─── Special ───
  {
    id: 'meme_lord',
    name: 'Meme Lord',
    description: 'Create a build with 80%+ meme potential.',
    icon: '🤡',
    category: 'special',
    check: (ctx: AchievementContext) => ctx.highestMeme >= 80,
  },
  {
    id: 'meme_100',
    name: 'Maximum Meme',
    description: 'Achieve 100% meme potential.',
    icon: '💀',
    category: 'special',
    check: (ctx: AchievementContext) => ctx.highestMeme >= 100,
    secret: true,
  },
  {
    id: 'challenge_first',
    name: 'Challenger',
    description: 'Complete your first daily challenge.',
    icon: '📅',
    category: 'special',
    check: (ctx: AchievementContext) => ctx.challengesCompleted >= 1,
  },
  {
    id: 'challenge_7',
    name: 'Weekly Warrior',
    description: 'Complete 7 daily challenges.',
    icon: '🗓️',
    category: 'special',
    check: (ctx: AchievementContext) => ctx.challengesCompleted >= 7,
  },
  {
    id: 'synergy_hunter',
    name: 'Synergy Hunter',
    description: 'Trigger 10 synergies across all runs.',
    icon: '⚡',
    category: 'special',
    check: (ctx: AchievementContext) => ctx.synergiesTriggered >= 10,
  },
  {
    id: 'paradox_lover',
    name: 'Paradox Lover',
    description: 'Encounter 5 conflicts across all runs.',
    icon: '☯️',
    category: 'special',
    check: (ctx: AchievementContext) => ctx.conflictsEncountered >= 5,
    secret: true,
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function checkNewAchievements(
  ctx: AchievementContext,
  alreadyUnlocked: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(
    a => !alreadyUnlocked.includes(a.id) && a.check(ctx)
  );
}
