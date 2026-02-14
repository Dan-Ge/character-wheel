// ── Core Game Types ──
// All type definitions for the Character Wheel game.
// This file is the single source of truth for all interfaces and enums.

// ─── Rarities ───

export enum Rarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
  Mythic = 'mythic',
  Forbidden = 'forbidden',
}

// ─── Tags ───

export type Tag =
  | 'fire' | 'ice' | 'void' | 'tech' | 'stealth' | 'tank'
  | 'support' | 'summoner' | 'retro' | 'arcane' | 'cyber'
  | 'plasma' | 'nature' | 'psychic' | 'shadow' | 'holy'
  | 'mecha' | 'beast' | 'speed' | 'brute' | 'charisma'
  | 'precision' | 'mutation' | 'cosmic' | 'necro' | 'temporal';

// ─── Wheel Category ───

export type WheelCategory =
  | 'stats' | 'power' | 'gear' | 'companion'
  | 'origin' | 'flaw' | 'style';

// ─── Segment (single slice of a wheel) ───

export interface Segment {
  id: string;
  label: string;
  rarity: Rarity;
  weight: number;           // Higher = more likely to land on
  tags: Tag[];
  effects: Effect[];
  lore: string;
  sourceRef?: string;       // Trope inspiration (never 1:1 copies)
  visualTheme?: string;     // CSS class or color hint
}

export interface Effect {
  type: 'stat_boost' | 'ability' | 'passive' | 'curse' | 'cosmetic' | 'combo_unlock';
  target?: string;          // What it affects
  value?: number;           // Magnitude
  description: string;
}

// ─── Wheel Module ───

export interface WheelModule {
  id: string;
  name: string;
  category: WheelCategory;
  icon: string;             // Emoji or icon identifier
  segments: Segment[];
  visualTheme: string;
  description: string;
  order: number;            // Display order in a run
}

// ─── Spin Result ───

export interface SpinResult {
  segment: Segment;
  wheelId: string;
  wheelName: string;
  wheelCategory: WheelCategory;
  timestamp: number;
  modifiersApplied: string[];
}

// ─── Build Context (run state) ───

export interface BuildContext {
  history: SpinResult[];
  collectedTags: Record<Tag, number>;
  rarityStreak: number;     // Spins since last Rare+ hit
  modifiers: Modifier[];
  totalScore: number;
  synergies: SynergyEvent[];
  conflicts: ConflictEvent[];
  flaws: SpinResult[];
  overclockActive: boolean;
  draftMode: boolean;
}

export interface Modifier {
  id: string;
  type: 'pity' | 'overclock' | 'synergy_bias' | 'season' | 'cursed_run';
  description: string;
  value: number;
}

// ─── Synergy & Conflict Rules ───

export interface SynergyRule {
  id: string;
  requiredTags: Tag[];
  minMatches: number;
  effect: string;
  bonusScore: number;
  description: string;
  comboName?: string;
  styleUpgrade?: string;
}

export interface ConflictRule {
  id: string;
  conflictingItems: string[];  // Segment IDs or tag combinations
  conflictingTags?: Tag[];
  penalty: number;
  paradoxAbility?: string;
  description: string;
}

// ─── Events (emitted by rules resolver) ───

export type GameEvent =
  | SynergyEvent
  | ConflictEvent
  | ScoreBonusEvent
  | RarityStreakEvent;

export interface SynergyEvent {
  type: 'synergy_unlocked';
  rule: SynergyRule;
  triggeringResults: SpinResult[];
  timestamp: number;
}

export interface ConflictEvent {
  type: 'conflict_detected';
  rule: ConflictRule;
  triggeringResults: SpinResult[];
  paradoxAbility?: string;
  timestamp: number;
}

export interface ScoreBonusEvent {
  type: 'score_bonus';
  amount: number;
  reason: string;
  timestamp: number;
}

export interface RarityStreakEvent {
  type: 'rarity_streak';
  currentStreak: number;
  pityBoost: number;
  timestamp: number;
}

// ─── Character Build (final result) ───

export interface CharacterBuild {
  id: string;
  name: string;              // Auto-generated build name
  results: SpinResult[];
  score: number;
  signatureCombo: SignatureCombo | null;
  weakSpot: string;
  memePotential: number;    // 0-100
  season: string;
  seed: string;
  shareCode: string;
  createdAt: number;
  tags: Tag[];
  rarityBreakdown: Record<Rarity, number>;
}

export interface SignatureCombo {
  name: string;
  components: SpinResult[];
  description: string;
  power: number;
}

// ─── Season ───

export interface Season {
  id: string;
  name: string;
  theme: string;
  description: string;
  wheels: WheelModule[];
  limitedSegments: Segment[];
  colorPalette: SeasonPalette;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface SeasonPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

// ─── Game Modes ───

export type GameMode = 'normal' | 'cursed' | 'draft' | 'duo';

// ─── Spin Options ───

export interface SpinOptions {
  overclock?: boolean;
  draftCount?: number;     // Number of options in draft mode (default: 3)
  seed?: number;           // For deterministic spins
  seasonModifiers?: Modifier[];
}

// ─── App Screen ───

export type Screen =
  | 'home'
  | 'season-select'
  | 'spin'
  | 'result'
  | 'codex'
  | 'gallery'
  | 'settings'
  | 'story';  // Story Adventure mode
