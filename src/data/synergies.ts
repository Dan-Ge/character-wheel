// ── Synergy Rules ──
// Gameplay-level synergy rules that map tag combinations to concrete effects.
// These are evaluated by the Rules Resolver after each spin.
// They consume the raw tag data from tags.ts/SYNERGY_GROUPS and translate it
// into SynergyRule objects the engine understands.

import type { SynergyRule, Tag } from '../types';

// ─── Full Synergy Rule Definitions ───

export const SYNERGY_RULES: SynergyRule[] = [
  // ── Techno-Mage ──
  {
    id: 'syn-techno-mage',
    requiredTags: ['tech', 'arcane', 'cyber'] as Tag[],
    minMatches: 2,
    effect: 'All ability cooldowns reduced. Spells compile faster.',
    bonusScore: 150,
    description: 'Where circuits meet spellcraft – digital sorcery.',
    comboName: 'Techno-Mage',
    styleUpgrade: 'Circuit runes glow along your arms; holographic arcane sigils orbit your head.',
  },

  // ── Elemental Storm ──
  {
    id: 'syn-elemental-storm',
    requiredTags: ['fire', 'ice', 'plasma', 'nature', 'cosmic'] as Tag[],
    minMatches: 2,
    effect: 'Elemental attacks chain between targets. Nature heals, fire burns, ice slows.',
    bonusScore: 120,
    description: 'Wielding multiple elements at once – catastrophic power.',
    comboName: 'Elemental Storm',
    styleUpgrade: 'A swirling vortex of clashing elements perpetually surrounds you.',
  },

  // ── Shadow Operative ──
  {
    id: 'syn-shadow-operative',
    requiredTags: ['stealth', 'shadow', 'precision', 'cyber'] as Tag[],
    minMatches: 2,
    effect: 'First strike from stealth deals triple damage. Crit rate doubled.',
    bonusScore: 130,
    description: 'Ghost in the machine. Unseen, precise, unstoppable.',
    comboName: 'Shadow Operative',
    styleUpgrade: 'Your silhouette glitches and flickers; afterimages trail behind you.',
  },

  // ── Juggernaut ──
  {
    id: 'syn-juggernaut',
    requiredTags: ['tank', 'brute', 'mecha'] as Tag[],
    minMatches: 2,
    effect: 'Crowd control immunity. Charge attacks cannot be blocked.',
    bonusScore: 140,
    description: 'Unstoppable force meets immovable object.',
    comboName: 'Juggernaut',
    styleUpgrade: 'Mechanical plating erupts from your skin; the ground shakes when you walk.',
  },

  // ── Cosmic Horror ──
  {
    id: 'syn-cosmic-horror',
    requiredTags: ['void', 'cosmic', 'psychic', 'shadow'] as Tag[],
    minMatches: 2,
    effect: 'Sanity-draining aura. Enemies lose accuracy and may flee in terror.',
    bonusScore: 170,
    description: 'Incomprehensible power from beyond the stars.',
    comboName: 'Cosmic Horror',
    styleUpgrade: 'Your eyes become starfields; tentacles of void energy drift behind you.',
  },

  // ── Void Walker ──
  {
    id: 'syn-void-walker',
    requiredTags: ['void', 'temporal', 'cosmic', 'psychic'] as Tag[],
    minMatches: 2,
    effect: 'Phase through solid matter. Teleport short distances as standard movement.',
    bonusScore: 160,
    description: 'Transcends reality itself. Exists between dimensions.',
    comboName: 'Void Walker',
    styleUpgrade: 'Reality distorts in a 2-meter radius around you; colors invert briefly.',
  },

  // ── Death Knight ──
  {
    id: 'syn-death-knight',
    requiredTags: ['necro', 'shadow', 'tank', 'brute'] as Tag[],
    minMatches: 2,
    effect: 'Lifesteal on all attacks. Fallen enemies rise as temporary allies.',
    bonusScore: 150,
    description: 'Risen warrior, fueled by death, clad in darkness.',
    comboName: 'Death Knight',
    styleUpgrade: 'Black frost coats your armor; a spectral cape billows with ghostly whispers.',
  },

  // ── Bio-Weapon ──
  {
    id: 'syn-bio-weapon',
    requiredTags: ['mutation', 'beast', 'nature', 'brute'] as Tag[],
    minMatches: 2,
    effect: 'Regenerate health each turn. Attacks apply stacking poison.',
    bonusScore: 130,
    description: 'Evolution gone wrong – or very, very right.',
    comboName: 'Bio-Weapon',
    styleUpgrade: 'Your body shifts between forms; extra limbs sprout mid-combat.',
  },

  // ── Chrono-Agent ──
  {
    id: 'syn-chrono-agent',
    requiredTags: ['temporal', 'tech', 'speed', 'precision'] as Tag[],
    minMatches: 2,
    effect: 'Can rewind 1 spin per run. Dodge rate massively increased.',
    bonusScore: 145,
    description: 'Time-bending operative. Always one step ahead.',
    comboName: 'Chrono-Agent',
    styleUpgrade: 'A faint clock-tick echoes around you; afterimages show your future positions.',
  },

  // ── Divine Summoner ──
  {
    id: 'syn-divine-summoner',
    requiredTags: ['holy', 'summoner', 'support', 'arcane'] as Tag[],
    minMatches: 2,
    effect: 'Summons heal allies passively. Celestial shield blocks one lethal hit.',
    bonusScore: 140,
    description: 'Calls celestial beings to aid the righteous.',
    comboName: 'Divine Summoner',
    styleUpgrade: 'Golden wings flicker behind you; a halo of summoning circles orbits overhead.',
  },

  // ── Neon Fury ──
  {
    id: 'syn-neon-fury',
    requiredTags: ['cyber', 'plasma', 'speed', 'fire'] as Tag[],
    minMatches: 2,
    effect: 'Attack speed doubles. Leave burning plasma trails when dashing.',
    bonusScore: 135,
    description: 'Blazing through neon-lit streets at impossible speed.',
    comboName: 'Neon Fury',
    styleUpgrade: 'Plasma trails ignite behind you in neon pink and cyan.',
  },

  // ── Retro Reboot ──
  {
    id: 'syn-retro-reboot',
    requiredTags: ['retro', 'tech', 'mecha'] as Tag[],
    minMatches: 2,
    effect: 'Pixelate enemies on hit, reducing their stats. Extra lives system.',
    bonusScore: 110,
    description: 'Classic vibes with modern firepower. 8-bit destruction.',
    comboName: 'Retro Reboot',
    styleUpgrade: 'Your character sprite occasionally pixelates; 8-bit sound effects play.',
  },

  // ── Mind Flayer ──
  {
    id: 'syn-mind-flayer',
    requiredTags: ['psychic', 'void', 'shadow', 'charisma'] as Tag[],
    minMatches: 2,
    effect: 'Charm enemies to fight for you. Psychic blast stuns in area.',
    bonusScore: 155,
    description: 'Breaks minds, bends wills, devours thoughts.',
    comboName: 'Mind Flayer',
    styleUpgrade: 'Psychic tendrils extend from your temples; your voice echoes telepathically.',
  },

  // ── Bonus: Cross-Category Combos ──

  {
    id: 'syn-paladin-of-steel',
    requiredTags: ['holy', 'tank', 'mecha'] as Tag[],
    minMatches: 3,
    effect: 'Aura of divine protection. Mechanical armor self-repairs.',
    bonusScore: 200,
    description: 'A walking cathedral of chrome and prayer.',
    comboName: 'Paladin of Steel',
    styleUpgrade: 'Stained-glass patterns project from your mecha armor; hymns play softly.',
  },

  {
    id: 'syn-wild-circuit',
    requiredTags: ['nature', 'cyber', 'mutation'] as Tag[],
    minMatches: 3,
    effect: 'Tech evolves organically. Plants grow circuit boards.',
    bonusScore: 180,
    description: 'Technology and nature fused at the genetic level.',
    comboName: 'Wild Circuit',
    styleUpgrade: 'Vines with glowing circuitry grow from your joints; flowers bloom data.',
  },

  {
    id: 'syn-star-shaman',
    requiredTags: ['cosmic', 'nature', 'summoner'] as Tag[],
    minMatches: 3,
    effect: 'Call down meteor fauna. Star-beasts answer your summons.',
    bonusScore: 190,
    description: 'The cosmos is your garden, and the stars are your pets.',
    comboName: 'Star Shaman',
    styleUpgrade: 'Constellations form living creatures around you; nebula pollen drifts by.',
  },

  {
    id: 'syn-chrono-necro',
    requiredTags: ['temporal', 'necro', 'arcane'] as Tag[],
    minMatches: 3,
    effect: 'Undo death itself. Resurrect allies from the timeline.',
    bonusScore: 220,
    description: 'Death is just a scheduling conflict.',
    comboName: 'Temporal Lich',
    styleUpgrade: 'Ghostly timelines collapse around you; past versions of the dead flicker nearby.',
  },
];

// ─── Helper Functions ───

/** Find all synergy rules satisfied by a set of tags */
export function findMatchingSynergies(collectedTags: Tag[]): SynergyRule[] {
  return SYNERGY_RULES.filter((rule) => {
    const matches = rule.requiredTags.filter((t) => collectedTags.includes(t)).length;
    return matches >= rule.minMatches;
  });
}

/** Check if a specific synergy is newly triggered by adding a new result's tags */
export function isNewSynergy(
  rule: SynergyRule,
  previousTags: Tag[],
  currentTags: Tag[]
): boolean {
  const prevMatches = rule.requiredTags.filter((t) => previousTags.includes(t)).length;
  const currMatches = rule.requiredTags.filter((t) => currentTags.includes(t)).length;
  return prevMatches < rule.minMatches && currMatches >= rule.minMatches;
}

/** Get the total synergy bonus score for a set of active synergies */
export function calculateSynergyBonus(activeSynergies: SynergyRule[]): number {
  return activeSynergies.reduce((total, rule) => total + rule.bonusScore, 0);
}

/** Get synergy rule by ID */
export function getSynergyRule(id: string): SynergyRule | undefined {
  return SYNERGY_RULES.find((r) => r.id === id);
}
