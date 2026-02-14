// ── PvP Encounter System ──
// Multiplayer combat resolution. Characters in the same region
// can encounter each other for PvP combat with risk and reward.

import type {
  StoryCharacter,
  PvPEncounter,
  PvPRound,
  PvPTrigger,
  StoryOutcome,
  RelationshipType,
} from '../types/storyTypes';
import type { Tag } from '../types';

// ═══════════════════════════════════════════════
// ─── Constants ───
// ═══════════════════════════════════════════════

const MAX_PVP_ROUNDS = 5;

const POWER_TIER_ORDER = [
  'novice', 'adventurer', 'veteran', 'champion',
  'hero', 'legend', 'mythic', 'ascendant',
] as const;

/**
 * Tag combat interactions — some tags counter others.
 * Key beats value for a +2 roll bonus.
 */
const TAG_COUNTERS: Record<string, Tag[]> = {
  fire: ['ice', 'nature'],
  ice: ['speed', 'beast'],
  void: ['holy', 'arcane'],
  tech: ['nature', 'beast'],
  stealth: ['brute', 'tank'],
  arcane: ['tech', 'mecha'],
  nature: ['mecha', 'cyber'],
  holy: ['necro', 'shadow'],
  psychic: ['brute', 'beast'],
  speed: ['tank', 'heavy'],
};

// ═══════════════════════════════════════════════
// ─── PvP Matching ───
// ═══════════════════════════════════════════════

/**
 * Check if two characters can have a PvP encounter.
 */
export function canEncounter(
  attacker: StoryCharacter,
  defender: StoryCharacter
): { canFight: boolean; trigger: PvPTrigger; reason: string } {
  // Dead/ascended characters can't fight
  if (attacker.status === 'dead' || attacker.status === 'ascended' ||
      defender.status === 'dead' || defender.status === 'ascended') {
    return { canFight: false, trigger: 'random_encounter', reason: 'Character is not active' };
  }

  // Don't fight yourself
  if (attacker.storyId === defender.storyId) {
    return { canFight: false, trigger: 'random_encounter', reason: 'Cannot fight yourself' };
  }

  // Same region
  if (attacker.currentRegion === defender.currentRegion) {
    // Check for existing rivalry
    const rivalry = attacker.relationships.find(
      (r) => r.targetCharacterId === defender.storyId &&
        (r.type === 'rival' || r.type === 'enemy')
    );

    if (rivalry) {
      return {
        canFight: true,
        trigger: 'rival_encounter',
        reason: `${attacker.build.name} and ${defender.build.name} are ${rivalry.type}s in the same region!`,
      };
    }

    return {
      canFight: true,
      trigger: 'same_region',
      reason: `Both adventurers are in ${attacker.currentRegion}`,
    };
  }

  return { canFight: false, trigger: 'random_encounter', reason: 'Not in the same region' };
}

/**
 * Find potential PvP opponents for a character from nearby players.
 */
export function findOpponents(
  character: StoryCharacter,
  allCharacters: StoryCharacter[]
): StoryCharacter[] {
  return allCharacters.filter((other) => {
    const { canFight } = canEncounter(character, other);
    return canFight;
  });
}

// ═══════════════════════════════════════════════
// ─── Combat Resolution ───
// ═══════════════════════════════════════════════

/**
 * Resolve a full PvP encounter between two characters.
 * Returns the encounter result with all rounds and outcomes.
 */
