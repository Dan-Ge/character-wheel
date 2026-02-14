// ── Name Generator ──
// Procedurally generates character build names from tags and context.
// Produces evocative names like "Neon Paladin of Static Mercy"
// or "Temporal Lich, Bane of Circuits".

import type { BuildContext, SignatureCombo, Tag } from '../types';

// ─── Word Banks ───

/** Adjectives mapped by tag – each tag contributes themed adjectives */
const TAG_ADJECTIVES: Partial<Record<Tag, string[]>> = {
  fire: ['Blazing', 'Infernal', 'Scorching', 'Molten', 'Ashen'],
  ice: ['Frozen', 'Glacial', 'Frostbitten', 'Crystalline', 'Boreal'],
  void: ['Void-Touched', 'Hollow', 'Abyssal', 'Null', 'Unraveled'],
  tech: ['Augmented', 'Hardwired', 'Overclocked', 'Synthetic', 'Digital'],
  stealth: ['Silent', 'Phantom', 'Unseen', 'Lurking', 'Veiled'],
  tank: ['Ironclad', 'Unbreakable', 'Titanic', 'Fortified', 'Stalwart'],
  support: ['Benevolent', 'Radiant', 'Nurturing', 'Vigilant', 'Devoted'],
  summoner: ['Conjuring', 'Bound', 'Manifold', 'Pact-Sworn', 'Beckoning'],
  retro: ['Pixel', 'Vintage', 'Classic', '8-Bit', 'Retro'],
  arcane: ['Arcane', 'Mystical', 'Eldritch', 'Enchanted', 'Runic'],
  cyber: ['Neon', 'Chrome', 'Cybernetic', 'Wired', 'Holographic'],
  plasma: ['Charged', 'Ionized', 'Voltaic', 'Static', 'Arc-Born'],
  nature: ['Wild', 'Verdant', 'Primal', 'Thorned', 'Mossy'],
  psychic: ['Psionic', 'Mind-Bent', 'Telepathic', 'Lucid', 'Cerebral'],
  shadow: ['Dark', 'Umbral', 'Shrouded', 'Twilight', 'Obsidian'],
  holy: ['Divine', 'Sacred', 'Blessed', 'Celestial', 'Hallowed'],
  mecha: ['Mech-Clad', 'Titanforged', 'Iron', 'Colossal', 'Armored'],
  beast: ['Feral', 'Savage', 'Untamed', 'Primal', 'Beastborn'],
  speed: ['Swift', 'Blitz', 'Lightning', 'Fleet', 'Supersonic'],
  brute: ['Brutal', 'Crushing', 'Relentless', 'Raging', 'Thunderous'],
  charisma: ['Dazzling', 'Magnetic', 'Sovereign', 'Silver-Tongued', 'Resplendent'],
  precision: ['Precise', 'Surgical', 'Calibrated', 'Lethal', 'Pinpoint'],
  mutation: ['Mutant', 'Aberrant', 'Twisted', 'Evolved', 'Unstable'],
  cosmic: ['Stellar', 'Cosmic', 'Astral', 'Nebula-Born', 'Gravity-Bound'],
  necro: ['Deathbound', 'Spectral', 'Undying', 'Grave-Risen', 'Ghastly'],
  temporal: ['Temporal', 'Chrono', 'Timeless', 'Paradoxical', 'Epoch'],
};

/** Title nouns – the core identity */
const TAG_NOUNS: Partial<Record<Tag, string[]>> = {
  fire: ['Pyromancer', 'Firebrand', 'Ember Lord'],
  ice: ['Cryomancer', 'Frost Warden', 'Ice Sovereign'],
  void: ['Nullifier', 'Void King', 'Abyss Walker'],
  tech: ['Engineer', 'Architect', 'Technomancer'],
  stealth: ['Phantom', 'Shade', 'Ghost'],
  tank: ['Sentinel', 'Bulwark', 'Guardian'],
  support: ['Cleric', 'Warden', 'Mender'],
  summoner: ['Summoner', 'Binder', 'Herald'],
  retro: ['Pixel Knight', 'Retronaut', 'Arcade Hero'],
  arcane: ['Sorcerer', 'Mage', 'Arcanist'],
  cyber: ['Netrunner', 'Hacker', 'Data Knight'],
  plasma: ['Conduit', 'Arc Mage', 'Volt'],
  nature: ['Druid', 'Warden', 'Grove Keeper'],
  psychic: ['Psion', 'Mind Weaver', 'Oracle'],
  shadow: ['Wraith', 'Shadow Lord', 'Nightblade'],
  holy: ['Paladin', 'Cleric', 'Lightbringer'],
  mecha: ['Pilot', 'War Machine', 'Titan'],
  beast: ['Beastmaster', 'Fang', 'Alpha'],
  speed: ['Runner', 'Blitz', 'Dash'],
  brute: ['Berserker', 'Crusher', 'Juggernaut'],
  charisma: ['Sovereign', 'Orator', 'Idol'],
  precision: ['Marksman', 'Sharpshooter', 'Operative'],
  mutation: ['Mutant', 'Chimera', 'Aberration'],
  cosmic: ['Starborn', 'Celestial', 'Nova'],
  necro: ['Lich', 'Revenant', 'Bone Lord'],
  temporal: ['Chronomancer', 'Time Lord', 'Epoch Walker'],
};

