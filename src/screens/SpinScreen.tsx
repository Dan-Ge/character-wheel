import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function SpinScreen() {
  const { state, dispatch } = useGame();

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center p-6 gap-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'home' })}
          className="text-surface-400 hover:text-white transition-colors p-2"
        >
          ← Back
        </button>
        <div className="text-center">
          <div className="font-display text-xs text-neon-cyan uppercase tracking-widest">
            Wheel {state.currentWheelIndex + 1} / 7
          </div>
          <div className="text-sm text-surface-400 mt-1">
            Stats Wheel
          </div>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Wheel Placeholder */}
      <div className="relative w-72 h-72 md:w-96 md:h-96">
        <div className="absolute inset-0 rounded-full border-4 border-surface-300 bg-surface-100 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-4xl">🎡</div>
            <p className="text-surface-400 text-sm px-8">
              Wheel component will be<br />rendered here
            </p>
          </div>
        </div>
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-2xl">
          ▼
        </div>
      </div>

      {/* Spin Button */}
      <button
        className="w-full max-w-xs py-5 bg-gradient-to-r from-accent to-accent-light rounded-2xl font-display font-bold text-xl tracking-widest text-white shadow-lg shadow-accent/30 hover:shadow-accent/50 active:scale-95 transition-all duration-200"
      >
        SPIN
      </button>

      {/* Overclock Toggle */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-surface-400">Overclock</span>
        <div className="w-12 h-6 bg-surface-200 rounded-full border border-surface-300 cursor-pointer relative">
          <div className="absolute left-1 top-1 w-4 h-4 bg-surface-400 rounded-full transition-transform" />
        </div>
      </div>

      {/* Collected Results (mini cards) */}
      <div className="w-full max-w-md">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-shrink-0 w-16 h-20 bg-surface-100 border border-surface-300 rounded-lg flex items-center justify-center text-surface-400 text-xs text-center p-1">
            Slot 1
          </div>
          <div className="flex-shrink-0 w-16 h-20 bg-surface-100 border border-dashed border-surface-300 rounded-lg flex items-center justify-center text-surface-400/50 text-xs">
            ?
          </div>
          <div className="flex-shrink-0 w-16 h-20 bg-surface-100 border border-dashed border-surface-300 rounded-lg flex items-center justify-center text-surface-400/50 text-xs">
            ?
          </div>
          <div className="flex-shrink-0 w-16 h-20 bg-surface-100 border border-dashed border-surface-300 rounded-lg flex items-center justify-center text-surface-400/50 text-xs">
            ?
          </div>
          <div className="flex-shrink-0 w-16 h-20 bg-surface-100 border border-dashed border-surface-300 rounded-lg flex items-center justify-center text-surface-400/50 text-xs">
            ?
          </div>
          <div className="flex-shrink-0 w-16 h-20 bg-surface-100 border border-dashed border-surface-300 rounded-lg flex items-center justify-center text-surface-400/50 text-xs">
            ?
          </div>
          <div className="flex-shrink-0 w-16 h-20 bg-surface-100 border border-dashed border-surface-300 rounded-lg flex items-center justify-center text-surface-400/50 text-xs">
            ?
          </div>
        </div>
      </div>
    </motion.div>
  );
}
