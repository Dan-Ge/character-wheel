// ── Companion Wheel ──
// Determines who or what follows the character around.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const companionWheel: WheelModule = {
  id: 'wheel-companion',
  name: 'Companion',
  category: 'companion',
  icon: '🐾',
  visualTheme: 'companion-green',
  description: 'Your loyal companion. Who (or what) follows you into chaos?',
  order: 4,
  segments: [
    {
      id: 'comp-stray-cat',
      label: 'Stray Cat',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['beast'],
      effects: [
        { type: 'passive', description: 'Occasionally brings you random items. Mostly useless ones.' },
        { type: 'cosmetic', description: 'Sits on your shoulder during idle animations.' },
      ],
      lore: 'It adopted you. You had no say in this. It judges your combat performance.',
    },
    {
      id: 'comp-repair-drone',
      label: 'Repair Drone',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['tech'],
      effects: [
        { type: 'passive', description: 'Slowly repairs gear during downtime. +1% HP regen per minute.' },
      ],
      lore: 'A tiny drone that fixes things. Its motivational beeps are oddly uplifting.',
    },
    {
      id: 'comp-ghost-lantern',
      label: 'Ghost Lantern',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['shadow', 'arcane'],
      effects: [
        { type: 'passive', description: 'Illuminates hidden paths. Reveals invisible enemies.' },
        { type: 'stat_boost', target: 'intelligence', value: 5, description: '+5 INT from spectral whispers.' },
      ],
      lore: 'A lantern containing a friendly ghost. It died of embarrassment. Still embarrassed.',
    },
    {
      id: 'comp-cyber-dog',
      label: 'Cyber Dog',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['cyber', 'beast'],
      effects: [
        { type: 'passive', description: 'Warns you of ambushes. +15% dodge during surprise attacks.' },
        { type: 'ability', description: 'Fetch Grenade: dog retrieves and returns enemy grenades.' },
      ],
      lore: 'Good boy. Chrome boy. Best boy. Built-in rocket-powered tail wagging.',
      visualTheme: 'neon-green',
    },
    {
      id: 'comp-pixie-swarm',
      label: 'Pixie Swarm',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['nature', 'support'],
      effects: [
        { type: 'passive', description: 'Heal 1% HP per second. Pixies sing annoying songs.' },
        { type: 'cosmetic', description: 'Sparkle trail follows you everywhere.' },
      ],
      lore: 'Tiny, glowing, extremely opinionated. They critique your fashion choices mid-combat.',
    },
    {
      id: 'comp-battle-golem',
      label: 'Battle Golem',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['mecha', 'tank'],
      effects: [
        { type: 'passive', description: 'Golem absorbs 20% of damage aimed at you.' },
        { type: 'stat_boost', target: 'defense', value: 10, description: '+10 DEF. Mobile cover.' },
        { type: 'ability', description: 'Golem Slam: AoE stun around the golem.' },
      ],
      lore: 'A walking boulder with anger issues. Follows simple commands. Mostly "SMASH".',
    },
    {
      id: 'comp-shadow-familiar',
      label: 'Shadow Familiar',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['shadow', 'stealth'],
      effects: [
        { type: 'passive', description: 'Your shadow acts independently. Can scout ahead.' },
        { type: 'ability', description: 'Shadow Swap: switch places with your shadow.' },
      ],
      lore: 'Your shadow grew sentient. It has opinions about your life choices. Mostly negative.',
    },
    {
      id: 'comp-retro-ai',
      label: 'Retro AI',
      rarity: Rarity.Rare,
      weight: 18,
      tags: ['retro', 'tech'],
      effects: [
        { type: 'passive', description: 'Provides tactical advice in 8-bit speech bubbles. +10% crit chance.' },
        { type: 'ability', description: 'IDDQD: AI activates 3 seconds of invulnerability. Once per battle.' },
      ],
      lore: 'A nostalgic AI from 1987. Thinks in pixels. Swears in ASCII.',
      visualTheme: 'pixel-green',
    },
    {
      id: 'comp-phoenix-hatchling',
      label: 'Phoenix Hatchling',
      rarity: Rarity.Epic,
      weight: 10,
      tags: ['fire', 'holy'],
      effects: [
        { type: 'passive', description: 'On death, phoenix revives you with 30% HP. Once per run.' },
        { type: 'ability', description: 'Flame Aura: burn nearby enemies for 5s.' },
        { type: 'stat_boost', target: 'charisma', value: 10, description: '+10 CHA. It is very cute.' },
      ],
      lore: 'A baby bird made of fire. Adorable. Sets your inventory on fire regularly.',
      visualTheme: 'flame-aura',
    },
    {
      id: 'comp-void-parasite',
      label: 'Void Parasite',
      rarity: Rarity.Legendary,
      weight: 5,
      tags: ['void', 'mutation'],
      effects: [
        { type: 'passive', description: 'Absorbs 30% of damage dealt to enemies as healing for you.' },
        { type: 'ability', description: 'Consume: devour a weak enemy to restore 50% HP.' },
        { type: 'stat_boost', target: 'strength', value: 15, description: '+15 STR. It makes you... hungrier.' },
      ],
      lore: 'Something latched onto your spine. It is helpful. This concerns you.',
      visualTheme: 'void-tendrils',
    },
    {
      id: 'comp-time-echo',
      label: 'Time Echo',
      rarity: Rarity.Mythic,
      weight: 1.5,
      tags: ['temporal', 'psychic'],
      effects: [
        { type: 'passive', description: 'A future version of you fights alongside you. Copies your abilities with 1s delay.' },
        { type: 'ability', description: 'Paradox Shield: future-you takes damage for present-you.' },
      ],
      lore: 'You from 5 seconds in the future. Keeps spoiling what happens next.',
      visualTheme: 'chrono-ghost',
    },
    {
      id: 'comp-cosmic-entity',
      label: 'Cosmic Entity',
      rarity: Rarity.Forbidden,
      weight: 0.5,
      tags: ['cosmic', 'void', 'psychic'],
      effects: [
        { type: 'passive', description: 'Reality warps around you. All enemy stats reduced by 20%.' },
        { type: 'ability', description: 'Judgment: entity decides if an enemy deserves to exist. 50/50 instant kill or full heal.' },
        { type: 'curse', description: 'Entity occasionally takes control. You attack random targets for 3s.' },
      ],
      lore: 'A being from beyond the observable universe. It finds you amusing. For now.',
      visualTheme: 'forbidden-pulse',
    },
  ],
};
