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
  [Rarity.Common]:    '#1e1e36',
  [Rarity.Uncommon]:  '#122e1e',
  [Rarity.Rare]:      '#121e36',
  [Rarity.Epic]:      '#261240',
  [Rarity.Legendary]: '#362a08',
  [Rarity.Mythic]:    '#361228',
  [Rarity.Forbidden]: '#361212',
};

const RARITY_LABEL: Record<Rarity, string> = {
  [Rarity.Common]:    '#e5e7eb',
  [Rarity.Uncommon]:  '#86efac',
  [Rarity.Rare]:      '#93c5fd',
  [Rarity.Epic]:      '#d8b4fe',
  [Rarity.Legendary]: '#fef08a',
  [Rarity.Mythic]:    '#fbcfe8',
  [Rarity.Forbidden]: '#fecaca',
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
      borderColor: '#818cf8',
      borderWidth: 3,
      lineColor: '#4b5563',
      lineWidth: 1.5,
      radius: 0.92,
      itemLabelRadius: 0.88,
      itemLabelRadiusMax: 0.35,
      itemLabelAlign: 'right' as const,
      itemLabelFont: "'Inter', system-ui, sans-serif",
      itemLabelFontSizeMax: 20,
      itemLabelColors: items.map(i => i.labelColor),
      itemBackgroundColors: items.map(i => i.backgroundColor),
      pointerAngle: 0, // Pointer at the top (12 o'clock)
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
        <svg width="28" height="24" viewBox="0 0 28 24">
          <polygon points="14,24 0,0 28,0" fill="#818cf8" stroke="#a5b4fc" strokeWidth="1.5" />
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
