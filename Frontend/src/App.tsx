import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CHECKLIST, CATEGORIES } from './data/index';
import { ChecklistItemCard } from './components/ChecklistItemCard';
import { Sidebar, ProgressBar } from './components/Sidebar';
import AIAgentsPage from './pages/AIAgentsPage';
import { ShieldCheck, Bot, Wifi, Battery, Search, Sliders, Cpu, Github, Menu, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1100);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsFilterDrawerOpen(false);
  }, [categoryFilter, levelFilter]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

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
      <Helmet>
        <title>A11Y Checklist by thealihamza04 — WCAG 2.2 Interactive Accessibility Audit Tool</title>
        <meta name="google-site-verification" content="mahIsZ464GV0kZKIbjK4thqbQEu49WZTOQwc_xwc4K8" />
        <meta name="description" content="Interactive WCAG 2.2 accessibility checklist, projects, and a11y tools developed by thealihamza04. Audit, filter, and track compliance with A11y by thealihamza04." />
        <meta name="keywords" content="thealihamza04, projects by thealihamza04, thealihamza04 projects, a11y by thealihamza04, accessibility, wcag 2.2, a11y checklist, web standard compliance, a11y project, accessibility auditor" />
        <link rel="canonical" href="https://a11ydesk.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="A11Y Checklist by thealihamza04 — WCAG 2.2 Interactive Accessibility Audit Tool" />
        <meta property="og:description" content="Interactive WCAG 2.2 accessibility checklist, projects, and a11y tools developed by thealihamza04. Audit, filter, and track compliance with A11y by thealihamza04." />
        <meta property="og:url" content="https://a11ydesk.com" />
        <meta property="og:image" content="https://a11ydesk.com/assets/a11y_architecture.png" />
        <meta property="og:site_name" content="A11Y Checklist by thealihamza04" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="A11Y Checklist by thealihamza04 — WCAG 2.2 Interactive Accessibility Audit Tool" />
        <meta name="twitter:description" content="Interactive WCAG 2.2 accessibility checklist, projects, and a11y tools developed by thealihamza04. Audit, filter, and track compliance with A11y by thealihamza04." />
        <meta name="twitter:image" content="https://a11ydesk.com/assets/a11y_architecture.png" />

        {/* SEO Directives */}
        <meta name="robots" content="index, follow" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "A11Y Checklist by thealihamza04",
            "url": "https://a11ydesk.com",
            "description": "Interactive WCAG 2.2 accessibility checklist, projects, and a11y tools developed by thealihamza04.",
            "inLanguage": "en",
            "license": "https://opensource.org/licenses/MIT",
            "author": {
              "@type": "Person",
              "name": "thealihamza04",
              "url": "https://github.com/thealihamza04"
            },
            "creator": {
              "@type": "Person",
              "name": "thealihamza04"
            },
            "publisher": {
              "@type": "Organization",
              "name": "A11Y Accessibility Toolkit Team by thealihamza04"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Interactive WCAG 2.2 Accessibility Checklist by thealihamza04",
            "description": "Interactive WCAG 2.2 accessibility checklist, projects, and a11y tools developed by thealihamza04.",
            "url": "https://a11ydesk.com",
            "author": {
              "@type": "Person",
              "name": "thealihamza04",
              "url": "https://github.com/thealihamza04"
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "A11Y Checklist by thealihamza04",
              "url": "https://a11ydesk.com"
            }
          })}
        </script>
      </Helmet>

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

          {/* Menu Items / Nav Tabs (Desktop) */}
          {!isMobile && (
            <>
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
            </>
          )}
        </div>

        {/* Right Side: NPM MCP Link & GitHub Link (Desktop / Mobile Switch) */}
        <div className="flex items-center gap-3">
          {!isMobile ? (
            <>
              <a
                href="https://www.npmjs.com/package/@thealihamza04/a11y-mcp-server"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-zinc-600 hover:text-emerald-600 hover:bg-zinc-800/5 transition-all text-xs font-semibold"
              >
                <Cpu className="h-3.5 w-3.5 text-zinc-500 hover:text-emerald-600 transition-colors" aria-hidden="true" />
                <span>MCP Server</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>

              <div className="h-3.5 w-px bg-zinc-200" />

              <a
                href="https://github.com/thealihamza04/A11yDesk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-zinc-600 hover:text-zinc-900 hover:bg-zinc-800/5 transition-all text-xs font-semibold"
              >
                <Github className="h-3.5 w-3.5 text-zinc-500 hover:text-zinc-900 transition-colors" aria-hidden="true" />
                <span>GitHub</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          ) : (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 -mr-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-800/5 rounded transition-all focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {/* Mobile & Tablet Dropdown Navigation Overlay */}
        {isMobile && isMobileMenuOpen && (
          <div className="absolute top-10 left-0 right-0 bg-white border-b border-zinc-200 shadow-md px-4 py-3 flex flex-col gap-2 z-50 select-none">
            <button
              onClick={() => {
                setView('checklist');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded transition-colors text-xs font-semibold ${
                view === 'checklist' ? 'bg-zinc-800/10 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-800/5'
              }`}
            >
              Checklist
            </button>
            <button
              onClick={() => {
                setView('ai-agents');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left flex items-center gap-1.5 px-3 py-2 rounded transition-colors text-xs font-semibold ${
                view === 'ai-agents' ? 'bg-zinc-800/10 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-800/5'
              }`}
            >
              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
              For AI
            </button>
            <div className="h-px bg-zinc-100 my-1" />
            <a
              href="https://www.npmjs.com/package/@thealihamza04/a11y-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded text-zinc-600 hover:text-emerald-600 hover:bg-zinc-800/5 transition-all text-xs font-semibold"
            >
              <Cpu className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
              <span>MCP Server</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href="https://github.com/thealihamza04/A11yDesk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded text-zinc-600 hover:text-zinc-900 hover:bg-zinc-800/5 transition-all text-xs font-semibold"
            >
              <Github className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
              <span>GitHub</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        )}
      </header>

      {view === 'ai-agents' ? (
        <AIAgentsPage />
      ) : (
        <div className={isMobile ? 'flex flex-col min-h-[calc(100vh-40px)]' : 'grid lg:grid-cols-[280px_minmax(0,1fr)] gap-0'}>
          {/* Sticky Mobile/Tablet Control Bar */}
          {isMobile && (
            <div className="sticky top-10 z-30 w-full flex items-center justify-between px-4 py-2 bg-white border-b border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.01)] select-none">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">Category:</span>
                <span className="text-xs font-semibold text-zinc-800 truncate max-w-[120px] sm:max-w-none">
                  {categoryFilter === 'all' ? 'All Categories' : CATEGORIES.find(c => c.id === categoryFilter)?.label || categoryFilter}
                </span>
                {levelFilter !== 'all' && (
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded shrink-0">
                    {levelFilter}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-16 sm:w-24">
                  <ProgressBar done={totalDone} total={totalItems} compact />
                </div>
                <button
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 text-white rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors shadow-sm"
                  aria-label="Open filter and categories menu"
                >
                  <Sliders className="h-3 w-3" aria-hidden="true" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          )}

          {/* Slide-over Filter Drawer Sheet (Mobile/Tablet <= 1100px) */}
          {isMobile && isFilterDrawerOpen && (
            <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
              {/* Dark Backdrop */}
              <button
                type="button"
                className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300 w-full h-full cursor-default"
                onClick={() => setIsFilterDrawerOpen(false)}
                tabIndex={-1}
                aria-hidden="true"
              />
              
              {/* Sliding panel content */}
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50 select-none">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">Filters & Categories</span>
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all focus:outline-none"
                    aria-label="Close menu"
                  >
                    <X className="h-4.5 w-4.5" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
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
                </div>
              </div>
            </div>
          )}

          {/* Sidebar (Desktop > 1100px) */}
          {!isMobile && (
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
          )}

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

            <footer className="mt-8 pt-6 border-t border-zinc-200 text-center text-xs text-zinc-400 space-y-1.5">
              <p className="text-zinc-500 font-medium">
                Developed by{' '}
                <a href="https://github.com/thealihamza04" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-700 font-semibold">
                  thealihamza04<span className="sr-only"> (opens in a new tab)</span>
                </a>
                . Explore other open-source a11y tools and projects by thealihamza04.
              </p>
              <p>
                Checklist content adapted from{' '}
                <a href="https://www.a11yproject.com/checklist/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600">
                  The A11Y Project<span className="sr-only"> (opens in a new tab)</span>
                </a>{' '}
                (APLv2). WCAG levels resolved against{' '}
                <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600">
                  W3C WCAG 2.2<span className="sr-only"> (opens in a new tab)</span>
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
