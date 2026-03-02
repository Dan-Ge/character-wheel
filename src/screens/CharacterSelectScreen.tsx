// ── Character Select Screen ──
// Shows the player's characters in three sections:
//   1. Spielbare Charaktere (alive / injured / near_death / exiled / corrupted)
//   2. Ruhmeshalle (ascended / legendary / retired)
//   3. Friedhof (dead)
// Dead characters are shown grayed-out. Playable characters can enter the story.

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { useGame } from '../context/GameContext';
import {
  fetchPlayerCharacters,
  getPlayableCharacters,
  getGraveyardCharacters,
  getHallOfFameCharacters,
  type SavedCharacterRow,
} from '../services/characterService';

// ─── Status display helpers ───

const STATUS_EMOJI: Record<string, string> = {
  alive: '💚',
  injured: '🩹',
  near_death: '💔',
  dead: '💀',
  ascended: '✨',
  exiled: '🚫',
  corrupted: '🖤',
  legendary: '🏆',
  retired: '🏖️',
};

const STATUS_LABEL: Record<string, string> = {
  alive: 'Lebendig',
  injured: 'Verletzt',
  near_death: 'Todesnähe',
  dead: 'Tot',
  ascended: 'Aufgestiegen',
  exiled: 'Verbannt',
  corrupted: 'Korrumpiert',
  legendary: 'Legendär',
  retired: 'Im Ruhestand',
};

// ─── Character Card ───

