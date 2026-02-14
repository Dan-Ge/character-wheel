// ── Story Engine ──
// Core logic for story progression: event generation, check rolling,
// outcome application, chapter management, XP/leveling system.

import type {
  StoryCharacter,
  StoryEvent,
  StoryChoice,
  StoryCheck,
  StoryOutcome,
  StoryChapter,
  StoryEventResult,
  StoryLogEntry,
  PowerTier,
  CharacterStatus,
  StoryCondition,
  StoryEffect,
} from '../types/storyTypes';
import type { Tag } from '../types';
import { spinFateWheel } from './fateWheel';
import { getEligibleEvents } from './storyEvents';
import { getRegion } from './worldRegions';

// ═══════════════════════════════════════════════
// ─── Constants ───
// ═══════════════════════════════════════════════

const POWER_TIERS: PowerTier[] = [
  'novice', 'adventurer', 'veteran', 'champion',
  'hero', 'legend', 'mythic', 'ascendant',
];

const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 850,
  6: 1300,
  7: 1900,
  8: 2700,
  9: 3800,
  10: 5200,
  11: 7000,
  12: 9200,
  13: 12000,
  14: 15500,
  15: 20000,
  16: 25500,
  17: 32000,
  18: 40000,
  19: 50000,
  20: 65000,
};

const MAX_LEVEL = 20;

const CHAPTER_SIZE_BY_DIFFICULTY = {
  easy: 5,
  normal: 7,
  hard: 9,
  nightmare: 12,
  legendary: 15,
} as const;

const TIER_THRESHOLDS: Record<number, PowerTier> = {
  1: 'novice',
  3: 'adventurer',
  5: 'veteran',
  8: 'champion',
  11: 'hero',
  14: 'legend',
  17: 'mythic',
  19: 'ascendant',
};

// ═══════════════════════════════════════════════
// ─── RNG (Seeded) ───
// ═══════════════════════════════════════════════

/**
 * Mulberry32 PRNG — deterministic, seedable.
 * Same as spin engine for consistency.
 */
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Roll a d20 (1-20) using the provided RNG.
 */
function rollD20(random: () => number = Math.random): number {
  return Math.floor(random() * 20) + 1;
}

// ═══════════════════════════════════════════════
// ─── Event Generation ───
// ═══════════════════════════════════════════════

/**
 * Generate the next story event for a character.
 * 1. Spin the Fate Wheel to determine category.
 * 2. Filter eligible events by category, tags, region, tier.
 * 3. Apply tag-affinity scoring.
 * 4. Weighted-random pick among eligible events.
 */
export function generateNextEvent(
  character: StoryCharacter,
  seed?: number
): { event: StoryEvent; fateCategory: string } | null {
  const rng = seed ? mulberry32(seed) : Math.random;
  const region = getRegion(character.currentRegion);
  const regionTags = region?.dominantTags ?? [];

  // Spin the Fate Wheel
  const fateResult = spinFateWheel(character, regionTags, rng);
  const category = fateResult.category;

  // Get eligible events
  const eligible = getEligibleEvents(
    category,
    character.build.tags,
    character.currentRegion,
    character.powerTier
  );

  if (eligible.length === 0) return null;

  // Score events by tag affinity
  const scored = eligible.map((event) => {
    const tagOverlap = event.triggerTags.filter((t) =>
      character.build.tags.includes(t)
    ).length;

    // Check conditions
    const conditionsMet = event.conditions
      ? event.conditions.every((c) => checkCondition(c, character))
      : true;

    // Skip non-repeatable events already experienced
    const alreadySeen = !event.repeatable &&
      character.storyLog.some((log) => log.title === event.title);

    const score = conditionsMet && !alreadySeen
      ? 1 + tagOverlap * 2 + fateResult.rarityModifier
      : 0;

    return { event, score };
  });

  // Filter out zero-score (ineligible)
  const valid = scored.filter((s) => s.score > 0);
  if (valid.length === 0) {
    // Fallback to any eligible event
    const fallback = eligible[Math.floor(rng() * eligible.length)];
    return { event: fallback, fateCategory: category };
  }

  // Weighted random pick
  const totalScore = valid.reduce((sum, s) => sum + s.score, 0);
  let roll = rng() * totalScore;
  for (const entry of valid) {
    roll -= entry.score;
    if (roll <= 0) {
      return { event: entry.event, fateCategory: category };
    }
  }

  return { event: valid[valid.length - 1].event, fateCategory: category };
}

