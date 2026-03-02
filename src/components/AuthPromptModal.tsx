// ── Auth Prompt Modal ──
// Contextual popup that encourages login/registration.
// Two variants:
//   1. "story" — shown when entering story mode (explains benefits)
//   2. "save"  — shown when navigating away without being logged in

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { generateHeroName } from '../utils/heroNames';

export type AuthPromptVariant = 'story' | 'save';

interface AuthPromptModalProps {
  variant: AuthPromptVariant;
  open: boolean;
  onClose: () => void;
  /** Called after successful login/register OR when user chooses to continue without account */
  onContinue: () => void;
}

const VARIANT_CONFIG: Record<AuthPromptVariant, {
  icon: string;
  title: string;
  description: string;
  skipLabel: string;
}> = {
  story: {
    icon: '📖',
    title: 'Story-Modus freischalten',
    description:
      'Melde dich an, um deinen Charakter dauerhaft zu speichern, Story-Fortschritte zu behalten und deine Helden in der Ruhmeshalle zu verewigen. Ohne Account geht dein Charakter nach dem Schließen verloren.',
    skipLabel: 'Ohne Account fortfahren',
  },
  save: {
    icon: '⚠️',
    title: 'Charakter nicht gespeichert!',
    description:
      'Ohne Anmeldung wird dein aktueller Charakter nicht gespeichert. Erstelle einen Account, um deine Helden sicher in der Cloud zu speichern und jederzeit weiterzuspielen.',
    skipLabel: 'Trotzdem fortfahren',
  },
};

type AuthMode = 'prompt' | 'login' | 'register';

export default function AuthPromptModal({ variant, open, onClose, onContinue }: AuthPromptModalProps) {
  const { login, register, error, clearError, loading, user } = usePlayer();

  const config = VARIANT_CONFIG[variant];
  const [mode, setMode] = useState<AuthMode>('prompt');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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
      onContinue();
    }
  }, [email, password, login, onContinue]);

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

  const handleSkip = useCallback(() => {
    onContinue();
  }, [onContinue]);

  // If user is already logged in, just continue
  if (user && open) {
    onContinue();
    return null;
  }

  const displayError = localError || error;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-sm bg-surface-100 border border-surface-300 rounded-2xl overflow-hidden z-10"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-surface-400 hover:text-white transition-colors z-20 text-lg"
            >
              ✕
            </button>

            <div className="p-6 space-y-5">
              {mode === 'prompt' && (
                <motion.div
                  key="prompt"
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <div className="text-4xl">{config.icon}</div>
                    <h2 className="font-display text-xl font-bold text-white">{config.title}</h2>
                    <p className="text-sm text-surface-500 leading-relaxed">{config.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={() => { resetForm(); setMode('register'); }}
                      className="w-full py-3 bg-linear-to-r from-neon-pink to-accent rounded-xl font-display font-bold text-white active:scale-95 transition-all"
                    >
                      🚀 Kostenlos registrieren
                    </button>
                    <button
                      onClick={() => { resetForm(); setMode('login'); }}
                      className="w-full py-3 bg-surface-200 border border-surface-300 rounded-xl font-display font-bold text-white hover:border-neon-cyan transition-all active:scale-95"
                    >
                      🎮 Ich habe bereits einen Account
                    </button>
                    <button
                      onClick={handleSkip}
                      className="w-full py-2 text-sm text-surface-400 hover:text-surface-500 transition-colors"
                    >
                      {config.skipLabel} →
                    </button>
                  </div>
                </motion.div>
              )}

              {mode === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <button
                    onClick={() => setMode('prompt')}
                    className="text-xs text-surface-500 hover:text-white mb-3"
                  >
                    ← Zurück
                  </button>
                  <h2 className="font-display text-lg font-bold text-white mb-4">Anmelden</h2>
                  <form onSubmit={handleLogin} className="space-y-4">
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
                  </form>
                </motion.div>
              )}

              {mode === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <button
                    onClick={() => setMode('prompt')}
                    className="text-xs text-surface-500 hover:text-white mb-3"
                  >
                    ← Zurück
                  </button>

                  {success ? (
                    <div className="text-center space-y-3 py-4">
                      <div className="text-4xl">✅</div>
                      <p className="text-neon-green font-bold text-lg">Registrierung erfolgreich!</p>
                      <p className="text-sm text-surface-500">
                        Prüfe deine E-Mail für den Bestätigungslink.
                        <br />
                        Dein zufälliger Heldenname wurde automatisch vergeben — du kannst ihn jederzeit in den Einstellungen ändern.
                      </p>
                      <button
                        type="button"
                        onClick={() => { resetForm(); setMode('login'); }}
                        className="text-neon-cyan underline text-sm"
                      >
                        Zur Anmeldung
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-display text-lg font-bold text-white mb-1">Registrieren</h2>
                      <p className="text-xs text-surface-500 mb-4">
                        Ein zufälliger Heldenname wird automatisch vergeben. Du kannst ihn später ändern.
                      </p>
                      <form onSubmit={handleRegister} className="space-y-4">
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
                      </form>
                    </>
                  )}
                </motion.div>
              )}

              {/* Error Display */}
              <AnimatePresence>
                {displayError && (
                  <motion.div
                    className="p-3 bg-rarity-forbidden/10 border border-rarity-forbidden/30 rounded-xl text-sm text-rarity-forbidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {displayError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
