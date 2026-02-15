import { useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useRunManager } from '../hooks/useRunManager';
import { useSound } from '../hooks/useSound';
import SpinWheel from '../components/SpinWheel';
import { ResultMiniCard } from '../components/ResultCard';
import EventToast from '../components/EventToast';
import DraftPicker from '../components/DraftPicker';
import type { Segment } from '../types';
import { Rarity } from '../types';

export default function SpinScreen() {
  const { dispatch } = useGame();
  const {
    phase, context, currentWheel, currentWheelIndex,
    lastResult, draftOptions, events,
    completedBuild, overclockActive, draftMode,
    totalWheels, startRun, doSpin, pickDraft, resetRun,
    toggleOverclock, toggleDraft, canSpin, wheelSequence,
  } = useRunManager();
  const { play } = useSound();

  // Auto-start on first mount
  useEffect(() => {
    if (!currentWheel && phase === 'idle') {
      startRun(false, false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate to result on finish
  useEffect(() => {
    if (phase === 'finished' && completedBuild) {
      dispatch({ type: 'NAVIGATE', screen: 'result' });
    }
  }, [phase, completedBuild, dispatch]);

  // Sound effects for events
  useEffect(() => {
    for (const e of events) {
      if (e.type === 'synergy_unlocked') play('synergy');
      else if (e.type === 'conflict_detected') play('conflict');
    }
  }, [events, play]);

  // Sound for rarity on reveal
  useEffect(() => {
    if (phase === 'revealing' && lastResult) {
      const r = lastResult.segment.rarity;
      if (r === Rarity.Legendary) play('legendary');
      else if (r === Rarity.Mythic) play('mythic');
      else if (r === Rarity.Forbidden) play('forbidden');
      else play('reveal');
    }
  }, [phase, lastResult, play]);

  const handleSpin = useCallback(() => {
    if (!canSpin) return;
    play('spin-start');
    doSpin();
  }, [canSpin, doSpin, play]);

  const handleSpinComplete = useCallback((_segment: Segment) => {
    play('spin-land');
  }, [play]);

  const handleTick = useCallback(() => {
    play('spin-tick');
  }, [play]);

  const handleDraftPick = useCallback((idx: number) => {
    play('draft-pick');
    pickDraft(idx);
  }, [pickDraft, play]);

  const isBeforeFirstSpin = currentWheelIndex === 0 && phase === 'idle';

  const collectedResults = useMemo(
    () => context.history,
    [context.history],
  );

  const buttonLabel = phase === 'spinning'
    ? 'SPINNING…'
    : phase === 'revealing'
      ? 'REVEALING…'
      : phase === 'draft-pick'
        ? 'CHOOSE…'
        : 'SPIN';

  const buttonDisabled = !canSpin;

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center p-6 gap-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      {/* Event Toasts */}
      <EventToast events={events} />

      {/* Draft Picker Overlay */}
      <AnimatePresence>
        {phase === 'draft-pick' && draftOptions && (
          <DraftPicker draft={draftOptions} onPick={handleDraftPick} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between">
        <button
          onClick={() => { resetRun(); dispatch({ type: 'NAVIGATE', screen: 'home' }); }}
          className="text-surface-400 hover:text-white transition-colors p-2"
        >
          ← Back
        </button>
        <div className="text-center">
          <div className="font-display text-sm text-neon-cyan uppercase tracking-widest">
            Wheel {currentWheelIndex + 1} / {totalWheels}
          </div>
          {currentWheel && (
            <div className="text-base text-surface-600 mt-1 font-medium">
              {currentWheel.icon} {currentWheel.name}
            </div>
          )}
        </div>
        <div className="w-10" />
      </div>

      {/* Wheel */}
      {currentWheel && (
        <SpinWheel
          wheel={currentWheel}
          onSpinComplete={handleSpinComplete}
          spinning={phase === 'spinning'}
          targetSegmentId={lastResult?.segment.id}
          size={380}
          onTick={handleTick}
        />
      )}

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={buttonDisabled}
        className={`w-full max-w-xs py-5 rounded-2xl font-display font-bold text-xl tracking-widest text-white shadow-lg transition-all duration-200 ${
          buttonDisabled
            ? 'bg-surface-300 text-surface-400 cursor-not-allowed shadow-none'
            : 'bg-linear-to-r from-accent to-accent-light shadow-accent/30 hover:shadow-accent/50 active:scale-95'
        }`}
      >
        {buttonLabel}
      </button>

      {/* Toggles (before first spin only) */}
      {isBeforeFirstSpin && (
        <div className="flex items-center gap-6 text-sm">
          {/* Overclock */}
          <button
            onClick={() => { toggleOverclock(); play(overclockActive ? 'overclock-off' : 'overclock-on'); }}
            className="flex items-center gap-2"
          >
            <span className={overclockActive ? 'text-neon-orange' : 'text-surface-400'}>⚡ Overclock</span>
            <div className={`w-10 h-5 rounded-full border relative transition-colors ${overclockActive ? 'bg-neon-orange/20 border-neon-orange' : 'bg-surface-200 border-surface-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${overclockActive ? 'left-5 bg-neon-orange' : 'left-0.5 bg-surface-400'}`} />
            </div>
          </button>
          {/* Draft */}
          <button
            onClick={() => { toggleDraft(); play('navigate'); }}
            className="flex items-center gap-2"
          >
            <span className={draftMode ? 'text-neon-cyan' : 'text-surface-400'}>🃏 Draft</span>
            <div className={`w-10 h-5 rounded-full border relative transition-colors ${draftMode ? 'bg-neon-cyan/20 border-neon-cyan' : 'bg-surface-200 border-surface-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${draftMode ? 'left-5 bg-neon-cyan' : 'left-0.5 bg-surface-400'}`} />
            </div>
          </button>
        </div>
      )}

      {/* Collected Results strip */}
      <div className="w-full max-w-md">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {wheelSequence.map((wheel, i) => {
            const r = collectedResults[i];
            if (r) {
              return <ResultMiniCard key={`${r.wheelId}-${i}`} result={r} />;
            }
            return (
              <div
                key={`slot-${i}`}
                className={`shrink-0 w-20 h-24 bg-surface-100 border-2 rounded-xl flex flex-col items-center justify-center text-surface-500 text-xs gap-1.5 ${
                  i === currentWheelIndex ? 'border-accent/50 animate-pulse' : 'border-dashed border-surface-300'
                }`}
              >
                <span className="text-lg">{wheel.icon}</span>
                <span className="text-[10px] font-medium truncate" style={{ maxWidth: '64px' }}>{wheel.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