function CharacterCard({
  character,
  playable,
  onSelect,
}: {
  character: SavedCharacterRow;
  playable: boolean;
  onSelect?: (c: SavedCharacterRow) => void;
}) {
  const build = character.build_data;
  const rarityColor = build.results[0]?.segment.rarity === 'legendary'
    ? 'border-rarity-legendary'
    : build.results[0]?.segment.rarity === 'mythic'
      ? 'border-rarity-mythic'
      : build.results[0]?.segment.rarity === 'forbidden'
        ? 'border-rarity-forbidden'
        : 'border-surface-300';

  const isHallOfFame = ['ascended', 'legendary', 'retired'].includes(character.status);
  const isDead = character.status === 'dead';

  return (
    <motion.button
      onClick={playable && onSelect ? () => onSelect(character) : undefined}
      disabled={!playable}
      className={`
        relative w-full text-left p-4 rounded-2xl border-2 transition-all
        ${isDead
          ? 'bg-surface-200/40 border-surface-300/50 opacity-60 cursor-not-allowed grayscale'
          : isHallOfFame
            ? 'bg-surface-100 border-neon-gold/60 cursor-default'
            : `bg-surface-100 ${rarityColor} hover:bg-surface-200 cursor-pointer active:scale-[0.98]`
        }
      `}
      whileHover={playable ? { scale: 1.02 } : {}}
      whileTap={playable ? { scale: 0.98 } : {}}
      layout
    >
      {/* Status Badge */}
      <span className="absolute top-2 right-2 text-lg" title={STATUS_LABEL[character.status]}>
        {STATUS_EMOJI[character.status] ?? '❓'}
      </span>

      {/* Name */}
      <h3 className={`font-display font-bold text-lg truncate pr-8 ${isDead ? 'text-surface-400' : 'text-white'}`}>
        {character.name}
      </h3>

      {/* Info row */}
      <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
        <span>Lvl {character.level}</span>
        <span>•</span>
        <span>{character.power_tier}</span>
        <span>•</span>
        <span>{character.score} Pkt.</span>
      </div>

      {/* Tags preview */}
      {build.tags && build.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {build.tags.slice(0, 5).map(tag => (
            <span
              key={tag}
              className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                isDead
                  ? 'bg-surface-300/30 text-surface-400 border-surface-400/30'
                  : 'bg-accent/10 text-accent-light border-accent/20'
              }`}
            >
              {tag}
            </span>
          ))}
          {build.tags.length > 5 && (
            <span className="text-[10px] text-surface-400">+{build.tags.length - 5}</span>
          )}
        </div>
      )}

      {/* Status label */}
      <div className={`mt-2 text-xs font-bold uppercase tracking-wider ${
        isDead ? 'text-rarity-forbidden/60' : isHallOfFame ? 'text-neon-gold' : 'text-neon-green/80'
      }`}>
        {STATUS_LABEL[character.status]}
      </div>
    </motion.button>
  );
}

// ─── Section ───

function Section({
  title,
  icon,
  characters,
  playable,
  onSelect,
  emptyText,
  colorClass = 'text-white',
}: {
  title: string;
  icon: string;
  characters: SavedCharacterRow[];
  playable: boolean;
  onSelect?: (c: SavedCharacterRow) => void;
  emptyText: string;
  colorClass?: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 w-full text-left font-display font-bold text-base uppercase tracking-wider ${colorClass}`}
      >
        <span className="text-xl">{icon}</span>
        <span>{title}</span>
        <span className="text-sm font-normal text-surface-500">({characters.length})</span>
        <span className="ml-auto text-xs text-surface-500">{open ? '▼' : '▶'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {characters.length === 0 ? (
              <p className="text-surface-500 text-sm col-span-full italic py-2">{emptyText}</p>
            ) : (
              characters.map(c => (
                <CharacterCard
                  key={c.id}
                  character={c}
                  playable={playable}
                  onSelect={onSelect}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Screen ───

export default function CharacterSelectScreen() {
  const { user, profile, logout } = usePlayer();
  const { dispatch } = useGame();

  const [characters, setCharacters] = useState<SavedCharacterRow[]>([]);
  const [loadingChars, setLoadingChars] = useState(true);

  // Fetch characters on mount
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setLoadingChars(true);

    fetchPlayerCharacters(user.id).then(rows => {
      if (!cancelled) {
        setCharacters(rows);
        setLoadingChars(false);
      }
    });

    return () => { cancelled = true; };
  }, [user]);

  const playable = getPlayableCharacters(characters);
  const graveyard = getGraveyardCharacters(characters);
  const hallOfFame = getHallOfFameCharacters(characters);

  // Select a character to continue their story
  const handleSelectCharacter = useCallback((_char: SavedCharacterRow) => {
    // TODO: Load the character into StoryContext and navigate to story screen
    // For now, navigate to story
    dispatch({ type: 'NAVIGATE', screen: 'story' });
  }, [dispatch]);

  // Start a new run (create new character via the wheel)
  const handleNewRun = useCallback(() => {
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  }, [dispatch]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return (
    <motion.div
      className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-2xl mx-auto w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-black tracking-wide text-white">
            Deine Charaktere
          </h1>
          {profile && (
            <p className="text-surface-500 text-sm mt-0.5">
              Spieler: <span className="text-neon-cyan font-bold">{profile.username}</span>
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-surface-500 hover:text-rarity-forbidden transition-colors px-3 py-1.5 border border-surface-300 rounded-lg"
        >
          Abmelden
        </button>
      </div>

      {/* New Run Button */}
      <motion.button
        onClick={handleNewRun}
        className="flex items-center justify-center gap-2 py-4 bg-linear-to-r from-accent to-neon-cyan rounded-2xl font-display font-bold text-lg text-white active:scale-[0.97] transition-transform"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="text-2xl">🎡</span>
        Neuen Charakter erstellen
      </motion.button>

      {/* Loading */}
      {loadingChars ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="text-3xl animate-spin">⚙️</div>
            <p className="text-surface-500 text-sm">Charaktere werden geladen…</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-6 overflow-y-auto pb-10">
          {/* Playable Characters */}
          <Section
            title="Spielbare Charaktere"
            icon="⚔️"
            characters={playable}
            playable
            onSelect={handleSelectCharacter}
            emptyText="Noch keine Charaktere. Starte einen neuen Run!"
            colorClass="text-neon-green"
          />

          {/* Hall of Fame */}
          {hallOfFame.length > 0 && (
            <Section
              title="Ruhmeshalle"
              icon="🏆"
              characters={hallOfFame}
              playable={false}
              emptyText=""
              colorClass="text-neon-gold"
            />
          )}

          {/* Graveyard */}
          {graveyard.length > 0 && (
            <Section
              title="Friedhof"
              icon="💀"
              characters={graveyard}
              playable={false}
              emptyText=""
              colorClass="text-surface-400"
            />
          )}
        </div>
      )}
    </motion.div>
  );
}
