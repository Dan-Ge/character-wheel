// ── Story Resolver ──
// High-level orchestrator that processes player choices,
// resolves checks, applies outcomes, and manages the story flow.
// This is the main interface between UI and story engine.

import type {
  StoryCharacter,
  StoryEvent,
  StoryChoice,
  StoryOutcome,
  StoryEventResult,
  StoryChapter,
  StoryEffect,
  PvPEncounter,
} from '../types/storyTypes';
import type { Tag } from '../types';
import {
  rollCheck,
  applyOutcome,
  startChapter,
  recordEventResult,
  completeChapter,
  generateNextEvent,
  getAvailableChoices,
  initStoryCharacter,
  getXpToNextLevel,
} from './storyEngine';
import {
  resolvePvPEncounter,
  applyPvPResults,
  findOpponents,
} from './pvpSystem';
import { getRegion, getStartingRegions } from './worldRegions';

// ═══════════════════════════════════════════════
// ─── Story Flow Orchestration ───
// ═══════════════════════════════════════════════

export interface StoryTurnResult {
  /** Updated character after the turn */
  character: StoryCharacter;
  /** Updated chapter after the turn */
  chapter: StoryChapter | null;
  /** The event that was resolved */
  event: StoryEvent;
  /** The choice the player made */
  choice: StoryChoice;
  /** The check result (if any) */
  checkResult: {
    rawRoll: number;
    total: number;
    passed: boolean;
    bonuses: string[];
  } | null;
  /** The outcome that was applied */
  outcome: StoryOutcome;
  /** Was this a critical moment? */
  isCritical: boolean;
  /** Is the character dead? */
  isDead: boolean;
  /** Is the chapter complete? */
  isChapterComplete: boolean;
  /** Generated system messages/notifications */
  notifications: StoryNotification[];
}

export interface StoryNotification {
  type: 'level_up' | 'tier_up' | 'death' | 'ascension' | 'title' |
        'trait' | 'item' | 'relationship' | 'region_unlock' | 'chapter_complete';
  title: string;
  description: string;
  sentiment: 'positive' | 'negative' | 'dramatic' | 'neutral';
}

// ═══════════════════════════════════════════════
// ─── Main Resolution Function ───
// ═══════════════════════════════════════════════

/**
 * Process a player's choice for the current story event.
 * This is the main function called by the UI.
 */
export function resolveStoryChoice(
  character: StoryCharacter,
  event: StoryEvent,
  choiceId: string,
  chapter: StoryChapter | null,
  seed?: number
): StoryTurnResult {
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) {
    throw new Error(`Choice ${choiceId} not found in event ${event.id}`);
  }

  const notifications: StoryNotification[] = [];
  let checkResult = null;
  let outcome: StoryOutcome;

  // ── Resolve Check ──
  if (choice.check) {
    checkResult = rollCheck(choice.check, character, seed);

    if (checkResult.passed) {
      outcome = choice.successOutcomes[
        Math.floor(Math.random() * choice.successOutcomes.length)
      ];
    } else {
      outcome = choice.failureOutcomes?.[
        Math.floor(Math.random() * (choice.failureOutcomes?.length ?? 1))
      ] ?? choice.successOutcomes[0]; // Fallback to success if no failure defined
    }
  } else {
    // No check — use success outcome
    outcome = choice.successOutcomes[
      Math.floor(Math.random() * choice.successOutcomes.length)
    ];
  }

  // ── Snapshot pre-state for comparison ──
  const prevLevel = character.level;
  const prevTier = character.powerTier;
  const prevTitles = new Set(character.titles);
  const prevTraits = new Set(character.acquiredTraits.map((t) => t.name));
  const prevItems = new Set(character.inventory.map((i) => i.name));

  // ── Apply Outcome ──
  let updatedCharacter = applyOutcome(character, outcome, event);

  // ── Generate Notifications ──
  if (updatedCharacter.level > prevLevel) {
    notifications.push({
      type: 'level_up',
      title: `Level Up! → ${updatedCharacter.level}`,
      description: `${getXpToNextLevel(updatedCharacter.level, updatedCharacter.xp)} XP bis zum nächsten Level.`,
      sentiment: 'positive',
    });
  }

  if (updatedCharacter.powerTier !== prevTier) {
    notifications.push({
      type: 'tier_up',
      title: `Tier Aufstieg: ${updatedCharacter.powerTier.toUpperCase()}`,
      description: `Deine Macht wächst. Neue Gefahren erwarten dich.`,
      sentiment: 'dramatic',
    });
  }

  if (updatedCharacter.status === 'dead') {
    notifications.push({
      type: 'death',
      title: 'TOD',
      description: 'Dein Charakter ist gefallen. Die Geschichte endet hier.',
      sentiment: 'negative',
    });
  }

  if (updatedCharacter.status === 'ascended') {
    notifications.push({
      type: 'ascension',
      title: 'AUFSTIEG!',
      description: 'Dein Charakter hat die sterbliche Ebene überschritten. Legende.',
      sentiment: 'dramatic',
    });
  }

  // New titles
  for (const title of updatedCharacter.titles) {
    if (!prevTitles.has(title)) {
      notifications.push({
        type: 'title',
        title: `Neuer Titel: ${title}`,
        description: `Du trägst nun den Titel "${title}".`,
        sentiment: 'positive',
      });
    }
  }

  // New traits
  for (const trait of updatedCharacter.acquiredTraits) {
    if (!prevTraits.has(trait.name)) {
      notifications.push({
        type: 'trait',
        title: `Neuer Trait: ${trait.name}`,
        description: trait.description,
        sentiment: 'positive',
      });
    }
  }

  // New items
  for (const item of updatedCharacter.inventory) {
    if (!prevItems.has(item.name)) {
      notifications.push({
        type: 'item',
        title: `Neues Item: ${item.name}`,
        description: item.description,
        sentiment: 'positive',
      });
    }
  }

  // ── Update Chapter ──
  let updatedChapter = chapter;
  let isChapterComplete = false;

  if (updatedChapter) {
    const eventResult: StoryEventResult = {
      event,
      chosenChoice: choice,
      checkRoll: checkResult?.rawRoll,
      checkPassed: checkResult?.passed,
      outcomeApplied: outcome,
      timestamp: Date.now(),
    };

    updatedChapter = recordEventResult(updatedChapter, eventResult);

    if (updatedChapter.completed) {
      isChapterComplete = true;
      updatedCharacter = completeChapter(updatedCharacter, updatedChapter);
      notifications.push({
        type: 'chapter_complete',
        title: `Kapitel abgeschlossen: ${updatedChapter.title}`,
        description: updatedChapter.summary ?? 'Das Kapitel endet.',
        sentiment: 'dramatic',
      });
    }
  }

  return {
    character: updatedCharacter,
    chapter: isChapterComplete ? null : updatedChapter,
    event,
    choice,
    checkResult,
    outcome,
    isCritical: outcome.isCritical ?? false,
    isDead: updatedCharacter.status === 'dead',
    isChapterComplete,
    notifications,
  };
}

