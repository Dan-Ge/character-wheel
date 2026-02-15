// ── Season 1: Cyber Mythic ──
// Where ancient myth collides with bleeding-edge cyberpunk.
// Neon gods. Chrome knights. Digital dragons. Eldritch hackers.

import type { Season, Segment } from '../../../types';
import { Rarity } from '../../../types';
import { speedWheel } from '../../wheels/speedWheel';
import { strengthWheel } from '../../wheels/strengthWheel';
import { intelligenceWheel } from '../../wheels/intelligenceWheel';
import { powerMultiplierWheel } from '../../wheels/powerMultiplierWheel';
import { powerWheel } from '../../wheels/powerWheel';
import { gearWheel } from '../../wheels/gearWheel';
import { companionWheel } from '../../wheels/companionWheel';
import { originWheel } from '../../wheels/originWheel';
import { flawWheel } from '../../wheels/flawWheel';
import { styleWheel } from '../../wheels/styleWheel';
import { raceWheel } from '../../wheels/raceWheel';
import { worldWheel } from '../../wheels/worldWheel';
import { alignmentWheel } from '../../wheels/alignmentWheel';

// ─── Season-Exclusive Segments ───
// Limited-time segments only available during Cyber Mythic.

export const CYBER_MYTHIC_LIMITED: Segment[] = [
  {
    id: 'limited-neon-dragon',
    label: 'Neon Dragon',
    rarity: Rarity.Mythic,
    weight: 1.5,
    tags: ['cyber', 'fire', 'cosmic'],
    effects: [
      { type: 'ability', description: 'Neon Breath: cone AoE with plasma fire. Ignites and overloads.' },
      { type: 'passive', description: 'Flight. You are a dragon. A neon dragon.' },
      { type: 'stat_boost', target: 'all', value: 18, description: '+18 all stats. Dragon supremacy.' },
    ],
    lore: 'A dragon reborn in circuitry and starlight. Its wings are solar panels. Its roar is a modem sound.',
    visualTheme: 'neon-dragon',
    sourceRef: 'Cyber-dragon trope',
  },
  {
    id: 'limited-glitch-oracle',
    label: 'Glitch Oracle',
    rarity: Rarity.Legendary,
    weight: 5,
    tags: ['cyber', 'temporal', 'psychic'],
    effects: [
      { type: 'ability', description: 'Predict the next 3 spin results. Can lock one.' },
      { type: 'passive', description: 'All probabilities visible. No hidden information.' },
    ],
    lore: 'A prophet of the digital age. Sees the future in error logs.',
    visualTheme: 'glitch-gold',
    sourceRef: 'Digital oracle archetype',
  },
  {
    id: 'limited-chrome-valkyrie',
    label: 'Chrome Valkyrie',
    rarity: Rarity.Epic,
    weight: 10,
    tags: ['mecha', 'holy', 'speed'],
    effects: [
      { type: 'ability', description: 'Valkyrie Dive: aerial charge dealing massive damage.' },
      { type: 'passive', description: 'Can carry a fallen ally back to safety.' },
      { type: 'stat_boost', target: 'agility', value: 15, description: '+15 AGI. Wings of chrome.' },
    ],
    lore: 'A mechanical angel. She chooses the worthy — and the worthy are whoever she decides.',
    visualTheme: 'chrome-gold',
    sourceRef: 'Sci-fi valkyrie concept',
  },
];

// ─── Season Definition ───

export const cyberMythicSeason: Season = {
  id: 'cyber-mythic',
  name: 'Cyber Mythic',
  theme: 'Ancient myth meets bleeding-edge cyberpunk',
  description:
    'When the old gods plugged into the network, everything changed. ' +
    'Neon temples. Chrome knights. Digital prophecies. ' +
    'In this season, mythology is an upgrade — and technology is divine.',
  wheels: [
    raceWheel,
    worldWheel,
    alignmentWheel,
    speedWheel,
    strengthWheel,
    intelligenceWheel,
    powerMultiplierWheel,
    powerWheel,
    gearWheel,
    companionWheel,
    originWheel,
    flawWheel,
    styleWheel,
  ],
  limitedSegments: CYBER_MYTHIC_LIMITED,
  colorPalette: {
    primary: '#06b6d4',    // Cyan
    secondary: '#a855f7',  // Purple
    accent: '#f59e0b',     // Amber
    background: '#0a0a1a', // Deep dark
    text: '#f1f5f9',       // Light slate
  },
  startDate: '2026-01-01',
  endDate: '2026-06-30',
  isActive: true,
};

// ─── Quick Access ───

/** Get all wheels for this season in order */
export function getSeasonWheels() {
  return cyberMythicSeason.wheels.sort((a, b) => a.order - b.order);
}

/** Get total number of unique segments across all wheels */
export function getTotalSegmentCount(): number {
  return cyberMythicSeason.wheels.reduce(
    (total, wheel) => total + wheel.segments.length,
    0
  );
}

/** Get all segments of a specific rarity */
export function getSegmentsByRarity(rarity: Rarity): Segment[] {
  const segments: Segment[] = [];
  for (const wheel of cyberMythicSeason.wheels) {
    segments.push(...wheel.segments.filter((s) => s.rarity === rarity));
  }
  return segments;
}

/** Get the season's limited segments */
export function getLimitedSegments(): Segment[] {
  return CYBER_MYTHIC_LIMITED;
}

export default cyberMythicSeason;
