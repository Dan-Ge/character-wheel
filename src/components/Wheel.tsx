// ── Wheel ──
// Interactive SVG spin wheel with Framer Motion animation.
// Renders segments as pie slices with rarity-colored borders,
// text labels, and a smooth deceleration spin.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { WheelModule, Segment } from '../types';
import { Rarity } from '../types';

// ─── Props ───

interface WheelProps {
  wheel: WheelModule;
  onSpinComplete: (segment: Segment) => void;
  spinning: boolean;
  targetSegmentId?: string;
  size?: number;
  onTick?: () => void;
}

// ─── Rarity Color Map ───

const RARITY_COLORS: Record<Rarity, { fill: string; stroke: string; text: string }> = {
  [Rarity.Common]:    { fill: '#1a1a25', stroke: '#9ca3af', text: '#d1d5db' },
  [Rarity.Uncommon]:  { fill: '#0f2a1a', stroke: '#22c55e', text: '#86efac' },
  [Rarity.Rare]:      { fill: '#0f1a2e', stroke: '#3b82f6', text: '#93c5fd' },
  [Rarity.Epic]:      { fill: '#1f0f2e', stroke: '#a855f7', text: '#c084fc' },
  [Rarity.Legendary]: { fill: '#2a2000', stroke: '#eab308', text: '#fde047' },
  [Rarity.Mythic]:    { fill: '#2a0f1f', stroke: '#ec4899', text: '#f9a8d4' },
  [Rarity.Forbidden]: { fill: '#2a0f0f', stroke: '#ef4444', text: '#fca5a5' },
};

const RARITY_ICONS: Record<Rarity, string> = {
  [Rarity.Common]: '',
  [Rarity.Uncommon]: '◆',
  [Rarity.Rare]: '★',
  [Rarity.Epic]: '♦',
  [Rarity.Legendary]: '⚜',
  [Rarity.Mythic]: '✦',
  [Rarity.Forbidden]: '☠',
};

// ─── Component ───

