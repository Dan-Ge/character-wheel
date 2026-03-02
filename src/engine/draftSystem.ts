// ── Draft System ──
// Instead of a single spin result, the player is presented
// with multiple options (default: 3) and chooses one.
//
// All options are still weighted – so rarities are respected –
// but the player gains agency over their build.
//
// Key design: non-chosen options are discarded forever.
// No re-rolls, no banking. Pick or lose.

import type {
  WheelModule,
  BuildContext,
  SpinResult,
  SpinOptions,
} from '../types';
import {
  computeWeights,
  selectSegment,
  mulberry32,
  type ComputedWeight,
} from './spinEngine';

// ─── Draft Configuration ───

export interface DraftConfig {
  /** Number of options to present (default: 3) */
  optionCount: number;
  /** Whether to guarantee at least one Rare+ option (if possible) */
  guaranteeRarePlus: boolean;
  /** Whether duplicates are allowed in draft options */
  allowDuplicates: boolean;
}

export const DRAFT_DEFAULTS: DraftConfig = {
  optionCount: 3,
  guaranteeRarePlus: false,
  allowDuplicates: false,
};

// ─── Draft Result ───

export interface DraftOption {
  /** The potential spin result */
  result: SpinResult;
  /** Computed weight info for this option */
  weightInfo: ComputedWeight;
  /** Index in the draft options array */
  index: number;
}

export interface DraftResult {
  /** All options presented to the player */
  options: DraftOption[];
  /** The wheel this draft is for */
  wheelId: string;
  wheelName: string;
  /** Timestamp of draft generation */
  timestamp: number;
}

/**
 * Generate draft options for a wheel spin.
 * Produces N weighted-random options (no duplicates by default)
 * for the player to choose from.
 *
 * @param wheel - The wheel module to draft from
 * @param context - Current build context
 * @param options - Spin options (seed, overclock, etc.)
 * @param draftConfig - Draft-specific configuration
 * @returns DraftResult with N options
 */
export function generateDraft(
  wheel: WheelModule,
  context: BuildContext,
  options: SpinOptions = {},
  draftConfig: DraftConfig = DRAFT_DEFAULTS
): DraftResult {
  const count = options.draftCount ?? draftConfig.optionCount;

  // Setup PRNG
  let random: () => number;
  if (options.seed != null) {
    const rng = mulberry32(options.seed);
    random = rng;
  } else {
    random = Math.random;
  }

  // Compute weights
  const weights = computeWeights(wheel, context, options);

  // Select N unique options
  const selectedOptions: DraftOption[] = [];
  const usedSegmentIds = new Set<string>();
  let remainingWeights = [...weights];

  for (let i = 0; i < count && remainingWeights.length > 0; i++) {
    const selected = selectSegment(remainingWeights, random);

    const result: SpinResult = {
      segment: selected.segment,
      wheelId: wheel.id,
      wheelName: wheel.name,
      wheelCategory: wheel.category,
      timestamp: Date.now(),
      modifiersApplied: [...selected.modifiers, 'draft'],
    };

    selectedOptions.push({
      result,
      weightInfo: selected,
      index: i,
    });

    // Remove selected segment to avoid duplicates (unless allowed)
    if (!draftConfig.allowDuplicates) {
      usedSegmentIds.add(selected.segment.id);
      remainingWeights = remainingWeights.filter(
        (w) => !usedSegmentIds.has(w.segment.id)
      );
    }
  }

  return {
    options: selectedOptions,
    wheelId: wheel.id,
    wheelName: wheel.name,
    timestamp: Date.now(),
  };
}

/**
 * Apply the player's draft choice.
 * Returns the selected SpinResult (same as a normal spin would return).
 *
 * @param draft - The DraftResult to pick from
 * @param chosenIndex - Index of the chosen option (0-based)
 * @returns The chosen SpinResult
 */
export function applyDraftChoice(
  draft: DraftResult,
  chosenIndex: number
): SpinResult {
  if (chosenIndex < 0 || chosenIndex >= draft.options.length) {
    throw new Error(
      `Invalid draft choice: ${chosenIndex}. Must be 0-${draft.options.length - 1}`
    );
  }

  const chosen = draft.options[chosenIndex];

  // Update modifiers to reflect it was chosen (not just generated)
  return {
    ...chosen.result,
    modifiersApplied: [
      ...chosen.result.modifiersApplied,
      `draft-pick:${chosenIndex + 1}/${draft.options.length}`,
    ],
  };
}

/**
 * Get information about discarded options (for UI flavor text).
 */
export function getDiscardedOptions(
  draft: DraftResult,
  chosenIndex: number
): DraftOption[] {
  return draft.options.filter((_, i) => i !== chosenIndex);
}
