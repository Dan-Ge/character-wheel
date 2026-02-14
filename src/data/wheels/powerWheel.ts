// ── Power Wheel ──
// Determines the character's main combat ability / power.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const powerWheel: WheelModule = {
  id: 'wheel-power',
  name: 'Power',
  category: 'power',
  icon: '⚡',
  visualTheme: 'power-orange',
  description: 'Your signature ability. What do you DO?',
  order: 2,
  segments: [
    {
      id: 'power-basic-blast',
      label: 'Basic Blast',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['plasma'],
      effects: [
        { type: 'ability', description: 'Fire a simple energy bolt. Nothing fancy, but reliable.' },
      ],
      lore: 'The tutorial ability. Everyone starts here. Some never leave.',
    },
    {
      id: 'power-shield-bash',
      label: 'Shield Bash',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['tank', 'brute'],
      effects: [
        { type: 'ability', description: 'Slam your shield into the enemy. Stun for 1s.' },
        { type: 'stat_boost', target: 'defense', value: 5, description: '+5 DEF while shield is held.' },
      ],
      lore: 'Why cast spells when you can hit people with a large piece of metal?',
    },
    {
      id: 'power-flame-burst',
      label: 'Flame Burst',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['fire'],
      effects: [
        { type: 'ability', description: 'Eruption of flame in a 5m radius. Ignites targets.' },
        { type: 'passive', description: 'Burning enemies take 3% max HP per second.' },
      ],
      lore: 'Fire does not discriminate. It burns everything equally. How egalitarian.',
    },
    {
      id: 'power-frost-chains',
      label: 'Frost Chains',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['ice', 'support'],
      effects: [
        { type: 'ability', description: 'Chains of ice root up to 3 enemies for 4 seconds.' },
        { type: 'passive', description: 'Frozen enemies take +25% damage from all sources.' },
      ],
      lore: 'Let it go? No. Let them stay. Permanently.',
    },
    {
      id: 'power-smoke-dash',
      label: 'Smoke Dash',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['stealth', 'speed'],
      effects: [
        { type: 'ability', description: 'Vanish into smoke, teleport 10m forward. Next attack from stealth crits.' },
      ],
      lore: 'You are here. Then you are not. Then the enemy is on the floor.',
    },
    {
      id: 'power-neon-overload',
      label: 'Neon Overload',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['cyber', 'plasma'],
      effects: [
        { type: 'ability', description: 'Discharge all implant energy. Massive AoE damage, self-stun 2s.' },
        { type: 'passive', description: 'Implant energy recharges 20% faster after use.' },
      ],
      lore: 'Your cybernetics scream. The air tastes like ozone. Everything glows.',
      visualTheme: 'neon-pulse',
    },
    {
      id: 'power-summon-familiar',
      label: 'Summon Familiar',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['summoner', 'arcane'],
      effects: [
        { type: 'ability', description: 'Summon an arcane familiar that fights alongside you for 30s.' },
        { type: 'passive', description: 'Familiar copies 30% of your abilities.' },
      ],
      lore: 'A small glowing creature appears. It judges you silently. It also shoots lasers.',
    },
    {
      id: 'power-psionic-wave',
      label: 'Psionic Wave',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['psychic', 'cosmic'],
      effects: [
        { type: 'ability', description: 'Telekinetic shockwave. Knocks back all enemies in cone.' },
        { type: 'passive', description: 'Knocked-back enemies are confused for 3s.' },
      ],
      lore: 'You think, therefore they fly.',
    },
    {
      id: 'power-divine-smite',
      label: 'Divine Smite',
      rarity: Rarity.Epic,
      weight: 10,
      tags: ['holy', 'brute'],
      effects: [
        { type: 'ability', description: 'Channel divine energy through your weapon. 300% damage to undead.' },
        { type: 'passive', description: 'Auto-crits against shadow-tagged enemies.' },
      ],
      lore: 'Your god gave you one job: hit things really hard. You are very devout.',
      visualTheme: 'golden-radiance',
    },
    {
      id: 'power-void-rift',
      label: 'Void Rift',
      rarity: Rarity.Epic,
      weight: 10,
      tags: ['void', 'shadow'],
      effects: [
        { type: 'ability', description: 'Tear open a rift to the void. Enemies near it are slowly erased.' },
        { type: 'passive', description: 'Rift persists for 10s. Grows larger over time.' },
      ],
      lore: 'A hole in reality. It whispers your name. It knows things.',
      visualTheme: 'void-tear',
    },
    {
      id: 'power-chrono-strike',
      label: 'Chrono Strike',
      rarity: Rarity.Legendary,
      weight: 5,
      tags: ['temporal', 'precision'],
      effects: [
        { type: 'ability', description: 'Attack an enemy in the past, present, and future simultaneously.' },
        { type: 'passive', description: 'Guaranteed critical. Damage applies three times.' },
      ],
      lore: 'You hit them yesterday, today, and tomorrow. They should have dodged last Tuesday.',
      visualTheme: 'time-fracture',
    },
    {
      id: 'power-mecha-fusion',
      label: 'Mecha Fusion',
      rarity: Rarity.Mythic,
      weight: 1.5,
      tags: ['mecha', 'tech', 'cyber'],
      effects: [
        { type: 'ability', description: 'Merge with your mecha suit. Become a walking fortress for 20s.' },
        { type: 'stat_boost', target: 'all', value: 25, description: '+25 all stats during fusion.' },
        { type: 'passive', description: 'All attacks become AoE. Flight enabled.' },
      ],
      lore: 'You ARE the weapon system. Targeting: everything.',
      visualTheme: 'titan-chrome',
    },
    {
      id: 'power-cosmic-erasure',
      label: 'Cosmic Erasure',
      rarity: Rarity.Forbidden,
      weight: 0.5,
      tags: ['cosmic', 'void', 'necro'],
      effects: [
        { type: 'ability', description: 'Erase one enemy from existence. No resurrection possible.' },
        { type: 'curse', description: 'Using this ability costs 50% of your max HP.' },
        { type: 'passive', description: 'Erased enemies cannot be summoned or cloned.' },
      ],
      lore: 'They were never born. Their mother does not remember them. The universe moved on.',
      visualTheme: 'forbidden-pulse',
    },
  ],
};
