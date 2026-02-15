import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { Screen, GameMode, BuildContext, CharacterBuild, Season, UnlockedAchievement, ChallengeResult, AchievementContext } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { checkNewAchievements } from '../data/achievements';
import { cyberMythicSeason } from '../data/seasons/cyberMythic';

// ─── Statistics ───

export interface GameStats {
  totalRuns: number;
  bestScore: number;
  bestBuildName: string;
  totalSpins: number;
  legendaryCount: number;
  mythicCount: number;
  forbiddenCount: number;
  synergiesTriggered: number;
  conflictsEncountered: number;
  highestMeme: number;
  firstRunDate: number | null;
  lastRunDate: number | null;
}

const initialStats: GameStats = {
  totalRuns: 0,
  bestScore: 0,
  bestBuildName: '',
  totalSpins: 0,
  legendaryCount: 0,
  mythicCount: 0,
  forbiddenCount: 0,
  synergiesTriggered: 0,
  conflictsEncountered: 0,
  highestMeme: 0,
  firstRunDate: null,
  lastRunDate: null,
};

// ─── State ───

export interface GameState {
  currentScreen: Screen;
  selectedSeason: Season | null;
  gameMode: GameMode;
  currentRun: BuildContext | null;
  currentWheelIndex: number;
  savedBuilds: CharacterBuild[];
  settings: GameSettings;
  stats: GameStats;
  codexDiscovered: string[];
  achievements: UnlockedAchievement[];
  challengeResults: ChallengeResult[];
  pendingAchievements: string[];  // IDs of achievements to show notification for
}

export interface GameSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  draftModeDefault: boolean;
}

function loadInitialState(): GameState {
  const stored = loadFromStorage();

  return {
    currentScreen: 'home',
    selectedSeason: null,
    gameMode: 'normal',
    currentRun: null,
    currentWheelIndex: 0,
    savedBuilds: (stored.savedBuilds ?? []) as CharacterBuild[],
    settings: (stored.settings as GameSettings) ?? {
      soundEnabled: false,
      reducedMotion: false,
      draftModeDefault: false,
    },
    stats: (stored.stats as GameStats) ?? { ...initialStats },
    codexDiscovered: stored.codexDiscovered ?? [],
    achievements: (stored.achievements ?? []) as UnlockedAchievement[],
    challengeResults: (stored.challengeResults ?? []) as ChallengeResult[],
    pendingAchievements: [],
  };
}

// ─── Actions ───

export type GameAction =
  | { type: 'NAVIGATE'; screen: Screen }
  | { type: 'SELECT_SEASON'; season: Season }
  | { type: 'SET_GAME_MODE'; mode: GameMode }
  | { type: 'START_RUN'; context: BuildContext }
  | { type: 'ADVANCE_WHEEL' }
  | { type: 'UPDATE_RUN'; context: BuildContext }
  | { type: 'FINALIZE_RUN'; build: CharacterBuild }
  | { type: 'SAVE_BUILD'; build: CharacterBuild }
  | { type: 'DELETE_BUILD'; buildId: string }
  | { type: 'DELETE_ALL_BUILDS' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'RESET_RUN' }
  | { type: 'IMPORT_DATA'; builds: CharacterBuild[]; settings: GameSettings; stats: GameStats; codex: string[] }
  | { type: 'RESET_STATS' }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievement: UnlockedAchievement }
  | { type: 'COMPLETE_CHALLENGE'; result: ChallengeResult }
  | { type: 'DISMISS_ACHIEVEMENT'; achievementId: string }
  | { type: 'CHECK_ACHIEVEMENTS' };

// ─── Helpers ───

function updateStatsFromBuild(stats: GameStats, build: CharacterBuild): GameStats {
  const now = Date.now();
  let legendaryCount = 0;
  let mythicCount = 0;
  let forbiddenCount = 0;

  for (const r of build.results) {
    if (r.segment.rarity === 'legendary') legendaryCount++;
    else if (r.segment.rarity === 'mythic') mythicCount++;
    else if (r.segment.rarity === 'forbidden') forbiddenCount++;
  }

  return {
    totalRuns: stats.totalRuns + 1,
    bestScore: build.score > stats.bestScore ? build.score : stats.bestScore,
    bestBuildName: build.score > stats.bestScore ? build.name : stats.bestBuildName,
    totalSpins: stats.totalSpins + build.results.length,
    legendaryCount: stats.legendaryCount + legendaryCount,
    mythicCount: stats.mythicCount + mythicCount,
    forbiddenCount: stats.forbiddenCount + forbiddenCount,
    synergiesTriggered: stats.synergiesTriggered,
    conflictsEncountered: stats.conflictsEncountered,
    highestMeme: build.memePotential > stats.highestMeme ? build.memePotential : stats.highestMeme,
    firstRunDate: stats.firstRunDate ?? now,
    lastRunDate: now,
  };
}

function discoverSegments(codex: string[], build: CharacterBuild): string[] {
  const newIds = build.results
    .map(r => r.segment.id)
    .filter(id => !codex.includes(id));
  return newIds.length > 0 ? [...codex, ...newIds] : codex;
}

// ─── Achievement Context Builder ───