// ═══════════════════════════════════════════════
// ─── Story Session Management ───
// ═══════════════════════════════════════════════

/**
 * Begin a new story session for a character.
 * Initializes a new chapter if none is active.
 */
export function beginStorySession(
  character: StoryCharacter,
  difficulty: StoryChapter['difficulty'] = 'normal'
): { character: StoryCharacter; chapter: StoryChapter } {
  if (character.activeChapter) {
    return { character, chapter: character.activeChapter };
  }

  const chapter = startChapter(character, character.currentRegion, difficulty);
  const updatedCharacter: StoryCharacter = {
    ...character,
    activeChapter: chapter,
  };

  return { character: updatedCharacter, chapter };
}

/**
 * Generate the next event for the current session.
 */
export function advanceStory(
  character: StoryCharacter,
  seed?: number
): StoryEvent | null {
  const result = generateNextEvent(character, seed);
  return result?.event ?? null;
}

/**
 * Travel to a new region.
 */
export function travelToRegion(
  character: StoryCharacter,
  targetRegionId: string
): { success: boolean; character: StoryCharacter; message: string } {
  const targetRegion = getRegion(targetRegionId);
  if (!targetRegion) {
    return { success: false, character, message: 'Region existiert nicht.' };
  }

  if (!targetRegion.unlocked) {
    return { success: false, character, message: 'Region ist noch gesperrt.' };
  }

  // Check if regions are connected
  const currentRegion = getRegion(character.currentRegion);
  if (currentRegion && !currentRegion.connections.includes(targetRegionId)) {
    return {
      success: false,
      character,
      message: `${targetRegion.name} ist nicht von ${currentRegion.name} aus erreichbar.`,
    };
  }

  return {
    success: true,
    character: {
      ...character,
      currentRegion: targetRegionId,
      lastActiveAt: Date.now(),
    },
    message: `Reise nach ${targetRegion.name} erfolgreich.`,
  };
}

/**
 * Retire a character peacefully.
 */
export function retireCharacter(
  character: StoryCharacter
): StoryCharacter {
  return {
    ...character,
    status: 'retired',
    lastActiveAt: Date.now(),
    storyLog: [
      ...character.storyLog,
      {
        timestamp: Date.now(),
        title: 'Ruhestand',
        narrative: `${character.build.name} legt die Waffen nieder und zieht sich zurück. Die Geschichte endet — aber die Legende lebt weiter.`,
        category: 'rest',
        sentiment: 'positive',
        involvedTags: character.build.tags,
      },
    ],
  };
}

