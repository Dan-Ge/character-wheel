// ── useRunManager ──
// Orchestrates the full 7-wheel spin loop.
// Manages spin → draft → result → rules → advance flow.

import { useCallback, useMemo, useRef, useState } from 'react';
import type {
  BuildContext,
  SpinResult,
  WheelModule,
  SpinOptions,
  GameEvent,
  CharacterBuild,
} from '../types';
import { spin, updateContextAfterSpin, createFreshContext } from '../engine/spinEngine';
import { generateDraft, applyDraftChoice, type DraftResult } from '../engine/draftSystem';
import { applyRules } from '../engine/rulesResolver';
import { finalizeBuild } from '../engine/buildFinalizer';
import { cyberMythicSeason } from '../data/seasons/cyberMythic';
import { useGame } from '../context/GameContext';

// ─── Types ───

export type RunPhase = 'idle' | 'spinning' | 'draft-pick' | 'revealing' | 'finished';

export interface RunState {
  phase: RunPhase;
  context: BuildContext;
  currentWheel: WheelModule | null;
  currentWheelIndex: number;
  lastResult: SpinResult | null;
  draftOptions: DraftResult | null;
  events: GameEvent[];
  allEvents: GameEvent[];
  completedBuild: CharacterBuild | null;
  overclockActive: boolean;
  draftMode: boolean;
}

const TOTAL_WHEELS = 7;

// ─── Hook ───

export function useRunManager() {
  const { dispatch } = useGame();
  const wheels = useMemo(() => cyberMythicSeason.wheels, []);

  const [runState, setRunState] = useState<RunState>({
    phase: 'idle',
    context: createFreshContext(),
    currentWheel: null,
    currentWheelIndex: 0,
    lastResult: null,
    draftOptions: null,
    events: [],
    allEvents: [],
    completedBuild: null,
    overclockActive: false,
    draftMode: false,
  });

  // Ref for spin animation timing
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Start a new run ──
  const startRun = useCallback((overclock: boolean = false, draft: boolean = false) => {
    const ctx = createFreshContext(overclock, draft);
    const firstWheel = wheels[0];

    setRunState({
      phase: 'idle',
      context: ctx,
      currentWheel: firstWheel,
      currentWheelIndex: 0,
      lastResult: null,
      draftOptions: null,
      events: [],
      allEvents: [],
      completedBuild: null,
      overclockActive: overclock,
      draftMode: draft,
    });

    dispatch({ type: 'START_RUN', context: ctx });
  }, [wheels, dispatch]);

  // ── Perform a spin ──
  const doSpin = useCallback((options: SpinOptions = {}) => {
    const { currentWheel, context, draftMode, currentWheelIndex } = runState;
    if (!currentWheel || runState.phase === 'spinning') return;

    const mergedOptions: SpinOptions = {
      ...options,
      overclock: runState.overclockActive,
    };

    setRunState(prev => ({ ...prev, phase: 'spinning', events: [] }));

    if (draftMode) {
      // Draft mode: generate options, show after spin animation
      const draft = generateDraft(currentWheel, context, mergedOptions);

      // Pre-compute the "display" result (first option) for the wheel animation
      const displayResult = draft.options[0]?.result ?? null;

      // After spin animation delay, show draft options
      spinTimeoutRef.current = setTimeout(() => {
        setRunState(prev => ({
          ...prev,
          phase: 'draft-pick',
          draftOptions: draft,
          lastResult: displayResult,
        }));
      }, 3200);
    } else {
      // Normal mode: single spin
      const result = spin(currentWheel, context, mergedOptions);

      // After spin animation delay, reveal result
      spinTimeoutRef.current = setTimeout(() => {
        const updatedCtx = updateContextAfterSpin(context, result);
        const { updatedContext, events } = applyRules(updatedCtx, result);

        setRunState(prev => ({
          ...prev,
          phase: 'revealing',
          context: updatedContext,
          lastResult: result,
          events,
          allEvents: [...prev.allEvents, ...events],
        }));

        dispatch({ type: 'UPDATE_RUN', context: updatedContext });

        // Auto-advance after reveal animation
        setTimeout(() => {
          advanceToNext(updatedContext, currentWheelIndex);
        }, 1800);
      }, 3200);
    }
  }, [runState, dispatch]);

  // ── Pick a draft option ──
  const pickDraft = useCallback((choiceIndex: number) => {
    const { draftOptions, context, currentWheelIndex } = runState;
    if (!draftOptions) return;

    const result = applyDraftChoice(draftOptions, choiceIndex);
    const updatedCtx = updateContextAfterSpin(context, result);
    const { updatedContext, events } = applyRules(updatedCtx, result);

    setRunState(prev => ({
      ...prev,
      phase: 'revealing',
      context: updatedContext,
      lastResult: result,
      draftOptions: null,
      events,
      allEvents: [...prev.allEvents, ...events],
    }));

    dispatch({ type: 'UPDATE_RUN', context: updatedContext });

    setTimeout(() => {
      advanceToNext(updatedContext, currentWheelIndex);
    }, 1800);
  }, [runState, dispatch]);

  // ── Advance to next wheel or finish ──
  const advanceToNext = useCallback((ctx: BuildContext, currentIdx: number) => {
    const nextIdx = currentIdx + 1;

    if (nextIdx >= TOTAL_WHEELS) {
      // Run complete — finalize build
      const build = finalizeBuild(ctx, cyberMythicSeason.id);

      setRunState(prev => ({
        ...prev,
        phase: 'finished',
        completedBuild: build,
        currentWheel: null,
      }));

      dispatch({ type: 'FINALIZE_RUN', build });
    } else {
      // Next wheel
      const nextWheel = wheels[nextIdx];

      setRunState(prev => ({
        ...prev,
        phase: 'idle',
        currentWheel: nextWheel,
        currentWheelIndex: nextIdx,
        lastResult: null,
        draftOptions: null,
        events: [],
      }));

      dispatch({ type: 'ADVANCE_WHEEL' });
    }
  }, [wheels, dispatch]);

  // ── Reset / Abort ──
  const resetRun = useCallback(() => {
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);

    setRunState({
      phase: 'idle',
      context: createFreshContext(),
      currentWheel: null,
      currentWheelIndex: 0,
      lastResult: null,
      draftOptions: null,
      events: [],
      allEvents: [],
      completedBuild: null,
      overclockActive: false,
      draftMode: false,
    });

    dispatch({ type: 'RESET_RUN' });
  }, [dispatch]);

  // ── Toggle overclock ──
  const toggleOverclock = useCallback(() => {
    if (runState.phase !== 'idle' || runState.currentWheelIndex > 0) return;
    setRunState(prev => ({
      ...prev,
      overclockActive: !prev.overclockActive,
      context: { ...prev.context, overclockActive: !prev.overclockActive },
    }));
  }, [runState.phase, runState.currentWheelIndex]);

  // ── Toggle draft mode ──
  const toggleDraft = useCallback(() => {
    if (runState.phase !== 'idle' || runState.currentWheelIndex > 0) return;
    setRunState(prev => ({
      ...prev,
      draftMode: !prev.draftMode,
      context: { ...prev.context, draftMode: !prev.draftMode },
    }));
  }, [runState.phase, runState.currentWheelIndex]);

  return {
    ...runState,
    totalWheels: TOTAL_WHEELS,
    startRun,
    doSpin,
    pickDraft,
    resetRun,
    toggleOverclock,
    toggleDraft,
    canSpin: runState.phase === 'idle' && runState.currentWheel !== null,
  };
}