export function resolvePvPEncounter(
  attacker: StoryCharacter,
  defender: StoryCharacter,
  trigger: PvPTrigger,
  seed?: number
): PvPEncounter {
  const rng = seed ? mulberry32(seed) : Math.random;

  const rounds: PvPRound[] = [];
  let attackerHp = attacker.hp;
  let defenderHp = defender.hp;

  for (let round = 1; round <= MAX_PVP_ROUNDS; round++) {
    if (attackerHp <= 0 || defenderHp <= 0) break;

    const roundResult = resolveRound(
      attacker, defender,
      attackerHp, defenderHp,
      round, rng
    );

    rounds.push(roundResult);
    attackerHp -= roundResult.defenderDamage;
    defenderHp -= roundResult.attackerDamage;
  }

  // Determine winner
  let winnerId: string | null = null;
  if (attackerHp <= 0 && defenderHp <= 0) {
    winnerId = null; // Draw
  } else if (defenderHp <= 0) {
    winnerId = attacker.storyId;
  } else if (attackerHp <= 0) {
    winnerId = defender.storyId;
  } else {
    // Went to max rounds — winner is whoever has more HP percentage
    const attackerPercent = attackerHp / attacker.maxHp;
    const defenderPercent = defenderHp / defender.maxHp;
    winnerId = attackerPercent >= defenderPercent ? attacker.storyId : defender.storyId;
  }

  // Generate rewards and penalties
  const { winnerRewards, loserPenalties } = generatePvPRewards(
    attacker, defender, winnerId, trigger
  );

  return {
    id: `pvp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    attackerId: attacker.storyId,
    attackerName: attacker.build.name,
    defenderId: defender.storyId,
    defenderName: defender.build.name,
    region: attacker.currentRegion,
    triggerReason: trigger,
    rounds,
    winnerId,
    winnerRewards,
    loserPenalties,
    timestamp: Date.now(),
  };
}

/**
 * Resolve a single round of PvP combat.
 */
function resolveRound(
  attacker: StoryCharacter,
  defender: StoryCharacter,
  _attackerHp: number,
  _defenderHp: number,
  roundNumber: number,
  rng: () => number
): PvPRound {
  // Base rolls (d20)
  let attackerRoll = Math.floor(rng() * 20) + 1;
  let defenderRoll = Math.floor(rng() * 20) + 1;

  // Power tier modifier
  const aTier = POWER_TIER_ORDER.indexOf(attacker.powerTier as typeof POWER_TIER_ORDER[number]);
  const dTier = POWER_TIER_ORDER.indexOf(defender.powerTier as typeof POWER_TIER_ORDER[number]);
  attackerRoll += Math.floor(aTier / 2);
  defenderRoll += Math.floor(dTier / 2);

  // Level modifier
  attackerRoll += Math.floor(attacker.level / 5);
  defenderRoll += Math.floor(defender.level / 5);

  // Tag counter bonuses
  const attackerCounterBonus = computeTagCounterBonus(
    attacker.build.tags, defender.build.tags
  );
  const defenderCounterBonus = computeTagCounterBonus(
    defender.build.tags, attacker.build.tags
  );
  attackerRoll += attackerCounterBonus;
  defenderRoll += defenderCounterBonus;

  // Status effect modifiers
  if (attacker.status === 'injured') attackerRoll -= 2;
  if (attacker.status === 'near_death') attackerRoll -= 4;
  if (defender.status === 'injured') defenderRoll -= 2;
  if (defender.status === 'near_death') defenderRoll -= 4;

  // Calculate damage
  const baseDamage = 10 + Math.floor(rng() * 15);
  const attackerDamage = attackerRoll > defenderRoll
    ? baseDamage + (attackerRoll - defenderRoll) * 2
    : Math.floor(baseDamage * 0.3);
  const defenderDamage = defenderRoll > attackerRoll
    ? baseDamage + (defenderRoll - attackerRoll) * 2
    : Math.floor(baseDamage * 0.3);

  // Generate narrative
  const narrative = generateRoundNarrative(
    attacker.build.name, defender.build.name,
    attackerRoll, defenderRoll,
    attackerDamage, defenderDamage,
    roundNumber
  );

  return {
    roundNumber,
    attackerRoll,
    defenderRoll,
    attackerDamage,
    defenderDamage,
    narrative,
  };
}

/**
 * Compute tag counter bonus: +2 per counter tag matchup.
 */
function computeTagCounterBonus(myTags: Tag[], theirTags: Tag[]): number {
  let bonus = 0;
  for (const tag of myTags) {
    const counters = TAG_COUNTERS[tag];
    if (counters) {
      for (const counter of counters) {
        if (theirTags.includes(counter)) {
          bonus += 2;
        }
      }
    }
  }
  return Math.min(bonus, 6); // Cap at +6
}

// ═══════════════════════════════════════════════
// ─── PvP Rewards & Penalties ───
// ═══════════════════════════════════════════════

function generatePvPRewards(
  attacker: StoryCharacter,
  defender: StoryCharacter,
  winnerId: string | null,
  trigger: PvPTrigger
): { winnerRewards: StoryOutcome[]; loserPenalties: StoryOutcome[] } {
  const isRivalry = trigger === 'rival_encounter';
  const xpBase = isRivalry ? 80 : 50;

  const winnerRewards: StoryOutcome[] = [
    {
      id: 'pvp-win-reward',
      description: 'Victory in PvP',
      effects: [
        { type: 'xp_gain', value: xpBase, description: `+${xpBase} XP (PvP victory)` },
        {
          type: 'reputation_change',
          target: attacker.currentRegion,
          value: 10,
          description: 'Reputation +10 (PvP victor)',
        },
      ],
      narrative: winnerId === attacker.storyId
        ? `${attacker.build.name} stands victorious over ${defender.build.name}. The region takes notice.`
        : `${defender.build.name} repels ${attacker.build.name}'s assault. Respect is earned.`,
    },
  ];

  // Add title for rivalry victory
  if (isRivalry) {
    winnerRewards[0].effects.push({
      type: 'title_gain',
      stringValue: 'Rival Slayer',
      description: 'Title: Rival Slayer',
    });
  }

  const loserPenalties: StoryOutcome[] = [
    {
      id: 'pvp-loss-penalty',
      description: 'Defeat in PvP',
      effects: [
        { type: 'hp_change', value: -20, description: '-20 HP (post-combat)' },
        { type: 'xp_gain', value: Math.floor(xpBase * 0.3), description: `+${Math.floor(xpBase * 0.3)} XP (learned from defeat)` },
      ],
      narrative: winnerId === attacker.storyId
        ? `${defender.build.name} falls. A painful lesson in combat.`
        : `${attacker.build.name}'s attack fails. Retreat and regroup.`,
    },
  ];

  // Death risk for extreme power difference
  const winnerTier = winnerId === attacker.storyId
    ? POWER_TIER_ORDER.indexOf(attacker.powerTier as typeof POWER_TIER_ORDER[number])
    : POWER_TIER_ORDER.indexOf(defender.powerTier as typeof POWER_TIER_ORDER[number]);
  const loserTier = winnerId === attacker.storyId
    ? POWER_TIER_ORDER.indexOf(defender.powerTier as typeof POWER_TIER_ORDER[number])
    : POWER_TIER_ORDER.indexOf(attacker.powerTier as typeof POWER_TIER_ORDER[number]);

  if (winnerTier - loserTier >= 3) {
    loserPenalties[0].effects.push({
      type: 'status_change',
      stringValue: 'near_death',
      description: 'Near death from overwhelming force',
    });
  }

  return { winnerRewards, loserPenalties };
}

