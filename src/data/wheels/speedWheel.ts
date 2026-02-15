// ── Speed Wheel (Geschwindigkeit) ──
// Determines the character's speed & agility profile.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const speedWheel: WheelModule = {
  id: 'wheel-speed',
  name: 'Geschwindigkeit',
  category: 'speed',
  icon: '⚡',
  visualTheme: 'speed-yellow',
  description: 'Wie schnell bist du? Reflexe, Bewegung, Initiative.',
  order: 1,
  segments: [
    {
      id: 'speed-sluggish',
      label: 'Sluggish',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['heavy'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 2, description: '+2 Speed. You get there… eventually.' },
      ],
      lore: 'Slow and steady. Mostly slow.',
    },
    {
      id: 'speed-jogger',
      label: 'Steady Jogger',
      rarity: Rarity.Common,
      weight: 35,
      tags: ['support'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 5, description: '+5 Speed. A reliable pace.' },
      ],
      lore: 'Not fast, not slow. Just keeps going.',
    },
    {
      id: 'speed-nimble',
      label: 'Nimble Feet',
      rarity: Rarity.Uncommon,
      weight: 28,
      tags: ['speed'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 8, description: '+8 Speed. Quick on your feet.' },
        { type: 'passive', description: 'Dodge chance +5%.' },
      ],
      lore: 'Dancing through danger like it\'s choreographed.',
    },
    {
      id: 'speed-sprint',
      label: 'Sprint Champion',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['speed', 'melee'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 11, description: '+11 Speed. Burst acceleration.' },
        { type: 'ability', description: 'Sprint Burst: Double speed for 3 seconds.' },
      ],
      lore: 'Zero to sixty in the blink of an eye.',
    },
    {
      id: 'speed-reflex',
      label: 'Quick Reflexes',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['speed', 'ranged'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 14, description: '+14 Speed. Preternatural reflexes.' },
        { type: 'passive', description: 'Always act first in combat.' },
      ],
      lore: 'Your body moves before your brain decides to.',
    },
    {
      id: 'speed-shadow-step',
      label: 'Shadow Step',
      rarity: Rarity.Rare,
      weight: 15,
      tags: ['speed', 'stealth'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 16, description: '+16 Speed. Phase through obstacles.' },
        { type: 'ability', description: 'Shadow Step: Short-range teleport.' },
      ],
      lore: 'You don\'t run. You just appear somewhere else.',
    },
    {
      id: 'speed-wind-runner',
      label: 'Wind Runner',
      rarity: Rarity.Epic,
      weight: 10,
      tags: ['speed', 'elemental'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 20, description: '+20 Speed. Ride the wind itself.' },
        { type: 'ability', description: 'Air Dash: Triple jump with wind propulsion.' },
        { type: 'passive', description: 'No fall damage. Ever.' },
      ],
      lore: 'The wind doesn\'t carry you — you carry the wind.',
    },
    {
      id: 'speed-neon-blur',
      label: 'Neon Blur',
      rarity: Rarity.Epic,
      weight: 8,
      tags: ['speed', 'cyber'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 22, description: '+22 Speed. Cybernetic overclocked legs.' },
        { type: 'ability', description: 'Afterimage: Leave holographic decoys while moving.' },
      ],
      lore: 'Chrome legs, neon trails. They only see where you were.',
    },
    {
      id: 'speed-lightning-dash',
      label: 'Lightning Dash',
      rarity: Rarity.Legendary,
      weight: 5,
      tags: ['speed', 'elemental', 'cosmic'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 28, description: '+28 Speed. Move at the speed of lightning.' },
        { type: 'ability', description: 'Thunder Strike: Arrive with a shockwave.' },
        { type: 'passive', description: 'Immune to slow effects.' },
      ],
      lore: 'Lightning doesn\'t strike twice — you do.',
    },
    {
      id: 'speed-chrono-skip',
      label: 'Chrono Skip',
      rarity: Rarity.Legendary,
      weight: 4,
      tags: ['speed', 'temporal'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 30, description: '+30 Speed. Skip through time.' },
        { type: 'ability', description: 'Time Skip: Move 2 seconds into the future.' },
      ],
      lore: 'Why be fast when you can simply not experience the delay?',
    },
    {
      id: 'speed-quantum-flash',
      label: 'Quantum Flash',
      rarity: Rarity.Mythic,
      weight: 2,
      tags: ['speed', 'cosmic', 'temporal'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 40, description: '+40 Speed. Exist in multiple locations simultaneously.' },
        { type: 'ability', description: 'Quantum Superposition: Be in 3 places at once for 5 seconds.' },
        { type: 'passive', description: 'Cannot be targeted by single-target abilities.' },
      ],
      lore: 'So fast you broke causality. The universe files a complaint.',
    },
    {
      id: 'speed-lightspeed',
      label: 'Lightspeed',
      rarity: Rarity.Forbidden,
      weight: 1,
      tags: ['speed', 'cosmic', 'cursed'],
      effects: [
        { type: 'stat_boost', target: 'speed', value: 50, description: '+50 Speed. You ARE speed.' },
        { type: 'ability', description: 'Relativistic Strike: Hit every enemy in range simultaneously.' },
        { type: 'curse', description: 'Time moves differently for you. Conversations take hours from others\' perspective.' },
      ],
      lore: 'You moved so fast you outran your own timeline. Welcome to loneliness at mach infinity.',
    },
  ],
};
