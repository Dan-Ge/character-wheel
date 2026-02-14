import { AnimatePresence } from 'framer-motion';
import { useGame } from './context/GameContext';
import HomeScreen from './screens/HomeScreen';
import SpinScreen from './screens/SpinScreen';
import ResultScreen from './screens/ResultScreen';
import CodexScreen from './screens/CodexScreen';
import GalleryScreen from './screens/GalleryScreen';

function AppContent() {
  const { state } = useGame();

  return (
    <div className="min-h-dvh bg-surface text-white flex flex-col relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent pointer-events-none" />

      {/* Screen Router */}
      <AnimatePresence mode="wait">
        {state.currentScreen === 'home' && <HomeScreen key="home" />}
        {state.currentScreen === 'spin' && <SpinScreen key="spin" />}
        {state.currentScreen === 'result' && <ResultScreen key="result" />}
        {state.currentScreen === 'codex' && <CodexScreen key="codex" />}
        {state.currentScreen === 'gallery' && <GalleryScreen key="gallery" />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
