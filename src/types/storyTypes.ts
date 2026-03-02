// ── Story Adventure Types ──
// Complete type system for the post-creation story/adventure mode.
// Characters live through procedurally generated stories with risk,
// rewards, alliances, rivalries, death, and ascension.

import type { Tag, Rarity, CharacterBuild } from './index';

// ═══════════════════════════════════════════════
// ─── Character Status & Lifecycle ───
// ═══════════════════════════════════════════════

/** A character's current life state */
export type CharacterStatus =
  | 'alive'           // Active and adventuring
  | 'injured'         // Alive but debuffed
  | 'near_death'      // One bad roll from death
  | 'dead'            // Permanently dead (unless resurrection mechanic)
  | 'ascended'        // Reached legendary status — becomes NPC legend
  | 'exiled'          // Banished — can return with penalty
  | 'corrupted'       // Taken over by dark forces — can be saved or lost
  | 'legendary'       // Completed a full story arc — bonus prestige
  | 'retired';        // Player chose to end the story peacefully

/** Character power level tiers (earned through story) */
export type PowerTier =
  | 'novice'          // Just created
  | 'adventurer'      // Survived first chapter
  | 'veteran'         // Multiple chapters completed
  | 'champion'        // Major arc completed
  | 'hero'            // Defeated a major threat
  | 'legend'          // Known across all regions
  | 'mythic'          // Transcended normal limits
  | 'ascendant';      // Beyond mortal power

// ═══════════════════════════════════════════════
// ─── Story Character (extended build) ───
// ═══════════════════════════════════════════════

/** A character in the story system — wraps CharacterBuild with story state */
export interface StoryCharacter {
  /** Reference to the original character build */
  build: CharacterBuild;
  /** Unique story character ID */
  storyId: string;
  /** Player ID for multiplayer */
  playerId: string;
  /** Current status */
  status: CharacterStatus;
  /** Power tier progression */
  powerTier: PowerTier;
  /** Current HP (0 = dead) */
  hp: number;
  /** Maximum HP */
  maxHp: number;
  /** Experience points earned through story */
  xp: number;
  /** Current level (derived from XP) */
  level: number;
  /** Current region on the world map */
  currentRegion: string;
  /** Completed story chapters */
  completedChapters: StoryChapter[];
  /** Current active chapter (null if between chapters) */
  activeChapter: StoryChapter | null;
  /** All relationships with other characters */
  relationships: Relationship[];
  /** Acquired traits from story events */
  acquiredTraits: StoryTrait[];
  /** Items/artifacts collected */
  inventory: StoryItem[];
  /** Titles earned */
  titles: string[];
  /** Kill count / victories */
  victories: number;
  /** Defeats suffered */
  defeats: number;
  /** Total story events experienced */
  eventsExperienced: number;
  /** Reputation scores per region */
  reputation: Record<string, number>;
  /** Active status effects */
  statusEffects: StatusEffect[];
  /** Story log — key moments */
  storyLog: StoryLogEntry[];
  /** Timestamp of creation */
  createdAt: number;
  /** Timestamp of last activity */
  lastActiveAt: number;
}

// ═══════════════════════════════════════════════
// ─── Story Events ───
// ═══════════════════════════════════════════════

/** Categories of story events */
export type StoryEventCategory =
  | 'combat'          // Fight encounters
  | 'social'          // Dialogue, persuasion, negotiation
  | 'exploration'     // Discover new areas, treasures, secrets
  | 'mystery'         // Puzzles, investigations, plot twists
  | 'crisis'          // Urgent threats — act fast or lose something
  | 'trade'           // Barter, buy, sell, gamble
  | 'alliance'        // Form bonds with NPCs or other players
  | 'betrayal'        // Someone turns on you (or you on them)
  | 'divine'          // Encounters with gods, cosmic beings
  | 'curse'           // Something terrible and persistent happens
  | 'blessing'        // Something wonderful and persistent happens
  | 'training'        // Level up, learn new skills
  | 'pvp'             // Encounter with another player's character
  | 'boss'            // Major antagonist encounter
  | 'rest'            // Heal, recover, reflect
  | 'random';         // Wild card — anything goes

