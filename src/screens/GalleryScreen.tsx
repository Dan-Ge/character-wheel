import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function GalleryScreen() {
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
          <h1 className="font-display text-2xl font-bold">Build Gallery</h1>
          <p className="text-surface-400 text-sm">Your saved character builds</p>
        </div>
      </div>

      {/* Gallery Content Placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 text-surface-400">
          <div className="text-6xl">🏆</div>
          <p>No builds saved yet.</p>
          <p className="text-sm">Complete a run and save your build to see it here!</p>
        </div>
      </div>
    </motion.div>
  );
}
