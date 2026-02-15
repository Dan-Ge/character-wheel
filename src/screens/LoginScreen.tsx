// ── Login Screen ──
// Standalone auth screen (accessible from settings / character-select).
// Registration auto-generates a random hero username.

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { useGame } from '../context/GameContext';
import { generateHeroName } from '../utils/heroNames';

type AuthTab = 'login' | 'register';

export default function LoginScreen() {
  const { login, register, error, clearError, loading } = usePlayer();
  const { dispatch } = useGame();

  const [tab, setTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const switchTab = useCallback((t: AuthTab) => {
    setTab(t);
    setLocalError(null);
    clearError();
    setSuccess(false);
  }, [clearError]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Bitte fülle alle Felder aus.');
      return;
    }

    const ok = await login(email.trim(), password);
    if (ok) {
      dispatch({ type: 'NAVIGATE', screen: 'home' });
    }
  }, [email, password, login, dispatch]);

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Bitte fülle alle Felder aus.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Die Passwörter stimmen nicht überein.');
      return;
    }

    const heroName = generateHeroName();
    const ok = await register(email.trim(), password, heroName);
    if (ok) {
      setSuccess(true);
    }
  }, [email, password, confirmPassword, register]);

  const handleBack = useCallback(() => {
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  }, [dispatch]);

  const displayError = localError || error;

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center p-6 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back button */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleBack}
          className="text-sm text-surface-400 hover:text-white transition-colors"
        >
          ← Zurück zum Spiel
        </button>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-wider bg-linear-to-r from-accent-light via-neon-cyan to-neon-pink bg-clip-text text-transparent">
          CHARACTER WHEEL
        </h1>
        <p className="text-surface-500 text-base">
          Spin your destiny. Build your legend.
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-sm bg-surface-100 border border-surface-300 rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-surface-300">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-3 text-sm font-display uppercase tracking-wider transition-colors ${
              tab === 'login'
                ? 'text-neon-cyan bg-surface-200 border-b-2 border-neon-cyan'
                : 'text-surface-500 hover:text-white'
            }`}
          >
            Anmelden
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 py-3 text-sm font-display uppercase tracking-wider transition-colors ${
              tab === 'register'
                ? 'text-neon-pink bg-surface-200 border-b-2 border-neon-pink'
                : 'text-surface-500 hover:text-white'
            }`}
          >
            Registrieren
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              <motion.form
                key="login"
                onSubmit={handleLogin}
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-1.5">
                  <label className="text-xs text-surface-500 uppercase tracking-wider font-bold">E-Mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="deine@email.de"
                    className="w-full px-4 py-3 bg-surface-200 border border-surface-300 rounded-xl text-white placeholder-surface-400 focus:border-neon-cyan focus:outline-none transition-colors"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-surface-500 uppercase tracking-wider font-bold">Passwort</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-surface-200 border border-surface-300 rounded-xl text-white placeholder-surface-400 focus:border-neon-cyan focus:outline-none transition-colors"
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-linear-to-r from-accent to-neon-cyan rounded-xl font-display font-bold text-white active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Laden...' : '🎮 Anmelden'}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                onSubmit={handleRegister}
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {success ? (
                  <div className="text-center space-y-3 py-4">
                    <div className="text-4xl">✅</div>
                    <p className="text-neon-green font-bold text-lg">Registrierung erfolgreich!</p>
                    <p className="text-sm text-surface-500">
                      Prüfe deine E-Mail für den Bestätigungslink.
                      <br />
                      Dein Heldenname wurde automatisch vergeben — du kannst ihn in den Einstellungen ändern.
                    </p>
                    <button
                      type="button"
                      onClick={() => switchTab('login')}
                      className="text-neon-cyan underline text-sm"
                    >
                      Zur Anmeldung
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-surface-500 leading-relaxed">
                      Ein zufälliger Heldenname wird dir automatisch zugewiesen. Du kannst ihn später in den Einstellungen ändern.
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-xs text-surface-500 uppercase tracking-wider font-bold">E-Mail</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="deine@email.de"
                        className="w-full px-4 py-3 bg-surface-200 border border-surface-300 rounded-xl text-white placeholder-surface-400 focus:border-neon-pink focus:outline-none transition-colors"
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-surface-500 uppercase tracking-wider font-bold">Passwort</label>
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Mind. 6 Zeichen"
                        className="w-full px-4 py-3 bg-surface-200 border border-surface-300 rounded-xl text-white placeholder-surface-400 focus:border-neon-pink focus:outline-none transition-colors"
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-surface-500 uppercase tracking-wider font-bold">Passwort bestätigen</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-surface-200 border border-surface-300 rounded-xl text-white placeholder-surface-400 focus:border-neon-pink focus:outline-none transition-colors"
                        autoComplete="new-password"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-linear-to-r from-neon-pink to-accent rounded-xl font-display font-bold text-white active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Laden...' : '🚀 Account erstellen'}
                    </button>
                  </>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                className="mt-4 p-3 bg-rarity-forbidden/10 border border-rarity-forbidden/30 rounded-xl text-sm text-rarity-forbidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {displayError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-surface-400/50 mt-2">
        Deine Charaktere werden sicher in der Cloud gespeichert.
      </div>
    </motion.div>
  );
}