function buildAchievementContext(state: GameState, latestBuild: CharacterBuild | null): AchievementContext {
  const totalSegments = cyberMythicSeason.wheels.reduce((sum, w) => sum + w.segments.length, 0);
  return {
    totalRuns: state.stats.totalRuns,
    bestScore: state.stats.bestScore,
    totalSpins: state.stats.totalSpins,
    legendaryCount: state.stats.legendaryCount,
    mythicCount: state.stats.mythicCount,
    forbiddenCount: state.stats.forbiddenCount,
    synergiesTriggered: state.stats.synergiesTriggered,
    conflictsEncountered: state.stats.conflictsEncountered,
    highestMeme: state.stats.highestMeme,
    codexCount: state.codexDiscovered.length,
    buildCount: state.savedBuilds.length,
    totalSegments,
    challengesCompleted: state.challengeResults.length,
    latestBuild,
  };
}

// ─── Reducer ───

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentScreen: action.screen };

    case 'SELECT_SEASON':
      return { ...state, selectedSeason: action.season };

    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.mode };

    case 'START_RUN':
      return {
        ...state,
        currentRun: action.context,
        currentWheelIndex: 0,
        currentScreen: 'spin',
      };

    case 'ADVANCE_WHEEL':
      return { ...state, currentWheelIndex: state.currentWheelIndex + 1 };

    case 'UPDATE_RUN':
      return { ...state, currentRun: action.context };

    case 'FINALIZE_RUN': {
      const newStats = updateStatsFromBuild(state.stats, action.build);
      const newCodex = discoverSegments(state.codexDiscovered, action.build);
      const newBuilds = [action.build, ...state.savedBuilds];

      // Check for new achievements
      const tempState: GameState = {
        ...state,
        stats: newStats,
        codexDiscovered: newCodex,
        savedBuilds: newBuilds,
      };
      const ctx = buildAchievementContext(tempState, action.build);
      const alreadyUnlocked = state.achievements.map(a => a.achievementId);
      const newlyUnlocked = checkNewAchievements(ctx, alreadyUnlocked);
      const now = Date.now();
      const newAchievements = [
        ...state.achievements,
        ...newlyUnlocked.map(a => ({ achievementId: a.id, unlockedAt: now })),
      ];

      return {
        ...state,
        currentScreen: 'result',
        currentRun: null,
        currentWheelIndex: 0,
        savedBuilds: newBuilds,
        stats: newStats,
        codexDiscovered: newCodex,
        achievements: newAchievements,
        pendingAchievements: [
          ...state.pendingAchievements,
          ...newlyUnlocked.map(a => a.id),
        ],
      };
    }

    case 'SAVE_BUILD':
      return {
        ...state,
        savedBuilds: [action.build, ...state.savedBuilds],
      };

    case 'DELETE_BUILD':
      return {
        ...state,
        savedBuilds: state.savedBuilds.filter(b => b.id !== action.buildId),
      };

    case 'DELETE_ALL_BUILDS':
      return {
        ...state,
        savedBuilds: [],
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };

    case 'RESET_RUN':
      return {
        ...state,
        currentRun: null,
        currentWheelIndex: 0,
        currentScreen: 'home',
      };

    case 'IMPORT_DATA':
      return {
        ...state,
        savedBuilds: action.builds,
        settings: action.settings,
        stats: action.stats,
        codexDiscovered: action.codex,
      };

    case 'RESET_STATS':
      return {
        ...state,
        stats: { ...initialStats },
      };

    case 'UNLOCK_ACHIEVEMENT':
      if (state.achievements.some(a => a.achievementId === action.achievement.achievementId)) {
        return state;
      }
      return {
        ...state,
        achievements: [...state.achievements, action.achievement],
        pendingAchievements: [...state.pendingAchievements, action.achievement.achievementId],
      };

    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        challengeResults: [...state.challengeResults, action.result],
      };

    case 'DISMISS_ACHIEVEMENT':
      return {
        ...state,
        pendingAchievements: state.pendingAchievements.filter(id => id !== action.achievementId),
      };

    case 'CHECK_ACHIEVEMENTS': {
      const achCtx = buildAchievementContext(state, state.savedBuilds[0] ?? null);
      const unlocked = state.achievements.map(a => a.achievementId);
      const newAchs = checkNewAchievements(achCtx, unlocked);
      if (newAchs.length === 0) return state;
      const achNow = Date.now();
      return {
        ...state,
        achievements: [
          ...state.achievements,
          ...newAchs.map(a => ({ achievementId: a.id, unlockedAt: achNow })),
        ],
        pendingAchievements: [
          ...state.pendingAchievements,
          ...newAchs.map(a => a.id),
        ],
      };
    }

    default:
      return state;
  }
}

// ─── Context ───

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

// ─── Provider ───

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadInitialState);

  // Persist to localStorage on relevant state changes
  useEffect(() => {
    saveToStorage({
      savedBuilds: state.savedBuilds,
      settings: state.settings,
      stats: state.stats,
      codexDiscovered: state.codexDiscovered,
      achievements: state.achievements,
      challengeResults: state.challengeResults,
    });
  }, [state.savedBuilds, state.settings, state.stats, state.codexDiscovered, state.achievements, state.challengeResults]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// ─── Hook ───

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
