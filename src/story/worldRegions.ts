// ── World Regions ──
// All regions for Season 1: Cyber Mythic.
// Each region has dominant tags, danger levels, and connections.

import type { WorldRegion, RegionModifier } from '../types/storyTypes';

// ─── Region Modifiers ───

const NEON_BOOST: RegionModifier = {
  id: 'mod-neon-boost',
  name: 'Neon Overcharge',
  description: 'Cyber and plasma abilities are amplified in the neon glow.',
  boostedTags: ['cyber', 'plasma', 'tech'],
  weakenedTags: ['nature', 'holy'],
  checkModifier: 2,
};

const SHADOW_VEIL: RegionModifier = {
  id: 'mod-shadow-veil',
  name: 'Shadow Veil',
  description: 'Darkness empowers stealth but blinds the righteous.',
  boostedTags: ['shadow', 'stealth', 'necro'],
  weakenedTags: ['holy', 'fire'],
  checkModifier: -1,
};

const ARCANE_RESONANCE: RegionModifier = {
  id: 'mod-arcane-resonance',
  name: 'Arcane Resonance',
  description: 'Ancient magic lingers here, amplifying mystical abilities.',
  boostedTags: ['arcane', 'psychic', 'summoner'],
  weakenedTags: ['tech', 'cyber'],
  checkModifier: 1,
};

const VOID_PRESENCE: RegionModifier = {
  id: 'mod-void-presence',
  name: 'Void Presence',
  description: 'Reality thins. Void and cosmic powers surge dangerously.',
  boostedTags: ['void', 'cosmic', 'temporal'],
  weakenedTags: ['nature', 'beast'],
  checkModifier: -2,
};

const NATURE_SURGE: RegionModifier = {
  id: 'mod-nature-surge',
  name: 'Nature Surge',
  description: 'Life energy everywhere. Nature and beasts thrive.',
  boostedTags: ['nature', 'beast', 'mutation'],
  weakenedTags: ['cyber', 'mecha'],
  checkModifier: 1,
};

// ─── World Regions ───

