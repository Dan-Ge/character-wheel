// ── Tag Registry ──
// All tags with categories, icons, colors, descriptions.
// Synergy groups define which tags "work well together".
// Conflict pairs define incompatible combinations.

import type { Tag } from '../types';

// ─── Tag Category ───

export type TagCategory =
  | 'element'    // Fire, Ice, Void, Plasma, Nature, Cosmic
  | 'archetype'  // Tank, Support, Stealth, Brute, Speed, Precision, Charisma
  | 'school'     // Arcane, Tech, Cyber, Mecha, Psychic, Mutation
  | 'domain'     // Shadow, Holy, Necro, Temporal, Summoner
  | 'aesthetic'  // Retro, Beast
  ;

// ─── Tag Config ───

export interface TagConfig {
  tag: Tag;
  label: string;
  category: TagCategory;
  icon: string;
  /** Hex color for visual representation */
  color: string;
  description: string;
}

// ─── All Tag Definitions ───

export const TAG_REGISTRY: Record<Tag, TagConfig> = {
  // ── Elements ──
  fire: {
    tag: 'fire',
    label: 'Fire',
    category: 'element',
    icon: '🔥',
    color: '#ef4444',
    description: 'Blazing power, destruction, and relentless aggression.',
  },
  ice: {
    tag: 'ice',
    label: 'Ice',
    category: 'element',
    icon: '❄️',
    color: '#38bdf8',
    description: 'Freezing control, slowing enemies, crystalline precision.',
  },
  void: {
    tag: 'void',
    label: 'Void',
    category: 'element',
    icon: '🌀',
    color: '#7c3aed',
    description: 'Nothingness made manifest. Erases, absorbs, unmakes.',
  },
  plasma: {
    tag: 'plasma',
    label: 'Plasma',
    category: 'element',
    icon: '⚡',
    color: '#06b6d4',
    description: 'Superheated energy arcs. Tech meets raw elemental fury.',
  },
  nature: {
    tag: 'nature',
    label: 'Nature',
    category: 'element',
    icon: '🌿',
    color: '#22c55e',
    description: 'Growth, regeneration, the unstoppable force of life.',
  },
  cosmic: {
    tag: 'cosmic',
    label: 'Cosmic',
    category: 'element',
    icon: '🌌',
    color: '#c084fc',
    description: 'Starborn energy. Gravity, radiation, celestial might.',
  },

  // ── Archetypes ──
  tank: {
    tag: 'tank',
    label: 'Tank',
    category: 'archetype',
    icon: '🛡️',
    color: '#64748b',
    description: 'Immovable object. Absorbs hits, protects allies.',
  },
  support: {
    tag: 'support',
    label: 'Support',
    category: 'archetype',
    icon: '💚',
    color: '#4ade80',
    description: 'Empowers others. Heals, buffs, creates opportunities.',
  },
  stealth: {
    tag: 'stealth',
    label: 'Stealth',
    category: 'archetype',
    icon: '🗡️',
    color: '#334155',
    description: 'Unseen and lethal. Strikes from shadow, vanishes at will.',
  },
  brute: {
    tag: 'brute',
    label: 'Brute',
    category: 'archetype',
    icon: '💪',
    color: '#dc2626',
    description: 'Raw physical might. Overwhelms with sheer force.',
  },
  speed: {
    tag: 'speed',
    label: 'Speed',
    category: 'archetype',
    icon: '💨',
    color: '#fbbf24',
    description: 'Blinding velocity. Strikes first, dodges everything.',
  },
  precision: {
    tag: 'precision',
    label: 'Precision',
    category: 'archetype',
    icon: '🎯',
    color: '#f97316',
    description: 'Surgical accuracy. Every hit counts, no wasted motion.',
  },
  charisma: {
    tag: 'charisma',
    label: 'Charisma',
    category: 'archetype',
    icon: '✨',
    color: '#f472b6',
    description: 'Force of personality. Inspires, deceives, commands.',
  },

  // ── Schools ──
  arcane: {
    tag: 'arcane',
    label: 'Arcane',
    category: 'school',
    icon: '🔮',
    color: '#8b5cf6',
    description: 'Ancient mystical arts. Spells, wards, reality bending.',
  },
  tech: {
    tag: 'tech',
    label: 'Tech',
    category: 'school',
    icon: '⚙️',
    color: '#0ea5e9',
    description: 'Engineering and gadgets. Drones, devices, upgrades.',
  },
  cyber: {
    tag: 'cyber',
    label: 'Cyber',
    category: 'school',
    icon: '🤖',
    color: '#22d3ee',
    description: 'Digital augmentation. Neural links, hacking, data streams.',
  },
  mecha: {
    tag: 'mecha',
    label: 'Mecha',
    category: 'school',
    icon: '🦾',
    color: '#94a3b8',
    description: 'Piloted war machines. Heavy armor, rocket-powered fists.',
  },
  psychic: {
    tag: 'psychic',
    label: 'Psychic',
    category: 'school',
    icon: '🧠',
    color: '#e879f9',
    description: 'Mind over matter. Telekinesis, telepathy, foresight.',
  },
  mutation: {
    tag: 'mutation',
    label: 'Mutation',
    category: 'school',
    icon: '🧬',
    color: '#84cc16',
    description: 'Biological transformation. Adaptation, evolution, chaos.',
  },

  // ── Domains ──
  shadow: {
    tag: 'shadow',
    label: 'Shadow',
    category: 'domain',
    icon: '🌑',
    color: '#1e293b',
    description: 'Darkness given form. Fears, illusions, the unseen.',
  },
  holy: {
    tag: 'holy',
    label: 'Holy',
    category: 'domain',
    icon: '☀️',
    color: '#fde047',
    description: 'Divine radiance. Smites evil, shields the righteous.',
  },
  necro: {
    tag: 'necro',
    label: 'Necro',
    category: 'domain',
    icon: '💀',
    color: '#65a30d',
    description: 'Death magic. Raises the fallen, drains life force.',
  },
  temporal: {
    tag: 'temporal',
    label: 'Temporal',
    category: 'domain',
    icon: '⏳',
    color: '#a78bfa',
    description: 'Time manipulation. Rewind, freeze, accelerate moments.',
  },
  summoner: {
    tag: 'summoner',
    label: 'Summoner',
    category: 'domain',
    icon: '👻',
    color: '#fb923c',
    description: 'Calls forth allies, constructs, and spirits to fight.',
  },

  // ── Aesthetics ──
  retro: {
    tag: 'retro',
    label: 'Retro',
    category: 'aesthetic',
    icon: '🕹️',
    color: '#f43f5e',
    description: 'Pixel nostalgia. 8-bit vibes, classic game energy.',
  },
  beast: {
    tag: 'beast',
    label: 'Beast',
    category: 'aesthetic',
    icon: '🐺',
    color: '#a16207',
    description: 'Primal instinct. Feral power, animal companions.',
  },
};