// ═══════════════════════════════════════════════
// ─── PvP Application ───
// ═══════════════════════════════════════════════

/**
 * Apply PvP results to both characters.
 */
export function applyPvPResults(
  attacker: StoryCharacter,
  defender: StoryCharacter,
  encounter: PvPEncounter
): { updatedAttacker: StoryCharacter; updatedDefender: StoryCharacter } {
  let updatedAttacker = { ...attacker };
  let updatedDefender = { ...defender };

  // Apply HP changes from rounds
  const totalAttackerDamageTaken = encounter.rounds.reduce(
    (sum, r) => sum + r.defenderDamage, 0
  );
  const totalDefenderDamageTaken = encounter.rounds.reduce(
    (sum, r) => sum + r.attackerDamage, 0
  );

  updatedAttacker.hp = Math.max(0, updatedAttacker.hp - totalAttackerDamageTaken);
  updatedDefender.hp = Math.max(0, updatedDefender.hp - totalDefenderDamageTaken);

  // Apply rewards/penalties
  const isAttackerWinner = encounter.winnerId === attacker.storyId;

  if (isAttackerWinner) {
    updatedAttacker.victories += 1;
    updatedDefender.defeats += 1;
    for (const reward of encounter.winnerRewards) {
      for (const effect of reward.effects) {
        updatedAttacker = applySimpleEffect(updatedAttacker, effect);
      }
    }
    for (const penalty of encounter.loserPenalties) {
      for (const effect of penalty.effects) {
        updatedDefender = applySimpleEffect(updatedDefender, effect);
      }
    }
  } else if (encounter.winnerId === defender.storyId) {
    updatedDefender.victories += 1;
    updatedAttacker.defeats += 1;
    for (const reward of encounter.winnerRewards) {
      for (const effect of reward.effects) {
        updatedDefender = applySimpleEffect(updatedDefender, effect);
      }
    }
    for (const penalty of encounter.loserPenalties) {
      for (const effect of penalty.effects) {
        updatedAttacker = applySimpleEffect(updatedAttacker, effect);
      }
    }
  }

  // Update relationships
  updatedAttacker = updatePvPRelationship(updatedAttacker, updatedDefender, encounter);
  updatedDefender = updatePvPRelationship(updatedDefender, updatedAttacker, encounter);

  // Add story log entries
  const attackerLog = {
    timestamp: Date.now(),
    title: `PvP: vs ${defender.build.name}`,
    narrative: isAttackerWinner
      ? `Defeated ${defender.build.name} in combat!`
      : encounter.winnerId === null
        ? `Fought ${defender.build.name} to a draw.`
        : `Lost to ${defender.build.name} in combat.`,
    category: 'pvp' as const,
    sentiment: isAttackerWinner ? 'positive' as const : 'negative' as const,
    involvedTags: attacker.build.tags,
  };

  const defenderLog = {
    timestamp: Date.now(),
    title: `PvP: vs ${attacker.build.name}`,
    narrative: encounter.winnerId === defender.storyId
      ? `Defeated ${attacker.build.name} in combat!`
      : encounter.winnerId === null
        ? `Fought ${attacker.build.name} to a draw.`
        : `Lost to ${attacker.build.name} in combat.`,
    category: 'pvp' as const,
    sentiment: encounter.winnerId === defender.storyId ? 'positive' as const : 'negative' as const,
    involvedTags: defender.build.tags,
  };

  updatedAttacker.storyLog = [...updatedAttacker.storyLog, attackerLog];
  updatedDefender.storyLog = [...updatedDefender.storyLog, defenderLog];

  return { updatedAttacker, updatedDefender };
}

