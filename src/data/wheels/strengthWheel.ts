// ── Strength Wheel (Stärke) ──
// Determines the character's raw physical power.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const strengthWheel: WheelModule = {
  id: 'wheel-strength',
  name: 'Stärke',
  category: 'strength',
  icon: '💪',
  visualTheme: 'strength-red',
  description: 'Rohe Kraft. Wie hart schlägst du zu?',
  order: 2,
  segments: [
    {
      id: 'str-wet-noodle',
      label: 'Wet Noodle',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['support'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 2, description: '+2 Strength. Arms like overcooked spaghetti.' },
      ],
      lore: 'You struggle with jar lids. Combat is going to be... creative.',
    },
    {
      id: 'str-average-joe',
      label: 'Average Joe',
      rarity: Rarity.Common,
      weight: 35,
      tags: ['melee'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 5, description: '+5 Strength. Respectable, unremarkable.' },
      ],
      lore: 'You can carry groceries in one trip. Barely.',
    },
    {
      id: 'str-brawler',
      label: 'Street Brawler',
      rarity: Rarity.Uncommon,
      weight: 28,
      tags: ['melee', 'brutal'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 8, description: '+8 Strength. Hardened by street fights.' },
        { type: 'passive', description: 'Unarmed attacks deal bonus damage.' },
      ],
      lore: 'No technique, just aggression and surprisingly hard fists.',
    },
    {
      id: 'str-iron-grip',
      label: 'Iron Grip',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['melee', 'heavy'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 11, description: '+11 Strength. Crushing grip strength.' },
        { type: 'ability', description: 'Vice Grip: Grapple enemies, preventing escape.' },
      ],
      lore: 'Handshakes are now a weapon.',
    },
    {
      id: 'str-powerlifter',
      label: 'Powerlifter',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['heavy', 'melee'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 14, description: '+14 Strength. Peak human power.' },
        { type: 'passive', description: 'Can wield two-handed weapons in one hand.' },
      ],
      lore: 'You deadlift cars on your day off.',
    },
    {
      id: 'str-cyber-arms',
      label: 'Cyber Arms',
      rarity: Rarity.Rare,
      weight: 15,
      tags: ['heavy', 'cyber'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 16, description: '+16 Strength. Hydraulic prosthetic arms.' },
        { type: 'ability', description: 'Piston Punch: Charged strike that sends enemies flying.' },
      ],
      lore: 'Your arms were recalled for being too dangerous. You kept them anyway.',
    },
    {
      id: 'str-berserker',
      label: 'Berserker Rage',
      rarity: Rarity.Epic,
      weight: 10,
      tags: ['brutal', 'melee', 'cursed'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 20, description: '+20 Strength. Rage-fueled power.' },
        { type: 'ability', description: 'Berserk: +50% damage, -30% defense for 10 seconds.' },
        { type: 'curse', description: 'Cannot distinguish friend from foe during Berserk.' },
      ],
      lore: 'Anger management? Never heard of it.',
    },
    {
      id: 'str-titan-frame',
      label: 'Titan Frame',
      rarity: Rarity.Epic,
      weight: 8,
      tags: ['heavy', 'mecha'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 22, description: '+22 Strength. Exoskeleton-enhanced.' },
        { type: 'passive', description: 'Can carry and throw objects 10x your size.' },
      ],
      lore: 'Part human, part industrial crane. All muscle.',
    },
    {
      id: 'str-seismic-force',
      label: 'Seismic Force',
      rarity: Rarity.Legendary,
      weight: 5,
      tags: ['heavy', 'elemental', 'brutal'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 28, description: '+28 Strength. Ground-shaking power.' },
        { type: 'ability', description: 'Earthquake Slam: AoE ground pound that stuns.' },
        { type: 'passive', description: 'Footsteps create tremors.' },
      ],
      lore: 'You don\'t break the ground. The ground breaks around you.',
    },
    {
      id: 'str-mythic-giant',
      label: 'Mythic Giant',
      rarity: Rarity.Legendary,
      weight: 4,
      tags: ['heavy', 'divine', 'brutal'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 30, description: '+30 Strength. Size of a small building.' },
        { type: 'ability', description: 'Giant\'s Grasp: Pick up and throw enemies like ragdolls.' },
      ],
      lore: 'Fee fi fo fum. They smell your protein shakes.',
    },
    {
      id: 'str-world-breaker',
      label: 'World Breaker',
      rarity: Rarity.Mythic,
      weight: 2,
      tags: ['heavy', 'cosmic', 'brutal'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 40, description: '+40 Strength. Continental-scale force.' },
        { type: 'ability', description: 'Tectonic Shatter: Split the ground in a 100m line.' },
        { type: 'passive', description: 'Immune to knockback. You ARE the knockback.' },
      ],
      lore: 'Last time you punched something at full power, they had to redraw the maps.',
    },
    {
      id: 'str-primordial-might',
      label: 'Primordial Might',
      rarity: Rarity.Forbidden,
      weight: 1,
      tags: ['heavy', 'cosmic', 'cursed'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 50, description: '+50 Strength. Power of creation itself.' },
        { type: 'ability', description: 'Genesis Strike: One punch creates a shockwave visible from orbit.' },
        { type: 'curse', description: 'Everything you touch gently still breaks. Hugging is impossible.' },
      ],
      lore: 'With great power comes great inability to pet cats.',
    },
  ],
};
