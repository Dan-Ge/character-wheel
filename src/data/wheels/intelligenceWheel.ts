// ── Intelligence Wheel (Intelligenz) ──
// Determines the character's mental acuity and knowledge.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const intelligenceWheel: WheelModule = {
  id: 'wheel-intelligence',
  name: 'Intelligenz',
  category: 'intelligence',
  icon: '🧠',
  visualTheme: 'intelligence-blue',
  description: 'Geistesschärfe. Wie clever bist du wirklich?',
  order: 3,
  segments: [
    {
      id: 'int-smooth-brain',
      label: 'Smooth Brain',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['brutal'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 2, description: '+2 Intelligence. Blissful ignorance.' },
      ],
      lore: 'You tried to hack a toaster. The toaster won.',
    },
    {
      id: 'int-street-smart',
      label: 'Street Smart',
      rarity: Rarity.Common,
      weight: 35,
      tags: ['stealth'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 5, description: '+5 Intelligence. Practical knowledge.' },
      ],
      lore: 'Book smarts? No. Knowing which alley to avoid? Absolutely.',
    },
    {
      id: 'int-quick-learner',
      label: 'Quick Learner',
      rarity: Rarity.Uncommon,
      weight: 28,
      tags: ['support'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 8, description: '+8 Intelligence. Picks things up fast.' },
        { type: 'passive', description: '+10% XP gain from all sources.' },
      ],
      lore: 'Watched one tutorial. Now an expert. Probably.',
    },
    {
      id: 'int-tactician',
      label: 'Tactician',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['ranged', 'support'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 11, description: '+11 Intelligence. Strategic mind.' },
        { type: 'ability', description: 'Tactical Analysis: Reveal enemy weaknesses for 10 seconds.' },
      ],
      lore: 'Always three steps ahead. Sometimes four, if coffee is involved.',
    },
    {
      id: 'int-tech-savant',
      label: 'Tech Savant',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['cyber', 'ranged'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 14, description: '+14 Intelligence. Silicon-sharp mind.' },
        { type: 'ability', description: 'System Hack: Disable one enemy device or cybernetic.' },
      ],
      lore: 'You don\'t use Google. Google uses you.',
    },
    {
      id: 'int-arcane-scholar',
      label: 'Arcane Scholar',
      rarity: Rarity.Rare,
      weight: 15,
      tags: ['arcane', 'psychic'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 16, description: '+16 Intelligence. Ancient knowledge unlocked.' },
        { type: 'passive', description: 'Can read any language, including dead ones.' },
      ],
      lore: 'You\'ve read the forbidden library. Twice. The librarian is concerned.',
    },
    {
      id: 'int-neural-link',
      label: 'Neural Link',
      rarity: Rarity.Epic,
      weight: 10,
      tags: ['cyber', 'psychic'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 20, description: '+20 Intelligence. Brain-computer interface.' },
        { type: 'ability', description: 'Data Stream: Download combat data in real-time.' },
        { type: 'passive', description: 'Can interface with any digital system by thought.' },
      ],
      lore: 'Your brain has WiFi. The password is "IAmVeryS mart".',
    },
    {
      id: 'int-hive-mind',
      label: 'Hive Mind',
      rarity: Rarity.Epic,
      weight: 8,
      tags: ['psychic', 'cosmic'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 22, description: '+22 Intelligence. Collective consciousness.' },
        { type: 'ability', description: 'Shared Thought: Telepathic link with all allies.' },
      ],
      lore: 'One brain is good. A thousand brains in a trenchcoat is better.',
    },
    {
      id: 'int-mastermind',
      label: 'Mastermind',
      rarity: Rarity.Legendary,
      weight: 5,
      tags: ['psychic', 'stealth'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 28, description: '+28 Intelligence. 12-dimensional chess player.' },
        { type: 'ability', description: 'Grand Plan: Predict and counter enemy actions for one full encounter.' },
        { type: 'passive', description: 'NPCs are slightly afraid of how smart you are.' },
      ],
      lore: 'Your plans have backup plans. Those backup plans have contingencies. The contingencies have escape routes.',
    },
    {
      id: 'int-singularity',
      label: 'Singularity Core',
      rarity: Rarity.Legendary,
      weight: 4,
      tags: ['cyber', 'cosmic'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 30, description: '+30 Intelligence. Post-human cognition.' },
        { type: 'ability', description: 'Singularity Burst: Process entire battlefields in microseconds.' },
      ],
      lore: 'You\'ve passed the Turing test — as the examiner.',
    },
    {
      id: 'int-omniscient',
      label: 'Omniscient',
      rarity: Rarity.Mythic,
      weight: 2,
      tags: ['psychic', 'cosmic', 'divine'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 40, description: '+40 Intelligence. Know everything about everything.' },
        { type: 'ability', description: 'All-Knowing Eye: See all hidden objects, enemies, and paths.' },
        { type: 'passive', description: 'Cannot be surprised. Cannot be lied to.' },
      ],
      lore: 'You already know how this story ends. It\'s boring.',
    },
    {
      id: 'int-forbidden-knowledge',
      label: 'Forbidden Knowledge',
      rarity: Rarity.Forbidden,
      weight: 1,
      tags: ['psychic', 'cosmic', 'cursed'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 50, description: '+50 Intelligence. You know things no mind should contain.' },
        { type: 'ability', description: 'Eldritch Insight: Understand the source code of reality.' },
        { type: 'curse', description: 'Chronic existential dread. You know too much to be happy.' },
      ],
      lore: 'You gazed into the abyss of knowledge. It filed a restraining order.',
    },
  ],
};
