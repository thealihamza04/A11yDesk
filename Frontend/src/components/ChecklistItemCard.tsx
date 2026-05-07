import React from 'react';
import { WCAGBadge } from './WCAGBadge';
import { DemoPanel } from './DemoPanel';
import type { ChecklistItem } from '../data/types';

interface Props {
  item: ChecklistItem;
  done: boolean;
  onToggle: (id: string) => void;
}

export function ChecklistItemCard({ item, done, onToggle }: Props) {
  return (
    <article
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-opacity ${done ? 'opacity-60' : ''}`}
    >
      <header className="flex items-start gap-3 p-4 border-b border-zinc-100">
        <input
          id={`done-${item.id}`}
          type="checkbox"
          checked={done}
          onChange={() => onToggle(item.id)}
          className="mt-1 h-5 w-5 rounded border-zinc-300 cursor-pointer accent-emerald-600 shrink-0"
        />
        <label htmlFor={`done-${item.id}`} className="flex-1 cursor-pointer">
          <h3 className={`font-semibold leading-snug text-sm mb-1.5 ${done ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>
            {item.title}
          </h3>
          <WCAGBadge
            level={item.level}
            wcag={item.wcag}
            wcagTitle={item.wcagTitle}
            wcagUrl={item.wcagUrl}
            obsolete={item.obsolete}
          />
        </label>
      </header>
      <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-100 border-b border-zinc-100">
        <DemoPanel kind="bad" Demo={item.badDemo} />
        <DemoPanel kind="good" Demo={item.goodDemo} />
      </div>
      <footer className="p-4 text-xs text-zinc-700 space-y-1.5">
        <p>{item.description}</p>
        <p className="text-zinc-500">
          <strong className="text-zinc-600">Why it matters:</strong> {item.whyItMatters}
        </p>
      </footer>
    </article>
  );
}
