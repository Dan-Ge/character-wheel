import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function CodexScreen() {
  const { dispatch } = useGame();

  return (
    <motion.div
      className="flex-1 flex flex-col p-6 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'home' })}
          className="text-surface-400 hover:text-white transition-colors p-2"
        >
          ← Back
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold">Codex</h1>
          <p className="text-surface-400 text-sm">Your collection of discovered items</p>
        </div>
      </div>

      {/* Codex Content Placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 text-surface-400">
          <div className="text-6xl">📖</div>
          <p>Your codex is empty.</p>
          <p className="text-sm">Complete runs to discover and collect items!</p>
        </div>
      </div>
    </motion.div>
  );
}
