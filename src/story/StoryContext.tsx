// ── Story Context ──
// React Context + Reducer for story adventure state management.
// Integrates with existing GameContext for cross-system navigation.

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  StoryState,
  StoryScreen,
  StoryCharacter,
  StoryEvent,
  StoryChapter,
} from '../types/storyTypes';
import type { CharacterBuild } from '../types';
import { WORLD_REGIONS } from './worldRegions';
import {
  resolveStoryChoice,
  beginStorySession,
  advanceStory,
  travelToRegion,
  retireCharacter,
  initiatePvP,
  getCharacterSummary,
  type StoryTurnResult,
  type StoryNotification,
} from './storyResolver';
import { initStoryCharacter } from './storyEngine';

// ═══════════════════════════════════════════════
// ─── State ───
// ═══════════════════════════════════════════════

const initialStoryState: StoryState = {
  activeCharacter: null,
  characters: [],
  worldMap: [...WORLD_REGIONS],
  nearbyPlayers: [],
  activePvP: null,
  storyScreen: 'story_hub',
  pendingEvent: null,
  lastRoll: null,
  isInStoryMode: false,
};

// ═══════════════════════════════════════════════
// ─── Actions ───
// ═══════════════════════════════════════════════

export type StoryAction =
  | { type: 'ENTER_STORY_MODE'; build: CharacterBuild; playerId: string }
  | { type: 'EXIT_STORY_MODE' }
  | { type: 'NAVIGATE_STORY'; screen: StoryScreen }
  | { type: 'SELECT_CHARACTER'; storyId: string }
  | { type: 'START_CHAPTER'; difficulty: StoryChapter['difficulty'] }
  | { type: 'GENERATE_EVENT'; seed?: number }
  | { type: 'RESOLVE_CHOICE'; eventId: string; choiceId: string; seed?: number }
  | { type: 'TRAVEL'; regionId: string }
  | { type: 'INITIATE_PVP'; defenderId: string; seed?: number }
  | { type: 'RETIRE_CHARACTER' }
  | { type: 'UPDATE_NEARBY_PLAYERS'; players: StoryCharacter[] }
  | { type: 'DISMISS_PVP' }
  | { type: 'SET_PENDING_EVENT'; event: StoryEvent | null }
  | { type: 'SET_LAST_ROLL'; roll: number | null }
  | { type: 'UNLOCK_REGION'; regionId: string };

// ═══════════════════════════════════════════════
// ─── Reducer ───
// ═══════════════════════════════════════════════

/** Holds the last turn result for UI consumption */
export let lastTurnResult: StoryTurnResult | null = null;

/** Holds the latest notifications for UI */
export let pendingNotifications: StoryNotification[] = [];