/** A single story event / encounter */
export interface StoryEvent {
  id: string;
  title: string;
  description: string;
  category: StoryEventCategory;
  /** Which tags make this event more likely to appear */
  triggerTags: Tag[];
  /** Minimum power tier required */
  minTier: PowerTier;
  /** Maximum power tier (optional, for scaling) */
  maxTier?: PowerTier;
  /** Region(s) where this can occur */
  regions: string[];
  /** Rarity of this event appearing */
  rarity: Rarity;
  /** Available choices for the player */
  choices: StoryChoice[];
  /** Conditions that must be true for this event to trigger */
  conditions?: StoryCondition[];
  /** Is this a season-specific event? */
  seasonId?: string;
  /** Can this event repeat for the same character? */
  repeatable: boolean;
  /** Flavor text / atmosphere */
  flavor?: string;
  /** Visual theme hint */
  visualTheme?: string;
}

/** A choice the player can make during a story event */
export interface StoryChoice {
  id: string;
  label: string;
  description: string;
  /** Required tags to unlock this choice */
  requiredTags?: Tag[];
  /** Required minimum stat values */
  requiredStats?: Record<string, number>;
  /** Required items */
  requiredItems?: string[];
  /** Required relationship level */
  requiredRelationship?: { characterId: string; minLevel: number };
  /** The type of check (if any) to determine success */
  check?: StoryCheck;
  /** Outcomes if check passes (or if no check) */
  successOutcomes: StoryOutcome[];
  /** Outcomes if check fails */
  failureOutcomes?: StoryOutcome[];
  /** Risk level indicator for UI */
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'extreme' | 'lethal';
  /** Flavor text for choosing this */
  flavor?: string;
}

/** A dice/stat check that determines success or failure */
export interface StoryCheck {
  /** What kind of check */
  type: 'stat' | 'tag' | 'luck' | 'combat' | 'social' | 'item';
  /** Target stat or tag to check against */
  target: string;
  /** Difficulty (1-20+, DnD-style) */
  difficulty: number;
  /** Bonus from matching tags */
  tagBonus?: Tag[];
  /** Can the player use items to boost? */
  itemBoostAllowed?: boolean;
}

// ═══════════════════════════════════════════════
// ─── Story Outcomes ───
// ═══════════════════════════════════════════════

/** What happens as a result of a choice */
export interface StoryOutcome {
  id: string;
  description: string;
  /** Effects applied to the character */
  effects: StoryEffect[];
  /** Next event triggered (chain events) */
  nextEventId?: string;
  /** Narrative text shown to the player */
  narrative: string;
  /** Is this a critical/climactic outcome? */
  isCritical?: boolean;
}

/** Types of effects that story outcomes can apply */
export type StoryEffectType =
  | 'hp_change'           // Damage or healing
  | 'xp_gain'             // Experience points
  | 'trait_gain'          // Acquire a new trait
  | 'trait_loss'          // Lose a trait
  | 'item_gain'           // Get an item
  | 'item_loss'           // Lose an item
  | 'status_change'       // Change character status (injured, corrupted, etc.)
  | 'relationship_change' // Alter relationship with another character
  | 'reputation_change'   // Alter reputation in a region
  | 'region_unlock'       // Unlock a new region
  | 'region_move'         // Move to a different region
  | 'title_gain'          // Earn a title
  | 'power_tier_up'       // Advance power tier
  | 'status_effect'       // Apply temporary effect
  | 'death'               // Character dies
  | 'resurrection'        // Come back from death
  | 'ascension'           // Transcend to legendary status
  | 'score_change'        // Modify character score
  | 'tag_gain'            // Gain a new tag
  | 'tag_loss'            // Lose a tag
  | 'spawn_rival'         // Create a rival NPC
  | 'spawn_ally'          // Create an ally NPC
  | 'trigger_pvp';        // Trigger PvP encounter

/** A single effect from a story outcome */
export interface StoryEffect {
  type: StoryEffectType;
  target?: string;         // What it affects (stat name, region id, etc.)
  value?: number;          // Magnitude
  stringValue?: string;    // For traits, items, titles, etc.
  duration?: number;       // Turns/chapters the effect lasts (0 = permanent)
  description: string;
}

// ═══════════════════════════════════════════════
// ─── Story Chapters & Arcs ───
// ═══════════════════════════════════════════════

/** A chapter = a sequence of story events forming a narrative arc */
export interface StoryChapter {
  id: string;
  title: string;
  description: string;
  /** Which region this chapter takes place in */
  region: string;
  /** Events in this chapter (completed and upcoming) */
  events: StoryEventResult[];
  /** Number of events in this chapter */
  totalEvents: number;
  /** Current event index */
  currentEventIndex: number;
  /** Is this chapter complete? */
  completed: boolean;
  /** Chapter outcome summary */
  summary?: string;
  /** Chapter difficulty */
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare' | 'legendary';
  /** Rewards for completing the chapter */
  completionRewards: StoryOutcome[];
  /** Timestamp */
  startedAt: number;
  completedAt?: number;
}

