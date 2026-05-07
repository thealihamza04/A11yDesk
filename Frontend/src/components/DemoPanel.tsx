import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  kind: 'bad' | 'good';
  Demo: React.FC;
}

export function DemoPanel({ kind, Demo }: Props) {
  const isBad = kind === 'bad';
  return (
    <section
      className={`p-4 min-h-[160px] flex flex-col gap-2.5 ${
        isBad ? 'bg-red-50/20' : 'bg-emerald-50/20'
      }`}
      aria-label={isBad ? 'Bad example (do not copy)' : 'Good example (recommended pattern)'}
    >
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider select-none">
        {isBad ? (
          <>
            <XCircle className="h-4 w-4 text-red-500 shrink-0" aria-hidden="true" />
            <span className="text-red-600">Bad</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
            <span className="text-emerald-700">Good</span>
          </>
        )}
      </div>
      <div className={`demo-surface rounded-lg bg-white border border-zinc-200/80 p-3.5 text-sm flex-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border-l-4 ${
        isBad ? 'border-l-red-500' : 'border-l-emerald-500'
      }`}>
        <Demo />
      </div>
    </section>
  );
}
