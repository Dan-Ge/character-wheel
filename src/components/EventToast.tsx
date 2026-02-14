// ── EventToast ──
// Animated pop-up notification for synergy, conflict,
// rarity streak, and score bonus events.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GameEvent } from '../types';

// ─── Props ───

interface EventToastProps {
  events: GameEvent[];
  onDismiss?: () => void;
}

// ─── Toast Appearance ───

interface ToastData {
  icon: string;
  title: string;
  description: string;
  color: string;
  borderColor: string;
  glowColor: string;
}

function getToastData(event: GameEvent): ToastData {
  switch (event.type) {
    case 'synergy_unlocked':
      return {
        icon: '⚡',
        title: event.rule.comboName ?? 'Synergy Unlocked!',
        description: event.rule.description,
        color: 'text-neon-cyan',
        borderColor: 'border-neon-cyan/50',
        glowColor: 'shadow-neon-cyan/20',
      };
    case 'conflict_detected':
      return {
        icon: event.paradoxAbility ? '🌀' : '💥',
        title: event.paradoxAbility ? 'Paradox Ability!' : 'Conflict!',
        description: event.paradoxAbility ?? event.rule.description,
        color: event.paradoxAbility ? 'text-neon-violet' : 'text-rarity-forbidden',
        borderColor: event.paradoxAbility ? 'border-neon-violet/50' : 'border-rarity-forbidden/50',
        glowColor: event.paradoxAbility ? 'shadow-neon-violet/20' : 'shadow-rarity-forbidden/20',
      };
    case 'score_bonus':
      return {
        icon: '🏆',
        title: `+${event.amount} Score`,
        description: event.reason,
        color: 'text-rarity-legendary',
        borderColor: 'border-rarity-legendary/50',
        glowColor: 'shadow-rarity-legendary/20',
      };
    case 'rarity_streak':
      return {
        icon: '🔥',
        title: `Pity Streak: ${event.currentStreak}`,
        description: `+${Math.round(event.pityBoost * 100)}% boost to rare+ chances`,
        color: 'text-neon-orange',
        borderColor: 'border-neon-orange/50',
        glowColor: 'shadow-neon-orange/20',
      };
  }
}

function Toast({ event, index, onDone }: { event: GameEvent; index: number; onDone: () => void }) {
  const data = getToastData(event);

  useEffect(() => {
    const timer = setTimeout(onDone, 3500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.15 }}
      className={`flex items-start gap-3 bg-surface-50 border ${data.borderColor} rounded-xl px-4 py-3 shadow-lg ${data.glowColor} max-w-sm cursor-pointer`}
      onClick={onDone}
    >
      <span className="text-2xl shrink-0 mt-0.5">{data.icon}</span>
      <div className="min-w-0">
        <div className={`font-display text-sm font-bold tracking-wide ${data.color}`}>
          {data.title}
        </div>
        <p className="text-xs text-surface-400 leading-relaxed mt-0.5">
          {data.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function EventToast({ events, onDismiss }: EventToastProps) {
  const [visibleEvents, setVisibleEvents] = useState<GameEvent[]>([]);

  useEffect(() => {
    if (events.length > 0) {
      setVisibleEvents(prev => [...prev, ...events]);
    }
  }, [events]);

  const dismissEvent = (idx: number) => {
    setVisibleEvents(prev => prev.filter((_, i) => i !== idx));
    if (visibleEvents.length <= 1) {
      onDismiss?.();
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {visibleEvents.map((event, i) => (
          <Toast
            key={`${event.type}-${event.timestamp}-${i}`}
            event={event}
            index={i}
            onDone={() => dismissEvent(i)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