/**
 * Update or create a relationship based on PvP encounter.
 */
function updatePvPRelationship(
  character: StoryCharacter,
  opponent: StoryCharacter,
  encounter: PvPEncounter
): StoryCharacter {
  const existing = character.relationships.findIndex(
    (r) => r.targetCharacterId === opponent.storyId
  );

  const isWinner = encounter.winnerId === character.storyId;
  const levelChange = isWinner ? -10 : -15; // PvP always worsens relations

  if (existing >= 0) {
    const rels = [...character.relationships];
    const rel = rels[existing];
    const newLevel = Math.max(-100, rel.level + levelChange);

    // Determine new relationship type based on level
    let newType: RelationshipType = rel.type;
    if (newLevel <= -60) newType = 'enemy';
    else if (newLevel <= -20) newType = 'rival';

    rels[existing] = {
      ...rel,
      level: newLevel,
      type: newType,
      history: [
        ...rel.history,
        `PvP ${isWinner ? 'victory' : 'defeat'} in ${encounter.region}`,
      ],
      lastInteractionAt: Date.now(),
    };

    return { ...character, relationships: rels };
  }

  // Create new rivalry
  return {
    ...character,
    relationships: [
      ...character.relationships,
      {
        targetCharacterId: opponent.storyId,
        targetName: opponent.build.name,
        isPlayer: true,
        type: 'rival',
        level: levelChange,
        history: [`First PvP encounter in ${encounter.region}`],
        establishedAt: Date.now(),
        lastInteractionAt: Date.now(),
      },
    ],
  };
}

/**
 * Simple effect application for PvP (subset of full engine).
 */
function applySimpleEffect(
  character: StoryCharacter,
  effect: { type: string; target?: string; value?: number; stringValue?: string; description: string }
): StoryCharacter {
  const c = { ...character };

  switch (effect.type) {
    case 'xp_gain':
      c.xp += effect.value ?? 0;
      break;
    case 'hp_change':
      c.hp = Math.max(0, Math.min(c.maxHp, c.hp + (effect.value ?? 0)));
      break;
    case 'reputation_change':
      if (effect.target) {
        c.reputation = {
          ...c.reputation,
          [effect.target]: (c.reputation[effect.target] ?? 0) + (effect.value ?? 0),
        };
      }
      break;
    case 'title_gain':
      if (effect.stringValue && !c.titles.includes(effect.stringValue)) {
        c.titles = [...c.titles, effect.stringValue];
      }
      break;
    case 'status_change':
      if (effect.stringValue) {
        c.status = effect.stringValue as StoryCharacter['status'];
      }
      break;
  }

  return c;
}

// ═══════════════════════════════════════════════
// ─── Round Narrative Generation ───
// ═══════════════════════════════════════════════

function generateRoundNarrative(
  attackerName: string,
  defenderName: string,
  attackerRoll: number,
  defenderRoll: number,
  attackerDmg: number,
  defenderDmg: number,
  round: number
): string {
  const narratives = {
    attackerDominates: [
      `${attackerName} strikes with precision! ${defenderName} staggers.`,
      `A devastating blow from ${attackerName} rocks ${defenderName}.`,
      `${attackerName} sees an opening and takes it. ${defenderName} reels.`,
    ],
    defenderDominates: [
      `${defenderName} parries and counters! ${attackerName} takes damage.`,
      `${defenderName}'s defense turns into offense. ${attackerName} bleeds.`,
      `${attackerName}'s attack is deflected. ${defenderName} retaliates fiercely.`,
    ],
    close: [
      `Both fighters exchange blows! Neither gives ground.`,
      `A fierce exchange — both warriors take hits but stand firm.`,
      `They clash and separate, both breathing hard.`,
    ],
    nat20: [
      `CRITICAL HIT! A legendary strike that will be talked about for years!`,
    ],
    nat1: [
      `A fumble! An embarrassing misstep in the heat of battle.`,
    ],
  };

  if (attackerRoll === 20 || defenderRoll === 20) {
    return narratives.nat20[0];
  }
  if (attackerRoll === 1 || defenderRoll === 1) {
    return narratives.nat1[0];
  }

  const diff = attackerRoll - defenderRoll;
  if (diff > 5) {
    return narratives.attackerDominates[round % narratives.attackerDominates.length];
  }
  if (diff < -5) {
    return narratives.defenderDominates[round % narratives.defenderDominates.length];
  }
  return narratives.close[round % narratives.close.length];
}

// ─── Seeded RNG (local copy) ───

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