function storyReducer(state: StoryState, action: StoryAction): StoryState {
  switch (action.type) {
    case 'ENTER_STORY_MODE': {
      // Check if character already exists in story
      const existing = state.characters.find(
        (c) => c.build.id === action.build.id
      );

      if (existing) {
        return {
          ...state,
          activeCharacter: existing,
          isInStoryMode: true,
          storyScreen: 'story_hub',
        };
      }

      // Create new story character
      const newChar = initStoryCharacter(action.build, action.playerId);
      return {
        ...state,
        activeCharacter: newChar,
        characters: [...state.characters, newChar],
        isInStoryMode: true,
        storyScreen: 'story_hub',
      };
    }

    case 'EXIT_STORY_MODE':
      return {
        ...state,
        isInStoryMode: false,
        pendingEvent: null,
        activePvP: null,
        lastRoll: null,
      };

    case 'NAVIGATE_STORY':
      return { ...state, storyScreen: action.screen };

    case 'SELECT_CHARACTER': {
      const selectedChar = state.characters.find(
        (c) => c.storyId === action.storyId
      );
      return selectedChar
        ? { ...state, activeCharacter: selectedChar, storyScreen: 'story_hub' }
        : state;
    }

    case 'START_CHAPTER': {
      if (!state.activeCharacter) return state;
      const { character: chapterChar } = beginStorySession(
        state.activeCharacter,
        action.difficulty
      );
      return {
        ...state,
        activeCharacter: chapterChar,
        characters: updateCharInList(state.characters, chapterChar),
        storyScreen: 'adventure',
      };
    }

    case 'GENERATE_EVENT': {
      if (!state.activeCharacter) return state;
      const event = advanceStory(state.activeCharacter, action.seed);
      if (!event) return state;

      return {
        ...state,
        pendingEvent: event,
        storyScreen: 'adventure',
      };
    }

    case 'RESOLVE_CHOICE': {
      if (!state.activeCharacter || !state.pendingEvent) return state;

      const result = resolveStoryChoice(
        state.activeCharacter,
        state.pendingEvent,
        action.choiceId,
        state.activeCharacter.activeChapter,
        action.seed
      );

      // Store for UI consumption
      lastTurnResult = result;
      pendingNotifications = result.notifications;

      let updatedChar = result.character;
      if (result.chapter) {
        updatedChar = { ...updatedChar, activeChapter: result.chapter };
      }

      let nextScreen: StoryScreen = 'adventure';
      if (result.isDead) nextScreen = 'death_screen';
      else if (result.character.status === 'ascended') nextScreen = 'ascension_screen';
      else if (result.isChapterComplete) nextScreen = 'chapter_summary';

      return {
        ...state,
        activeCharacter: updatedChar,
        characters: updateCharInList(state.characters, updatedChar),
        pendingEvent: null,
        lastRoll: result.checkResult?.rawRoll ?? null,
        storyScreen: nextScreen,
      };
    }

    case 'TRAVEL': {
      if (!state.activeCharacter) return state;
      const { success, character: travelChar } = travelToRegion(
        state.activeCharacter,
        action.regionId
      );

      if (!success) return state; // UI should show message

      return {
        ...state,
        activeCharacter: travelChar,
        characters: updateCharInList(state.characters, travelChar),
        storyScreen: 'story_hub',
      };
    }

    case 'INITIATE_PVP': {
      if (!state.activeCharacter) return state;
      const defender = state.nearbyPlayers.find(
        (p) => p.storyId === action.defenderId
      );
      if (!defender) return state;

      const {
        encounter,
        updatedAttacker,
        updatedDefender: _updatedDefender,
        notifications,
      } = initiatePvP(state.activeCharacter, defender, action.seed);

      pendingNotifications = notifications;

      return {
        ...state,
        activeCharacter: updatedAttacker,
        characters: updateCharInList(state.characters, updatedAttacker),
        activePvP: encounter,
        storyScreen: 'pvp',
        lastRoll: null,
      };
    }

    case 'DISMISS_PVP':
      return {
        ...state,
        activePvP: null,
        storyScreen: 'story_hub',
      };

    case 'RETIRE_CHARACTER': {
      if (!state.activeCharacter) return state;
      const retired = retireCharacter(state.activeCharacter);
      return {
        ...state,
        activeCharacter: retired,
        characters: updateCharInList(state.characters, retired),
        storyScreen: 'story_hub',
      };
    }

    case 'UPDATE_NEARBY_PLAYERS':
      return { ...state, nearbyPlayers: action.players };

    case 'SET_PENDING_EVENT':
      return { ...state, pendingEvent: action.event };

    case 'SET_LAST_ROLL':
      return { ...state, lastRoll: action.roll };

    case 'UNLOCK_REGION': {
      const updatedMap = state.worldMap.map((region) =>
        region.id === action.regionId
          ? { ...region, unlocked: true }
          : region
      );
      return { ...state, worldMap: updatedMap };
    }

    default:
      return state;
  }
}

// ═══════════════════════════════════════════════
// ─── Helpers ───
// ═══════════════════════════════════════════════

function updateCharInList(
  list: StoryCharacter[],
  updated: StoryCharacter
): StoryCharacter[] {
  const idx = list.findIndex((c) => c.storyId === updated.storyId);
  if (idx >= 0) {
    const newList = [...list];
    newList[idx] = updated;
    return newList;
  }
  return [...list, updated];
}

// ═══════════════════════════════════════════════
// ─── Context ───
// ═══════════════════════════════════════════════

interface StoryContextValue {
  storyState: StoryState;
  storyDispatch: React.Dispatch<StoryAction>;
  /** Get the last turn result (includes check roll, outcome, etc.) */
  getLastTurnResult: () => StoryTurnResult | null;
  /** Get & clear pending notifications */
  consumeNotifications: () => StoryNotification[];
  /** Get character summary */
  getSummary: () => import('./storyResolver').CharacterSummary | null;
}

const StoryContext = createContext<StoryContextValue | null>(null);

// ─── Provider ───

export function StoryProvider({ children }: { children: ReactNode }) {
  const [storyState, storyDispatch] = useReducer(storyReducer, initialStoryState);

  const getLastTurnResult = (): StoryTurnResult | null => {
    const result = lastTurnResult;
    lastTurnResult = null;
    return result;
  };

  const consumeNotifications = (): StoryNotification[] => {
    const notifs = [...pendingNotifications];
    pendingNotifications = [];
    return notifs;
  };

  const getSummary = () => {
    if (!storyState.activeCharacter) return null;
    return getCharacterSummary(storyState.activeCharacter);
  };

  return (
    <StoryContext.Provider
      value={{
        storyState,
        storyDispatch,
        getLastTurnResult,
        consumeNotifications,
        getSummary,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

// ─── Hook ───

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
}