// ═══════════════════════════════════════════════
// ─── Check Rolling ───
// ═══════════════════════════════════════════════

/**
 * Roll a check for a story choice.
 * Returns the raw roll, total (with bonuses), and pass/fail.
 */
export function rollCheck(
  check: StoryCheck,
  character: StoryCharacter,
  seed?: number
): { rawRoll: number; total: number; passed: boolean; bonuses: string[] } {
  const rng = seed ? mulberry32(seed) : Math.random;
  const rawRoll = rollD20(rng);
  let total = rawRoll;
  const bonuses: string[] = [];

  // Power tier bonus
  const tierIdx = POWER_TIERS.indexOf(character.powerTier);
  const tierBonus = Math.floor(tierIdx / 2);
  if (tierBonus > 0) {
    total += tierBonus;
    bonuses.push(`Power Tier +${tierBonus}`);
  }

  // Tag bonus: +2 per matching tag
  if (check.tagBonus) {
    const matchCount = check.tagBonus.filter((t) =>
      character.build.tags.includes(t)
    ).length;
    if (matchCount > 0) {
      const tagBonusVal = matchCount * 2;
      total += tagBonusVal;
      bonuses.push(`Tag Match +${tagBonusVal}`);
    }
  }

  // Acquired trait bonuses
  for (const trait of character.acquiredTraits) {
    if (trait.grantedTags && check.type === 'tag') {
      const traitMatch = trait.grantedTags.filter(
        (t) => t === (check.target as Tag)
      ).length;
      if (traitMatch > 0) {
        total += 1;
        bonuses.push(`Trait: ${trait.name} +1`);
      }
    }
  }

  // Status effects that modify checks
  for (const effect of character.statusEffects) {
    if (effect.effect.type === 'score_change' && effect.effect.value) {
      total += effect.effect.value;
      bonuses.push(`${effect.name} ${effect.effect.value > 0 ? '+' : ''}${effect.effect.value}`);
    }
  }

  // Level bonus (+1 per 5 levels)
  const levelBonus = Math.floor(character.level / 5);
  if (levelBonus > 0) {
    total += levelBonus;
    bonuses.push(`Level ${character.level} +${levelBonus}`);
  }

  // Natural 20 always succeeds, Natural 1 always fails
  if (rawRoll === 20) {
    return { rawRoll, total, passed: true, bonuses: [...bonuses, 'NAT 20!'] };
  }
  if (rawRoll === 1) {
    return { rawRoll, total, passed: false, bonuses: [...bonuses, 'NAT 1!'] };
  }

  return {
    rawRoll,
    total,
    passed: total >= check.difficulty,
    bonuses,
  };
}

// ═══════════════════════════════════════════════
// ─── Outcome Application ───
// ═══════════════════════════════════════════════

/**
 * Apply a story outcome's effects to a character.
 * Returns the mutated character (new object).
 */
export function applyOutcome(
  character: StoryCharacter,
  outcome: StoryOutcome,
  event: StoryEvent
): StoryCharacter {
  let updated = { ...character };

  for (const effect of outcome.effects) {
    updated = applyEffect(updated, effect);
  }

  // Add story log entry
  const logEntry: StoryLogEntry = {
    timestamp: Date.now(),
    title: event.title,
    narrative: outcome.narrative,
    category: event.category,
    sentiment: determineSentiment(outcome),
    involvedTags: event.triggerTags,
  };

  updated = {
    ...updated,
    storyLog: [...updated.storyLog, logEntry],
    eventsExperienced: updated.eventsExperienced + 1,
    lastActiveAt: Date.now(),
  };

  // Check for level-up
  updated = checkLevelUp(updated);

  // Check for power tier advancement
  updated = checkPowerTierUp(updated);

  // Clear expired status effects
  updated = tickStatusEffects(updated);

  return updated;
}

