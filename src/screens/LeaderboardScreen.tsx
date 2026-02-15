// ── LeaderboardScreen ──
// Local leaderboard of saved builds ranked by score.

import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { Rarity } from '../types';

type SortMode = 'score' | 'meme' | 'date';

const RARITY_ORDER = [
  Rarity.Common, Rarity.Uncommon, Rarity.Rare,
  Rarity.Epic, Rarity.Legendary, Rarity.Mythic, Rarity.Forbidden,
];

function getScoreTier(score: number): { label: string; color: string } {
  if (score >= 8000) return { label: 'S+', color: 'text-rarity-mythic' };
  if (score >= 6000) return { label: 'S', color: 'text-rarity-legendary' };
  if (score >= 4500) return { label: 'A', color: 'text-rarity-epic' };
  if (score >= 3000) return { label: 'B', color: 'text-rarity-rare' };
  if (score >= 1500) return { label: 'C', color: 'text-rarity-uncommon' };
  return { label: 'D', color: 'text-surface-400' };
}

function getMedalEmoji(rank: number): string {
  if (rank === 0) return '🥇';
  if (rank === 1) return '🥈';
  if (rank === 2) return '🥉';
  return `#${rank + 1}`;
}

export default function LeaderboardScreen() {
  const { state, dispatch } = useGame();
  const { play } = useSound();
  const [sortBy, setSortBy] = useState<SortMode>('score');

  const handleBack = useCallback(() => {
    play('navigate');
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  }, [dispatch, play]);

  const sorted = useMemo(() => {
    const builds = [...state.savedBuilds];
    switch (sortBy) {
      case 'score':
        return builds.sort((a, b) => b.score - a.score);
      case 'meme':
        return builds.sort((a, b) => b.memePotential - a.memePotential);
      case 'date':
        return builds.sort((a, b) => b.createdAt - a.createdAt);
      default:
        return builds;
    }
  }, [state.savedBuilds, sortBy]);

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
        <div>
          <h1 className="font-display text-2xl font-bold">Leaderboard</h1>
          <p className="text-surface-400 text-sm">
            {state.savedBuilds.length} build{state.savedBuilds.length !== 1 ? 's' : ''} ranked
          </p>
        </div>
      </div>

      {/* Sort Tabs */}
      <div className="flex gap-2">
        {([
          { key: 'score' as SortMode, label: '🏆 Score', color: 'text-rarity-legendary' },
          { key: 'meme' as SortMode, label: '🤡 Meme', color: 'text-neon-pink' },
          { key: 'date' as SortMode, label: '📅 Recent', color: 'text-neon-cyan' },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => { setSortBy(tab.key); play('navigate'); }}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              sortBy === tab.key
                ? `${tab.color} border-current bg-surface-200`
                : 'text-surface-400 border-surface-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {sorted.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 text-surface-400">
            <div className="text-6xl">🏆</div>
            <p>No builds yet. Complete a run!</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {sorted.map((build, i) => {
            const tier = getScoreTier(build.score);
            const bestRarity = build.results.reduce((best, r) => {
              return RARITY_ORDER.indexOf(r.segment.rarity) > RARITY_ORDER.indexOf(best)
                ? r.segment.rarity : best;
            }, Rarity.Common);

            const isTop3 = i < 3 && sortBy === 'score';

            return (
              <motion.div
                key={build.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  isTop3
                    ? 'bg-linear-to-r from-surface-100 to-surface-200 border-rarity-legendary/20'
                    : 'bg-surface-100 border-surface-300'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {/* Rank */}
                <div className={`w-8 text-center font-display font-bold shrink-0 ${
                  i === 0 ? 'text-rarity-legendary text-lg' :
                  i === 1 ? 'text-surface-400 text-lg' :
                  i === 2 ? 'text-neon-orange text-lg' :
                  'text-surface-400 text-sm'
                }`}>
                  {getMedalEmoji(i)}
                </div>

                {/* Build Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-white truncate">
                    {build.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-surface-400 mt-0.5">
                    <span className={`uppercase font-display ${
                      bestRarity === Rarity.Forbidden ? 'text-rarity-forbidden' :
                      bestRarity === Rarity.Mythic ? 'text-rarity-mythic' :
                      bestRarity === Rarity.Legendary ? 'text-rarity-legendary' :
                      'text-surface-400'
                    }`}>
                      {bestRarity}
                    </span>
                    <span>·</span>
                    <span>{build.tags.length} tags</span>
                    <span>·</span>
                    <span>{new Date(build.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Score / Sort Value */}
                <div className="text-right shrink-0">
                  {sortBy === 'meme' ? (
                    <div className="text-neon-pink font-bold text-sm">
                      {build.memePotential}%
                    </div>
                  ) : (
                    <>
                      <div className={`font-display font-bold text-sm ${tier.color}`}>
                        {tier.label}
                      </div>
                      <div className="text-xs text-rarity-legendary font-medium">
                        {build.score.toLocaleString()}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
