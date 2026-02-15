// ── Storage ──
// LocalStorage persistence layer with versioning and migration support.

const STORAGE_KEY = 'character-wheel-data';
const STORAGE_VERSION = 1;

export interface StorageData {
  version: number;
  savedBuilds: unknown[];
  settings: unknown;
  stats: unknown;
  codexDiscovered: string[];
  achievements: unknown[];
  challengeResults: unknown[];
  lastUpdated: number;
}

const DEFAULT_DATA: StorageData = {
  version: STORAGE_VERSION,
  savedBuilds: [],
  settings: null,
  stats: null,
  codexDiscovered: [],
  achievements: [],
  challengeResults: [],
  lastUpdated: Date.now(),
};

// ─── Save ───

export function saveToStorage(data: Partial<StorageData>): boolean {
  try {
    const existing = loadFromStorage();
    const merged: StorageData = {
      ...existing,
      ...data,
      version: STORAGE_VERSION,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return true;
  } catch {
    console.warn('[Storage] Failed to save data');
    return false;
  }
}

// ─── Load ───

export function loadFromStorage(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };

    const parsed = JSON.parse(raw) as StorageData;

    // Version migration
    if (!parsed.version || parsed.version < STORAGE_VERSION) {
      return migrateData(parsed);
    }

    return parsed;
  } catch {
    console.warn('[Storage] Failed to load data, using defaults');
    return { ...DEFAULT_DATA };
  }
}

// ─── Clear ───

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('[Storage] Failed to clear data');
  }
}

// ─── Export / Import ───

export function exportData(): string {
  const data = loadFromStorage();
  return JSON.stringify(data, null, 2);
}

export function importData(json: string): StorageData | null {
  try {
    const parsed = JSON.parse(json) as StorageData;
    if (!parsed.version || !Array.isArray(parsed.savedBuilds)) {
      return null;
    }
    saveToStorage(parsed);
    return parsed;
  } catch {
    return null;
  }
}

// ─── Storage Size ───

export function getStorageSize(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return '0 B';
    const bytes = new Blob([raw]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } catch {
    return '? B';
  }
}

// ─── Migration ───

function migrateData(data: Partial<StorageData>): StorageData {
  // v0 → v1: ensure all fields exist
  return {
    version: STORAGE_VERSION,
    savedBuilds: data.savedBuilds ?? [],
    settings: data.settings ?? null,
    stats: data.stats ?? null,
    codexDiscovered: data.codexDiscovered ?? [],
    achievements: data.achievements ?? [],
    challengeResults: data.challengeResults ?? [],
    lastUpdated: Date.now(),
  };
}
