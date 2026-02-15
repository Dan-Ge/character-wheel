// ── AchievementsScreen ──
// Display all achievements and their unlock status.

import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { ACHIEVEMENTS } from '../data/achievements';
import type { AchievementCategory } from '../types';

const CATEGORIES: { key: AchievementCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: '🏅' },
  { key: 'runs', label: 'Runs', icon: '🎯' },
  { key: 'score', label: 'Score', icon: '📈' },
  { key: 'rarity', label: 'Rarity', icon: '✨' },
  { key: 'collection', label: 'Collection', icon: '📖' },
  { key: 'special', label: 'Special', icon: '⭐' },
];

export default function AchievementsScreen() {
  const { state, dispatch } = useGame();
  const { play } = useSound();
  const [filter, setFilter] = useState<AchievementCategory | 'all'>('all');

  const handleBack = useCallback(() => {
    play('navigate');
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  }, [dispatch, play]);

  const unlockedIds = useMemo(
    () => new Set(state.achievements.map(a => a.achievementId)),
    [state.achievements]
  );

  const unlockedMap = useMemo(
    () => new Map(state.achievements.map(a => [a.achievementId, a.unlockedAt])),
    [state.achievements]
  );

  const filtered = useMemo(() => {
    const achs = filter === 'all'
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter(a => a.category === filter);

    // Sort: unlocked first, then by category
    return [...achs].sort((a, b) => {
      const aUnlocked = unlockedIds.has(a.id) ? 0 : 1;
      const bUnlocked = unlockedIds.has(b.id) ? 0 : 1;
      return aUnlocked - bUnlocked;
    });
  }, [filter, unlockedIds]);

  const totalUnlocked = state.achievements.length;
  const totalAchievements = ACHIEVEMENTS.length;
  const progress = totalAchievements > 0 ? Math.round((totalUnlocked / totalAchievements) * 100) : 0;

  return (
    <motion.div
      className="flex-1 flex flex-col p-6 gap-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="text-surface-400 hover:text-white transition-colors p-2">
          ← Back
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">Achievements</h1>
          <p className="text-surface-400 text-sm">
            {totalUnlocked} / {totalAchievements} unlocked ({progress}%)
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto">
        <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-accent to-neon-cyan rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => { setFilter(cat.key); play('navigate'); }}
            className={`px-3 py-1.5 rounded-full text-xs border whitespace-nowrap transition-colors ${
              filter === cat.key
                ? 'text-accent border-accent bg-accent/10'
                : 'text-surface-400 border-surface-300 hover:text-white'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filtered.map((ach, i) => {
          const isUnlocked = unlockedIds.has(ach.id);
          const isSecret = ach.secret && !isUnlocked;
          const unlockedAt = unlockedMap.get(ach.id);

          return (
            <motion.div
              key={ach.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                isUnlocked
                  ? 'bg-linear-to-r from-rarity-legendary/5 to-surface-100 border-rarity-legendary/20'
                  : 'bg-surface-100 border-surface-300 opacity-60'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isUnlocked ? 1 : 0.6, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              {/* Icon */}
              <div className={`text-2xl shrink-0 ${isUnlocked ? '' : 'grayscale'}`}>
                {isSecret ? '❓' : ach.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm ${isUnlocked ? 'text-white' : 'text-surface-400'}`}>
                  {isSecret ? '???' : ach.name}
                </div>
                <div className="text-xs text-surface-400 mt-0.5">
                  {isSecret ? 'Complete the hidden condition to reveal.' : ach.description}
                </div>
                {isUnlocked && unlockedAt && (
                  <div className="text-[10px] text-rarity-legendary mt-1">
                    Unlocked {new Date(unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="shrink-0">
                {isUnlocked ? (
                  <span className="text-rarity-legendary text-lg">✅</span>
                ) : (
                  <span className="text-surface-400 text-lg">🔒</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