// ═══════════════════════════════════════════════
// ─── PvP Resolution (High-Level) ───
// ═══════════════════════════════════════════════

/**
 * Initiate and resolve a PvP encounter.
 */
export function initiatePvP(
  attacker: StoryCharacter,
  defender: StoryCharacter,
  seed?: number
): {
  encounter: PvPEncounter;
  updatedAttacker: StoryCharacter;
  updatedDefender: StoryCharacter;
  notifications: StoryNotification[];
} {
  const trigger = attacker.relationships.some(
    (r) => r.targetCharacterId === defender.storyId &&
      (r.type === 'rival' || r.type === 'enemy')
  )
    ? 'rival_encounter' as const
    : 'same_region' as const;

  const encounter = resolvePvPEncounter(attacker, defender, trigger, seed);
  const { updatedAttacker, updatedDefender } = applyPvPResults(
    attacker, defender, encounter
  );

  const notifications: StoryNotification[] = [];
  const isAttackerWin = encounter.winnerId === attacker.storyId;
  const isDraw = encounter.winnerId === null;

  notifications.push({
    type: 'relationship',
    title: isDraw
      ? 'Unentschieden!'
      : isAttackerWin
        ? `${attacker.build.name} gewinnt!`
        : `${defender.build.name} gewinnt!`,
    description: `PvP-Kampf in ${encounter.region}: ${encounter.rounds.length} Runden.`,
    sentiment: isDraw ? 'neutral' : 'dramatic',
  });

  if (updatedAttacker.status === 'dead' || updatedDefender.status === 'dead') {
    notifications.push({
      type: 'death',
      title: 'Tod im PvP!',
      description: `Ein Kämpfer ist gefallen.`,
      sentiment: 'negative',
    });
  }

  return { encounter, updatedAttacker, updatedDefender, notifications };
}

// ═══════════════════════════════════════════════
// ─── Character Summary / Statistics ───
// ═══════════════════════════════════════════════

export interface CharacterSummary {
  name: string;
  level: number;
  powerTier: string;
  status: string;
  hp: number;
  maxHp: number;
  xp: number;
  xpToNext: number;
  totalEvents: number;
  chaptersCompleted: number;
  victories: number;
  defeats: number;
  titleCount: number;
  traitCount: number;
  itemCount: number;
  allyCount: number;
  rivalCount: number;
  currentRegion: string;
  topTitles: string[];
  survivalRating: string;
}

/**
 * Generate a summary of a story character's journey.
 */
export function getCharacterSummary(character: StoryCharacter): CharacterSummary {
  const allies = character.relationships.filter(
    (r) => r.type === 'ally' || r.type === 'mentor'
  );
  const rivals = character.relationships.filter(
    (r) => r.type === 'rival' || r.type === 'enemy'
  );

  const survivalRating = calculateSurvivalRating(character);

  return {
    name: character.build.name,
    level: character.level,
    powerTier: character.powerTier,
    status: character.status,
    hp: character.hp,
    maxHp: character.maxHp,
    xp: character.xp,
    xpToNext: getXpToNextLevel(character.level, character.xp),
    totalEvents: character.eventsExperienced,
    chaptersCompleted: character.completedChapters.length,
    victories: character.victories,
    defeats: character.defeats,
    titleCount: character.titles.length,
    traitCount: character.acquiredTraits.length,
    itemCount: character.inventory.length,
    allyCount: allies.length,
    rivalCount: rivals.length,
    currentRegion: character.currentRegion,
    topTitles: character.titles.slice(0, 3),
    survivalRating,
  };
}

function calculateSurvivalRating(character: StoryCharacter): string {
  const totalEncounters = character.eventsExperienced;
  if (totalEncounters === 0) return 'Unbekannt';

  const hpPercent = character.hp / character.maxHp;
  const victoryRate = totalEncounters > 0
    ? character.victories / Math.max(1, character.victories + character.defeats)
    : 0.5;

  if (character.status === 'dead') return 'Gefallen';
  if (character.status === 'ascended') return 'Transzendent';
  if (character.status === 'legendary') return 'Legendär';
  if (character.status === 'retired') return 'Im Ruhestand';

  const score = hpPercent * 40 + victoryRate * 30 +
    Math.min(character.level / 20, 1) * 30;

  if (score >= 80) return 'Unaufhaltsam';
  if (score >= 60) return 'Stark';
  if (score >= 40) return 'Stabil';
  if (score >= 20) return 'Angeschlagen';
  return 'Am Abgrund';
}

// ═══════════════════════════════════════════════
// ─── Re-exports for convenience ───
// ═══════════════════════════════════════════════

export {
  initStoryCharacter,
  getAvailableChoices,
  getXpToNextLevel,
} from './storyEngine';

export {
  findOpponents,
  canEncounter,
} from './pvpSystem';

export {
  getRegion,
  getStartingRegions,
} from './worldRegions';