/** Result of a story event (after player made choice) */
export interface StoryEventResult {
  event: StoryEvent;
  chosenChoice: StoryChoice;
  checkRoll?: number;       // The actual roll (1-20)
  checkPassed?: boolean;    // Did they pass?
  outcomeApplied: StoryOutcome;
  timestamp: number;
}

// ═══════════════════════════════════════════════
// ─── Relationships ───
// ═══════════════════════════════════════════════

export type RelationshipType =
  | 'ally'            // Fighting together
  | 'rival'           // Competitive but not hostile
  | 'enemy'           // Active hostility
  | 'mentor'          // Teacher relationship
  | 'student'         // Student relationship
  | 'lover'           // Romantic bond
  | 'betrayed'        // Was betrayed by this character
  | 'betrayer'        // Betrayed this character
  | 'neutral';        // No strong feelings

export interface Relationship {
  /** The other character's story ID */
  targetCharacterId: string;
  /** The other character's name */
  targetName: string;
  /** Is this an NPC or another player's character? */
  isPlayer: boolean;
  /** Relationship type */
  type: RelationshipType;
  /** Relationship strength (-100 to 100) */
  level: number;
  /** History of interactions */
  history: string[];
  /** When this relationship started */
  establishedAt: number;
  /** Last interaction timestamp */
  lastInteractionAt: number;
}

// ═══════════════════════════════════════════════
// ─── World Map & Regions ───
// ═══════════════════════════════════════════════

export interface WorldRegion {
  id: string;
  name: string;
  description: string;
  /** Biome / theme */
  biome: RegionBiome;
  /** Danger level (1-10) */
  dangerLevel: number;
  /** Tags associated with this region (affect which events spawn) */
  dominantTags: Tag[];
  /** Connected regions */
  connections: string[];
  /** Is this region unlocked for the character? */
  unlocked: boolean;
  /** Special modifiers active in this region */
  modifiers: RegionModifier[];
  /** NPCs present in this region */
  npcIds: string[];
  /** Players currently in this region */
  playerIds: string[];
  /** Season-specific visuals */
  visualTheme: string;
}

export type RegionBiome =
  | 'neon_city'       // Cyberpunk metropolis
  | 'crystal_wastes'  // Magical desert
  | 'shadow_forest'   // Dark enchanted woods
  | 'void_rift'       // Tear between dimensions
  | 'sky_citadel'     // Floating fortress
  | 'deep_net'        // Digital realm
  | 'ancient_temple'  // Ruins of old gods
  | 'mecha_foundry'   // Robot factory
  | 'cosmic_shore'    // Edge of the universe
  | 'underworld';     // Realm of the dead

export interface RegionModifier {
  id: string;
  name: string;
  description: string;
  /** Tags that get boosted in this region */
  boostedTags: Tag[];
  /** Tags that get weakened */
  weakenedTags: Tag[];
  /** Bonus/penalty to checks */
  checkModifier: number;
}

// ═══════════════════════════════════════════════
// ─── Story Traits & Items ───
// ═══════════════════════════════════════════════

/** Traits acquired through story events (not from wheels) */
export interface StoryTrait {
  id: string;
  name: string;
  description: string;
  /** Effect of this trait */
  effect: StoryEffect;
  /** Rarity */
  rarity: Rarity;
  /** Source event */
  sourceEventId: string;
  /** Is this permanent? */
  permanent: boolean;
  /** Tags this trait provides */
  grantedTags?: Tag[];
  /** Acquired timestamp */
  acquiredAt: number;
}

/** Items found during story adventures */
export interface StoryItem {
  id: string;
  name: string;
  description: string;
  /** Item type */
  itemType: 'weapon' | 'armor' | 'consumable' | 'artifact' | 'key' | 'cursed' | 'quest';
  /** Rarity */
  rarity: Rarity;
  /** Effects when used/equipped */
  effects: StoryEffect[];
  /** Can be used in checks? Provides bonus? */
  checkBonus?: { checkType: string; bonus: number };
  /** Uses remaining (null = infinite) */
  uses: number | null;
  /** Flavor text */
  lore: string;
}

