import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function HomeScreen() {
  const { dispatch } = useGame();

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center p-6 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo / Title */}
      <div className="text-center space-y-3">
        <h1 className="font-display text-5xl md:text-7xl font-black tracking-wider bg-gradient-to-r from-accent-light via-neon-cyan to-neon-pink bg-clip-text text-transparent">
          CHARACTER WHEEL
        </h1>
        <p className="text-surface-400 text-lg md:text-xl font-medium">
          Spin your destiny. Build your legend.
        </p>
      </div>

      {/* Season Preview (Placeholder) */}
      <div className="w-full max-w-md">
        <div className="bg-surface-100 rounded-2xl border border-surface-300 p-6 text-center space-y-4">
          <div className="text-sm text-neon-cyan font-display uppercase tracking-widest">
            Season 1
          </div>
          <h2 className="text-2xl font-bold">Cyber-Mythic</h2>
          <p className="text-surface-400 text-sm">
            Where ancient myths collide with neon circuits.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {['🔥 Fire', '⚡ Tech', '🌀 Void', '🧬 Mutation', '✨ Arcane'].map(tag => (
              <span key={tag} className="bg-surface-200 px-2 py-1 rounded-full text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'spin' })}
          className="w-full py-4 px-6 bg-gradient-to-r from-accent to-neon-pink rounded-xl font-display font-bold text-lg tracking-wide text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-95 transition-all duration-200"
        >
          START RUN
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', screen: 'codex' })}
            className="flex-1 py-3 px-4 bg-surface-100 border border-surface-300 rounded-xl font-medium text-sm text-gray-300 hover:border-accent/50 hover:text-white active:scale-95 transition-all duration-200"
          >
            📖 Codex
          </button>
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', screen: 'gallery' })}
            className="flex-1 py-3 px-4 bg-surface-100 border border-surface-300 rounded-xl font-medium text-sm text-gray-300 hover:border-accent/50 hover:text-white active:scale-95 transition-all duration-200"
          >
            🏆 Gallery
          </button>
        </div>
      </div>

      {/* Game Mode Selector (Placeholder) */}
      <div className="flex gap-2 text-xs text-surface-400">
        <span className="bg-surface-200 px-3 py-1 rounded-full border border-surface-300 cursor-pointer hover:border-accent/50 hover:text-white transition-colors">
          Normal
        </span>
        <span className="bg-surface-200 px-3 py-1 rounded-full border border-surface-300 cursor-pointer hover:border-neon-pink/50 hover:text-neon-pink transition-colors">
          ☠️ Cursed
        </span>
        <span className="bg-surface-200 px-3 py-1 rounded-full border border-surface-300 cursor-pointer hover:border-neon-cyan/50 hover:text-neon-cyan transition-colors">
          🃏 Draft
        </span>
      </div>

      {/* Footer */}
      <div className="text-xs text-surface-400/50 mt-auto pt-8">
        v0.1.0 · Season 1: Cyber-Mythic
      </div>
    </motion.div>
  );
}
