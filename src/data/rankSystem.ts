// ── Rank & Progression System ──
// Defines rank ladders per world/background combination.
// Characters advance through ranks via story events, achievements, and encounters.
// Ranks unlock new story branches, alliances, and abilities.

import type { Tag } from '../types';

// ─── Rank Definition ───

export interface Rank {
  id: string;
  label: string;
  tier: number;          // 0 = lowest, higher = more powerful
  icon: string;
  description: string;
  /** Tags that this rank provides access to */
  unlockedTags: Tag[];
  /** Minimum XP required to reach this rank */
  minXp: number;
  /** Minimum level required */
  minLevel: number;
}

// ─── Rank Ladder = a sequence of ranks for a specific world/race combo ───

export interface RankLadder {
  id: string;
  name: string;
  /** Which world IDs this ladder applies to */
  worldIds: string[];
  /** Which race IDs this ladder applies to (empty = all races) */
  raceIds: string[];
  /** Which alignment IDs this ladder applies to (empty = all) */
  alignmentIds: string[];
  /** The ranks in order */
  ranks: Rank[];
}

// ═══════════════════════════════════════════════
// ─── Rank Ladders ───
// ═══════════════════════════════════════════════

export const RANK_LADDERS: RankLadder[] = [
  // ── Iron Kingdom: Military Path ──
  {
    id: 'kingdom-military',
    name: 'Militärischer Aufstieg',
    worldIds: ['world-iron-kingdom'],
    raceIds: ['race-human', 'race-orc', 'race-dwarf', 'race-elf'],
    alignmentIds: ['align-heroic', 'align-noble', 'align-neutral', 'align-ruthless'],
    ranks: [
      { id: 'rank-recruit', label: 'Rekrut', tier: 0, icon: '🔰', description: 'Ein Niemand mit einem Schwert.', unlockedTags: ['melee'], minXp: 0, minLevel: 1 },
      { id: 'rank-soldier', label: 'Soldat', tier: 1, icon: '⚔️', description: 'Trainiert und bereit.', unlockedTags: ['melee', 'heavy'], minXp: 50, minLevel: 2 },
      { id: 'rank-sergeant', label: 'Feldwebel', tier: 2, icon: '🎖️', description: 'Führe eine Einheit.', unlockedTags: ['melee', 'heavy', 'charisma'], minXp: 150, minLevel: 4 },
      { id: 'rank-knight', label: 'Ritter', tier: 3, icon: '🛡️', description: 'Ehre und Stahl.', unlockedTags: ['melee', 'heavy', 'charisma', 'holy'], minXp: 400, minLevel: 6 },
      { id: 'rank-commander', label: 'Kommandant', tier: 4, icon: '⭐', description: 'Befehlige Armeen.', unlockedTags: ['melee', 'heavy', 'charisma', 'holy', 'precision'], minXp: 800, minLevel: 9 },
      { id: 'rank-general', label: 'General', tier: 5, icon: '🌟', description: 'Stratege des Königreichs.', unlockedTags: ['melee', 'heavy', 'charisma', 'holy', 'precision', 'tank'], minXp: 1500, minLevel: 12 },
      { id: 'rank-kings-hand', label: 'Hand des Königs', tier: 6, icon: '👑', description: 'Zweitmächtigster im Reich.', unlockedTags: ['melee', 'heavy', 'charisma', 'holy', 'precision', 'tank', 'divine'], minXp: 3000, minLevel: 15 },
      { id: 'rank-king', label: 'König', tier: 7, icon: '🏰', description: 'Der Thron gehört dir.', unlockedTags: ['melee', 'heavy', 'charisma', 'holy', 'precision', 'tank', 'divine', 'cosmic'], minXp: 5000, minLevel: 18 },
    ],
  },

  // ── Iron Kingdom: Shadow Court (evil alignments) ──
  {
    id: 'kingdom-shadow',
    name: 'Schattenhof',
    worldIds: ['world-iron-kingdom'],
    raceIds: [],
    alignmentIds: ['align-dark-lord', 'align-cunning', 'align-chaotic'],
    ranks: [
      { id: 'rank-spy', label: 'Spion', tier: 0, icon: '🕵️', description: 'Unsichtbar und gefährlich.', unlockedTags: ['stealth'], minXp: 0, minLevel: 1 },
      { id: 'rank-informant', label: 'Informant', tier: 1, icon: '👁️', description: 'Augen und Ohren.', unlockedTags: ['stealth', 'precision'], minXp: 50, minLevel: 2 },
      { id: 'rank-assassin', label: 'Assassine', tier: 2, icon: '🗡️', description: 'Lautlos und tödlich.', unlockedTags: ['stealth', 'precision', 'shadow'], minXp: 150, minLevel: 4 },
      { id: 'rank-shadowmaster', label: 'Schattenmeister', tier: 3, icon: '🌑', description: 'Netzwerk der Schatten.', unlockedTags: ['stealth', 'precision', 'shadow', 'psychic'], minXp: 400, minLevel: 7 },
      { id: 'rank-puppeteer', label: 'Puppenspieler', tier: 4, icon: '🎭', description: 'Kontrolliere alles von hinten.', unlockedTags: ['stealth', 'precision', 'shadow', 'psychic', 'charisma'], minXp: 1000, minLevel: 10 },
      { id: 'rank-shadow-king', label: 'Schattenkönig', tier: 5, icon: '👤', description: 'Der wahre Herrscher.', unlockedTags: ['stealth', 'precision', 'shadow', 'psychic', 'charisma', 'cursed'], minXp: 3000, minLevel: 15 },
    ],
  },

  // ── Neon Nexus: Street Path ──
  {
    id: 'nexus-street',
    name: 'Straßenaufstieg',
    worldIds: ['world-neon-nexus'],
    raceIds: [],
    alignmentIds: [],
    ranks: [
      { id: 'rank-nobody', label: 'Niemand', tier: 0, icon: '🚶', description: 'Eine Nummer in der Masse.', unlockedTags: ['stealth'], minXp: 0, minLevel: 1 },
      { id: 'rank-runner', label: 'Runner', tier: 1, icon: '🏃', description: 'Botengänge und kleine Jobs.', unlockedTags: ['stealth', 'speed'], minXp: 50, minLevel: 2 },
      { id: 'rank-fixer', label: 'Fixer', tier: 2, icon: '🔧', description: 'Du kennst die richtigen Leute.', unlockedTags: ['stealth', 'speed', 'tech'], minXp: 150, minLevel: 4 },
      { id: 'rank-merc', label: 'Söldner', tier: 3, icon: '💀', description: 'Töte für Credits.', unlockedTags: ['stealth', 'speed', 'tech', 'precision'], minXp: 400, minLevel: 6 },
      { id: 'rank-underboss', label: 'Unterboss', tier: 4, icon: '🃏', description: 'Eigenes Territorium.', unlockedTags: ['stealth', 'speed', 'tech', 'precision', 'charisma'], minXp: 800, minLevel: 9 },
      { id: 'rank-crimelord', label: 'Crime Lord', tier: 5, icon: '🏙️', description: 'Die Stadt gehört dir.', unlockedTags: ['stealth', 'speed', 'tech', 'precision', 'charisma', 'cyber'], minXp: 1500, minLevel: 12 },
      { id: 'rank-netgod', label: 'Netz-Gott', tier: 6, icon: '🌐', description: 'Deine digitale Macht ist absolut.', unlockedTags: ['stealth', 'speed', 'tech', 'precision', 'charisma', 'cyber', 'psychic'], minXp: 3500, minLevel: 16 },
    ],
  },

  // ── Mystic Wildlands: Druid Path ──
  {
    id: 'wildlands-druid',
    name: 'Pfad der Wildnis',
    worldIds: ['world-mystic-wildlands'],
    raceIds: [],
    alignmentIds: [],
    ranks: [
      { id: 'rank-wanderer', label: 'Wanderer', tier: 0, icon: '🥾', description: 'Neu in der Wildnis.', unlockedTags: ['nature'], minXp: 0, minLevel: 1 },
      { id: 'rank-tracker', label: 'Fährtenleser', tier: 1, icon: '🐾', description: 'Die Natur zeigt dir den Weg.', unlockedTags: ['nature', 'beast'], minXp: 50, minLevel: 2 },
      { id: 'rank-beastfriend', label: 'Tierfreund', tier: 2, icon: '🐺', description: 'Tiere folgen dir.', unlockedTags: ['nature', 'beast', 'support'], minXp: 150, minLevel: 4 },
      { id: 'rank-shaman', label: 'Schamane', tier: 3, icon: '🌿', description: 'Geister sprechen zu dir.', unlockedTags: ['nature', 'beast', 'support', 'arcane'], minXp: 400, minLevel: 7 },
      { id: 'rank-elder', label: 'Ältester', tier: 4, icon: '🌳', description: 'Hüter des Waldes.', unlockedTags: ['nature', 'beast', 'support', 'arcane', 'holy'], minXp: 1000, minLevel: 10 },
      { id: 'rank-archdruid', label: 'Erzdruide', tier: 5, icon: '🌍', description: 'Die Natur selbst gehorcht dir.', unlockedTags: ['nature', 'beast', 'support', 'arcane', 'holy', 'cosmic'], minXp: 3000, minLevel: 15 },
    ],
  },

  // ── Shadow Undercity: Assassin Guild ──
  {
    id: 'undercity-guild',
    name: 'Gilde der Schatten',
    worldIds: ['world-shadow-undercity'],
    raceIds: [],
    alignmentIds: [],
    ranks: [
      { id: 'rank-initiate', label: 'Schüler', tier: 0, icon: '🔰', description: 'Lerne die Kunst des Schattens.', unlockedTags: ['stealth'], minXp: 0, minLevel: 1 },
      { id: 'rank-blade', label: 'Klinge', tier: 1, icon: '🔪', description: 'Leise. Effektiv.', unlockedTags: ['stealth', 'precision'], minXp: 50, minLevel: 2 },
      { id: 'rank-phantom', label: 'Phantom', tier: 2, icon: '👻', description: 'Niemand sieht dich kommen.', unlockedTags: ['stealth', 'precision', 'shadow'], minXp: 200, minLevel: 5 },
      { id: 'rank-executioner', label: 'Henker', tier: 3, icon: '⚰️', description: 'Dein Name flüstert den Tod.', unlockedTags: ['stealth', 'precision', 'shadow', 'brutal'], minXp: 500, minLevel: 8 },
      { id: 'rank-grandmaster', label: 'Großmeister', tier: 4, icon: '🗝️', description: 'Meister der Gilde.', unlockedTags: ['stealth', 'precision', 'shadow', 'brutal', 'psychic'], minXp: 1200, minLevel: 11 },
      { id: 'rank-shadow-lord', label: 'Fürst der Schatten', tier: 5, icon: '🌑', description: 'Selbst Götter fürchten dich.', unlockedTags: ['stealth', 'precision', 'shadow', 'brutal', 'psychic', 'void'], minXp: 3000, minLevel: 15 },
    ],
  },

  // ── Celestial Citadel: Paladin Path ──
  {
    id: 'citadel-paladin',
    name: 'Pfad des Lichts',
    worldIds: ['world-celestial-citadel'],
    raceIds: [],
    alignmentIds: ['align-heroic', 'align-noble', 'align-balance-keeper'],
    ranks: [
      { id: 'rank-acolyte', label: 'Akolyth', tier: 0, icon: '📿', description: 'Gebet und Training.', unlockedTags: ['holy'], minXp: 0, minLevel: 1 },
      { id: 'rank-templar', label: 'Templer', tier: 1, icon: '⚔️', description: 'Schwert des Glaubens.', unlockedTags: ['holy', 'melee'], minXp: 50, minLevel: 2 },
      { id: 'rank-paladin', label: 'Paladin', tier: 2, icon: '🛡️', description: 'Champion des Lichts.', unlockedTags: ['holy', 'melee', 'divine'], minXp: 200, minLevel: 5 },
      { id: 'rank-crusader', label: 'Kreuzritter', tier: 3, icon: '✝️', description: 'Heiliger Krieger.', unlockedTags: ['holy', 'melee', 'divine', 'tank'], minXp: 500, minLevel: 8 },
      { id: 'rank-high-templar', label: 'Hochtempelritter', tier: 4, icon: '⭐', description: 'Anführer der Heiligen Armee.', unlockedTags: ['holy', 'melee', 'divine', 'tank', 'charisma'], minXp: 1200, minLevel: 11 },
      { id: 'rank-archon', label: 'Archon', tier: 5, icon: '👼', description: 'Lebende Gottheit.', unlockedTags: ['holy', 'melee', 'divine', 'tank', 'charisma', 'cosmic'], minXp: 3000, minLevel: 15 },
    ],
  },

  // ── Volcanic Forge: Smith Path ──
  {
    id: 'forge-smith',
    name: 'Meisterschmied',
    worldIds: ['world-volcanic-forge'],
    raceIds: [],
    alignmentIds: [],
    ranks: [
      { id: 'rank-apprentice', label: 'Lehrling', tier: 0, icon: '🔨', description: 'Lerne das Feuer.', unlockedTags: ['fire'], minXp: 0, minLevel: 1 },
      { id: 'rank-smith', label: 'Schmied', tier: 1, icon: '⚒️', description: 'Forme das Metall.', unlockedTags: ['fire', 'heavy'], minXp: 50, minLevel: 2 },
      { id: 'rank-master-smith', label: 'Meisterschmied', tier: 2, icon: '🔥', description: 'Legendäre Waffen.', unlockedTags: ['fire', 'heavy', 'tech'], minXp: 200, minLevel: 5 },
      { id: 'rank-forgemaster', label: 'Schmiedemeister', tier: 3, icon: '🌋', description: 'Göttliche Rüstungen.', unlockedTags: ['fire', 'heavy', 'tech', 'mecha'], minXp: 500, minLevel: 8 },
      { id: 'rank-titansmith', label: 'Titanenschmied', tier: 4, icon: '⚡', description: 'Baue Kriegsmaschinen.', unlockedTags: ['fire', 'heavy', 'tech', 'mecha', 'cosmic'], minXp: 1500, minLevel: 12 },
    ],
  },

  // ── Abyssal Depths: Dark Path ──
  {
    id: 'abyss-dark',
    name: 'Pfad des Abgrunds',
    worldIds: ['world-abyssal-depths'],
    raceIds: [],
    alignmentIds: [],
    ranks: [
      { id: 'rank-crawler', label: 'Kriecher', tier: 0, icon: '🕷️', description: 'Überleben in der Dunkelheit.', unlockedTags: ['shadow'], minXp: 0, minLevel: 1 },
      { id: 'rank-shade', label: 'Schatten', tier: 1, icon: '🌑', description: 'Eins mit der Dunkelheit.', unlockedTags: ['shadow', 'necro'], minXp: 50, minLevel: 2 },
      { id: 'rank-wraith', label: 'Wraith', tier: 2, icon: '👻', description: 'Zwischen Leben und Tod.', unlockedTags: ['shadow', 'necro', 'void'], minXp: 200, minLevel: 5 },
      { id: 'rank-overlord', label: 'Overlord', tier: 3, icon: '💀', description: 'Herrscher der Tiefen.', unlockedTags: ['shadow', 'necro', 'void', 'cursed'], minXp: 600, minLevel: 8 },
      { id: 'rank-voidlord', label: 'Void Lord', tier: 4, icon: '🌀', description: 'Kosmische Finsternis.', unlockedTags: ['shadow', 'necro', 'void', 'cursed', 'cosmic'], minXp: 1500, minLevel: 12 },
      { id: 'rank-abyssal-god', label: 'Abgrund-Gott', tier: 5, icon: '🕳️', description: 'Das Nichts gehorcht dir.', unlockedTags: ['shadow', 'necro', 'void', 'cursed', 'cosmic', 'temporal'], minXp: 4000, minLevel: 16 },
    ],
  },

  // ── Arcane Academy: Mage Path ──
  {
    id: 'academy-mage',
    name: 'Arkaner Aufstieg',
    worldIds: ['world-arcane-academy'],
    raceIds: [],
    alignmentIds: [],
    ranks: [
      { id: 'rank-student', label: 'Student', tier: 0, icon: '📚', description: 'Lerne die Grundlagen.', unlockedTags: ['arcane'], minXp: 0, minLevel: 1 },
      { id: 'rank-mage', label: 'Magier', tier: 1, icon: '🪄', description: 'Beherrsche die Elemente.', unlockedTags: ['arcane', 'psychic'], minXp: 50, minLevel: 2 },
      { id: 'rank-wizard', label: 'Zauberer', tier: 2, icon: '🧙', description: 'Meister der Formel.', unlockedTags: ['arcane', 'psychic', 'cosmic'], minXp: 250, minLevel: 5 },
      { id: 'rank-archmage', label: 'Erzmagier', tier: 3, icon: '✨', description: 'Dekan einer Fakultät.', unlockedTags: ['arcane', 'psychic', 'cosmic', 'temporal'], minXp: 700, minLevel: 9 },
      { id: 'rank-grand-sorcerer', label: 'Großzauberer', tier: 4, icon: '🌟', description: 'Rektor der Akademie.', unlockedTags: ['arcane', 'psychic', 'cosmic', 'temporal', 'void'], minXp: 2000, minLevel: 13 },
      { id: 'rank-reality-weaver', label: 'Realitätsweber', tier: 5, icon: '🌌', description: 'Die Realität ist dein Spielzeug.', unlockedTags: ['arcane', 'psychic', 'cosmic', 'temporal', 'void', 'divine'], minXp: 5000, minLevel: 17 },
    ],
  },

  // ── Titan Foundry: Mech Pilot Path ──
  {
    id: 'foundry-pilot',
    name: 'Mech-Pilot Aufstieg',
    worldIds: ['world-titan-foundry'],
    raceIds: [],
    alignmentIds: [],
    ranks: [
      { id: 'rank-cadet', label: 'Kadett', tier: 0, icon: '🎮', description: 'Simulatortraining.', unlockedTags: ['tech'], minXp: 0, minLevel: 1 },
      { id: 'rank-pilot', label: 'Pilot', tier: 1, icon: '🤖', description: 'Erster Mech.', unlockedTags: ['tech', 'mecha'], minXp: 50, minLevel: 2 },
      { id: 'rank-ace', label: 'Ass', tier: 2, icon: '💫', description: 'Elite-Pilot.', unlockedTags: ['tech', 'mecha', 'precision'], minXp: 200, minLevel: 5 },
      { id: 'rank-commander-pilot', label: 'Kommandant', tier: 3, icon: '⭐', description: 'Führe ein Geschwader.', unlockedTags: ['tech', 'mecha', 'precision', 'heavy'], minXp: 500, minLevel: 8 },
      { id: 'rank-titan-lord', label: 'Titanenherr', tier: 4, icon: '🏗️', description: 'Steuere die größten Mechs.', unlockedTags: ['tech', 'mecha', 'precision', 'heavy', 'cosmic'], minXp: 1500, minLevel: 12 },
    ],
  },

  // ── Void Between / Creator's Throne: Cosmic Path (any race) ──
  {
    id: 'cosmic-path',
    name: 'Kosmischer Aufstieg',
    worldIds: ['world-void-between', 'world-creators-throne'],
    raceIds: [],
    alignmentIds: [],
    ranks: [
      { id: 'rank-awakened', label: 'Erwacht', tier: 0, icon: '👁️', description: 'Du siehst die Wahrheit.', unlockedTags: ['cosmic'], minXp: 0, minLevel: 1 },
      { id: 'rank-dimensional', label: 'Dimensional', tier: 1, icon: '🌀', description: 'Zwischen den Ebenen.', unlockedTags: ['cosmic', 'void'], minXp: 100, minLevel: 3 },
      { id: 'rank-planeswalker', label: 'Ebenenwandler', tier: 2, icon: '🌌', description: 'Reise durch Dimensionen.', unlockedTags: ['cosmic', 'void', 'temporal'], minXp: 300, minLevel: 6 },
      { id: 'rank-cosmic-entity', label: 'Kosmisches Wesen', tier: 3, icon: '✨', description: 'Jenseits der Sterblichkeit.', unlockedTags: ['cosmic', 'void', 'temporal', 'psychic'], minXp: 800, minLevel: 10 },
      { id: 'rank-god', label: 'Gott', tier: 4, icon: '🌟', description: 'Omnipotent.', unlockedTags: ['cosmic', 'void', 'temporal', 'psychic', 'divine'], minXp: 2500, minLevel: 14 },
      { id: 'rank-creator', label: 'Schöpfer', tier: 5, icon: '💎', description: 'Du erschaffst Realitäten.', unlockedTags: ['cosmic', 'void', 'temporal', 'psychic', 'divine', 'holy'], minXp: 6000, minLevel: 18 },
    ],
  },

  // ── Frozen Wastes: Survivalist Path ──
  {
    id: 'wastes-survivor',
    name: 'Überlebenskünstler',
    worldIds: ['world-frozen-wastes'],
    raceIds: [],
    alignmentIds: [],
    ranks: [
      { id: 'rank-lost', label: 'Verlorener', tier: 0, icon: '❄️', description: 'Frierend und allein.', unlockedTags: ['ice'], minXp: 0, minLevel: 1 },
      { id: 'rank-hunter', label: 'Jäger', tier: 1, icon: '🏹', description: 'Jage oder werde gejagt.', unlockedTags: ['ice', 'ranged'], minXp: 50, minLevel: 2 },
      { id: 'rank-chieftain', label: 'Häuptling', tier: 2, icon: '🐻', description: 'Führe deinen Stamm.', unlockedTags: ['ice', 'ranged', 'beast'], minXp: 200, minLevel: 5 },
      { id: 'rank-warlord', label: 'Kriegsfürst', tier: 3, icon: '⚔️', description: 'Vereinige die Stämme.', unlockedTags: ['ice', 'ranged', 'beast', 'brutal'], minXp: 600, minLevel: 8 },
      { id: 'rank-frost-king', label: 'Frostkönig', tier: 4, icon: '🧊', description: 'Herrscher des ewigen Eises.', unlockedTags: ['ice', 'ranged', 'beast', 'brutal', 'cosmic'], minXp: 2000, minLevel: 13 },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Rank Resolution Functions ───
// ═══════════════════════════════════════════════

/**
 * Find all matching rank ladders for a character's build.
 * Returns ladders where world, race, and alignment match.
 */
export function getMatchingLadders(
  worldId: string,
  raceId: string,
  alignmentId: string,
): RankLadder[] {
  return RANK_LADDERS.filter(ladder => {
    const worldMatch = ladder.worldIds.includes(worldId);
    const raceMatch  = ladder.raceIds.length === 0 || ladder.raceIds.includes(raceId);
    const alignMatch = ladder.alignmentIds.length === 0 || ladder.alignmentIds.includes(alignmentId);
    return worldMatch && raceMatch && alignMatch;
  });
}

/**
 * Determine the current rank for a character on a given ladder.
 */
export function getCurrentRank(ladder: RankLadder, xp: number, level: number): Rank {
  let bestRank = ladder.ranks[0];
  for (const rank of ladder.ranks) {
    if (xp >= rank.minXp && level >= rank.minLevel) {
      bestRank = rank;
    }
  }
  return bestRank;
}

/**
 * Get the next rank a character can achieve.
 * Returns null if at max rank.
 */
export function getNextRank(ladder: RankLadder, xp: number, level: number): Rank | null {
  const current = getCurrentRank(ladder, xp, level);
  const idx = ladder.ranks.indexOf(current);
  return idx < ladder.ranks.length - 1 ? ladder.ranks[idx + 1] : null;
}

/**
 * Get all tags unlocked by the character's current rank(s).
 */
export function getRankTags(
  worldId: string,
  raceId: string,
  alignmentId: string,
  xp: number,
  level: number,
): Tag[] {
  const ladders = getMatchingLadders(worldId, raceId, alignmentId);
  const tags = new Set<Tag>();
  for (const ladder of ladders) {
    const rank = getCurrentRank(ladder, xp, level);
    for (const tag of rank.unlockedTags) {
      tags.add(tag);
    }
  }
  return [...tags];
}
