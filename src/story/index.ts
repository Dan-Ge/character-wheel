// ── Story Module Index ──
// Barrel exports for the story adventure system.

// ─── Context & State ───
export { StoryProvider, useStory } from './StoryContext';
export type { StoryAction } from './StoryContext';

// ─── Resolver (main interface) ───
export {
  resolveStoryChoice,
  beginStorySession,
  advanceStory,
  travelToRegion,
  retireCharacter,
  initiatePvP,
  getCharacterSummary,
  initStoryCharacter,
  getAvailableChoices,
  getXpToNextLevel,
  findOpponents,
  canEncounter,
  getRegion,
  getStartingRegions,
} from './storyResolver';
export type { StoryTurnResult, StoryNotification, CharacterSummary } from './storyResolver';

// ─── Engine ───
export {
  generateNextEvent,
  rollCheck,
  applyOutcome,
  startChapter,
  completeChapter,
  checkCondition,
} from './storyEngine';

// ─── Fate Wheel ───
export {
  FATE_WHEEL_SLICES,
  spinFateWheel,
  computeFateWeights,
} from './fateWheel';
export type { AdjustedSlice } from './fateWheel';

// ─── PvP ───
export {
  resolvePvPEncounter,
  applyPvPResults,
} from './pvpSystem';

// ─── Data ───
export {
  ALL_STORY_EVENTS,
  getStoryEvent,
  getEventsByCategory,
  getEligibleEvents,
  getTotalEventCount,
} from './storyEvents';

export {
  WORLD_REGIONS,
  getConnectedRegions,
  getRegionsByDanger,
  getRegionTagBoost,
} from './worldRegions';
