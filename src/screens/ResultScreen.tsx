import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function ResultScreen() {
  const { dispatch } = useGame();

  return (
    <motion.div
      className="flex-1 flex flex-col items-center p-6 gap-6 overflow-y-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Build Name */}
      <div className="text-center space-y-2 pt-4">
        <div className="text-xs font-display text-neon-cyan uppercase tracking-widest">
          Build Complete
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-black bg-gradient-to-r from-rarity-legendary via-neon-orange to-rarity-legendary bg-clip-text text-transparent">
          Neon Paladin of Static Mercy
        </h1>
        <div className="text-surface-400 text-sm">
          Score: <span className="text-white font-bold">7,420</span> · Meme Potential: <span className="text-neon-pink font-bold">78%</span>
        </div>
      </div>

      {/* Result Cards Grid (Placeholder) */}
      <div className="w-full max-w-lg grid grid-cols-2 gap-3">
        {['Stats', 'Power', 'Gear', 'Companion', 'Origin', 'Flaw', 'Style'].map((wheel, i) => (
          <div
            key={wheel}
            className={`bg-surface-100 border border-surface-300 rounded-xl p-4 space-y-2 ${
              i === 6 ? 'col-span-2' : ''
            }`}
          >
            <div className="text-xs text-surface-400 uppercase">{wheel}</div>
            <div className="text-sm font-medium">Result Placeholder</div>
            <div className="text-xs text-surface-400">Lore snippet...</div>
          </div>
        ))}
      </div>

      {/* Signature Combo */}
      <div className="w-full max-w-lg bg-gradient-to-r from-surface-100 to-surface-200 border border-accent/30 rounded-xl p-4 space-y-2">
        <div className="text-xs font-display text-accent uppercase tracking-widest">
          ⚡ Signature Combo
        </div>
        <div className="font-bold">Placeholder Combo Name</div>
        <div className="text-sm text-surface-400">
          Combo description will appear here...
        </div>
      </div>

      {/* Weak Spot */}
      <div className="w-full max-w-lg bg-surface-100 border border-rarity-forbidden/30 rounded-xl p-4 space-y-2">
        <div className="text-xs font-display text-rarity-forbidden uppercase tracking-widest">
          💀 Weak Spot
        </div>
        <div className="text-sm text-surface-400">
          Weakness description will appear here...
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs pb-8">
        <button className="w-full py-3 bg-gradient-to-r from-neon-green to-neon-cyan rounded-xl font-display font-bold tracking-wide text-white active:scale-95 transition-all">
          📸 Share Build
        </button>
        <button className="w-full py-3 bg-surface-100 border border-surface-300 rounded-xl font-medium text-gray-300 hover:border-accent/50 active:scale-95 transition-all">
          💾 Save Build
        </button>
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'home' })}
          className="w-full py-3 text-surface-400 hover:text-white transition-colors text-sm"
        >
          ← New Run
        </button>
      </div>
    </motion.div>
  );
}