// ─── Synergy Groups ───
// Tags within the same group have natural affinity.
// When multiple tags from the same group appear in a build,
// synergy bonuses can trigger.

export interface SynergyGroup {
  id: string;
  name: string;
  tags: Tag[];
  description: string;
  /** Minimum tags from this group needed to trigger */
  minTags: number;
  /** Bonus score when synergy triggers */
  bonusScore: number;
}

export const SYNERGY_GROUPS: SynergyGroup[] = [
  {
    id: 'techno-mage',
    name: 'Techno-Mage',
    tags: ['tech', 'arcane', 'cyber'],
    description: 'Where circuits meet spellcraft – digital sorcery.',
    minTags: 2,
    bonusScore: 150,
  },
  {
    id: 'elemental-storm',
    name: 'Elemental Storm',
    tags: ['fire', 'ice', 'plasma', 'nature', 'cosmic'],
    description: 'Wielding multiple elements at once – catastrophic power.',
    minTags: 2,
    bonusScore: 120,
  },
  {
    id: 'shadow-operative',
    name: 'Shadow Operative',
    tags: ['stealth', 'shadow', 'precision', 'cyber'],
    description: 'Ghost in the machine. Unseen, precise, unstoppable.',
    minTags: 2,
    bonusScore: 130,
  },
  {
    id: 'juggernaut',
    name: 'Juggernaut',
    tags: ['tank', 'brute', 'mecha'],
    description: 'Unstoppable force meets immovable object.',
    minTags: 2,
    bonusScore: 140,
  },
  {
    id: 'void-walker',
    name: 'Void Walker',
    tags: ['void', 'temporal', 'cosmic', 'psychic'],
    description: 'Transcends reality itself. Exists between dimensions.',
    minTags: 2,
    bonusScore: 160,
  },
  {
    id: 'death-knight',
    name: 'Death Knight',
    tags: ['necro', 'shadow', 'tank', 'brute'],
    description: 'Risen warrior, fueled by death, clad in darkness.',
    minTags: 2,
    bonusScore: 150,
  },
  {
    id: 'bio-weapon',
    name: 'Bio-Weapon',
    tags: ['mutation', 'beast', 'nature', 'brute'],
    description: 'Evolution gone wrong – or very, very right.',
    minTags: 2,
    bonusScore: 130,
  },
  {
    id: 'chrono-agent',
    name: 'Chrono-Agent',
    tags: ['temporal', 'tech', 'speed', 'precision'],
    description: 'Time-bending operative. Always one step ahead.',
    minTags: 2,
    bonusScore: 145,
  },
  {
    id: 'divine-summoner',
    name: 'Divine Summoner',
    tags: ['holy', 'summoner', 'support', 'arcane'],
    description: 'Calls celestial beings to aid the righteous.',
    minTags: 2,
    bonusScore: 140,
  },
  {
    id: 'neon-fury',
    name: 'Neon Fury',
    tags: ['cyber', 'plasma', 'speed', 'fire'],
    description: 'Blazing through neon-lit streets at impossible speed.',
    minTags: 2,
    bonusScore: 135,
  },
  {
    id: 'retro-reboot',
    name: 'Retro Reboot',
    tags: ['retro', 'tech', 'mecha'],
    description: 'Classic vibes with modern firepower. 8-bit destruction.',
    minTags: 2,
    bonusScore: 110,
  },
  {
    id: 'mind-flayer',
    name: 'Mind Flayer',
    tags: ['psychic', 'void', 'shadow', 'charisma'],
    description: 'Breaks minds, bends wills, devours thoughts.',
    minTags: 2,
    bonusScore: 155,
  },
];

