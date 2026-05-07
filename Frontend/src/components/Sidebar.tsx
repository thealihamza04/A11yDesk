import React from 'react';
import {
  FileText, Globe, Keyboard, Image, Type, List, MousePointer, Square as Grid3X3,
  ClipboardList, Film, Video, Volume2, Eye, Sparkles, SunMoon, Smartphone,
  Search, RotateCcw,
} from 'lucide-react';
import type { Category } from '../data/types';

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  content: FileText, 'global-code': Globe, keyboard: Keyboard, images: Image,
  headings: Type, lists: List, controls: MousePointer, tables: Grid3X3,
  forms: ClipboardList, media: Film, video: Video, audio: Volume2,
  appearance: Eye, animation: Sparkles, 'color-contrast': SunMoon, 'mobile-touch': Smartphone,
};

interface ProgressBarProps { done: number; total: number; compact?: boolean; }
export function ProgressBar({ done, total, compact }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="space-y-1">
      {!compact && (
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{done} / {total} completed</span>
          <span className="font-medium">{pct}%</span>
        </div>
      )}
      <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${done} of ${total} checklist items completed, ${pct}%`}
        />
      </div>
      {compact && (
        <p className="text-xs text-zinc-500 text-right">{done}/{total} &bull; {pct}%</p>
      )}
    </div>
  );
}

interface FilterBarProps {
  levelFilter: string;
  setLevelFilter: (v: string) => void;
  query: string;
  setQuery: (v: string) => void;
  hideDone: boolean;
  setHideDone: (v: boolean) => void;
  searchRef: React.RefObject<HTMLInputElement>;
}
function FilterBar({ levelFilter, setLevelFilter, query, setQuery, hideDone, setHideDone, searchRef }: FilterBarProps) {
  const levels = ['All', 'A', 'AA', 'AAA', 'Technique'];
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">WCAG Level</p>
        <div className="flex flex-wrap gap-1">
          {levels.map(l => (
            <button
              key={l}
              onClick={() => setLevelFilter(l === 'All' ? 'all' : l)}
              className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                levelFilter === (l === 'All' ? 'all' : l)
                  ? 'bg-zinc-800 text-white border-zinc-800'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="sidebar-search" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Search</label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" aria-hidden="true" />
          <input
            id="sidebar-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter items…"
            className="w-full pl-7 pr-2 py-1.5 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={hideDone}
          onChange={e => setHideDone(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 accent-zinc-800"
        />
        <span className="text-xs text-zinc-700">Hide completed</span>
      </label>
    </div>
  );
}

interface CategoryNavProps {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
  progressByCategory: Record<string, { done: number; total: number }>;
}
function CategoryNav({ categories, activeId, onSelect, progressByCategory }: CategoryNavProps) {
  return (
    <nav aria-label="Checklist categories">
      <ul className="space-y-0.5">
        <li>
          <button
            onClick={() => onSelect('all')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
              activeId === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <Grid3X3 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 font-medium">All categories</span>
          </button>
        </li>
        {categories.map(cat => {
          const prog = progressByCategory[cat.id] || { done: 0, total: 0 };
          const Icon = ICONS[cat.id] || FileText;
          const isActive = activeId === cat.id;
          return (
            <li key={cat.id}>
              <button
                onClick={() => onSelect(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  isActive ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="flex-1 text-xs">{cat.label}</span>
                <span className={`text-xs tabular-nums shrink-0 ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`}>
                  {prog.done}/{prog.total}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface SidebarProps {
  categories: Category[];
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  levelFilter: string;
  setLevelFilter: (v: string) => void;
  query: string;
  setQuery: (v: string) => void;
  hideDone: boolean;
  setHideDone: (v: boolean) => void;
  progressByCategory: Record<string, { done: number; total: number }>;
  totalDone: number;
  totalItems: number;
  searchRef: React.RefObject<HTMLInputElement>;
  onReset: () => void;
}

export function Sidebar({
  categories, categoryFilter, setCategoryFilter, levelFilter, setLevelFilter,
  query, setQuery, hideDone, setHideDone, progressByCategory, totalDone, totalItems, searchRef, onReset,
}: SidebarProps) {
  return (
    <div className="p-4 space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Progress</p>
          <button onClick={onReset} className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1" title="Reset all progress">
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Reset
          </button>
        </div>
        <ProgressBar done={totalDone} total={totalItems} />
      </div>
      <div className="border-t border-zinc-100" />
      <FilterBar
        levelFilter={levelFilter} setLevelFilter={setLevelFilter}
        query={query} setQuery={setQuery}
        hideDone={hideDone} setHideDone={setHideDone}
        searchRef={searchRef}
      />
      <div className="border-t border-zinc-100" />
      <CategoryNav
        categories={categories}
        activeId={categoryFilter}
        onSelect={setCategoryFilter}
        progressByCategory={progressByCategory}
      />
    </div>
  );
}
