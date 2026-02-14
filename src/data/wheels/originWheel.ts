// ── Origin Wheel ──
// Determines the character's backstory / where they come from.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const originWheel: WheelModule = {
  id: 'wheel-origin',
  name: 'Origin',
  category: 'origin',
  icon: '📜',
  visualTheme: 'origin-amber',
  description: 'Where do you come from? What shaped you?',
  order: 5,
  segments: [
    {
      id: 'origin-street-rat',
      label: 'Street Rat',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['stealth', 'speed'],
      effects: [
        { type: 'passive', description: 'Pickpocket: 10% chance to steal an item on hit.' },
        { type: 'stat_boost', target: 'agility', value: 5, description: '+5 AGI from surviving alleys.' },
      ],
      lore: 'You grew up on neon-lit streets. You learned to run before you learned to read.',
    },
    {
      id: 'origin-factory-worker',
      label: 'Factory Worker',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['tech', 'brute'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 8, description: '+8 STR from years of labor.' },
        { type: 'passive', description: 'Familiar with machines: +15% damage to mecha-tagged enemies.' },
      ],
      lore: 'Twelve-hour shifts in the chrome foundries. Your hands know metal better than skin.',
    },
    {
      id: 'origin-runaway-noble',
      label: 'Runaway Noble',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['charisma', 'arcane'],
      effects: [
        { type: 'stat_boost', target: 'charisma', value: 12, description: '+12 CHA. Raised with silver tongue.' },
        { type: 'passive', description: 'Start with bonus credits. Vendors like you more.' },
      ],
      lore: 'Born in luxury, chose chaos. Your family still sends passive-aggressive hologram messages.',
    },
    {
      id: 'origin-lab-experiment',
      label: 'Lab Experiment',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['mutation', 'tech'],
      effects: [
        { type: 'stat_boost', target: 'vitality', value: 10, description: '+10 VIT. Your cells are... optimized.' },
        { type: 'passive', description: 'Immune to poison. You metabolize toxins for lunch.' },
      ],
      lore: 'Subject 47-B. You escaped the lab. The lab has not stopped looking.',
    },
    {
      id: 'origin-temple-initiate',
      label: 'Temple Initiate',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['holy', 'support'],
      effects: [
        { type: 'passive', description: 'Meditation: rest restores 50% more HP.' },
        { type: 'stat_boost', target: 'intelligence', value: 8, description: '+8 INT from sacred studies.' },
      ],
      lore: 'Years of prayer and discipline. You can meditate through an earthquake. And have.',
    },
    {
      id: 'origin-cyber-merc',
      label: 'Cyber Merc',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['cyber', 'precision'],
      effects: [
        { type: 'stat_boost', target: 'attack', value: 12, description: '+12 ATK from combat experience.' },
        { type: 'passive', description: 'Contracts: bonus rewards for defeating elite enemies.' },
      ],
      lore: 'No allegiance, no mercy, no refunds. Your reputation is your resume.',
      visualTheme: 'chrome-dark',
    },
    {
      id: 'origin-deep-forest-exile',
      label: 'Deep Forest Exile',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['nature', 'beast'],
      effects: [
        { type: 'passive', description: 'Animals do not attack you. Can tame beasts as temporary allies.' },
        { type: 'stat_boost', target: 'agility', value: 10, description: '+10 AGI. Learned to move with the wind.' },
      ],
      lore: 'Banished to the wilds. The trees taught you patience. The wolves taught you teeth.',
    },
    {
      id: 'origin-void-refugee',
      label: 'Void Refugee',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['void', 'psychic'],
      effects: [
        { type: 'passive', description: 'Void sight: see through walls and illusions.' },
        { type: 'stat_boost', target: 'intelligence', value: 12, description: '+12 INT. The void teaches odd lessons.' },
      ],
      lore: 'You lived in the space between dimensions. Rent was cheap. The neighbors were eldritch.',
    },
    {
      id: 'origin-reincarnated-hero',
      label: 'Reincarnated Hero',
      rarity: Rarity.Epic,
      weight: 10,
      tags: ['holy', 'temporal'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 8, description: '+8 all. Echoes of past glory.' },
        { type: 'passive', description: 'Déjà vu: 25% chance to predict enemy attacks.' },
        { type: 'ability', description: 'Past Life: channel a random legendary ability once per battle.' },
      ],
      lore: 'You defeated the dark lord. Then you died. Then you were reborn. The dark lord is confused.',
      visualTheme: 'golden-aura',
    },
    {
      id: 'origin-digital-consciousness',
      label: 'Digital Consciousness',
      rarity: Rarity.Legendary,
      weight: 5,
      tags: ['cyber', 'tech', 'psychic'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 30, description: '+30 INT. You ARE the internet.' },
        { type: 'passive', description: 'Hack any electronic system. Firewalls are just speed bumps.' },
        { type: 'ability', description: 'Upload: momentarily transfer your consciousness into an enemy mech.' },
      ],
      lore: 'Once human. Now data. Your body is a formality. Your mind IS the network.',
      visualTheme: 'data-stream',
    },
    {
      id: 'origin-elder-god-avatar',
      label: 'Elder God Avatar',
      rarity: Rarity.Mythic,
      weight: 1.5,
      tags: ['cosmic', 'void', 'summoner'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 18, description: '+18 all. You are more than mortal.' },
        { type: 'passive', description: 'Aura of Dread: weak enemies flee on sight.' },
        { type: 'ability', description: 'Manifest: briefly reveal your true form. Area fear + massive damage.' },
      ],
      lore: 'A fragment of a sleeping god, walking among mortals. You forgot why. That worries you.',
      visualTheme: 'eldritch-glow',
    },
    {
      id: 'origin-timeline-error',
      label: 'Timeline Error',
      rarity: Rarity.Forbidden,
      weight: 0.5,
      tags: ['temporal', 'void', 'mutation'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 25, description: '+25 all. You should not exist.' },
        { type: 'passive', description: 'Causality Immune: you cannot be erased or time-locked.' },
        { type: 'ability', description: 'Paradox Bomb: cause a temporal explosion. Rerolls all nearby enemies.' },
        { type: 'curse', description: 'Unstable existence: 5% chance per turn to phase out of reality for 2s.' },
      ],
      lore: 'A bug in the universe\'s code. You exist because deleting you would crash reality.',
      visualTheme: 'forbidden-pulse',
    },
  ],
};