/** Prepositions and connectors for the "of X" or "Bane of X" suffix */
const SUFFIXES = [
  'of the',
  'Bane of',
  'Heir to',
  'Born in',
  'Sworn to',
  'Beyond',
  'from',
  'Breaker of',
  'Child of',
  'Keeper of',
];

/** Abstract concepts used in suffix phrases */
const CONCEPTS = [
  'Ashes', 'Static', 'Mercy', 'Ruin', 'Stars',
  'Circuits', 'Storms', 'Silence', 'Time', 'Chaos',
  'Entropy', 'Light', 'Void', 'Iron', 'Pixels',
  'Dreams', 'Fury', 'Echoes', 'Thorns', 'Flames',
];

// ─── Main Generator ───

/**
 * Generate a procedural character build name.
 *
 * Structure: "[Adjective] [Noun][, Suffix Phrase]"
 * Examples:
 *   "Neon Paladin of Static Mercy"
 *   "Frostbitten Lich, Bane of Circuits"
 *   "Chromatic Berserker, Heir to Chaos"
 */
export function generateBuildName(
  tags: Tag[],
  signatureCombo: SignatureCombo | null,
  context: BuildContext
): string {
  // If there's a signature combo, use its name as base
  if (signatureCombo && signatureCombo.name && Math.random() > 0.4) {
    const suffix = pickSuffix(tags);
    return `${signatureCombo.name}${suffix}`;
  }

  // Pick adjective from a random collected tag
  const adjective = pickAdjective(tags);

  // Pick noun from a different tag (prefer dominant tag)
  const noun = pickNoun(tags);

  // Maybe add suffix
  const suffix = Math.random() > 0.35 ? pickSuffix(tags) : '';

  return `${adjective} ${noun}${suffix}`;
}

// ─── Pickers ───

function pickAdjective(tags: Tag[]): string {
  // Try to find adjectives from collected tags
  const candidates: string[] = [];
  for (const tag of tags) {
    const adjs = TAG_ADJECTIVES[tag];
    if (adjs) candidates.push(...adjs);
  }

  if (candidates.length === 0) {
    return 'Mysterious';
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function pickNoun(tags: Tag[]): string {
  const candidates: string[] = [];
  for (const tag of tags) {
    const nouns = TAG_NOUNS[tag];
    if (nouns) candidates.push(...nouns);
  }

  if (candidates.length === 0) {
    return 'Wanderer';
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function pickSuffix(tags: Tag[]): string {
  const connector = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const concept = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
  return `, ${connector} ${concept}`;
}

// ─── Deterministic Name (seeded) ───

/**
 * Generate a deterministic name using a simple hash.
 * Same seed + tags = same name always (for shared builds).
 */
export function generateDeterministicName(
  tags: Tag[],
  seed: string
): string {
  let hash = simpleHash(seed + tags.join(''));

  // Pick adjective
  const allAdjs: string[] = [];
  for (const tag of tags) {
    const adjs = TAG_ADJECTIVES[tag];
    if (adjs) allAdjs.push(...adjs);
  }
  const adjective = allAdjs.length > 0
    ? allAdjs[hash % allAdjs.length]
    : 'Mysterious';

  hash = simpleHash(String(hash));

  // Pick noun
  const allNouns: string[] = [];
  for (const tag of tags) {
    const nouns = TAG_NOUNS[tag];
    if (nouns) allNouns.push(...nouns);
  }
  const noun = allNouns.length > 0
    ? allNouns[hash % allNouns.length]
    : 'Wanderer';

  hash = simpleHash(String(hash));

  // Pick suffix
  const connector = SUFFIXES[hash % SUFFIXES.length];
  hash = simpleHash(String(hash));
  const concept = CONCEPTS[hash % CONCEPTS.length];

  return `${adjective} ${noun}, ${connector} ${concept}`;
}

/** Simple string hash (deterministic, not cryptographic) */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
