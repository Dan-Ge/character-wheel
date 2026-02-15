// ── Character Service ──
// Supabase CRUD for saved characters.
// Characters are stored with their build AND story data.
// Dead characters remain in DB but are filtered out for gameplay.

import { supabase } from '../lib/supabase';
import type { CharacterBuild } from '../types';
import type { StoryCharacter, CharacterStatus } from '../types/storyTypes';

// ─── Types ───

export interface SavedCharacterRow {
  id: string;
  player_id: string;
  build_data: CharacterBuild;
  story_data: StoryCharacter | null;
  name: string;
  status: CharacterStatus;
  level: number;
  score: number;
  power_tier: string;
  created_at: string;
  updated_at: string;
}

/** Playable statuses — characters in these states can enter the story */
const PLAYABLE_STATUSES: CharacterStatus[] = [
  'alive', 'injured', 'near_death', 'exiled', 'corrupted',
];

/** Graveyard statuses — permanently out of play */
const GRAVEYARD_STATUSES: CharacterStatus[] = ['dead'];

/** Hall of Fame statuses — completed their journey */
const HALL_OF_FAME_STATUSES: CharacterStatus[] = [
  'ascended', 'legendary', 'retired',
];

// ─── Fetch all characters for a player ───

export async function fetchPlayerCharacters(playerId: string): Promise<SavedCharacterRow[]> {
  const { data, error } = await supabase
    .from('saved_characters')
    .select('*')
    .eq('player_id', playerId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[CharacterService] Failed to fetch characters:', error.message);
    return [];
  }

  return (data ?? []) as SavedCharacterRow[];
}

// ─── Filter helpers ───

export function getPlayableCharacters(characters: SavedCharacterRow[]): SavedCharacterRow[] {
  return characters.filter(c => PLAYABLE_STATUSES.includes(c.status));
}

export function getGraveyardCharacters(characters: SavedCharacterRow[]): SavedCharacterRow[] {
  return characters.filter(c => GRAVEYARD_STATUSES.includes(c.status));
}

export function getHallOfFameCharacters(characters: SavedCharacterRow[]): SavedCharacterRow[] {
  return characters.filter(c => HALL_OF_FAME_STATUSES.includes(c.status));
}

// ─── Create a new character from a wheel build ───

export async function createCharacter(
  playerId: string,
  build: CharacterBuild,
): Promise<SavedCharacterRow | null> {
  const { data, error } = await supabase
    .from('saved_characters')
    .insert({
      player_id: playerId,
      build_data: build,
      story_data: null,
      name: build.name,
      status: 'alive',
      level: 1,
      score: build.score,
      power_tier: 'novice',
    })
    .select()
    .single();

  if (error) {
    console.error('[CharacterService] Failed to create character:', error.message);
    return null;
  }

  // Increment player's total_characters
  await supabase.rpc('increment_total_characters', { p_id: playerId }).catch(() => {
    // Non-critical — the count can desync
  });

  return data as SavedCharacterRow;
}

// ─── Update character story state ───

export async function updateCharacterStory(
  characterId: string,
  storyChar: StoryCharacter,
): Promise<boolean> {
  const { error } = await supabase
    .from('saved_characters')
    .update({
      story_data: storyChar,
      status: storyChar.status,
      level: storyChar.level,
      power_tier: storyChar.powerTier,
    })
    .eq('id', characterId);

  if (error) {
    console.error('[CharacterService] Failed to update story:', error.message);
    return false;
  }

  return true;
}

// ─── Mark character as dead ───

export async function killCharacter(characterId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_characters')
    .update({ status: 'dead' })
    .eq('id', characterId);

  if (error) {
    console.error('[CharacterService] Failed to kill character:', error.message);
    return false;
  }

  return true;
}

// ─── Delete character permanently ───

export async function deleteCharacter(characterId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_characters')
    .delete()
    .eq('id', characterId);

  if (error) {
    console.error('[CharacterService] Failed to delete character:', error.message);
    return false;
  }

  return true;
}

// ─── Get a single character ───

export async function getCharacter(characterId: string): Promise<SavedCharacterRow | null> {
  const { data, error } = await supabase
    .from('saved_characters')
    .select('*')
    .eq('id', characterId)
    .single();

  if (error) {
    console.error('[CharacterService] Failed to get character:', error.message);
    return null;
  }

  return data as SavedCharacterRow;
}
