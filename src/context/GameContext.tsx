import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Screen, GameMode, BuildContext, CharacterBuild, Season } from '../types';

// ─── State ───

export interface GameState {
  currentScreen: Screen;
  selectedSeason: Season | null;
  gameMode: GameMode;
  currentRun: BuildContext | null;
  currentWheelIndex: number;
  savedBuilds: CharacterBuild[];
  settings: GameSettings;
}

export interface GameSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  draftModeDefault: boolean;
}

const initialState: GameState = {
  currentScreen: 'home',
  selectedSeason: null,
  gameMode: 'normal',
  currentRun: null,
  currentWheelIndex: 0,
  savedBuilds: [],
  settings: {
    soundEnabled: false,
    reducedMotion: false,
    draftModeDefault: false,
  },
};

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
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'RESET_RUN' };

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

    case 'FINALIZE_RUN':
      return {
        ...state,
        currentScreen: 'result',
        currentRun: null,
        currentWheelIndex: 0,
      };

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
  const [state, dispatch] = useReducer(gameReducer, initialState);

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