export const WORLD_REGIONS: WorldRegion[] = [
  {
    id: 'region-neon-nexus',
    name: 'Neon Nexus',
    description: 'The sprawling cyberpunk megacity. Neon lights paint everything in electric color. Corporations rule the upper levels; gangs rule below.',
    biome: 'neon_city',
    dangerLevel: 3,
    dominantTags: ['cyber', 'tech', 'stealth', 'plasma'],
    connections: ['region-shadow-undercity', 'region-mecha-foundry', 'region-deep-net'],
    unlocked: true, // Starting region
    modifiers: [NEON_BOOST],
    npcIds: [],
    playerIds: [],
    visualTheme: 'neon-city',
  },
  {
    id: 'region-shadow-undercity',
    name: 'Shadow Undercity',
    description: 'Beneath Neon Nexus lies a labyrinth of forgotten tunnels, black markets, and things that prefer the dark.',
    biome: 'shadow_forest',
    dangerLevel: 5,
    dominantTags: ['shadow', 'stealth', 'necro', 'charisma'],
    connections: ['region-neon-nexus', 'region-ancient-temple', 'region-underworld'],
    unlocked: true,
    modifiers: [SHADOW_VEIL],
    npcIds: [],
    playerIds: [],
    visualTheme: 'dark-underground',
  },
  {
    id: 'region-crystal-wastes',
    name: 'Crystal Wastes',
    description: 'An endless desert of crystallized mana. The sand hums with raw magical energy. Sandstorms can grant power — or obliterate.',
    biome: 'crystal_wastes',
    dangerLevel: 6,
    dominantTags: ['arcane', 'cosmic', 'fire', 'precision'],
    connections: ['region-ancient-temple', 'region-sky-citadel'],
    unlocked: false,
    modifiers: [ARCANE_RESONANCE],
    npcIds: [],
    playerIds: [],
    visualTheme: 'crystal-desert',
  },
  {
    id: 'region-ancient-temple',
    name: 'Temple of Forgotten Gods',
    description: 'Ruins of a civilization that worshipped beings from beyond the stars. The walls still whisper prayers.',
    biome: 'ancient_temple',
    dangerLevel: 7,
    dominantTags: ['holy', 'arcane', 'shadow', 'summoner'],
    connections: ['region-shadow-undercity', 'region-crystal-wastes', 'region-void-rift'],
    unlocked: false,
    modifiers: [ARCANE_RESONANCE],
    npcIds: [],
    playerIds: [],
    visualTheme: 'ancient-ruins',
  },
  {
    id: 'region-mecha-foundry',
    name: 'Titan Foundry',
    description: 'Massive factory complexes where war machines are born. Steam, sparks, and the sound of hammering metal everywhere.',
    biome: 'mecha_foundry',
    dangerLevel: 5,
    dominantTags: ['mecha', 'tech', 'brute', 'tank'],
    connections: ['region-neon-nexus', 'region-sky-citadel'],
    unlocked: false,
    modifiers: [NEON_BOOST],
    npcIds: [],
    playerIds: [],
    visualTheme: 'industrial-forge',
  },
  {
    id: 'region-wild-sprawl',
    name: 'Wild Sprawl',
    description: 'Where nature reclaimed the abandoned suburbs. Mutated wildlife roams freely. The trees have opinions.',
    biome: 'shadow_forest',
    dangerLevel: 4,
    dominantTags: ['nature', 'beast', 'mutation', 'support'],
    connections: ['region-neon-nexus', 'region-crystal-wastes'],
    unlocked: false,
    modifiers: [NATURE_SURGE],
    npcIds: [],
    playerIds: [],
    visualTheme: 'overgrown-city',
  },
  {
    id: 'region-sky-citadel',
    name: 'Sky Citadel',
    description: 'A floating fortress above the clouds. Home to the elite — and those who defy them.',
    biome: 'sky_citadel',
    dangerLevel: 8,
    dominantTags: ['holy', 'cosmic', 'speed', 'charisma'],
    connections: ['region-crystal-wastes', 'region-mecha-foundry', 'region-cosmic-shore'],
    unlocked: false,
    modifiers: [],
    npcIds: [],
    playerIds: [],
    visualTheme: 'sky-fortress',
  },
  {
    id: 'region-deep-net',
    name: 'The Deep Net',
    description: 'A digital dimension. Everything is data. Thought becomes reality. Viruses are monsters. Firewalls are fortresses.',
    biome: 'deep_net',
    dangerLevel: 6,
    dominantTags: ['cyber', 'psychic', 'tech', 'temporal'],
    connections: ['region-neon-nexus', 'region-void-rift'],
    unlocked: false,
    modifiers: [NEON_BOOST],
    npcIds: [],
    playerIds: [],
    visualTheme: 'digital-matrix',
  },
  {
    id: 'region-void-rift',
    name: 'Void Rift',
    description: 'A tear in reality. The space between dimensions. Here, the laws of physics are suggestions.',
    biome: 'void_rift',
    dangerLevel: 9,
    dominantTags: ['void', 'cosmic', 'temporal', 'psychic'],
    connections: ['region-ancient-temple', 'region-deep-net', 'region-cosmic-shore'],
    unlocked: false,
    modifiers: [VOID_PRESENCE],
    npcIds: [],
    playerIds: [],
    visualTheme: 'void-dimension',
  },
  {
    id: 'region-cosmic-shore',
    name: 'Cosmic Shore',
    description: 'The edge of the known universe. Stars are close enough to touch. Time flows in all directions.',
    biome: 'cosmic_shore',
    dangerLevel: 10,
    dominantTags: ['cosmic', 'void', 'temporal', 'mutation'],
    connections: ['region-sky-citadel', 'region-void-rift'],
    unlocked: false,
    modifiers: [VOID_PRESENCE],
    npcIds: [],
    playerIds: [],
    visualTheme: 'edge-of-universe',
  },
  {
    id: 'region-underworld',
    name: 'The Underworld',
    description: 'Where dead characters go. But death is not always the end...',
    biome: 'underworld',
    dangerLevel: 10,
    dominantTags: ['necro', 'shadow', 'void', 'psychic'],
    connections: ['region-shadow-undercity'],
    unlocked: false,
    modifiers: [SHADOW_VEIL, VOID_PRESENCE],
    npcIds: [],
    playerIds: [],
    visualTheme: 'death-realm',
  },
];

// ─── Helpers ───

export function getRegion(id: string): WorldRegion | undefined {
  return WORLD_REGIONS.find((r) => r.id === id);
}

export function getStartingRegions(): WorldRegion[] {
  return WORLD_REGIONS.filter((r) => r.unlocked);
}

export function getConnectedRegions(regionId: string): WorldRegion[] {
  const region = getRegion(regionId);
  if (!region) return [];
  return WORLD_REGIONS.filter((r) => region.connections.includes(r.id));
}

export function getRegionsByDanger(maxDanger: number): WorldRegion[] {
  return WORLD_REGIONS.filter((r) => r.dangerLevel <= maxDanger);
}

export function getRegionTagBoost(regionId: string, tag: import('../types').Tag): number {
  const region = getRegion(regionId);
  if (!region) return 0;
  let boost = 0;
  for (const mod of region.modifiers) {
    if (mod.boostedTags.includes(tag)) boost += mod.checkModifier;
    if (mod.weakenedTags.includes(tag)) boost -= Math.abs(mod.checkModifier);
  }
  return boost;
}
