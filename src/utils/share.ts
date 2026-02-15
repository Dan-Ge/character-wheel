// ── Share Utilities ──
// Clipboard copy and text generation for build sharing.

import type { CharacterBuild } from '../types';

function getScoreTier(score: number): string {
  if (score >= 8000) return 'S+';
  if (score >= 6000) return 'S';
  if (score >= 4500) return 'A';
  if (score >= 3000) return 'B';
  if (score >= 1500) return 'C';
  return 'D';
}

/**
 * Generate a shareable text summary of a build.
 */
export function generateShareText(build: CharacterBuild): string {
  const tier = getScoreTier(build.score);
  const results = build.results
    .map(r => `  ${r.wheelCategory.toUpperCase()}: ${r.segment.label} [${r.segment.rarity}]`)
    .join('\n');

  const combo = build.signatureCombo
    ? `⚡ Combo: ${build.signatureCombo.name}`
    : '';

  const lines = [
    `🎡 CHARACTER WHEEL — ${build.name}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `Score: ${build.score.toLocaleString()} · Tier: ${tier} · Meme: ${build.memePotential}%`,
    '',
    results,
    '',
    combo,
    build.weakSpot ? `💀 Weak Spot: ${build.weakSpot}` : '',
    '',
    `🏷️ ${build.tags.join(', ')}`,
    '',
    `📋 Share Code: ${build.shareCode}`,
    `🌐 characterwheel.app`,
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Copy text to clipboard with fallback.
 * Returns true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for non-secure contexts
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

/**
 * Copy share code only.
 */
export async function copyShareCode(build: CharacterBuild): Promise<boolean> {
  return copyToClipboard(build.shareCode);
}

/**
 * Copy full build summary.
 */
export async function copyBuildSummary(build: CharacterBuild): Promise<boolean> {
  const text = generateShareText(build);
  return copyToClipboard(text);
}
