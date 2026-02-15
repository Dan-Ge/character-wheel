// ── Seed System ──
// Deterministic PRNG + seed encoding/decoding for community features.

/**
 * Simple deterministic hash from a string.
 */
export function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Create a seeded PRNG function that returns values between 0 and 1.
 * Uses a linear congruential generator.
 */
export function createSeededRandom(seed: string): () => number {
  let s = hashSeed(seed);
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/**
 * Generate a random seed string.
 */
export function generateSeed(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let seed = '';
  for (let i = 0; i < 8; i++) {
    seed += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return seed;
}

/**
 * Generate a daily seed based on the current date.
 */
export function getDailySeed(): string {
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  return `daily-${dateStr}-${hashSeed(dateStr).toString(36)}`;
}

/**
 * Encode a build's results into a compact share code.
 */
export function encodeShareCode(
  season: string,
  seed: string,
  segmentIds: string[]
): string {
  const seasonShort = season.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  const seedShort = seed ? seed.slice(0, 6) : Math.random().toString(36).slice(2, 8);
  const segIds = segmentIds.map(id => id.slice(0, 3)).join('');
  return `${seasonShort}-${seedShort}-${segIds}`.toUpperCase();
}

/**
 * Decode a share code into its components.
 */
export function decodeShareCode(code: string): {
  season: string;
  seed: string;
  segmentHints: string[];
} | null {
  const parts = code.split('-');
  if (parts.length < 3) return null;

  const season = parts[0].toLowerCase();
  const seed = parts[1].toLowerCase();
  const segmentStr = parts.slice(2).join('');

  // Each segment hint is 3 chars
  const segmentHints: string[] = [];
  for (let i = 0; i < segmentStr.length; i += 3) {
    segmentHints.push(segmentStr.slice(i, i + 3).toLowerCase());
  }

  return { season, seed, segmentHints };
}
