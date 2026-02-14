// ── SettingsScreen ──
// User settings, statistics overview, and data management.

import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame, type GameSettings, type GameStats } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { exportData, importData, getStorageSize, clearStorage } from '../utils/storage';
import type { CharacterBuild } from '../types';

function Toggle({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex items-center justify-between w-full py-3">
      <span className="text-sm text-gray-300">{label}</span>
      <div className={`w-10 h-5 rounded-full border relative transition-colors ${enabled ? 'bg-accent/20 border-accent' : 'bg-surface-200 border-surface-300'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${enabled ? 'left-5 bg-accent' : 'left-0.5 bg-surface-400'}`} />
      </div>
    </button>
  );
}

function StatRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-surface-400">{label}</span>
      <span className={`text-sm font-medium ${color ?? 'text-white'}`}>{value}</span>
    </div>
  );
}

export default function SettingsScreen() {
  const { state, dispatch } = useGame();
  const { play } = useSound();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [confirmClear, setConfirmClear] = useState(false);

  const handleBack = useCallback(() => {
    play('navigate');
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  }, [dispatch, play]);

  const handleToggle = useCallback((key: keyof GameSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { [key]: !state.settings[key] } });
  }, [dispatch, state.settings]);

  const handleExport = useCallback(() => {
    play('navigate');
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `character-wheel-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [play]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = importData(reader.result as string);
      if (result) {
        dispatch({
          type: 'IMPORT_DATA',
          builds: (result.savedBuilds ?? []) as CharacterBuild[],
          settings: (result.settings as GameSettings) ?? state.settings,
          stats: (result.stats as GameStats) ?? state.stats,
          codex: result.codexDiscovered ?? [],
        });
        setImportStatus('success');
        play('synergy');
      } else {
        setImportStatus('error');
        play('conflict');
      }
      setTimeout(() => setImportStatus('idle'), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [dispatch, play, state.settings, state.stats]);

  const handleClearAll = useCallback(() => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearStorage();
    dispatch({
      type: 'IMPORT_DATA',
      builds: [],
      settings: { soundEnabled: false, reducedMotion: false, draftModeDefault: false },
      stats: { totalRuns: 0, bestScore: 0, bestBuildName: '', totalSpins: 0, legendaryCount: 0, mythicCount: 0, forbiddenCount: 0, synergiesTriggered: 0, conflictsEncountered: 0, highestMeme: 0, firstRunDate: null, lastRunDate: null },
      codex: [],
    });
    setConfirmClear(false);
    play('forbidden');
  }, [confirmClear, dispatch, play]);

  const { stats } = state;

  return (
    <motion.div
      className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="text-surface-400 hover:text-white transition-colors p-2">
          ← Back
        </button>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
      </div>

      <div className="max-w-md mx-auto w-full space-y-6">

        {/* ── Preferences ── */}
        <section className="bg-surface-100 border border-surface-300 rounded-xl p-4 space-y-1">
          <h2 className="text-xs font-display text-accent uppercase tracking-widest mb-3">Preferences</h2>
          <Toggle label="🔊 Sound Effects" enabled={state.settings.soundEnabled} onToggle={() => handleToggle('soundEnabled')} />
          <Toggle label="🎭 Reduced Motion" enabled={state.settings.reducedMotion} onToggle={() => handleToggle('reducedMotion')} />
          <Toggle label="🃏 Draft Mode Default" enabled={state.settings.draftModeDefault} onToggle={() => handleToggle('draftModeDefault')} />
        </section>

        {/* ── Statistics ── */}
        <section className="bg-surface-100 border border-surface-300 rounded-xl p-4">
          <h2 className="text-xs font-display text-neon-cyan uppercase tracking-widest mb-3">Statistics</h2>
          <div className="space-y-0.5">
            <StatRow label="Total Runs" value={stats.totalRuns} />
            <StatRow label="Total Spins" value={stats.totalSpins} />
            <StatRow label="Best Score" value={stats.bestScore > 0 ? stats.bestScore.toLocaleString() : '—'} color="text-rarity-legendary" />
            <StatRow label="Best Build" value={stats.bestBuildName || '—'} color="text-rarity-legendary" />
            <StatRow label="Highest Meme" value={stats.highestMeme > 0 ? `${stats.highestMeme}%` : '—'} color="text-neon-pink" />
            <StatRow label="Legendaries Found" value={stats.legendaryCount} color="text-rarity-legendary" />
            <StatRow label="Mythics Found" value={stats.mythicCount} color="text-rarity-mythic" />
            <StatRow label="Forbidden Found" value={stats.forbiddenCount} color="text-rarity-forbidden" />
            <StatRow label="Segments Discovered" value={`${state.codexDiscovered.length}`} color="text-neon-cyan" />
            <StatRow label="Saved Builds" value={state.savedBuilds.length} />
            {stats.firstRunDate && (
              <StatRow label="Playing Since" value={new Date(stats.firstRunDate).toLocaleDateString()} />
            )}
          </div>
        </section>

        {/* ── Data Management ── */}
        <section className="bg-surface-100 border border-surface-300 rounded-xl p-4 space-y-3">
          <h2 className="text-xs font-display text-neon-orange uppercase tracking-widest mb-3">Data Management</h2>

          <div className="text-xs text-surface-400 flex justify-between">
            <span>Storage used</span>
            <span>{getStorageSize()}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 py-2 bg-surface-200 border border-surface-300 rounded-lg text-sm text-gray-300 hover:border-accent/50 active:scale-95 transition-all"
            >
              📤 Export
            </button>
            <button
              onClick={handleImport}
              className="flex-1 py-2 bg-surface-200 border border-surface-300 rounded-lg text-sm text-gray-300 hover:border-accent/50 active:scale-95 transition-all"
            >
              📥 Import
            </button>
          </div>

          {importStatus === 'success' && (
            <div className="text-xs text-neon-green text-center">✅ Import successful!</div>
          )}
          {importStatus === 'error' && (
            <div className="text-xs text-rarity-forbidden text-center">❌ Invalid file format</div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => { dispatch({ type: 'DELETE_ALL_BUILDS' }); play('navigate'); }}
              className="flex-1 py-2 bg-surface-200 border border-rarity-forbidden/30 rounded-lg text-sm text-rarity-forbidden/70 hover:text-rarity-forbidden hover:border-rarity-forbidden/50 active:scale-95 transition-all"
            >
              🗑️ Clear Builds
            </button>
            <button
              onClick={handleClearAll}
              className={`flex-1 py-2 rounded-lg text-sm active:scale-95 transition-all ${
                confirmClear
                  ? 'bg-rarity-forbidden/20 border border-rarity-forbidden text-rarity-forbidden font-bold'
                  : 'bg-surface-200 border border-rarity-forbidden/30 text-rarity-forbidden/70 hover:text-rarity-forbidden hover:border-rarity-forbidden/50'
              }`}
            >
              {confirmClear ? '⚠️ Confirm?' : '💣 Reset All'}
            </button>
          </div>
          {confirmClear && (
            <div className="text-[10px] text-rarity-forbidden/60 text-center">
              This will delete ALL data permanently. Click again to confirm.
            </div>
          )}
        </section>

      </div>
    </motion.div>
  );
}
