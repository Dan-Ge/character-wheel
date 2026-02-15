import { AnimatePresence } from 'framer-motion';
import { useGame } from './context/GameContext';
import { usePlayer } from './context/PlayerContext';
import { StoryProvider } from './story/StoryContext';
import LoginScreen from './screens/LoginScreen';
import CharacterSelectScreen from './screens/CharacterSelectScreen';
import HomeScreen from './screens/HomeScreen';
import SpinScreen from './screens/SpinScreen';
import ResultScreen from './screens/ResultScreen';
import StoryScreen from './screens/StoryScreen';
import CodexScreen from './screens/CodexScreen';
import GalleryScreen from './screens/GalleryScreen';
import SettingsScreen from './screens/SettingsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import AchievementToast from './components/AchievementToast';

function AppContent() {
  const { state } = useGame();
  const { user, loading } = usePlayer();

  // Show loading spinner while auth state is being resolved
  if (loading) {
    return (
      <div className="min-h-dvh bg-surface text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-spin">🎡</div>
          <p className="text-surface-500 font-display">Laden…</p>
        </div>
      </div>
    );
  }

  // Not logged in → show login screen
  if (!user) {
    return (
      <div className="min-h-dvh bg-surface text-white flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent pointer-events-none" />
        <LoginScreen />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface text-white flex flex-col relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent pointer-events-none" />

      {/* Achievement Toast - global overlay */}
      <AchievementToast />

      {/* Screen Router */}
      <AnimatePresence mode="wait">
        {state.currentScreen === 'character-select' && <CharacterSelectScreen key="char-select" />}
        {state.currentScreen === 'home' && <HomeScreen key="home" />}
        {state.currentScreen === 'spin' && <SpinScreen key="spin" />}
        {state.currentScreen === 'result' && <ResultScreen key="result" />}
        {state.currentScreen === 'story' && <StoryScreen key="story" />}
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
  return (
    <StoryProvider>
      <AppContent />
    </StoryProvider>
  );
}
