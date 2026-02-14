// ── Flaw Wheel ──
// Determines the character's weakness / flaw.
// Higher rarity = more interesting (and sometimes beneficial) flaws.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const flawWheel: WheelModule = {
  id: 'wheel-flaw',
  name: 'Flaw',
  category: 'flaw',
  icon: '💀',
  visualTheme: 'flaw-red',
  description: 'Nobody is perfect. What is your greatest weakness?',
  order: 6,
  segments: [
    {
      id: 'flaw-clumsy',
      label: 'Clumsy',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['brute'],
      effects: [
        { type: 'curse', description: '10% chance to trip when dodging. Embarrassing but survivable.' },
        { type: 'stat_boost', target: 'agility', value: -5, description: '-5 AGI. Gravity is your nemesis.' },
      ],
      lore: 'You trip over your own feet. In combat. During dramatic moments. Every. Single. Time.',
    },
    {
      id: 'flaw-loud-mouth',
      label: 'Loud Mouth',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['charisma'],
      effects: [
        { type: 'curse', description: 'Cannot use stealth abilities. You narrate everything you do. Out loud.' },
        { type: 'stat_boost', target: 'stealth', value: -10, description: '-10 Stealth. HELLO I AM HERE.' },
      ],
      lore: 'You announce your attacks before executing them. Enemies appreciate the warning.',
    },
    {
      id: 'flaw-allergic-to-magic',
      label: 'Allergic to Magic',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['nature'],
      effects: [
        { type: 'curse', description: 'Sneezing fit when hit by magical attacks. -20% accuracy for 3s.' },
        { type: 'stat_boost', target: 'intelligence', value: -5, description: '-5 INT. Hard to think while sneezing.' },
      ],
      lore: 'Arcane energy makes you sneeze explosively. Wizard school was a disaster.',
    },
    {
      id: 'flaw-glass-cannon',
      label: 'Glass Cannon',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['precision'],
      effects: [
        { type: 'stat_boost', target: 'attack', value: 15, description: '+15 ATK. Hit harder...' },
        { type: 'stat_boost', target: 'vitality', value: -15, description: '-15 VIT. ...but break easier.' },
        { type: 'curse', description: 'All damage taken increased by 25%.' },
      ],
      lore: 'You dish it out but cannot take it. A strong breeze is a medical emergency.',
    },
    {
      id: 'flaw-haunted',
      label: 'Haunted',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['shadow', 'necro'],
      effects: [
        { type: 'curse', description: 'Ghost follows you. Spooks allies. -5% team accuracy.' },
        { type: 'passive', description: 'The ghost occasionally distracts enemies too. 5% stun chance.' },
      ],
      lore: 'A ghost follows you everywhere. Bathroom. Meetings. Dates. It comments on everything.',
    },
    {
      id: 'flaw-phobia-of-fire',
      label: 'Phobia of Fire',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['ice'],
      effects: [
        { type: 'curse', description: 'Panic when hit by fire attacks. Flee randomly for 2s.' },
        { type: 'stat_boost', target: 'defense', value: -10, description: '-10 DEF against fire.' },
        { type: 'passive', description: 'But: ice powers deal +30% damage from overcompensation.' },
      ],
      lore: 'Fire is scary. Fire is very scary. You scream. Then you freeze everything in sight.',
    },
    {
      id: 'flaw-tech-dependent',
      label: 'Tech Dependent',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['tech', 'cyber'],
      effects: [
        { type: 'curse', description: 'EMP attacks disable ALL your abilities for 5s.' },
        { type: 'stat_boost', target: 'all', value: -3, description: '-3 all stats when tech is offline.' },
        { type: 'passive', description: 'When tech is online: +15% to all abilities.' },
      ],
      lore: 'Without your implants, you are just a confused person in a cool jacket.',
      visualTheme: 'glitch-red',
    },
    {
      id: 'flaw-berserker-rage',
      label: 'Berserker Rage',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['brute', 'fire'],
      effects: [
        { type: 'curse', description: 'Below 30% HP: attack everything indiscriminately for 5s.' },
        { type: 'stat_boost', target: 'strength', value: 20, description: '+20 STR during rage.' },
        { type: 'stat_boost', target: 'defense', value: -15, description: '-15 DEF. Reckless abandon.' },
      ],
      lore: 'Your anger management therapist quit. Then you destroyed their office. By accident.',
    },
    {
      id: 'flaw-cursed-blood',
      label: 'Cursed Blood',
      rarity: Rarity.Epic,
      weight: 10,
      tags: ['necro', 'mutation'],
      effects: [
        { type: 'curse', description: 'Healing is 50% less effective. Potions taste terrible.' },
        { type: 'passive', description: 'But: lifesteal on all attacks (5% damage dealt returns as HP).' },
        { type: 'stat_boost', target: 'strength', value: 10, description: '+10 STR. Pain is fuel.' },
      ],
      lore: 'An ancient curse runs through your veins. It hurts. It also makes you terrifyingly strong.',
      visualTheme: 'blood-dark',
    },
    {
      id: 'flaw-quantum-instability',
      label: 'Quantum Instability',
      rarity: Rarity.Legendary,
      weight: 5,
      tags: ['temporal', 'void'],
      effects: [
        { type: 'curse', description: '10% chance each turn to phase to a random position on the map.' },
        { type: 'passive', description: 'Phased attacks deal double damage. Enemies cannot predict you.' },
        { type: 'ability', description: 'Collapse Waveform: choose your exact position. 30s cooldown.' },
      ],
      lore: 'You exist in multiple places at once. Sitting down is a challenge. Chairs hate you.',
      visualTheme: 'quantum-flicker',
    },
    {
      id: 'flaw-hivemind-infection',
      label: 'Hivemind Infection',
      rarity: Rarity.Mythic,
      weight: 1.5,
      tags: ['psychic', 'mutation', 'void'],
      effects: [
        { type: 'curse', description: 'Hear the thoughts of ALL nearby creatures. -20% focus. Constant migraine.' },
        { type: 'passive', description: 'But: always know enemy intentions. Cannot be surprised.' },
        { type: 'ability', description: 'Overload: broadcast your pain to all enemies. Stun 3s.' },
        { type: 'stat_boost', target: 'intelligence', value: 25, description: '+25 INT. A thousand minds, one body.' },
      ],
      lore: 'A million voices in your head. Most are screaming. Some are ordering pizza.',
      visualTheme: 'hive-pulse',
    },
    {
      id: 'flaw-reality-leak',
      label: 'Reality Leak',
      rarity: Rarity.Forbidden,
      weight: 0.5,
      tags: ['void', 'cosmic', 'temporal'],
      effects: [
        { type: 'curse', description: 'Reality glitches around you. Random objects phase in from other dimensions.' },
        { type: 'passive', description: 'Phased objects are sometimes useful weapons (30%) or hazards (70%).' },
        { type: 'ability', description: 'Dimensional Anchor: stabilize reality for 10s. All stats +50% during anchor.' },
        { type: 'stat_boost', target: 'all', value: -10, description: '-10 all stats normally. Reality hurts.' },
      ],
      lore: 'You are a hole in the fabric of spacetime. Things fall in. Things fall out. You are the things.',
      visualTheme: 'forbidden-pulse',
    },
  ],
};
