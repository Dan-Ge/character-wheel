// ── Story Choice → Wheel Converter ──
// Builds a WheelModule from story event choices, dynamically
// weighted based on the character's tags, stats, and traits.

import type { StoryChoice, StoryCharacter } from '../types/storyTypes';
import type { WheelModule, Segment, Tag } from '../types';
import { Rarity } from '../types';

// ─── Risk Level → Rarity (visual coding) ───

const RISK_TO_RARITY: Record<string, Rarity> = {
  safe:    Rarity.Common,
  low:     Rarity.Uncommon,
  medium:  Rarity.Rare,
  high:    Rarity.Epic,
  extreme: Rarity.Legendary,
  lethal:  Rarity.Forbidden,
};

// ─── Check-type icons ───

const CHECK_ICONS: Record<string, string> = {
  combat: '⚔️',
  stat:   '📊',
  tag:    '🏷️',
  luck:   '🎲',
  social: '💬',
  item:   '🎒',
};

// ─── Archetype tag groups for personality-based weighting ───

const AGGRESSIVE_TAGS: Tag[] = ['brute', 'melee', 'brutal', 'heavy', 'fire'];
const CAUTIOUS_TAGS:   Tag[] = ['stealth', 'precision', 'support', 'tech', 'shadow'];
const MAGIC_TAGS:      Tag[] = ['arcane', 'psychic', 'cosmic', 'necro', 'void', 'holy', 'divine'];
const SOCIAL_TAGS:     Tag[] = ['charisma', 'holy', 'support', 'divine'];
const WILD_TAGS:       Tag[] = ['beast', 'nature', 'mutation', 'cursed'];

/**
 * Returns only the choices the character qualifies for
 * (requiredTags, requiredStats, requiredItems).
 */
function filterAvailableChoices(
  choices: StoryChoice[],
  character: StoryCharacter,
): StoryChoice[] {
  const charTags = new Set<string>(character.build.tags);
  const inventoryIds = new Set(character.inventory.map(i => i.id));

  return choices.filter(choice => {
    // Must have every required tag
    if (choice.requiredTags?.length) {
      if (!choice.requiredTags.every(t => charTags.has(t))) return false;
    }
    // Must have every required item
    if (choice.requiredItems?.length) {
      if (!choice.requiredItems.every(id => inventoryIds.has(id))) return false;
    }
    return true;
  });
}

/**
 * Compute how well a choice matches the character.
 * Higher weight = larger wheel segment = more likely to land on.
 */
function calculateChoiceWeight(
  choice: StoryChoice,
  character: StoryCharacter,
): number {
  const charTags = new Set<string>(character.build.tags);
  let w = 10; // base

  // ── tagBonus overlap → strong affinity ──
  if (choice.check?.tagBonus) {
    const hits = choice.check.tagBonus.filter(t => charTags.has(t)).length;
    w += hits * 6;
  }

  // ── check target matches a character tag ──
  if (choice.check) {
    if (charTags.has(choice.check.target as Tag)) w += 8;
  }

  // ── Archetype personality boost ──
  const hasAny = (tags: Tag[]) => tags.some(t => charTags.has(t));

  // Aggressive characters favor risky combat choices
  if (hasAny(AGGRESSIVE_TAGS)) {
    if (choice.riskLevel === 'high' || choice.riskLevel === 'extreme') w += 5;
    if (choice.check?.type === 'combat') w += 4;
  }

  // Cautious characters favor safe/low-risk & stealth/tag checks
  if (hasAny(CAUTIOUS_TAGS)) {
    if (choice.riskLevel === 'safe' || choice.riskLevel === 'low') w += 5;
    if (choice.check?.type === 'tag') w += 3;
  }

  // Magical characters favor luck & social checks (mystique)
  if (hasAny(MAGIC_TAGS)) {
    if (choice.check?.type === 'luck') w += 4;
    if (choice.riskLevel === 'medium') w += 2;
  }

  // Social characters boost social checks
  if (hasAny(SOCIAL_TAGS)) {
    if (choice.check?.type === 'social') w += 6;
  }

  // Wild/chaotic characters enjoy extreme/lethal
  if (hasAny(WILD_TAGS)) {
    if (choice.riskLevel === 'extreme' || choice.riskLevel === 'lethal') w += 6;
  }

  // ── Acquired-trait synergy ──
  const traitTags = character.acquiredTraits.flatMap(t => t.grantedTags ?? []);
  if (choice.check?.tagBonus) {
    const traitHits = choice.check.tagBonus.filter(t => traitTags.includes(t)).length;
    w += traitHits * 3;
  }

  return Math.max(w, 3); // minimum so every choice is always possible
}

/**
 * Pick a random choice ID weighted by segment weights.
 * Used to pre-determine where the wheel will land.
 */
export function pickWeightedChoiceId(segments: Segment[]): string {
  const total = segments.reduce((sum, s) => sum + s.weight, 0);
  let r = Math.random() * total;
  for (const seg of segments) {
    r -= seg.weight;
    if (r <= 0) return seg.id;
  }
  return segments[segments.length - 1].id;
}

/**
 * Build a WheelModule from the available story choices,
 * with segments dynamically weighted for the character.
 */
export function buildStoryWheel(
  choices: StoryChoice[],
  character: StoryCharacter,
  eventTitle?: string,
): WheelModule {
  const available = filterAvailableChoices(choices, character);
  // Fallback: if filtering removed everything, show all choices
  const finalChoices = available.length > 0 ? available : choices;

  const segments: Segment[] = finalChoices.map(choice => {
    const weight = calculateChoiceWeight(choice, character);
    const rarity  = RISK_TO_RARITY[choice.riskLevel] ?? Rarity.Common;
    const icon    = choice.check ? (CHECK_ICONS[choice.check.type] ?? '🎯') : '✨';

    return {
      id:     choice.id,
      label:  `${icon} ${choice.label}`,
      rarity,
      weight,
      tags:   (choice.requiredTags ?? []) as Tag[],
      effects: [],
      lore:   choice.description,
    };
  });

  return {
    id:          'story-choice-wheel',
    name:        eventTitle ?? 'Schicksal',
    category:    'stats',   // closest available category
    icon:        '📖',
    segments,
    visualTheme: 'story',
    description: 'Drehe das Rad des Schicksals!',
    order:       0,
  };
}