/**
 * Apply a single effect to a character.
 */
function applyEffect(
  character: StoryCharacter,
  effect: StoryEffect
): StoryCharacter {
  const c = { ...character };

  switch (effect.type) {
    case 'hp_change':
      c.hp = Math.max(0, Math.min(c.maxHp, c.hp + (effect.value ?? 0)));
      if (c.hp <= 0) {
        c.status = 'dead';
      } else if (c.hp <= c.maxHp * 0.2) {
        c.status = 'near_death';
      } else if (c.hp <= c.maxHp * 0.5 && c.status === 'alive') {
        c.status = 'injured';
      } else if (c.hp > c.maxHp * 0.5 && (c.status === 'injured' || c.status === 'near_death')) {
        c.status = 'alive';
      }
      break;

    case 'xp_gain':
      c.xp = c.xp + (effect.value ?? 0);
      break;

    case 'trait_gain':
      if (effect.stringValue) {
        c.acquiredTraits = [
          ...c.acquiredTraits,
          {
            id: `trait-${effect.stringValue}-${Date.now()}`,
            name: effect.stringValue,
            description: effect.description,
            effect,
            rarity: 'uncommon' as const,
            sourceEventId: '',
            permanent: true,
            acquiredAt: Date.now(),
          },
        ];
      }
      break;

    case 'trait_loss':
      if (effect.stringValue) {
        c.acquiredTraits = c.acquiredTraits.filter(
          (t) => t.name !== effect.stringValue
        );
      }
      break;

    case 'item_gain':
      if (effect.stringValue) {
        c.inventory = [
          ...c.inventory,
          {
            id: `item-${effect.stringValue}-${Date.now()}`,
            name: effect.stringValue,
            description: effect.description,
            itemType: 'artifact',
            rarity: 'uncommon' as const,
            effects: [],
            uses: null,
            lore: effect.description,
          },
        ];
      }
      break;

    case 'item_loss':
      if (effect.stringValue === 'random' && c.inventory.length > 0) {
        const idx = Math.floor(Math.random() * c.inventory.length);
        c.inventory = c.inventory.filter((_, i) => i !== idx);
      } else if (effect.stringValue) {
        c.inventory = c.inventory.filter((i) => i.name !== effect.stringValue);
      }
      break;

    case 'status_change':
      if (effect.stringValue) {
        c.status = effect.stringValue as CharacterStatus;
      }
      break;

    case 'relationship_change':
      if (effect.target && effect.value !== undefined) {
        const existingIdx = c.relationships.findIndex(
          (r) => r.targetCharacterId === effect.target
        );
        if (existingIdx >= 0) {
          const rels = [...c.relationships];
          rels[existingIdx] = {
            ...rels[existingIdx],
            level: Math.max(-100, Math.min(100, rels[existingIdx].level + effect.value)),
            lastInteractionAt: Date.now(),
            history: [...rels[existingIdx].history, effect.description],
          };
          c.relationships = rels;
        }
      }
      break;

    case 'reputation_change':
      if (effect.target && effect.value !== undefined) {
        c.reputation = {
          ...c.reputation,
          [effect.target]: (c.reputation[effect.target] ?? 0) + effect.value,
        };
      }
      break;

    case 'region_unlock':
      // Handled in StoryContext (mutates world map, not character)
      break;

    case 'region_move':
      if (effect.stringValue && effect.stringValue !== 'random') {
        c.currentRegion = effect.stringValue;
      }
      // For 'random', handled in StoryContext
      break;

    case 'title_gain':
      if (effect.stringValue && !c.titles.includes(effect.stringValue)) {
        c.titles = [...c.titles, effect.stringValue];
      }
      break;

    case 'power_tier_up': {
      const currentIdx = POWER_TIERS.indexOf(c.powerTier);
      if (currentIdx < POWER_TIERS.length - 1) {
        c.powerTier = POWER_TIERS[currentIdx + 1];
        c.maxHp = c.maxHp + 20; // More HP per tier
        c.hp = Math.min(c.hp + 20, c.maxHp);
      }
      break;
    }

    case 'status_effect':
      if (effect.stringValue) {
        c.statusEffects = [
          ...c.statusEffects,
          {
            id: `se-${effect.stringValue}-${Date.now()}`,
            name: effect.stringValue,
            description: effect.description,
            effect,
            remainingDuration: effect.duration ?? 1,
            sourceEventId: '',
          },
        ];
      }
      break;

    case 'death':
      c.status = 'dead';
      c.hp = 0;
      break;

    case 'resurrection':
      c.status = 'alive';
      c.hp = Math.floor(c.maxHp * 0.3); // Come back at 30% HP
      break;

    case 'ascension':
      c.status = 'ascended';
      c.powerTier = 'ascendant';
      break;

    case 'score_change':
      // Handled in StoryContext (modifies build score)
      break;

    case 'tag_gain':
      // Tags are on the build — handled in StoryContext
      break;

    case 'tag_loss':
      // Tags are on the build — handled in StoryContext
      break;

    case 'spawn_rival':
    case 'spawn_ally':
      // NPC creation handled in StoryContext
      break;

    case 'trigger_pvp':
      // PvP trigger handled in StoryContext
      break;
  }

  return c;
}

