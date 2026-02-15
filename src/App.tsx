import { AnimatePresence } from 'framer-motion';
import { useGame } from './context/GameContext';
import HomeScreen from './screens/HomeScreen';
import SpinScreen from './screens/SpinScreen';
import ResultScreen from './screens/ResultScreen';
import CodexScreen from './screens/CodexScreen';
import GalleryScreen from './screens/GalleryScreen';
import SettingsScreen from './screens/SettingsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import AchievementToast from './components/AchievementToast';

function AppContent() {
  const { state } = useGame();

  return (
    <div className="min-h-dvh bg-surface text-white flex flex-col relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent pointer-events-none" />

      {/* Achievement Toast - global overlay */}
      <AchievementToast />

      {/* Screen Router */}
      <AnimatePresence mode="wait">
        {state.currentScreen === 'home' && <HomeScreen key="home" />}
        {state.currentScreen === 'spin' && <SpinScreen key="spin" />}
        {state.currentScreen === 'result' && <ResultScreen key="result" />}
        {state.currentScreen === 'codex' && <CodexScreen key="codex" />}
        {state.currentScreen === 'gallery' && <GalleryScreen key="gallery" />}
        {state.currentScreen === 'settings' && <SettingsScreen key="settings" />}
        {state.currentScreen === 'leaderboard' && <LeaderboardScreen key="leaderboard" />}
        {state.currentScreen === 'achievements' && <AchievementsScreen key="achievements" />}
        {state.currentScreen === 'challenge' && <ChallengeScreen key="challenge" />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