/** Temporary status effects */
export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  /** Effect type */
  effect: StoryEffect;
  /** Remaining duration in events */
  remainingDuration: number;
  /** Source */
  sourceEventId: string;
}

// ═══════════════════════════════════════════════
// ─── Story Conditions ───
// ═══════════════════════════════════════════════

/** Conditions for events to trigger */
export interface StoryCondition {
  type: 'has_tag' | 'has_trait' | 'has_item' | 'min_level' | 'min_rep'
    | 'in_region' | 'has_relationship' | 'min_hp_percent' | 'status_is'
    | 'power_tier_is' | 'chapter_completed' | 'not_has_trait' | 'pvp_enabled';
  target: string;
  value?: number;
}

// ═══════════════════════════════════════════════
// ─── Story Log ───
// ═══════════════════════════════════════════════

export interface StoryLogEntry {
  timestamp: number;
  /** Short headline */
  title: string;
  /** Full narrative text */
  narrative: string;
  /** Event category */
  category: StoryEventCategory;
  /** Was this positive or negative? */
  sentiment: 'positive' | 'negative' | 'neutral' | 'dramatic';
  /** Key tags involved */
  involvedTags: Tag[];
}

// ═══════════════════════════════════════════════
// ─── PvP / Multiplayer ───
// ═══════════════════════════════════════════════

/** A PvP encounter between two player characters */
export interface PvPEncounter {
  id: string;
  /** Attacker */
  attackerId: string;
  attackerName: string;
  /** Defender */
  defenderId: string;
  defenderName: string;
  /** Region where the encounter happens */
  region: string;
  /** Why did they meet? */
  triggerReason: PvPTrigger;
  /** Combat rounds */
  rounds: PvPRound[];
  /** Winner (null if draw) */
  winnerId: string | null;
  /** Consequences for winner */
  winnerRewards: StoryOutcome[];
  /** Consequences for loser */
  loserPenalties: StoryOutcome[];
  /** Timestamp */
  timestamp: number;
}

export type PvPTrigger =
  | 'same_region'       // Both in same region
  | 'rival_encounter'   // Existing rivalry
  | 'bounty'            // One has a bounty
  | 'territory_dispute' // Both want the same region
  | 'random_encounter'  // Fate brought them together
  | 'quest_conflict'    // Both pursuing same objective
  | 'challenge';        // Direct challenge from one player

/** A single round in PvP combat */
export interface PvPRound {
  roundNumber: number;
  attackerRoll: number;
  defenderRoll: number;
  attackerDamage: number;
  defenderDamage: number;
  narrative: string;
}

// ═══════════════════════════════════════════════
// ─── Fate Wheel (Story Wheel) ───
// ═══════════════════════════════════════════════

/** The Fate Wheel determines what kind of story event happens next */
export interface FateWheelSlice {
  id: string;
  label: string;
  category: StoryEventCategory;
  weight: number;
  /** Modifier to event rarity (higher = rarer events) */
  rarityModifier: number;
  /** Description shown when landing on this slice */
  description: string;
  /** Visual color */
  color: string;
}

// ═══════════════════════════════════════════════
// ─── Story State (for Context) ───
// ═══════════════════════════════════════════════

/** Global story state managed by context */
export interface StoryState {
  /** Active story character (null if not in story mode) */
  activeCharacter: StoryCharacter | null;
  /** All story characters owned by this player */
  characters: StoryCharacter[];
  /** World regions */
  worldMap: WorldRegion[];
  /** Known other players' characters in the same regions */
  nearbyPlayers: StoryCharacter[];
  /** Active PvP encounter */
  activePvP: PvPEncounter | null;
  /** Current story screen */
  storyScreen: StoryScreen;
  /** Pending event (awaiting player choice) */
  pendingEvent: StoryEvent | null;
  /** Last roll result (for animation) */
  lastRoll: number | null;
  /** Story mode active? */
  isInStoryMode: boolean;
}

export type StoryScreen =
  | 'story_hub'          // Main story dashboard
  | 'world_map'          // Region selection
  | 'adventure'          // Active story event
  | 'combat'             // Combat encounter
  | 'pvp'                // PvP battle
  | 'character_sheet'    // Character details
  | 'story_log'          // Full story history
  | 'relationships'      // Relationship overview
  | 'inventory'          // Item management
  | 'chapter_summary'    // End of chapter recap
  | 'death_screen'       // Character died
  | 'ascension_screen';  // Character ascended
