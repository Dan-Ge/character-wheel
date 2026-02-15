// ── AchievementToast ──
// Animated toast notification when an achievement is unlocked.

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { getAchievementById } from '../data/achievements';

export default function AchievementToast() {
  const { state, dispatch } = useGame();

  const currentId = state.pendingAchievements[0] ?? null;
  const achievement = currentId ? getAchievementById(currentId) : null;

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!currentId) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_ACHIEVEMENT', achievementId: currentId });
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentId, dispatch]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-sm"
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <button
            onClick={() => dispatch({ type: 'DISMISS_ACHIEVEMENT', achievementId: achievement.id })}
            className="w-full text-left bg-linear-to-r from-rarity-legendary/20 via-surface-100 to-neon-orange/10 border border-rarity-legendary/40 rounded-xl p-4 shadow-lg shadow-rarity-legendary/20 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl shrink-0">{achievement.icon}</div>
              <div className="min-w-0">
                <div className="text-[10px] font-display text-rarity-legendary uppercase tracking-widest">
                  Achievement Unlocked!
                </div>
                <div className="font-bold text-white text-sm truncate mt-0.5">
                  {achievement.name}
                </div>
                <div className="text-xs text-surface-400 mt-0.5">
                  {achievement.description}
                </div>
              </div>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
