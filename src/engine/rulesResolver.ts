// ── Rules Resolver ──
// Central rules engine that processes each spin result and detects:
//   1. Newly unlocked synergies
//   2. Newly triggered conflicts (with paradox abilities)
//   3. Score adjustments (bonuses & penalties)
//   4. Rarity streak events (pity system feedback)
//
// applyRules(context, newResult) -> { updatedContext, events[] }

import type {
  BuildContext,
  SpinResult,
  GameEvent,
  SynergyEvent,
  ConflictEvent,
  ScoreBonusEvent,
  RarityStreakEvent,
  Tag,
  SynergyRule,
  ConflictRule,
} from '../types';
import { isHighTier } from '../data/rarities';
import { SYNERGY_RULES, isNewSynergy } from '../data/synergies';
import { CONFLICT_RULES, isNewConflict } from '../data/conflicts';

// ─── Result Interface ───

export interface RulesResult {
  /** Updated build context with new synergies, conflicts, score */
  updatedContext: BuildContext;
  /** Events emitted this spin (for UI toasts, animations) */
  events: GameEvent[];
}

// ─── Main Entry Point ───

/**
 * Apply all game rules after a spin result is added to the context.
 * Call this AFTER updateContextAfterSpin from spinEngine.
 *
 * @param context  The BuildContext already updated with the new spin
 * @param newResult  The SpinResult that was just added
 * @returns Updated context and emitted events
 */
export function applyRules(
  context: BuildContext,
  newResult: SpinResult
): RulesResult {
  const events: GameEvent[] = [];
  let ctx = { ...context };

  // Collect all tags for synergy/conflict checks
  const allTags = getAllTags(ctx);
  const previousTags = getPreviousTags(ctx, newResult);

  // 1. Check for new synergies
  const { ctx: ctxAfterSyn, events: synEvents } = checkSynergies(
    ctx,
    previousTags,
    allTags,
    newResult
  );
  ctx = ctxAfterSyn;
  events.push(...synEvents);

  // 2. Check for new conflicts
  const { ctx: ctxAfterCon, events: conEvents } = checkConflicts(
    ctx,
    previousTags,
    allTags,
    newResult
  );
  ctx = ctxAfterCon;
  events.push(...conEvents);

  // 3. Rarity streak event (for UI feedback)
  const streakEvent = checkRarityStreak(ctx, newResult);
  if (streakEvent) {
    events.push(streakEvent);
  }

  return { updatedContext: ctx, events };
}

// ─── Synergy Detection ───

function checkSynergies(
  context: BuildContext,
  previousTags: Tag[],
  currentTags: Tag[],
  triggerResult: SpinResult
): { ctx: BuildContext; events: SynergyEvent[] } {
  let ctx = { ...context };
  const events: SynergyEvent[] = [];
  const alreadyActiveIds = new Set(ctx.synergies.map((s) => s.rule.id));

  for (const rule of SYNERGY_RULES) {
    // Skip if this synergy was already active
    if (alreadyActiveIds.has(rule.id)) continue;

    if (isNewSynergy(rule, previousTags, currentTags)) {
      const event: SynergyEvent = {
        type: 'synergy_unlocked',
        rule,
        triggeringResults: findTriggeringResults(ctx, rule),
        timestamp: Date.now(),
      };

      events.push(event);
      ctx = applySynergyToContext(ctx, event);
    }
  }

  return { ctx, events };
}

function applySynergyToContext(
  context: BuildContext,
  event: SynergyEvent
): BuildContext {
  return {
    ...context,
    synergies: [...context.synergies, event],
    totalScore: context.totalScore + event.rule.bonusScore,
    modifiers: [
      ...context.modifiers,
      {
        id: `mod-${event.rule.id}`,
        type: 'synergy_bias' as const,
        description: `Synergy: ${event.rule.comboName || event.rule.id}`,
        value: event.rule.bonusScore,
      },
    ],
  };
}

// ─── Conflict Detection ───

function checkConflicts(
  context: BuildContext,
  previousTags: Tag[],
  currentTags: Tag[],
  triggerResult: SpinResult
): { ctx: BuildContext; events: ConflictEvent[] } {
  let ctx = { ...context };
  const events: ConflictEvent[] = [];
  const alreadyActiveIds = new Set(ctx.conflicts.map((c) => c.rule.id));

  for (const rule of CONFLICT_RULES) {
    // Skip if this conflict was already active
    if (alreadyActiveIds.has(rule.id)) continue;

    if (isNewConflict(rule, previousTags, currentTags)) {
      const event: ConflictEvent = {
        type: 'conflict_detected',
        rule,
        triggeringResults: findConflictTriggers(ctx, rule),
        paradoxAbility: rule.paradoxAbility,
        timestamp: Date.now(),
      };

      events.push(event);
      ctx = applyConflictToContext(ctx, event);
    }
  }

  return { ctx, events };
}

function applyConflictToContext(
  context: BuildContext,
  event: ConflictEvent
): BuildContext {
  return {
    ...context,
    conflicts: [...context.conflicts, event],
    totalScore: context.totalScore + event.rule.penalty, // penalty is negative
    modifiers: [
      ...context.modifiers,
      {
        id: `mod-${event.rule.id}`,
        type: 'synergy_bias' as const,
        description: `Conflict: ${event.rule.description}`,
        value: event.rule.penalty,
      },
    ],
  };
}

// ─── Rarity Streak ───

function checkRarityStreak(
  context: BuildContext,
  result: SpinResult
): RarityStreakEvent | null {
  // Only emit event if on a dry streak (3+ spins without Rare+)
  if (context.rarityStreak < 3) return null;

  // If we just hit a high tier, emit a "streak broken" event
  if (isHighTier(result.segment.rarity)) {
    return {
      type: 'rarity_streak',
      currentStreak: 0,
      pityBoost: 0,
      timestamp: Date.now(),
    };
  }

  // Otherwise emit current pity status
  const pityBoost = Math.min(context.rarityStreak * 3, 30);
  return {
    type: 'rarity_streak',
    currentStreak: context.rarityStreak,
    pityBoost,
    timestamp: Date.now(),
  };
}

// ─── Tag Helpers ───

/** Get all unique tags from the current context */
function getAllTags(context: BuildContext): Tag[] {
  return Object.entries(context.collectedTags)
    .filter(([, count]) => count > 0)
    .map(([tag]) => tag as Tag);
}

/** Get tags from all results EXCEPT the newest one */
function getPreviousTags(context: BuildContext, latestResult: SpinResult): Tag[] {
  const previousResults = context.history.filter(
    (r) => r.timestamp !== latestResult.timestamp || r.segment.id !== latestResult.segment.id
  );

  const tagSet = new Set<Tag>();
  for (const result of previousResults) {
    for (const tag of result.segment.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet);
}

/** Find the SpinResults that contributed tags to trigger a synergy */
function findTriggeringResults(
  context: BuildContext,
  rule: SynergyRule
): SpinResult[] {
  return context.history.filter((result) =>
    result.segment.tags.some((t) => rule.requiredTags.includes(t))
  );
}

/** Find the SpinResults that contributed tags to trigger a conflict */
function findConflictTriggers(
  context: BuildContext,
  rule: ConflictRule
): SpinResult[] {
  if (!rule.conflictingTags) return [];
  return context.history.filter((result) =>
    result.segment.tags.some((t) => rule.conflictingTags!.includes(t))
  );
}
