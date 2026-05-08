import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CHECKLIST, CATEGORIES } from './data/index';
import { ChecklistItemCard } from './components/ChecklistItemCard';
import { Sidebar, ProgressBar } from './components/Sidebar';
import AIAgentsPage from './pages/AIAgentsPage';
import { ShieldCheck, Bot, Wifi, Battery, Search, Sliders } from 'lucide-react';

const LS_KEY = 'a11y-checklist-done';

type View = 'checklist' | 'ai-agents';

export default function App() {
  const [view, setView] = useState<View>('checklist');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [hideDone, setHideDone] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]')); }
    catch { return new Set(); }
  });


  const searchRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify([...completed]));
  }, [completed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggle = useCallback((id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const onReset = useCallback(() => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      setCompleted(new Set());
    }
  }, []);

  const visibleItems = useMemo(() => CHECKLIST.filter(it => {
    if (categoryFilter !== 'all' && it.category !== categoryFilter) return false;
    if (levelFilter !== 'all' && it.level !== levelFilter) return false;
    if (hideDone && completed.has(it.id)) return false;
    if (query && !(`${it.title} ${it.description}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  }), [categoryFilter, levelFilter, query, hideDone, completed]);

  const progressByCategory = useMemo(() => {
    const map: Record<string, { done: number; total: number }> = {};
    for (const c of CATEGORIES) map[c.id] = { done: 0, total: 0 };
    for (const it of CHECKLIST) {
      map[it.category].total++;
      if (completed.has(it.id)) map[it.category].done++;
    }
    return map;
  }, [completed]);

  const visibleCategories = useMemo(() =>
    CATEGORIES.filter(cat => visibleItems.some(it => it.category === cat.id)),
    [visibleItems]);

  const totalDone = completed.size;
  const totalItems = CHECKLIST.length;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 antialiased pt-10">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* macOS Top Menu Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-10 w-full flex items-center justify-between px-4 bg-white/40 backdrop-blur-sm border-b border-zinc-200/40 select-none text-xs font-medium text-zinc-800 ">
        {/* Left Side: Logo & Menu Items */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span className="font-bold text-zinc-900 px-2 py-1 rounded hover:bg-zinc-800/5 transition-colors cursor-default">
            A11Y Checklist
          </span>

          {/* Menu Items / Nav Tabs */}
          <div className="h-4 w-px bg-zinc-200 mx-1" />

          <button
            onClick={() => setView('checklist')}
            className={`px-3 py-1 rounded transition-colors ${view === 'checklist' ? 'bg-zinc-800/10 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-800/5 hover:text-zinc-900'
              }`}
          >
            Checklist
          </button>

          <button
            onClick={() => setView('ai-agents')}
            className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${view === 'ai-agents' ? 'bg-zinc-800/10 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-800/5 hover:text-zinc-900'
              }`}
          >
            <Bot className="h-3 w-3 inline mr-1" aria-hidden="true" />
            For AI
          </button>
        </div>


      </header>

      {view === 'ai-agents' ? (
        <AIAgentsPage />
      ) : (
        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-0">
          {/* Sidebar */}
          <aside
            className="lg:sticky lg:top-10 lg:h-[calc(100vh-40px)] lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-zinc-200/50 bg-white"
            aria-label="Navigation and filters"
          >
            <Sidebar
              categories={CATEGORIES}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              levelFilter={levelFilter}
              setLevelFilter={setLevelFilter}
              query={query}
              setQuery={setQuery}
              hideDone={hideDone}
              setHideDone={setHideDone}
              progressByCategory={progressByCategory}
              totalDone={totalDone}
              totalItems={totalItems}
              searchRef={searchRef}
              onReset={onReset}
            />
          </aside>

          {/* Main content */}
          <main id="main" className="px-4 sm:px-6 py-6 max-w-[1400px] mx-auto w-full">
            {visibleItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-2xl mb-2">🔍</p>
                <p className="font-semibold text-zinc-700">No items match your filters</p>
                <p className="text-sm text-zinc-500 mt-1">Try adjusting the search or level filter</p>
              </div>
            ) : (
              <>
                {visibleCategories.map(cat => {
                  const catItems = visibleItems.filter(it => it.category === cat.id);
                  return (
                    <section key={cat.id} className="mb-10" aria-labelledby={`cat-${cat.id}`}>
                      <div className="flex items-center gap-2 mb-4">
                        <h2 id={`cat-${cat.id}`} className="text-lg font-bold text-zinc-800">{cat.label}</h2>
                        <span className="text-sm text-zinc-400">
                          {catItems.filter(it => completed.has(it.id)).length}/{catItems.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {catItems.map(item => (
                          <ChecklistItemCard
                            key={item.id}
                            item={item}
                            done={completed.has(item.id)}
                            onToggle={toggle}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </>
            )}

            <footer className="mt-8 pt-6 border-t border-zinc-200 text-center text-xs text-zinc-400 space-y-1">
              <p>
                Checklist content adapted from{' '}
                <a href="https://www.a11yproject.com/checklist/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600">
                  The A11Y Project
                </a>{' '}
                (APLv2). WCAG levels resolved against{' '}
                <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600">
                  W3C WCAG 2.2
                </a>.
              </p>
              <p>Press <kbd className="px-1 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-600">/</kbd> to focus search</p>
            </footer>
          </main>
        </div>
      )}
    </div>
  );
}