// ─── Conflict Pairs ───
// Tags that create tension or absurd paradoxes when combined.
// These can result in penalties, but also funny "Paradox Abilities".

export interface TagConflict {
  id: string;
  tags: [Tag, Tag];
  description: string;
  /** Score penalty (negative number) */
  penalty: number;
  /** If a paradox ability is generated from the conflict */
  paradoxName?: string;
  paradoxDescription?: string;
}

export const TAG_CONFLICTS: TagConflict[] = [
  {
    id: 'fire-ice',
    tags: ['fire', 'ice'],
    description: 'Burning and freezing at the same time. Uncomfortable.',
    penalty: -30,
    paradoxName: 'Thermal Paradox',
    paradoxDescription: 'Attacks randomly alternate between scorching and freezing, confusing everyone – including yourself.',
  },
  {
    id: 'holy-necro',
    tags: ['holy', 'necro'],
    description: 'Raising the dead while smiting evil. Theology gets complicated.',
    penalty: -40,
    paradoxName: 'Redemption Necromancy',
    paradoxDescription: 'Your undead minions are surprisingly wholesome and apologize before attacking.',
  },
  {
    id: 'stealth-brute',
    tags: ['stealth', 'brute'],
    description: 'Sneaking around while being the size of a truck.',
    penalty: -25,
    paradoxName: 'Gentle Giant Ambush',
    paradoxDescription: 'You hide behind objects half your size. It works because nobody believes what they are seeing.',
  },
  {
    id: 'tech-arcane',
    tags: ['tech', 'arcane'],
    description: 'Magic and science argue inside your head constantly.',
    penalty: -15,
    paradoxName: 'Blue Screen of Sorcery',
    paradoxDescription: 'Your spells occasionally crash and need to be rebooted. When they work, they work REALLY well.',
  },
  {
    id: 'shadow-holy',
    tags: ['shadow', 'holy'],
    description: 'The light casts the darkest shadow. Poetic, but impractical.',
    penalty: -35,
    paradoxName: 'Eclipse Form',
    paradoxDescription: 'You exist in perpetual twilight. Neither fully light nor dark, you make vampires AND angels uncomfortable.',
  },
  {
    id: 'speed-tank',
    tags: ['speed', 'tank'],
    description: 'Fast AND indestructible? Physics would like a word.',
    penalty: -20,
    paradoxName: 'Freight Train Mode',
    paradoxDescription: 'You can not stop once you start moving. Allies learn to dodge when you charge through.',
  },
  {
    id: 'charisma-void',
    tags: ['charisma', 'void'],
    description: 'You are deeply charming but also an embodiment of nothingness.',
    penalty: -30,
    paradoxName: 'Existential Magnetism',
    paradoxDescription: 'People are drawn to you despite (because of?) the crushing existential dread you radiate.',
  },
  {
    id: 'nature-cyber',
    tags: ['nature', 'cyber'],
    description: 'Organic growth meets digital precision. Vines in the server room.',
    penalty: -15,
    paradoxName: 'Digital Druid',
    paradoxDescription: 'You hack the planet – literally. Trees grow USB ports. Flowers bloom in binary patterns.',
  },
  {
    id: 'retro-temporal',
    tags: ['retro', 'temporal'],
    description: 'Stuck between nostalgic past and actual time travel.',
    penalty: -20,
    paradoxName: 'Anachronism Engine',
    paradoxDescription: 'You time-travel but only to decades with great aesthetics. Your power peaks in the 1980s.',
  },
  {
    id: 'psychic-beast',
    tags: ['psychic', 'beast'],
    description: 'A refined mind trapped in feral instincts.',
    penalty: -25,
    paradoxName: 'Primal Intellect',
    paradoxDescription: 'You solve quantum equations while howling at the moon. Your thesis defense involves biting.',
  },
];

