import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import ShareCard from '../components/ShareCard';
import type { CharacterBuild } from '../types';
import { Rarity } from '../types';

const RARITY_BADGE: Record<Rarity, string> = {
  [Rarity.Common]: 'bg-gray-600 text-gray-300',
  [Rarity.Uncommon]: 'bg-rarity-uncommon/20 text-rarity-uncommon',
  [Rarity.Rare]: 'bg-rarity-rare/20 text-rarity-rare',
  [Rarity.Epic]: 'bg-rarity-epic/20 text-rarity-epic',
  [Rarity.Legendary]: 'bg-rarity-legendary/20 text-rarity-legendary',
  [Rarity.Mythic]: 'bg-rarity-mythic/20 text-rarity-mythic',
  [Rarity.Forbidden]: 'bg-rarity-forbidden/20 text-rarity-forbidden',
};

function getScoreTier(score: number): { label: string; color: string } {
  if (score >= 8000) return { label: 'S+', color: 'text-rarity-mythic' };
  if (score >= 6000) return { label: 'S', color: 'text-rarity-legendary' };
  if (score >= 4500) return { label: 'A', color: 'text-rarity-epic' };
  if (score >= 3000) return { label: 'B', color: 'text-rarity-rare' };
  if (score >= 1500) return { label: 'C', color: 'text-rarity-uncommon' };
  return { label: 'D', color: 'text-surface-400' };
}

export default function GalleryScreen() {
  const { state, dispatch } = useGame();
  const [selectedBuild, setSelectedBuild] = useState<CharacterBuild | null>(null);

  const handleBack = useCallback(() => {
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  }, [dispatch]);

  const handleDelete = useCallback((buildId: string) => {
    dispatch({ type: 'DELETE_BUILD', buildId });
  }, [dispatch]);

  return (
    <motion.div
      className="flex-1 flex flex-col p-6 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Share Card Overlay */}
      <AnimatePresence>
        {selectedBuild && (
          <ShareCard build={selectedBuild} onClose={() => setSelectedBuild(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="text-surface-400 hover:text-white transition-colors p-2"
        >
          ← Back
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold">Build Gallery</h1>
          <p className="text-surface-400 text-sm">
            {state.savedBuilds.length} saved build{state.savedBuilds.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Gallery Content */}
      {state.savedBuilds.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 text-surface-400">
            <div className="text-6xl">🏆</div>
            <p>No builds saved yet.</p>
            <p className="text-sm">Complete a run to see your builds here!</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {state.savedBuilds.map((build, i) => {
            const tier = getScoreTier(build.score);
            const bestRarity = build.results.reduce((best, r) => {
              const order = [Rarity.Common, Rarity.Uncommon, Rarity.Rare, Rarity.Epic, Rarity.Legendary, Rarity.Mythic, Rarity.Forbidden];
              return order.indexOf(r.segment.rarity) > order.indexOf(best) ? r.segment.rarity : best;
            }, Rarity.Common);

            return (
              <motion.div
                key={build.id}
                className="bg-surface-100 border border-surface-300 rounded-xl p-4 space-y-2 cursor-pointer hover:border-accent/40 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedBuild(build)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display font-bold text-white">
                      {build.name}
                    </div>
                    <div className="text-xs text-surface-400 mt-0.5">
                      {new Date(build.createdAt).toLocaleDateString()} · {build.season}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-display font-bold text-lg ${tier.color}`}>
                      {tier.label}
                    </span>
                    <span className="text-sm text-rarity-legendary font-bold">
                      {build.score.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {build.results.slice(0, 4).map(r => (
                    <span
                      key={r.wheelId}
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${RARITY_BADGE[r.segment.rarity]}`}
                    >
                      {r.segment.label}
                    </span>
                  ))}
                  {build.results.length > 4 && (
                    <span className="text-[10px] text-surface-400">
                      +{build.results.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-surface-400">
                  <span>Best: <span className={RARITY_BADGE[bestRarity].split(' ')[1]}>{bestRarity}</span></span>
                  <span>Meme: {build.memePotential}%</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(build.id); }}
                    className="text-rarity-forbidden/60 hover:text-rarity-forbidden transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
