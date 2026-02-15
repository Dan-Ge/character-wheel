// ── useRunManager ──
// Orchestrates the dynamic wheel spin loop.
// Handles power multiplier → dynamic power wheel insertion.

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
import { powerWheel } from '../data/wheels/powerWheel';
import { getPowerCount } from '../data/wheels/powerMultiplierWheel';
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
  /** Dynamic wheel sequence — built as we go */
  wheelSequence: WheelModule[];
  /** Whether the power multiplier has been resolved */
  multiplierResolved: boolean;
}

// ─── Build initial wheel sequence (before multiplier resolution) ───

function buildInitialSequence(seasonWheels: WheelModule[]): WheelModule[] {
  // All wheels EXCEPT the power wheel (it gets inserted dynamically)
  // Order: speed, strength, intelligence, power-multiplier, [power×N], gear, companion, origin, flaw, style
  return seasonWheels.filter(w => w.category !== 'power');
}

// ─── Hook ───

export function useRunManager() {
  const { dispatch } = useGame();
  const seasonWheels = useMemo(() => cyberMythicSeason.wheels, []);

  const initialSequence = useMemo(() => buildInitialSequence(seasonWheels), [seasonWheels]);

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
    wheelSequence: initialSequence,
    multiplierResolved: false,
  });

  // Ref for spin animation timing
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Start a new run ──
  const startRun = useCallback((overclock: boolean = false, draft: boolean = false) => {
    const ctx = createFreshContext(overclock, draft);
    const seq = buildInitialSequence(seasonWheels);
    const firstWheel = seq[0];

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
      wheelSequence: seq,
      multiplierResolved: false,
    });

    dispatch({ type: 'START_RUN', context: ctx });
  }, [seasonWheels, dispatch]);

  // ── Expand sequence after power multiplier result ──
  const expandSequenceWithPower = useCallback((
    currentSeq: WheelModule[],
    multiplierIdx: number,
    powerCount: number,
  ): WheelModule[] => {
    // Insert powerCount copies of powerWheel right after the multiplier wheel
    const before = currentSeq.slice(0, multiplierIdx + 1);
    const after = currentSeq.slice(multiplierIdx + 1);
    const powerWheels = Array.from({ length: powerCount }, (_, i) => ({
      ...powerWheel,
      id: `wheel-power-${i + 1}`,
      name: powerCount > 1 ? `Power ${i + 1}` : 'Power',
    }));
    return [...before, ...powerWheels, ...after];
  }, []);

  // ── Perform a spin ──
  const doSpin = useCallback((options: SpinOptions = {}) => {
    const { currentWheel, context, draftMode, currentWheelIndex, wheelSequence, multiplierResolved } = runState;
    if (!currentWheel || runState.phase === 'spinning') return;

    const mergedOptions: SpinOptions = {
      ...options,
      overclock: runState.overclockActive,
    };

    setRunState(prev => ({ ...prev, phase: 'spinning', events: [] }));

    if (draftMode && currentWheel.category !== 'power-multiplier') {
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
      // Normal mode (or power-multiplier which always uses normal mode)
      const result = spin(currentWheel, context, mergedOptions);

      // After spin animation delay, reveal result
      spinTimeoutRef.current = setTimeout(() => {
        const updatedCtx = updateContextAfterSpin(context, result);
        const { updatedContext, events } = applyRules(updatedCtx, result);

        // Check if this was the power multiplier wheel
        const isMultiplier = currentWheel.category === 'power-multiplier';
        let newSequence = wheelSequence;
        let newMultiplierResolved = multiplierResolved;

        if (isMultiplier && !multiplierResolved) {
          const count = getPowerCount(result.segment.id);
          newSequence = expandSequenceWithPower(wheelSequence, currentWheelIndex, count);
          newMultiplierResolved = true;
        }

        setRunState(prev => ({
          ...prev,
          phase: 'revealing',
          context: updatedContext,
          lastResult: result,
          events,
          allEvents: [...prev.allEvents, ...events],
          wheelSequence: newSequence,
          multiplierResolved: newMultiplierResolved,
        }));

        dispatch({ type: 'UPDATE_RUN', context: updatedContext });

        // Auto-advance after reveal animation
        setTimeout(() => {
          advanceToNext(updatedContext, currentWheelIndex, newSequence);
        }, 1800);
      }, 3200);
    }
  }, [runState, dispatch, expandSequenceWithPower]);

  // ── Pick a draft option ──
  const pickDraft = useCallback((choiceIndex: number) => {
    const { draftOptions, context, currentWheelIndex, wheelSequence } = runState;
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
      advanceToNext(updatedContext, currentWheelIndex, wheelSequence);
    }, 1800);
  }, [runState, dispatch]);

  // ── Advance to next wheel or finish ──
  const advanceToNext = useCallback((ctx: BuildContext, currentIdx: number, sequence: WheelModule[]) => {
    const nextIdx = currentIdx + 1;

    if (nextIdx >= sequence.length) {
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
      const nextWheel = sequence[nextIdx];

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
  }, [dispatch]);

  // ── Reset / Abort ──
  const resetRun = useCallback(() => {
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    const seq = buildInitialSequence(seasonWheels);

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
      wheelSequence: seq,
      multiplierResolved: false,
    });

    dispatch({ type: 'RESET_RUN' });
  }, [seasonWheels, dispatch]);

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
    totalWheels: runState.wheelSequence.length,
    startRun,
    doSpin,
    pickDraft,
    resetRun,
    toggleOverclock,
    toggleDraft,
    canSpin: runState.phase === 'idle' && runState.currentWheel !== null,
  };
}