// ─── Helper Functions ───

/** Get tag config */
export function getTagConfig(tag: Tag): TagConfig {
  return TAG_REGISTRY[tag];
}

/** Get all tags in a category */
export function getTagsByCategory(category: TagCategory): TagConfig[] {
  return Object.values(TAG_REGISTRY).filter(t => t.category === category);
}

/** Get all synergy groups that include a specific tag */
export function getSynergyGroupsForTag(tag: Tag): SynergyGroup[] {
  return SYNERGY_GROUPS.filter(g => g.tags.includes(tag));
}

/** Get all conflicts involving a specific tag */
export function getConflictsForTag(tag: Tag): TagConflict[] {
  return TAG_CONFLICTS.filter(c => c.tags.includes(tag));
}

/** Check if two tags are in the same synergy group */
export function areTagsSynergistic(a: Tag, b: Tag): boolean {
  return SYNERGY_GROUPS.some(g => g.tags.includes(a) && g.tags.includes(b));
}

/** Check if two tags conflict */
export function areTagsConflicting(a: Tag, b: Tag): boolean {
  return TAG_CONFLICTS.some(
    c => (c.tags[0] === a && c.tags[1] === b) || (c.tags[0] === b && c.tags[1] === a)
  );
}

/** Find active synergies given a set of collected tags */
export function findActiveSynergies(collectedTags: Tag[]): SynergyGroup[] {
  return SYNERGY_GROUPS.filter(group => {
    const matchCount = group.tags.filter(t => collectedTags.includes(t)).length;
    return matchCount >= group.minTags;
  });
}

/** Find active conflicts given a set of collected tags */
export function findActiveConflicts(collectedTags: Tag[]): TagConflict[] {
  return TAG_CONFLICTS.filter(
    c => collectedTags.includes(c.tags[0]) && collectedTags.includes(c.tags[1])
  );
}

/** Get the synergy bias weight boost for a tag based on collected tags */
export function getSynergyBiasForTag(tag: Tag, collectedTags: Tag[]): number {
  let bias = 0;
  for (const collected of collectedTags) {
    if (areTagsSynergistic(tag, collected)) {
      bias += 0.05; // +5% per synergistic tag match
    }
  }
  // Cap at 15% max bias
  return Math.min(bias, 0.15);
}
