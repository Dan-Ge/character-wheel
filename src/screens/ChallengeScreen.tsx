// ── ChallengeScreen ──
// Daily and weekly challenge display.

import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { generateDailyChallenge, generateWeeklyChallenge } from '../features/dailyChallenge';
import { cyberMythicSeason } from '../data/seasons/cyberMythic';

export default function ChallengeScreen() {
  const { state, dispatch } = useGame();
  const { play } = useSound();

  const daily = useMemo(() => generateDailyChallenge(), []);
  const weekly = useMemo(() => generateWeeklyChallenge(), []);

  const dailyCompleted = state.challengeResults.some(r => r.challengeId === daily.id);
  const weeklyCompleted = state.challengeResults.some(r => r.challengeId === weekly.id);

  const dailyBestScore = useMemo(() => {
    const result = state.challengeResults.find(r => r.challengeId === daily.id);
    return result?.score ?? null;
  }, [state.challengeResults, daily.id]);

  const weeklyBestScore = useMemo(() => {
    const result = state.challengeResults.find(r => r.challengeId === weekly.id);
    return result?.score ?? null;
  }, [state.challengeResults, weekly.id]);

  const handleBack = useCallback(() => {
    play('navigate');
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  }, [dispatch, play]);

  const handleStartChallenge = useCallback((seed: string) => {
    play('navigate');
    dispatch({ type: 'SELECT_SEASON', season: cyberMythicSeason });
    dispatch({ type: 'SET_GAME_MODE', mode: 'normal' });
    dispatch({ type: 'NAVIGATE', screen: 'spin' });
    // The seed is available in the challenge data for future deterministic runs
    void seed; // acknowledged
  }, [dispatch, play]);

  const totalCompleted = state.challengeResults.length;

  return (
    <motion.div
      className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="text-surface-400 hover:text-white transition-colors p-2">
          ← Back
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold">Challenges</h1>
          <p className="text-surface-400 text-sm">
            {totalCompleted} challenge{totalCompleted !== 1 ? 's' : ''} completed
          </p>
        </div>
      </div>

      {/* Daily Challenge */}
      <ChallengeCard
        type="daily"
        challenge={daily}
        completed={dailyCompleted}
        bestScore={dailyBestScore}
        onStart={() => handleStartChallenge(daily.seed)}
      />

      {/* Weekly Challenge */}
      <ChallengeCard
        type="weekly"
        challenge={weekly}
        completed={weeklyCompleted}
        bestScore={weeklyBestScore}
        onStart={() => handleStartChallenge(weekly.seed)}
      />

      {/* Challenge History */}
      {totalCompleted > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-display text-surface-400 uppercase tracking-widest">
            Recent Challenges
          </h2>
          <div className="space-y-2">
            {state.challengeResults.slice(-5).reverse().map((result) => (
              <div
                key={result.challengeId + result.completedAt}
                className="flex items-center justify-between bg-surface-100 border border-surface-300 rounded-lg p-3"
              >
                <div>
                  <div className="text-sm text-white font-medium">
                    {result.challengeId.startsWith('weekly') ? '⭐ Weekly' : '📅 Daily'} – {result.date}
                  </div>
                  <div className="text-xs text-surface-400">
                    {new Date(result.completedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-rarity-legendary font-bold text-sm">
                  {result.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}

// ─── Challenge Card Component ───

interface ChallengeCardProps {
  type: 'daily' | 'weekly';
  challenge: ReturnType<typeof generateDailyChallenge>;
  completed: boolean;
  bestScore: number | null;
  onStart: () => void;
}

function ChallengeCard({ type, challenge, completed, bestScore, onStart }: ChallengeCardProps) {
  const borderColor = type === 'daily'
    ? 'border-neon-cyan/30'
    : 'border-rarity-legendary/30';
  const gradientFrom = type === 'daily'
    ? 'from-neon-cyan/10'
    : 'from-rarity-legendary/10';
  const headerColor = type === 'daily'
    ? 'text-neon-cyan'
    : 'text-rarity-legendary';
  const buttonGradient = type === 'daily'
    ? 'from-neon-cyan to-accent'
    : 'from-rarity-legendary to-neon-orange';

  return (
    <motion.div
      className={`bg-linear-to-br ${gradientFrom} to-surface-100 border ${borderColor} rounded-2xl p-5 space-y-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: type === 'weekly' ? 0.1 : 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-xs font-display ${headerColor} uppercase tracking-widest`}>
            {type === 'daily' ? '📅 Daily Challenge' : '⭐ Weekly Challenge'}
          </div>
          <h3 className="text-xl font-display font-bold text-white mt-1">
            {challenge.title}
          </h3>
          <p className="text-sm text-surface-400 mt-1">
            {challenge.description}
          </p>
        </div>
        {completed && (
          <span className="text-2xl shrink-0">✅</span>
        )}
      </div>

      {/* Modifiers */}
      <div className="flex flex-wrap gap-2">
        {challenge.modifiers.map((mod, i) => (
          <span
            key={i}
            className="text-xs bg-surface-200 border border-surface-300 text-surface-400 px-2.5 py-1 rounded-lg"
          >
            {mod.label}: <span className="text-white">{mod.description}</span>
          </span>
        ))}
      </div>

      {/* Target & Mode */}
      <div className="flex items-center gap-4 text-xs text-surface-400">
        <span>Target: <span className="text-rarity-legendary font-bold">{challenge.targetScore.toLocaleString()}</span></span>
        <span>Mode: <span className="text-white capitalize">{challenge.gameMode}</span></span>
        {bestScore !== null && (
          <span>Your Score: <span className="text-neon-green font-bold">{bestScore.toLocaleString()}</span></span>
        )}
      </div>

      {/* Action */}
      {!completed ? (
        <button
          onClick={onStart}
          className={`w-full py-3 bg-linear-to-r ${buttonGradient} rounded-xl font-display font-bold text-sm tracking-wide text-white shadow-lg active:scale-95 transition-all`}
        >
          Start Challenge
        </button>
      ) : (
        <div className="text-center text-sm text-neon-green font-medium py-2">
          ✅ Completed! Score: {bestScore?.toLocaleString() ?? '—'}
        </div>
      )}
    </motion.div>
  );
}
