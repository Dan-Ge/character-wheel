// ── Stats Wheel ──
// Determines the character's core stat profile.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const statsWheel: WheelModule = {
  id: 'wheel-stats',
  name: 'Stats',
  category: 'stats',
  icon: '📊',
  visualTheme: 'stats-cyan',
  description: 'Your core stat spread. What are you naturally good at?',
  order: 1,
  segments: [
    {
      id: 'stats-balanced-recruit',
      label: 'Balanced Recruit',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['support'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 5, description: '+5 to all stats. Jack of all trades.' },
      ],
      lore: 'No standout strengths, no glaring weaknesses. The safest bet — and the most boring one.',
    },
    {
      id: 'stats-scrappy-brawler',
      label: 'Scrappy Brawler',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['brute'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 12, description: '+12 STR. Hits hard, thinks later.' },
        { type: 'stat_boost', target: 'intelligence', value: -3, description: '-3 INT. Thinking is overrated.' },
      ],
      lore: 'Grew up solving problems with fists. Surprisingly effective life philosophy.',
    },
    {
      id: 'stats-quick-reflexes',
      label: 'Quick Reflexes',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['speed'],
      effects: [
        { type: 'stat_boost', target: 'agility', value: 15, description: '+15 AGI. Fast enough to dodge rain.' },
        { type: 'passive', description: '10% dodge chance on all attacks.' },
      ],
      lore: 'Your reflexes fire before your brain. Which is great, because your brain is slow.',
    },
    {
      id: 'stats-iron-constitution',
      label: 'Iron Constitution',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['tank'],
      effects: [
        { type: 'stat_boost', target: 'vitality', value: 18, description: '+18 VIT. Walking health bar.' },
        { type: 'passive', description: 'Poison and bleed effects last 50% shorter.' },
      ],
      lore: 'You once ate expired rations from a war that ended 200 years ago. You were fine.',
    },
    {
      id: 'stats-sharp-mind',
      label: 'Sharp Mind',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['precision', 'tech'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 16, description: '+16 INT. Big brain energy.' },
        { type: 'passive', description: 'Ability cooldowns reduced by 15%.' },
      ],
      lore: 'You process information faster than most computers. Most.',
    },
    {
      id: 'stats-charming-rogue',
      label: 'Charming Rogue',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['charisma', 'stealth'],
      effects: [
        { type: 'stat_boost', target: 'charisma', value: 20, description: '+20 CHA. Smile that disarms.' },
        { type: 'ability', description: 'Can talk way out of 1 conflict per run.' },
      ],
      lore: 'Your smile has prevented more wars than any peace treaty. Also started a few.',
    },
    {
      id: 'stats-cyber-enhanced',
      label: 'Cyber-Enhanced',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['cyber', 'tech'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 8, description: '+8 to all stats via implants.' },
        { type: 'passive', description: 'Neural link: +20% ability accuracy.' },
      ],
      lore: 'More machine than human. The warranty expired, but the upgrades haven\'t.',
      visualTheme: 'neon-blue',
    },
    {
      id: 'stats-primal-instinct',
      label: 'Primal Instinct',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['beast', 'nature'],
      effects: [
        { type: 'stat_boost', target: 'agility', value: 14, description: '+14 AGI from animal reflexes.' },
        { type: 'stat_boost', target: 'strength', value: 14, description: '+14 STR from raw power.' },
        { type: 'passive', description: 'Sense hidden enemies within 10m.' },
      ],
      lore: 'Civilization is a thin veneer over millions of years of predator evolution.',
    },
    {
      id: 'stats-arcane-prodigy',
      label: 'Arcane Prodigy',
      rarity: Rarity.Epic,
      weight: 10,
      tags: ['arcane', 'psychic'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 25, description: '+25 INT. Reality bends to your will.' },
        { type: 'ability', description: 'Unlock one bonus spell slot.' },
        { type: 'passive', description: 'Mana regeneration doubled.' },
      ],
      lore: 'Born during a mana storm. Your first word was a fireball. Your second was "oops".',
      visualTheme: 'purple-glow',
    },
    {
      id: 'stats-void-touched',
      label: 'Void-Touched',
      rarity: Rarity.Legendary,
      weight: 5,
      tags: ['void', 'cosmic'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 15, description: '+15 to all stats. Void perfection.' },
        { type: 'ability', description: 'Phase Shift: become intangible for 3 seconds.' },
        { type: 'passive', description: 'Immune to crowd control effects.' },
      ],
      lore: 'You fell into the void between worlds. It stared back. Then it flinched.',
      visualTheme: 'void-shimmer',
    },
    {
      id: 'stats-temporal-anomaly',
      label: 'Temporal Anomaly',
      rarity: Rarity.Mythic,
      weight: 1.5,
      tags: ['temporal', 'cosmic'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 20, description: '+20 all stats. You exist in multiple timelines.' },
        { type: 'ability', description: 'Rewind: undo the last 5 seconds of combat.' },
        { type: 'passive', description: 'Always act first. You already know what happens.' },
      ],
      lore: 'You remember tomorrow. You forget yesterday. Today is... complicated.',
      visualTheme: 'chrono-ripple',
    },
    {
      id: 'stats-forbidden-genome',
      label: 'Forbidden Genome',
      rarity: Rarity.Forbidden,
      weight: 0.5,
      tags: ['mutation', 'void'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 30, description: '+30 ALL. Genetically impossible perfection.' },
        { type: 'ability', description: 'Adaptive Evolution: gain resistance to the last damage type taken.' },
        { type: 'passive', description: 'Stats cannot be reduced by debuffs.' },
        { type: 'curse', description: 'Unstable DNA: 5% chance per turn to randomly mutate a stat.' },
      ],
      lore: 'A genome that should not exist. Every cell in your body is a war crime against biology.',
      visualTheme: 'forbidden-pulse',
    },
  ],
};
