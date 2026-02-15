// ── Power Multiplier Wheel ──
// Determines how many times the Power wheel spins (0-3).
// Higher multiplier = lower probability.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const powerMultiplierWheel: WheelModule = {
  id: 'wheel-power-multiplier',
  name: 'Power Schicksal',
  category: 'power-multiplier',
  icon: '🎰',
  visualTheme: 'multiplier-neon',
  description: 'Das Schicksal entscheidet: Wie viele Power-Räder darfst du drehen?',
  order: 4,
  segments: [
    // 0x Power — weight 45 (highest probability)
    {
      id: 'pm-zero',
      label: '0× Power',
      rarity: Rarity.Common,
      weight: 45,
      tags: ['cursed'],
      effects: [
        { type: 'passive', description: 'Kein Power-Rad. Du verlässt dich auf rohe Stats.' },
      ],
      lore: 'Das Schicksal zeigt dir die kalte Schulter. Keine besonderen Kräfte für dich.',
    },
    // Duplicate 0x for more visual variety and higher combined probability
    {
      id: 'pm-zero-b',
      label: '0× Nada',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['cursed'],
      effects: [
        { type: 'passive', description: 'Kein Power-Rad. Viel Glück mit den Fäusten.' },
      ],
      lore: 'Null. Nix. Niente. Das Universum hat andere Pläne für dich.',
    },
    // 1x Power — weight 25
    {
      id: 'pm-one',
      label: '1× Power',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['support'],
      effects: [
        { type: 'passive', description: 'Ein Power-Rad. Standard-Held.' },
      ],
      lore: 'Eine Kraft. Klassisch. Zeitlos. Langweilig? Vielleicht.',
    },
    {
      id: 'pm-one-b',
      label: '1× Kraft',
      rarity: Rarity.Uncommon,
      weight: 22,
      tags: ['support'],
      effects: [
        { type: 'passive', description: 'Ein Power-Rad. Setze es weise ein.' },
      ],
      lore: 'Die meisten Helden kommen mit einer Kraft aus. Du auch.',
    },
    // 2x Power — weight 8
    {
      id: 'pm-two',
      label: '2× Power',
      rarity: Rarity.Epic,
      weight: 8,
      tags: ['cosmic'],
      effects: [
        { type: 'passive', description: 'Zwei Power-Räder! Dual-Wielding Kräfte.' },
      ],
      lore: 'Warum eine Kraft, wenn man zwei haben kann? Das Schicksal ist gnädig.',
    },
    {
      id: 'pm-two-b',
      label: '2× Doppelt',
      rarity: Rarity.Epic,
      weight: 6,
      tags: ['cosmic'],
      effects: [
        { type: 'passive', description: 'Zwei Power-Räder. Combo-Potential!' },
      ],
      lore: 'Doppelte Kraft, doppelter Spaß. Oder doppelte Probleme.',
    },
    // 3x Power — weight 2 (lowest probability)
    {
      id: 'pm-three',
      label: '3× JACKPOT',
      rarity: Rarity.Mythic,
      weight: 2,
      tags: ['cosmic', 'divine'],
      effects: [
        { type: 'passive', description: 'DREI Power-Räder! Absoluter Wahnsinn!' },
      ],
      lore: 'Die Sterne stehen in deiner Gunst. Drei Kräfte! Die Götter applaudieren.',
    },
    {
      id: 'pm-three-b',
      label: '3× ULTRA',
      rarity: Rarity.Forbidden,
      weight: 1,
      tags: ['cosmic', 'divine', 'cursed'],
      effects: [
        { type: 'passive', description: 'DREI Power-Räder! Mit großer Macht kommt großes Chaos.' },
      ],
      lore: 'Drei Kräfte? Das ist entweder genial oder eine Katastrophe. Wahrscheinlich beides.',
    },
  ],
};

/**
 * Extract the power multiplier count (0-3) from a multiplier segment.
 */
export function getPowerCount(segmentId: string): number {
  if (segmentId.startsWith('pm-three')) return 3;
  if (segmentId.startsWith('pm-two')) return 2;
  if (segmentId.startsWith('pm-one')) return 1;
  return 0;
}
