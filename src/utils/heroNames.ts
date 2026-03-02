// ── Random Hero Name Generator ──
// Creates fun, random hero-style usernames for new registrations.
// Format: [Adjective][Noun][Number]

const PREFIXES = [
  'Shadow', 'Iron', 'Storm', 'Frost', 'Flame', 'Void', 'Star', 'Thunder',
  'Dark', 'Silver', 'Crimson', 'Golden', 'Crystal', 'Mystic', 'Ancient',
  'Neon', 'Chaos', 'Ember', 'Dusk', 'Dawn', 'Lunar', 'Solar', 'Rune',
  'Arcane', 'Cosmic', 'Savage', 'Silent', 'Swift', 'Wild', 'Brave',
  'Noble', 'Grim', 'Phantom', 'Steel', 'Ash', 'Blood', 'Ghost',
];

const NOUNS = [
  'Blade', 'Wolf', 'Hawk', 'Dragon', 'Knight', 'Mage', 'Titan',
  'Reaper', 'Hunter', 'Forge', 'Fang', 'Claw', 'Serpent', 'Phoenix',
  'Raven', 'Bear', 'Lion', 'Viper', 'Wraith', 'Golem', 'Sage',
  'Keeper', 'Walker', 'Slayer', 'Warden', 'Seeker', 'Guard', 'Striker',
  'Fury', 'Bane', 'Crown', 'Thorn', 'Shade', 'Spark', 'Storm',
  'Drifter', 'Prowler', 'Ranger', 'Scion', 'Oracle',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a random hero-style username like "ShadowWolf42" */
export function generateHeroName(): string {
  const prefix = pick(PREFIXES);
  const noun = pick(NOUNS);
  const num = Math.floor(Math.random() * 99) + 1;
  return `${prefix}${noun}${num}`;
}