export default function Wheel({
  wheel,
  onSpinComplete,
  spinning,
  targetSegmentId,
  size = 320,
  onTick,
}: WheelProps) {
  const controls = useAnimation();
  const [currentRotation, setCurrentRotation] = useState(0);
  const lastTickAngleRef = useRef(0);
  const animFrameRef = useRef<number>();
  const wheelRef = useRef<SVGGElement>(null);

  const segments = wheel.segments;
  const segmentCount = segments.length;
  const anglePerSegment = 360 / segmentCount;
  const center = size / 2;
  const radius = size / 2 - 8;

  // ── Compute segment paths ──
  const segmentPaths = useMemo(() => {
    return segments.map((seg, i) => {
      const startAngle = i * anglePerSegment - 90;
      const endAngle = startAngle + anglePerSegment;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const largeArc = anglePerSegment > 180 ? 1 : 0;

      const path = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');

      const midAngle = startAngle + anglePerSegment / 2;
      const midRad = (midAngle * Math.PI) / 180;
      const labelRadius = radius * 0.62;
      const labelX = center + labelRadius * Math.cos(midRad);
      const labelY = center + labelRadius * Math.sin(midRad);

      return { seg, path, labelX, labelY, midAngle, startAngle, endAngle };
    });
  }, [segments, anglePerSegment, center, radius]);

  // ── Determine target rotation ──
  const computeTargetRotation = useCallback(() => {
    let targetIdx = 0;
    if (targetSegmentId) {
      const idx = segments.findIndex(s => s.id === targetSegmentId);
      if (idx >= 0) targetIdx = idx;
    } else {
      targetIdx = Math.floor(Math.random() * segmentCount);
    }

    const targetCenter = targetIdx * anglePerSegment + anglePerSegment / 2;
    const extraTurns = 5 + Math.floor(Math.random() * 3);
    const totalRotation = 360 * extraTurns + (360 - targetCenter);

    return { totalRotation, targetIdx };
  }, [segments, targetSegmentId, segmentCount, anglePerSegment]);

  // ── Spin tick tracking ──
  useEffect(() => {
    if (!spinning || !onTick) return;

    let active = true;

    const trackRotation = () => {
      if (!active || !wheelRef.current) return;

      const style = window.getComputedStyle(wheelRef.current);
      const transform = style.transform;

      if (transform && transform !== 'none') {
        const values = transform.match(/matrix\((.+)\)/);
        if (values) {
          const parts = values[1].split(', ');
          const a = parseFloat(parts[0]);
          const b = parseFloat(parts[1]);
          const angle = Math.atan2(b, a) * (180 / Math.PI);
          const normalizedAngle = ((angle % 360) + 360) % 360;

          const segBoundary = anglePerSegment;
          const lastBucket = Math.floor(lastTickAngleRef.current / segBoundary);
          const currentBucket = Math.floor(normalizedAngle / segBoundary);

          if (currentBucket !== lastBucket) {
            onTick();
          }
          lastTickAngleRef.current = normalizedAngle;
        }
      }

      animFrameRef.current = requestAnimationFrame(trackRotation);
    };

    animFrameRef.current = requestAnimationFrame(trackRotation);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [spinning, onTick, anglePerSegment]);

  // ── Start spin animation ──
  useEffect(() => {
    if (!spinning) return;

    const { totalRotation, targetIdx } = computeTargetRotation();
    const newRotation = currentRotation + totalRotation;

    controls.start({
      rotate: newRotation,
      transition: {
        duration: 3,
        ease: [0.17, 0.67, 0.12, 0.99],
      },
    }).then(() => {
      setCurrentRotation(newRotation);
      onSpinComplete(segments[targetIdx]);
    });
  }, [spinning]); // eslint-disable-line react-hooks/exhaustive-deps

  const truncateLabel = (label: string, maxLen: number) => {
    if (label.length <= maxLen) return label;
    return label.slice(0, maxLen - 1) + '…';
  };

  const fontSize = segmentCount > 12 ? 8 : segmentCount > 8 ? 9 : 10;
  const maxLabelLen = segmentCount > 12 ? 10 : segmentCount > 8 ? 14 : 18;

  return (
    <div className="relative" style={{ width: size, height: size, aspectRatio: '1 / 1' }}>
      {/* Pointer */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10"
        style={{ filter: 'drop-shadow(0 0 4px rgba(99,102,241,0.6))' }}
      >
        <svg width="24" height="20" viewBox="0 0 24 20">
          <polygon points="12,20 0,0 24,0" fill="#6366f1" stroke="#818cf8" strokeWidth="1" />
        </svg>
      </div>

      {/* Wheel SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
        className="drop-shadow-2xl"
      >
        <defs>
          <filter id="wheel-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="center-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a25" />
            <stop offset="100%" stopColor="#0a0a0f" />
          </radialGradient>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius + 4}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          opacity="0.5"
          filter="url(#wheel-glow)"
        />

        <motion.g
          ref={wheelRef}
          animate={controls}
          style={{ originX: `${center}px`, originY: `${center}px` }}
        >
          {segmentPaths.map(({ seg, path, labelX, labelY, midAngle }, i) => {
            const colors = RARITY_COLORS[seg.rarity];
            const icon = RARITY_ICONS[seg.rarity];

            return (
              <g key={seg.id || i}>
                <path
                  d={path}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="1.5"
                  opacity="0.9"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={colors.text}
                  fontSize={fontSize}
                  fontWeight="600"
                  letterSpacing="0.02em"
                  transform={`rotate(${midAngle}, ${labelX}, ${labelY})`}
                >
                  {icon ? `${icon} ` : ''}{truncateLabel(seg.label, maxLabelLen)}
                </text>
              </g>
            );
          })}
        </motion.g>

        <circle
          cx={center}
          cy={center}
          r={radius * 0.14}
          fill="url(#center-gradient)"
          stroke="#6366f1"
          strokeWidth="2"
        />

        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#818cf8"
          fontSize="16"
          fontWeight="bold"
        >
          {wheel.icon}
        </text>
      </svg>
    </div>
  );
}
