import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import ResultCard from '../components/ResultCard';
import ShareCard from '../components/ShareCard';
import { copyShareCode } from '../utils/share';

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const [showShare, setShowShare] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const build = state.savedBuilds[0] ?? null;

  const handleNewRun = useCallback(() => {
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  }, [dispatch]);

  const handleEnterStory = useCallback(() => {
    dispatch({ type: 'NAVIGATE', screen: 'story' });
  }, [dispatch]);

  const handleCopyCode = useCallback(async () => {
    if (!build) return;
    const ok = await copyShareCode(build);
    if (ok) {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  }, [build]);

  if (!build) {
    return (
      <motion.div
        className="flex-1 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center space-y-4 text-surface-400">
          <p>No build found.</p>
          <button onClick={handleNewRun} className="text-accent underline">Back to Home</button>
        </div>
      </motion.div>
    );
  }

  const scoreTier = build.score >= 8000 ? { label: 'S+', color: 'from-rarity-mythic via-neon-pink to-rarity-mythic' }
    : build.score >= 6000 ? { label: 'S', color: 'from-rarity-legendary via-neon-orange to-rarity-legendary' }
    : build.score >= 4500 ? { label: 'A', color: 'from-rarity-epic via-neon-violet to-rarity-epic' }
    : build.score >= 3000 ? { label: 'B', color: 'from-rarity-rare via-neon-cyan to-rarity-rare' }
    : build.score >= 1500 ? { label: 'C', color: 'from-rarity-uncommon via-rarity-uncommon to-rarity-uncommon' }
    : { label: 'D', color: 'from-surface-400 via-surface-400 to-surface-400' };

  return (
    <motion.div
      className="flex-1 flex flex-col items-center p-6 gap-6 overflow-y-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Share Card Overlay */}
      <AnimatePresence>
        {showShare && <ShareCard build={build} onClose={() => setShowShare(false)} />}
      </AnimatePresence>

      {/* Build Name */}
      <div className="text-center space-y-2 pt-4">
        <div className="text-xs font-display text-neon-cyan uppercase tracking-widest">
          Build Complete
        </div>
        <h1 className={`font-display text-3xl md:text-4xl font-black bg-linear-to-r ${scoreTier.color} bg-clip-text text-transparent`}>
          {build.name}
        </h1>
        <div className="text-surface-400 text-sm">
          Score: <span className="text-white font-bold">{build.score.toLocaleString()}</span>
          {' · '}Tier: <span className="text-white font-bold">{scoreTier.label}</span>
          {' · '}Meme: <span className="text-neon-pink font-bold">{build.memePotential}%</span>
        </div>
      </div>

      {/* Result Cards Grid */}
      <div className="w-full max-w-lg grid grid-cols-2 gap-3">
        {build.results.map((result, i) => (
          <div key={result.wheelId} className={i === build.results.length - 1 && build.results.length % 2 !== 0 ? 'col-span-2' : ''}>
            <ResultCard result={result} index={i} />
          </div>
        ))}
      </div>

      {/* Signature Combo */}
      {build.signatureCombo && (
        <motion.div
          className="w-full max-w-lg bg-linear-to-r from-surface-100 to-surface-200 border border-accent/30 rounded-xl p-4 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs font-display text-accent uppercase tracking-widest">
            ⚡ Signature Combo
          </div>
          <div className="font-bold">{build.signatureCombo.name}</div>
          <div className="text-sm text-surface-400">{build.signatureCombo.description}</div>
          <div className="text-xs text-rarity-legendary">
            Power: {build.signatureCombo.power}
          </div>
        </motion.div>
      )}

      {/* Weak Spot */}
      {build.weakSpot && (
        <motion.div
          className="w-full max-w-lg bg-surface-100 border border-rarity-forbidden/30 rounded-xl p-4 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-xs font-display text-rarity-forbidden uppercase tracking-widest">
            💀 Weak Spot
          </div>
          <div className="text-sm text-surface-400">{build.weakSpot}</div>
        </motion.div>
      )}

      {/* Tag Cloud */}
      {build.tags.length > 0 && (
        <div className="w-full max-w-lg flex flex-wrap gap-1.5 justify-center">
          {build.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-surface-200 text-surface-400 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs pb-8">
        <button
          onClick={handleEnterStory}
          className="w-full py-3 bg-linear-to-r from-neon-pink via-accent to-neon-violet rounded-xl font-display font-bold tracking-wide text-white active:scale-95 transition-all shadow-lg shadow-accent/20"
        >
          📖 Story starten
        </button>
        <button
          onClick={() => setShowShare(true)}
          className="w-full py-3 bg-linear-to-r from-neon-green to-neon-cyan rounded-xl font-display font-bold tracking-wide text-white active:scale-95 transition-all"
        >
          📸 Share Build
        </button>
        <button
          onClick={handleCopyCode}
          className="w-full py-3 bg-surface-100 border border-accent/30 rounded-xl font-medium text-sm text-gray-300 hover:border-accent/50 active:scale-95 transition-all"
        >
          {codeCopied ? '✅ Code Copied!' : `📋 Copy Code: ${build.shareCode}`}
        </button>
        <button
          onClick={handleNewRun}
          className="w-full py-3 bg-surface-100 border border-surface-300 rounded-xl font-medium text-gray-300 hover:border-accent/50 active:scale-95 transition-all"
        >
          ← New Run
        </button>
      </div>
    </motion.div>
  );
}
