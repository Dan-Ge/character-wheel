// ── SpinWheel ──
// React wrapper around the `spin-wheel` library for a reliable,
// canvas-based, perfectly circular spin wheel.

import { useEffect, useRef } from 'react';
import { Wheel as SpinWheelLib } from 'spin-wheel';
import type { WheelModule, Segment } from '../types';
import { Rarity } from '../types';

// ─── Props ───

interface SpinWheelProps {
  wheel: WheelModule;
  onSpinComplete: (segment: Segment) => void;
  spinning: boolean;
  targetSegmentId?: string;
  size?: number;
  onTick?: () => void;
}

// ─── Rarity → Color maps ───

const RARITY_BG: Record<Rarity, string> = {
  [Rarity.Common]:    '#1a1a2e',
  [Rarity.Uncommon]:  '#0f2a1a',
  [Rarity.Rare]:      '#0f1a2e',
  [Rarity.Epic]:      '#1f0f2e',
  [Rarity.Legendary]: '#2a2000',
  [Rarity.Mythic]:    '#2a0f1f',
  [Rarity.Forbidden]: '#2a0f0f',
};

const RARITY_LABEL: Record<Rarity, string> = {
  [Rarity.Common]:    '#d1d5db',
  [Rarity.Uncommon]:  '#86efac',
  [Rarity.Rare]:      '#93c5fd',
  [Rarity.Epic]:      '#c084fc',
  [Rarity.Legendary]: '#fde047',
  [Rarity.Mythic]:    '#f9a8d4',
  [Rarity.Forbidden]: '#fca5a5',
};

const RARITY_ICONS: Record<Rarity, string> = {
  [Rarity.Common]:    '',
  [Rarity.Uncommon]:  '◆ ',
  [Rarity.Rare]:      '★ ',
  [Rarity.Epic]:      '♦ ',
  [Rarity.Legendary]: '⚜ ',
  [Rarity.Mythic]:    '✦ ',
  [Rarity.Forbidden]: '☠ ',
};

// ─── Component ───

export default function SpinWheel({
  wheel,
  onSpinComplete,
  spinning,
  targetSegmentId,
  size = 320,
  onTick,
}: SpinWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<InstanceType<typeof SpinWheelLib> | null>(null);
  const spinningRef = useRef(false);

  const segments = wheel.segments;

  // ── Build items from segments ──
  const items = segments.map((seg) => ({
    label: `${RARITY_ICONS[seg.rarity]}${seg.label}`,
    backgroundColor: RARITY_BG[seg.rarity],
    labelColor: RARITY_LABEL[seg.rarity],
    weight: seg.weight,
    value: seg, // Store reference to our segment
  }));

  // ── Initialize wheel ──
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous wheel
    if (wheelRef.current) {
      wheelRef.current.remove();
      wheelRef.current = null;
    }

    const props = {
      items,
      borderColor: '#6366f1',
      borderWidth: 2,
      lineColor: '#374151',
      lineWidth: 1,
      radius: 0.92,
      itemLabelRadius: 0.88,
      itemLabelRadiusMax: 0.35,
      itemLabelAlign: 'right' as const,
      itemLabelFont: 'system-ui, sans-serif',
      itemLabelFontSizeMax: 16,
      itemLabelColors: items.map(i => i.labelColor),
      itemBackgroundColors: items.map(i => i.backgroundColor),
      pointerAngle: 90, // Pointer at the top (12 o'clock)
      rotationResistance: -60,
      isInteractive: false,
      onCurrentIndexChange: () => {
        onTick?.();
      },
      onRest: (_event: { currentIndex: number }) => {
        spinningRef.current = false;
        // Sound/visual feedback only — actual result logic is in useRunManager
        // The onSpinComplete from SpinScreen just plays the landing sound
        const idx = _event.currentIndex;
        if (idx >= 0 && idx < segments.length) {
          onSpinComplete(segments[idx]);
        }
      },
    };

    const w = new SpinWheelLib(containerRef.current, props);
    wheelRef.current = w;

    return () => {
      w.remove();
      wheelRef.current = null;
    };
  }, [wheel.id]); // Re-create when the wheel definition changes

  // ── Update callbacks when they change ──
  useEffect(() => {
    if (!wheelRef.current) return;
    wheelRef.current.onCurrentIndexChange = () => {
      onTick?.();
    };
    wheelRef.current.onRest = (_event: { currentIndex: number }) => {
      spinningRef.current = false;
      const idx = _event.currentIndex;
      if (idx >= 0 && idx < segments.length) {
        onSpinComplete(segments[idx]);
      }
    };
  }, [onSpinComplete, onTick, segments]);

  // ── Spin when `spinning` prop becomes true ──
  useEffect(() => {
    if (!spinning || !wheelRef.current || spinningRef.current) return;

    spinningRef.current = true;

    // Find target index
    let targetIdx = 0;
    if (targetSegmentId) {
      const idx = segments.findIndex(s => s.id === targetSegmentId);
      if (idx >= 0) targetIdx = idx;
    } else {
      targetIdx = Math.floor(Math.random() * segments.length);
    }

    const revolutions = 4 + Math.floor(Math.random() * 3);

    wheelRef.current.spinToItem(
      targetIdx,
      3000,     // duration in ms
      true,     // spinToCenter
      revolutions,
      1,        // direction: clockwise
    );
  }, [spinning, targetSegmentId, segments]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Pointer triangle at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10"
        style={{ filter: 'drop-shadow(0 0 4px rgba(99,102,241,0.6))' }}
      >
        <svg width="24" height="20" viewBox="0 0 24 20">
          <polygon points="12,20 0,0 24,0" fill="#6366f1" stroke="#818cf8" strokeWidth="1" />
        </svg>
      </div>

      {/* Wheel canvas container */}
      <div
        ref={containerRef}
        style={{ width: size, height: size }}
      />
    </div>
  );
}
