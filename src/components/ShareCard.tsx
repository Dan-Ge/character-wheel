// ── ShareCard ──
// Screenshot-friendly character build summary card with share actions.

import { forwardRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import type { CharacterBuild } from '../types';
import { Rarity } from '../types';
import { copyShareCode, copyBuildSummary } from '../utils/share';

// ─── Props ───

interface ShareCardProps {
  build: CharacterBuild;
  onClose?: () => void;
}

// ─── Rarity Badge Colors ───

const RARITY_BADGE: Record<Rarity, string> = {
  [Rarity.Common]: 'bg-gray-600 text-gray-300',
  [Rarity.Uncommon]: 'bg-rarity-uncommon/20 text-rarity-uncommon',
  [Rarity.Rare]: 'bg-rarity-rare/20 text-rarity-rare',
  [Rarity.Epic]: 'bg-rarity-epic/20 text-rarity-epic',
  [Rarity.Legendary]: 'bg-rarity-legendary/20 text-rarity-legendary',
  [Rarity.Mythic]: 'bg-rarity-mythic/20 text-rarity-mythic',
  [Rarity.Forbidden]: 'bg-rarity-forbidden/20 text-rarity-forbidden',
};

function getScoreTier(score: number): { label: string; color: string } {
  if (score >= 8000) return { label: 'S+', color: 'text-rarity-mythic' };
  if (score >= 6000) return { label: 'S', color: 'text-rarity-legendary' };
  if (score >= 4500) return { label: 'A', color: 'text-rarity-epic' };
  if (score >= 3000) return { label: 'B', color: 'text-rarity-rare' };
  if (score >= 1500) return { label: 'C', color: 'text-rarity-uncommon' };
  return { label: 'D', color: 'text-surface-400' };
}

function MemeBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-neon-pink' :
    value >= 60 ? 'bg-neon-orange' :
    value >= 40 ? 'bg-neon-cyan' : 'bg-surface-400';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-surface-400 shrink-0">Meme</span>
      <div className="flex-1 h-2 bg-surface-300 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-surface-400 w-8 text-right">{value}%</span>
    </div>
  );
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ build, onClose }, ref) {
    const tier = getScoreTier(build.score);
    const [copied, setCopied] = useState<'none' | 'code' | 'summary'>('none');

    const handleCopyCode = useCallback(async (e: React.MouseEvent) => {
      e.stopPropagation();
      const ok = await copyShareCode(build);
      if (ok) {
        setCopied('code');
        setTimeout(() => setCopied('none'), 2000);
      }
    }, [build]);

    const handleCopySummary = useCallback(async (e: React.MouseEvent) => {
      e.stopPropagation();
      const ok = await copyBuildSummary(build);
      if (ok) {
        setCopied('summary');
        setTimeout(() => setCopied('none'), 2000);
      }
    }, [build]);

    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={ref}
          className="w-full max-w-md bg-surface-50 border border-surface-300 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: 'spring', stiffness: 250, damping: 22 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-linear-to-r from-accent/20 via-neon-cyan/10 to-neon-pink/20 px-5 pt-5 pb-4 border-b border-surface-300">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-display text-accent uppercase tracking-widest">
                  Character Wheel
                </div>
                <h2 className="text-xl font-display font-black text-white mt-1 leading-tight">
                  {build.name}
                </h2>
              </div>
              <div className={`text-3xl font-display font-black ${tier.color}`}>
                {tier.label}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-rarity-legendary font-bold">
                {build.score.toLocaleString()} pts
              </span>
              <span className="text-surface-400">
                {build.season}
              </span>
            </div>
          </div>

          {/* Build Results */}
          <div className="px-5 py-4 space-y-2">
            {build.results.map((result) => (
              <div
                key={result.wheelId}
                className="flex items-center justify-between py-1.5 border-b border-surface-300/30 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-surface-400 uppercase w-16 shrink-0">
                    {result.wheelCategory}
                  </span>
                  <span className="text-sm font-medium text-white truncate">
                    {result.segment.label}
                  </span>
                </div>
                <span className={`text-[10px] font-display uppercase px-2 py-0.5 rounded-full shrink-0 ${RARITY_BADGE[result.segment.rarity]}`}>
                  {result.segment.rarity}
                </span>
              </div>
            ))}
          </div>

          {/* Signature Combo */}
          {build.signatureCombo && (
            <div className="mx-5 mb-3 bg-accent/10 border border-accent/30 rounded-lg p-3">
              <div className="text-xs font-display text-accent uppercase tracking-wider">
                ⚡ {build.signatureCombo.name}
              </div>
              <p className="text-xs text-surface-400 mt-1">
                {build.signatureCombo.description}
              </p>
            </div>
          )}

          {/* Weak Spot */}
          {build.weakSpot && (
            <div className="mx-5 mb-3 bg-rarity-forbidden/10 border border-rarity-forbidden/30 rounded-lg p-3">
              <div className="text-xs font-display text-rarity-forbidden uppercase tracking-wider">
                💀 Weak Spot
              </div>
              <p className="text-xs text-surface-400 mt-1">
                {build.weakSpot}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-3 bg-surface-100 border-t border-surface-300 space-y-3">
            <MemeBar value={build.memePotential} />
            <div className="flex flex-wrap gap-1">
              {build.tags.slice(0, 8).map(tag => (
                <span key={tag} className="text-[9px] bg-surface-200 text-surface-400 px-1.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
              {build.tags.length > 8 && (
                <span className="text-[9px] text-surface-400">
                  +{build.tags.length - 8}
                </span>
              )}
            </div>

            {/* Share Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleCopyCode}
                className="flex-1 py-2 bg-surface-200 border border-surface-300 rounded-lg text-xs font-medium text-gray-300 hover:border-accent/50 hover:text-white active:scale-95 transition-all"
              >
                {copied === 'code' ? '✅ Copied!' : '📋 Copy Code'}
              </button>
              <button
                onClick={handleCopySummary}
                className="flex-1 py-2 bg-linear-to-r from-accent/20 to-neon-cyan/20 border border-accent/30 rounded-lg text-xs font-medium text-white hover:border-accent/60 active:scale-95 transition-all"
              >
                {copied === 'summary' ? '✅ Copied!' : '📸 Copy Summary'}
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-surface-400/50 pt-1">
              <span>Share: {build.shareCode}</span>
              <span>characterwheel.app</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

export default ShareCard;
