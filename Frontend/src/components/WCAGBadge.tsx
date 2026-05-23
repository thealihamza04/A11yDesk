import React from 'react';
import type { Level } from '../data/types';

interface Props {
  level: Level;
  wcag: string;
  wcagTitle: string;
  wcagUrl: string;
  obsolete?: boolean;
}

export function WCAGBadge({ level, wcag, wcagTitle, wcagUrl, obsolete }: Props) {
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-75';

  if (obsolete) {
    return (
      <a href={wcagUrl} target="_blank" rel="noopener noreferrer"
        className={`${base} bg-zinc-200 text-zinc-500 line-through`}
        title="This criterion is obsolete and removed in WCAG 2.2">
        WCAG {wcag} — Obsolete<span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  const colors: Record<Level, string> = {
    A: 'bg-blue-100 text-blue-800',
    AA: 'bg-emerald-100 text-emerald-800',
    AAA: 'bg-violet-100 text-violet-800',
    Technique: 'bg-zinc-100 text-zinc-600',
  };

  const label = level === 'Technique' ? wcag : `WCAG ${wcag}`;

  return (
    <a href={wcagUrl} target="_blank" rel="noopener noreferrer"
      className={`${base} ${colors[level]}`}
      title={wcagTitle}>
      {label}
      <span className="font-bold">{level}</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
