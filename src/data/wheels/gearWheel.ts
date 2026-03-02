// ── Gear Wheel ──
// Determines the character's signature equipment.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const gearWheel: WheelModule = {
  id: 'wheel-gear',
  name: 'Gear',
  category: 'gear',
  icon: '🛡️',
  visualTheme: 'gear-steel',
  description: 'Your signature equipment. What do you carry into battle?',
  order: 3,
  segments: [
    {
      id: 'gear-rusty-sword',
      label: 'Rusty Sword',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['brute'],
      effects: [
        { type: 'stat_boost', target: 'attack', value: 5, description: '+5 ATK. It cuts... mostly.' },
      ],
      lore: 'Found behind a dumpster. Still sharp enough. Tetanus included free of charge.',
    },
    {
      id: 'gear-leather-jacket',
      label: 'Leather Jacket',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['stealth'],
      effects: [
        { type: 'stat_boost', target: 'defense', value: 3, description: '+3 DEF. Looks cool though.' },
        { type: 'cosmetic', description: 'Adds a cool collar-pop animation.' },
      ],
      lore: 'Protection? Minimal. Style? Maximum. Priorities.',
    },
    {
      id: 'gear-energy-shield',
      label: 'Energy Shield',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['tech', 'tank'],
      effects: [
        { type: 'passive', description: 'Absorbs first 50 damage of each hit.' },
        { type: 'stat_boost', target: 'defense', value: 10, description: '+10 DEF from energy plating.' },
      ],
      lore: 'Hexagonal energy panels. Very sci-fi. Breaks dramatically in cutscenes.',
    },
    {
      id: 'gear-grapple-gauntlets',
      label: 'Grapple Gauntlets',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['speed', 'mecha'],
      effects: [
        { type: 'ability', description: 'Grapple to any surface within 20m.' },
        { type: 'stat_boost', target: 'agility', value: 8, description: '+8 AGI. Spider-person vibes.' },
      ],
      lore: 'Magnetic grappling hooks. Great for mobility. Terrible for high-fives.',
    },
    {
      id: 'gear-enchanted-staff',
      label: 'Enchanted Staff',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['arcane'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 12, description: '+12 INT. The staff is smarter than you.' },
        { type: 'passive', description: 'Spells cost 10% less mana.' },
      ],
      lore: 'The staff chose you. You are not sure why. Neither is the staff.',
    },
    {
      id: 'gear-cyber-arm',
      label: 'Cyber Arm',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['cyber', 'tech'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 15, description: '+15 STR. Grip strength: yes.' },
        { type: 'ability', description: 'Rocket punch: detach fist, auto-returns. 15m range.' },
      ],
      lore: 'Your warranty says "do not punch walls." You punch walls.',
      visualTheme: 'chrome-neon',
    },
    {
      id: 'gear-shadow-cloak',
      label: 'Shadow Cloak',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['shadow', 'stealth'],
      effects: [
        { type: 'passive', description: 'Invisibility when standing still for 3s.' },
        { type: 'stat_boost', target: 'agility', value: 10, description: '+10 AGI. You flow like darkness.' },
      ],
      lore: 'Woven from solidified darkness. Dry clean only. Do NOT machine wash.',
    },
    {
      id: 'gear-natures-mantle',
      label: "Nature's Mantle",
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['nature', 'support'],
      effects: [
        { type: 'passive', description: 'Regenerate 2% HP per second when in natural environments.' },
        { type: 'ability', description: 'Entangle: roots grow from the mantle, trapping nearby enemies.' },
      ],
      lore: 'A living garment. It photosynthesizes. You never need to wash it. It washes you.',
    },
    {
      id: 'gear-plasma-cannon',
      label: 'Plasma Cannon',
      rarity: Rarity.Epic,
      weight: 10,
      tags: ['plasma', 'mecha'],
      effects: [
        { type: 'ability', description: 'Charged shot: 3s charge, devastating single-target damage.' },
        { type: 'stat_boost', target: 'attack', value: 25, description: '+25 ATK. Overkill is underrated.' },
      ],
      lore: 'Shoulder-mounted. Because subtlety is for people who cannot afford plasma.',
      visualTheme: 'plasma-glow',
    },
    {
      id: 'gear-infinity-blade',
      label: 'Infinity Blade',
      rarity: Rarity.Legendary,
      weight: 5,
      tags: ['cosmic', 'precision'],
      effects: [
        { type: 'stat_boost', target: 'attack', value: 35, description: '+35 ATK. Cuts through anything. Literally.' },
        { type: 'passive', description: 'Ignores all armor and shields.' },
        { type: 'ability', description: 'Dimensional Slash: cut through space itself.' },
      ],
      lore: 'Forged in a collapsing star. The blade extends infinitely if you think about it hard enough.',
      visualTheme: 'starlight-edge',
    },
    {
      id: 'gear-necro-crown',
      label: 'Necro Crown',
      rarity: Rarity.Mythic,
      weight: 1.5,
      tags: ['necro', 'shadow', 'summoner'],
      effects: [
        { type: 'ability', description: 'Raise up to 5 fallen enemies as undead servants.' },
        { type: 'passive', description: 'Each undead servant grants +5% damage.' },
        { type: 'stat_boost', target: 'intelligence', value: 30, description: '+30 INT. Death is merely a resource.' },
      ],
      lore: 'A crown of bones that whispers battle strategies. Its previous owner is one of your minions now.',
      visualTheme: 'deathglow',
    },
    {
      id: 'gear-reality-gauntlet',
      label: 'Reality Gauntlet',
      rarity: Rarity.Forbidden,
      weight: 0.5,
      tags: ['void', 'temporal', 'cosmic'],
      effects: [
        { type: 'ability', description: 'Rewrite one law of physics per battle. Gravity? Optional.' },
        { type: 'passive', description: 'All stats scale with number of active synergies.' },
        { type: 'curse', description: 'Reality destabilizes: random environmental hazards each turn.' },
      ],
      lore: 'A gauntlet that lets you edit reality\'s source code. No documentation. Good luck.',
      visualTheme: 'forbidden-pulse',
    },
  ],
};