// ═══════════════════════════════════════════════
// ─── Chapter Management ───
// ═══════════════════════════════════════════════

/**
 * Start a new chapter in the given region.
 */
export function startChapter(
  character: StoryCharacter,
  region: string,
  difficulty: StoryChapter['difficulty'] = 'normal'
): StoryChapter {
  const totalEvents = CHAPTER_SIZE_BY_DIFFICULTY[difficulty];

  return {
    id: `chapter-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: generateChapterTitle(region, character.completedChapters.length + 1),
    description: `Chapter ${character.completedChapters.length + 1}`,
    region,
    events: [],
    totalEvents,
    currentEventIndex: 0,
    completed: false,
    difficulty,
    completionRewards: generateChapterRewards(difficulty),
    startedAt: Date.now(),
  };
}

/**
 * Record an event result in the current chapter.
 */
export function recordEventResult(
  chapter: StoryChapter,
  result: StoryEventResult
): StoryChapter {
  const events = [...chapter.events, result];
  const currentEventIndex = events.length;
  const completed = currentEventIndex >= chapter.totalEvents;

  return {
    ...chapter,
    events,
    currentEventIndex,
    completed,
    completedAt: completed ? Date.now() : undefined,
    summary: completed
      ? generateChapterSummary(events)
      : undefined,
  };
}

/**
 * Complete a chapter and apply rewards to the character.
 */
export function completeChapter(
  character: StoryCharacter,
  chapter: StoryChapter
): StoryCharacter {
  const completedChapter = {
    ...chapter,
    completed: true,
    completedAt: Date.now(),
  };

  let updated: StoryCharacter = {
    ...character,
    completedChapters: [...character.completedChapters, completedChapter],
    activeChapter: null,
  };

  // Apply completion rewards
  for (const reward of chapter.completionRewards) {
    for (const effect of reward.effects) {
      updated = applyEffect(updated, effect);
    }
  }

  return updated;
}

// ═══════════════════════════════════════════════
// ─── Leveling & Progression ───
// ═══════════════════════════════════════════════

function checkLevelUp(character: StoryCharacter): StoryCharacter {
  let level = character.level;

  for (let l = level + 1; l <= MAX_LEVEL; l++) {
    if (character.xp >= (XP_THRESHOLDS[l] ?? Infinity)) {
      level = l;
    } else {
      break;
    }
  }

  if (level !== character.level) {
    const hpGain = (level - character.level) * 10;
    return {
      ...character,
      level,
      maxHp: character.maxHp + hpGain,
      hp: Math.min(character.hp + hpGain, character.maxHp + hpGain),
    };
  }

  return character;
}

function checkPowerTierUp(character: StoryCharacter): StoryCharacter {
  let newTier = character.powerTier;

  for (const [levelStr, tier] of Object.entries(TIER_THRESHOLDS)) {
    const levelReq = parseInt(levelStr, 10);
    if (character.level >= levelReq) {
      const tierIdx = POWER_TIERS.indexOf(tier);
      const currentIdx = POWER_TIERS.indexOf(newTier);
      if (tierIdx > currentIdx) {
        newTier = tier;
      }
    }
  }

  if (newTier !== character.powerTier) {
    return { ...character, powerTier: newTier };
  }

  return character;
}

// ═══════════════════════════════════════════════
// ─── Character Initialization ───
// ═══════════════════════════════════════════════

/**
 * Create a new StoryCharacter from a completed CharacterBuild.
 */
export function initStoryCharacter(
  build: import('../types').CharacterBuild,
  playerId: string
): StoryCharacter {
  const baseHp = calculateBaseHp(build);

  return {
    build,
    storyId: `story-${build.id}-${Date.now()}`,
    playerId,
    status: 'alive',
    powerTier: 'novice',
    hp: baseHp,
    maxHp: baseHp,
    xp: 0,
    level: 1,
    currentRegion: 'neon-nexus', // Default starting region
    completedChapters: [],
    activeChapter: null,
    relationships: [],
    acquiredTraits: [],
    inventory: [],
    titles: [],
    victories: 0,
    defeats: 0,
    eventsExperienced: 0,
    reputation: {},
    statusEffects: [],
    storyLog: [],
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };
}

/**
 * Calculate base HP from a CharacterBuild.
 * Higher score = slightly higher HP. Flaws reduce HP.
 */
function calculateBaseHp(build: import('../types').CharacterBuild): number {
  const baseHp = 100;
  const scoreBonus = Math.floor(build.score / 50) * 5;
  const flawPenalty = build.results
    .filter((r) => r.wheelCategory === 'flaw')
    .length * 5;
  return Math.max(50, baseHp + scoreBonus - flawPenalty);
}

// ═══════════════════════════════════════════════
// ─── Condition Checking ───
// ═══════════════════════════════════════════════

/**
 * Check if a story condition is met by the character.
 */
export function checkCondition(
  condition: StoryCondition,
  character: StoryCharacter
): boolean {
  switch (condition.type) {
    case 'has_tag':
      return character.build.tags.includes(condition.target as Tag);

    case 'has_trait':
      return character.acquiredTraits.some((t) => t.name === condition.target);

    case 'not_has_trait':
      return !character.acquiredTraits.some((t) => t.name === condition.target);

    case 'has_item':
      return character.inventory.some((i) => i.name === condition.target);

    case 'min_level':
      return character.level >= (condition.value ?? 0);

    case 'min_rep':
      return (character.reputation[condition.target] ?? 0) >= (condition.value ?? 0);

    case 'in_region':
      return character.currentRegion === condition.target;

    case 'has_relationship':
      if (condition.target === 'any_ally') {
        return character.relationships.some((r) => r.type === 'ally');
      }
      return character.relationships.some(
        (r) => r.targetCharacterId === condition.target
      );

    case 'min_hp_percent':
      return (character.hp / character.maxHp) >= (condition.value ?? 0) / 100;

    case 'status_is':
      return character.status === condition.target;

    case 'power_tier_is':
      return character.powerTier === condition.target;

    case 'chapter_completed':
      return character.completedChapters.some((c) => c.id === condition.target);

    case 'pvp_enabled':
      return true; // Always available in this version

    default:
      return true;
  }
}

// ═══════════════════════════════════════════════
// ─── Utility Functions ───
// ═══════════════════════════════════════════════

/**
 * Tick down status effects. Remove expired ones.
 */
function tickStatusEffects(character: StoryCharacter): StoryCharacter {
  const updated = character.statusEffects
    .map((se) => ({ ...se, remainingDuration: se.remainingDuration - 1 }))
    .filter((se) => se.remainingDuration > 0);

  return { ...character, statusEffects: updated };
}

function determineSentiment(
  outcome: StoryOutcome
): StoryLogEntry['sentiment'] {
  const hasPositive = outcome.effects.some(
    (e) =>
      e.type === 'xp_gain' ||
      e.type === 'trait_gain' ||
      e.type === 'item_gain' ||
      e.type === 'title_gain' ||
      e.type === 'power_tier_up' ||
      e.type === 'ascension' ||
      e.type === 'resurrection' ||
      e.type === 'spawn_ally' ||
      (e.type === 'hp_change' && (e.value ?? 0) > 0)
  );

  const hasNegative = outcome.effects.some(
    (e) =>
      e.type === 'death' ||
      e.type === 'trait_loss' ||
      e.type === 'item_loss' ||
      e.type === 'status_change' ||
      (e.type === 'hp_change' && (e.value ?? 0) < 0) ||
      (e.type === 'reputation_change' && (e.value ?? 0) < 0)
  );

  if (outcome.isCritical) return 'dramatic';
  if (hasPositive && hasNegative) return 'dramatic';
  if (hasPositive) return 'positive';
  if (hasNegative) return 'negative';
  return 'neutral';
}

function generateChapterTitle(region: string, chapterNum: number): string {
  const epics = [
    'The Awakening', 'Dark Tides', 'Shattered Flames', 'Echoes of War',
    'The Hunt Begins', 'Storm Rising', 'Shadows Fall', 'Last Stand',
    'The Reckoning', 'Crimson Dawn', 'Fading Light', 'Steel and Stars',
    'The Voidwalker', 'Broken Crown', 'Whispers of Doom', 'Rising Phoenix',
    'The Betrayal Arc', 'Forgotten Oaths', 'Neon Requiem', 'Final Protocol',
  ];

  return epics[(chapterNum - 1) % epics.length];
}

function generateChapterRewards(
  difficulty: StoryChapter['difficulty']
): StoryOutcome[] {
  const xpReward: Record<string, number> = {
    easy: 50,
    normal: 100,
    hard: 200,
    nightmare: 350,
    legendary: 500,
  };

  return [
    {
      id: `chapter-reward-${difficulty}`,
      description: `Chapter complete (${difficulty})`,
      effects: [
        {
          type: 'xp_gain',
          value: xpReward[difficulty] ?? 100,
          description: `+${xpReward[difficulty] ?? 100} XP (chapter clear)`,
        },
        {
          type: 'hp_change',
          value: 30,
          description: '+30 HP (recovery)',
        },
      ],
      narrative: 'The chapter ends. You\'ve survived. What comes next will be harder.',
    },
  ];
}

function generateChapterSummary(events: StoryEventResult[]): string {
  const passes = events.filter((e) => e.checkPassed).length;
  const fails = events.filter((e) => e.checkPassed === false).length;
  const total = events.length;

  return `${total} events experienced. ${passes} checks passed, ${fails} failed. The journey continues.`;
}

/**
 * Get XP needed for the next level.
 */
export function getXpToNextLevel(level: number, currentXp: number): number {
  const nextLevel = Math.min(level + 1, MAX_LEVEL);
  const threshold = XP_THRESHOLDS[nextLevel] ?? Infinity;
  return Math.max(0, threshold - currentXp);
}

/**
 * Get the available choices for an event, filtering by character capabilities.
 */
export function getAvailableChoices(
  event: StoryEvent,
  character: StoryCharacter
): StoryChoice[] {
  return event.choices.filter((choice) => {
    // Check required tags
    if (choice.requiredTags) {
      const hasAllTags = choice.requiredTags.every((t) =>
        character.build.tags.includes(t)
      );
      if (!hasAllTags) return false;
    }

    // Check required items
    if (choice.requiredItems) {
      const hasAllItems = choice.requiredItems.every((itemId) =>
        character.inventory.some((i) => i.id === itemId || i.name === itemId)
      );
      if (!hasAllItems) return false;
    }

    return true;
  });
}
