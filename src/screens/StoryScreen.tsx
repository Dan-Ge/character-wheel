// ── Story Screen ──
// Entry point for the story adventure mode.
// Allows the character to begin their own story after a wheel run.

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useStory } from '../story/StoryContext';
import SpinWheel from '../components/SpinWheel';
import { buildStoryWheel, pickWeightedChoiceId } from '../utils/buildStoryWheel';
import type { Segment } from '../types';

export default function StoryScreen() {
  const { state, dispatch } = useGame();
  const { storyState, storyDispatch, getSummary } = useStory();
  const [initialized, setInitialized] = useState(false);

  const build = state.savedBuilds[0] ?? null;

  // Auto-initialize story character from build
  useEffect(() => {
    if (build && !initialized && !storyState.activeCharacter) {
      storyDispatch({
        type: 'ENTER_STORY_MODE',
        build,
        playerId: `player-${Date.now()}`,
      });
      setInitialized(true);
    }
  }, [build, initialized, storyState.activeCharacter, storyDispatch]);

  const handleBack = useCallback(() => {
    dispatch({ type: 'NAVIGATE', screen: 'result' });
  }, [dispatch]);

  const handleHome = useCallback(() => {
    storyDispatch({ type: 'EXIT_STORY_MODE' });
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  }, [dispatch, storyDispatch]);

  const handleStartChapter = useCallback(() => {
    storyDispatch({ type: 'START_CHAPTER', difficulty: 'normal' });
  }, [storyDispatch]);

  const handleGenerateEvent = useCallback(() => {
    storyDispatch({ type: 'GENERATE_EVENT', seed: Date.now() });
  }, [storyDispatch]);

  const handleResolveChoice = useCallback((choiceId: string) => {
    const eventId = storyState.pendingEvent?.id ?? '';
    storyDispatch({ type: 'RESOLVE_CHOICE', eventId, choiceId, seed: Date.now() });
  }, [storyDispatch, storyState.pendingEvent]);

  const character = storyState.activeCharacter;
  const summary = getSummary();
  const pendingEvent = storyState.pendingEvent;
  const screen = storyState.storyScreen;

  // ── Story choice wheel state ──
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelTargetId, setWheelTargetId] = useState<string | undefined>();
  const [chosenLabel, setChosenLabel] = useState<string | null>(null);
  const resolveTimer = useRef<ReturnType<typeof setTimeout>>();

  // Build a WheelModule whenever the pending event changes
  const storyWheel = useMemo(() => {
    if (!pendingEvent || !character) return null;
    return buildStoryWheel(pendingEvent.choices, character, pendingEvent.title);
  }, [pendingEvent, character]);

  // Clean-up timer on unmount
  useEffect(() => () => { clearTimeout(resolveTimer.current); }, []);

  // Reset wheel state when a new event arrives
  useEffect(() => {
    setWheelSpinning(false);
    setWheelTargetId(undefined);
    setChosenLabel(null);
  }, [pendingEvent?.id]);

  const handleSpinStoryWheel = useCallback(() => {
    if (!storyWheel || wheelSpinning) return;
    const targetId = pickWeightedChoiceId(storyWheel.segments);
    setWheelTargetId(targetId);
    setWheelSpinning(true);
    setChosenLabel(null);
  }, [storyWheel, wheelSpinning]);

  const handleStoryWheelComplete = useCallback((segment: Segment) => {
    setWheelSpinning(false);
    setChosenLabel(segment.label);
    // Short delay so the player sees the result, then resolve
    resolveTimer.current = setTimeout(() => {
      handleResolveChoice(segment.id);
    }, 1200);
  }, [handleResolveChoice]);

  if (!build) {
    return (
      <motion.div
        className="flex-1 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center space-y-4">
          <p className="text-surface-400">Kein Build gefunden.</p>
          <button onClick={handleBack} className="text-accent underline">
            Zurück
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex-1 flex flex-col items-center p-6 gap-6 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between">
        <button
          onClick={handleBack}
          className="text-surface-400 hover:text-white transition-colors p-2"
        >
          ← Zurück
        </button>
        <div className="font-display text-xs text-neon-pink uppercase tracking-widest">
          📖 Story Modus
        </div>
        <button
          onClick={handleHome}
          className="text-surface-400 hover:text-white transition-colors p-2 text-sm"
        >
          🏠
        </button>
      </div>

      {/* Character Info */}
      {character && (
        <motion.div
          className="w-full max-w-lg bg-surface-100 border border-accent/20 rounded-xl p-5 space-y-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">
              {character.build.name}
            </h2>
            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
              Lvl {character.level}
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-400">❤️ HP</span>
              <span className="text-white font-bold">{character.hp} / {character.maxHp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">⭐ XP</span>
              <span className="text-white font-bold">{character.xp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">⚔️ Power</span>
              <span className="text-neon-cyan font-bold">{character.powerTier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">🏆 Rep</span>
              <span className="text-neon-orange font-bold">{Object.values(character.reputation).reduce((a, b) => a + b, 0)}</span>
            </div>
          </div>

          {/* Tags */}
          {character.build.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {character.build.tags.slice(0, 8).map((tag: string) => (
                <span key={tag} className="text-[10px] bg-surface-200 text-surface-400 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Story Hub */}
      {screen === 'story_hub' && character && (
        <motion.div
          className="w-full max-w-lg space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-surface-100 border border-surface-300 rounded-xl p-5 space-y-3">
            <h3 className="font-display text-lg text-neon-cyan">
              📜 Dein Abenteuer beginnt...
            </h3>
            <p className="text-sm text-surface-400 leading-relaxed">
              {character.build.name} steht am Anfang einer epischen Reise. 
              Die Welt liegt vor dir — voller Gefahren, Geheimnisse und Schätze.
              Jede Entscheidung formt deine Geschichte.
            </p>

            {/* Chapter Info */}
            {character.activeChapter && (
              <div className="bg-surface-200 rounded-lg p-3 space-y-1">
                <div className="text-xs text-accent uppercase tracking-wider">Aktuelles Kapitel</div>
                <div className="text-sm text-white">{character.activeChapter.title}</div>
                <div className="text-xs text-surface-400">
                  Events: {character.activeChapter.currentEventIndex} / {character.activeChapter.totalEvents}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              {!character.activeChapter && (
                <button
                  onClick={handleStartChapter}
                  className="w-full py-3 bg-linear-to-r from-accent to-accent-light rounded-xl font-display font-bold text-white active:scale-95 transition-all"
                >
                  ⚔️ Kapitel starten
                </button>
              )}
              {character.activeChapter && (
                <button
                  onClick={handleGenerateEvent}
                  className="w-full py-3 bg-linear-to-r from-neon-cyan to-accent rounded-xl font-display font-bold text-white active:scale-95 transition-all"
                >
                  🎲 Nächstes Event
                </button>
              )}
            </div>
          </div>

          {/* Inventory quick view */}
          {character.inventory.length > 0 && (
            <div className="bg-surface-100 border border-surface-300 rounded-xl p-4 space-y-2">
              <div className="text-xs font-display text-neon-orange uppercase tracking-widest">
                🎒 Inventar ({character.inventory.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {character.inventory.map(item => (
                  <span key={item.id} className="text-xs bg-surface-200 text-surface-300 px-2 py-1 rounded-lg">
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Adventure - Event Display */}
      {screen === 'adventure' && pendingEvent && storyWheel && (
        <motion.div
          className="w-full max-w-lg space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Event description */}
          <div className="bg-surface-100 border border-neon-cyan/20 rounded-xl p-5 space-y-3">
            <h3 className="font-display text-lg text-neon-cyan">
              {pendingEvent.title}
            </h3>
            <p className="text-sm text-surface-300 leading-relaxed">
              {pendingEvent.description}
            </p>
          </div>

          {/* Choice legend */}
          <div className="bg-surface-100 border border-surface-300 rounded-xl p-4 space-y-2">
            <div className="text-xs font-display text-surface-400 uppercase tracking-widest">
              Mögliche Schicksale
            </div>
            <div className="space-y-1">
              {storyWheel.segments.map(seg => {
                const matchingChoice = pendingEvent.choices.find(c => c.id === seg.id);
                return (
                  <div key={seg.id} className="flex items-start gap-2 text-xs">
                    <span
                      className="inline-block w-3 h-3 rounded-sm shrink-0 mt-0.5"
                      style={{
                        backgroundColor:
                          seg.rarity === 'common' ? '#6b7280'
                          : seg.rarity === 'uncommon' ? '#22c55e'
                          : seg.rarity === 'rare' ? '#3b82f6'
                          : seg.rarity === 'epic' ? '#a855f7'
                          : seg.rarity === 'legendary' ? '#eab308'
                          : seg.rarity === 'forbidden' ? '#ef4444'
                          : '#9ca3af',
                      }}
                    />
                    <div>
                      <span className="text-white">{seg.label}</span>
                      {matchingChoice?.check && (
                        <span className="text-surface-500 ml-1">
                          DC {matchingChoice.check.difficulty}
                        </span>
                      )}
                      <span className="text-surface-500 ml-1">
                        (Gewicht: {seg.weight})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spin Wheel */}
          <div className="flex flex-col items-center gap-4">
            <SpinWheel
              wheel={storyWheel}
              onSpinComplete={handleStoryWheelComplete}
              spinning={wheelSpinning}
              targetSegmentId={wheelTargetId}
              size={280}
            />

            <AnimatePresence mode="wait">
              {chosenLabel ? (
                <motion.div
                  key="result"
                  className="text-center space-y-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-xs text-surface-400 uppercase tracking-wider">Dein Schicksal</div>
                  <div className="font-display text-lg text-neon-cyan">{chosenLabel}</div>
                </motion.div>
              ) : (
                <motion.button
                  key="spin-btn"
                  onClick={handleSpinStoryWheel}
                  disabled={wheelSpinning}
                  className="py-3 px-8 bg-linear-to-r from-accent to-neon-cyan rounded-xl font-display font-bold text-white active:scale-95 transition-all disabled:opacity-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎰 Schicksal drehen!
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Adventure - No Event (generate prompt) */}
      {screen === 'adventure' && !pendingEvent && character?.activeChapter && (
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-surface-100 border border-surface-300 rounded-xl p-5 text-center space-y-4">
            <p className="text-surface-400 text-sm">
              Die Story wartet auf dein nächstes Event...
            </p>
            <button
              onClick={handleGenerateEvent}
              className="py-3 px-6 bg-linear-to-r from-neon-cyan to-accent rounded-xl font-display font-bold text-white active:scale-95 transition-all"
            >
              🎲 Event generieren
            </button>
          </div>
        </motion.div>
      )}

      {/* Death Screen */}
      {screen === 'death_screen' && (
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-surface-100 border border-rarity-forbidden/30 rounded-xl p-6 text-center space-y-4">
            <div className="text-4xl">💀</div>
            <h3 className="font-display text-xl text-rarity-forbidden">Gefallen</h3>
            <p className="text-sm text-surface-400">
              {character?.build.name} ist gefallen. Die Geschichte endet hier... oder doch nicht?
            </p>
            <button
              onClick={handleHome}
              className="py-3 px-6 bg-surface-200 border border-surface-300 rounded-xl font-medium text-gray-300 active:scale-95 transition-all"
            >
              Neues Abenteuer
            </button>
          </div>
        </motion.div>
      )}

      {/* Chapter Summary */}
      {screen === 'chapter_summary' && (
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-surface-100 border border-neon-green/30 rounded-xl p-6 text-center space-y-4">
            <div className="text-4xl">🏆</div>
            <h3 className="font-display text-xl text-neon-green">Kapitel abgeschlossen!</h3>
            {summary && (
              <div className="text-sm text-surface-400 space-y-1">
                <p>Level: {summary.level} | XP: {summary.xp}</p>
                <p>Titel: {summary.topTitles.join(', ') || 'Keine'}</p>
              </div>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={handleStartChapter}
                className="py-3 px-6 bg-linear-to-r from-accent to-accent-light rounded-xl font-display font-bold text-white active:scale-95 transition-all"
              >
                Nächstes Kapitel
              </button>
              <button
                onClick={handleHome}
                className="py-3 px-6 bg-surface-200 border border-surface-300 rounded-xl font-medium text-gray-300 active:scale-95 transition-all"
              >
                Beenden
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Ascension Screen */}
      {screen === 'ascension_screen' && (
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-surface-100 border border-rarity-mythic/30 rounded-xl p-6 text-center space-y-4">
            <div className="text-4xl">✨</div>
            <h3 className="font-display text-xl bg-linear-to-r from-rarity-mythic to-neon-pink bg-clip-text text-transparent">
              Aufgestiegen!
            </h3>
            <p className="text-sm text-surface-400">
              {character?.build.name} hat die Grenzen der Sterblichkeit überschritten. 
              Eine Legende ist geboren.
            </p>
            <button
              onClick={handleHome}
              className="py-3 px-6 bg-linear-to-r from-rarity-mythic to-neon-pink rounded-xl font-display font-bold text-white active:scale-95 transition-all"
            >
              🌟 In die Halle der Legenden
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
