// ── Season Manager ──
// Manages season lifecycle, activation, and rotation.

import type { Season } from '../types';
import { cyberMythicSeason } from '../data/seasons/cyberMythic';

const ALL_SEASONS: Season[] = [
  cyberMythicSeason,
];

export function getActiveSeason(): Season {
  const active = ALL_SEASONS.find(s => s.isActive);
  return active ?? ALL_SEASONS[0];
}

export function getAllSeasons(): readonly Season[] {
  return ALL_SEASONS;
}

export function getSeasonById(id: string): Season | undefined {
  return ALL_SEASONS.find(s => s.id === id);
}

export function getSeasonStats(season: Season) {
  const totalSegments = season.wheels.reduce((sum, w) => sum + w.segments.length, 0);
  const totalWheels = season.wheels.length;
  const limitedCount = season.limitedSegments.length;

  return { totalSegments, totalWheels, limitedCount };
}
