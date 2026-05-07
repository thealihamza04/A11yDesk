import React, { useState, useEffect } from 'react';
import {
  AlertCircle, CheckCircle2, ExternalLink, Save, Volume2, Search, Settings,
} from 'lucide-react';
import type { ChecklistItem } from './types';

export const CATEGORIES = [
  { id: 'content', label: 'Content' },
  { id: 'global-code', label: 'Global code' },
  { id: 'keyboard', label: 'Keyboard' },
  { id: 'images', label: 'Images' },
  { id: 'headings', label: 'Headings' },
  { id: 'lists', label: 'Lists' },
  { id: 'controls', label: 'Controls' },
  { id: 'tables', label: 'Tables' },
  { id: 'forms', label: 'Forms' },
  { id: 'media', label: 'Media' },
  { id: 'video', label: 'Video' },
  { id: 'audio', label: 'Audio' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'animation', label: 'Animation' },
  { id: 'color-contrast', label: 'Color contrast' },
  { id: 'mobile-touch', label: 'Mobile and touch' },
];

// ── Named components that use hooks ──────────────────────────────────────────

const AutofocusBadDemo: React.FC = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      {!show ? (
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs" onClick={() => setShow(true)}>
          Click to demo autofocus
        </button>
      ) : (
        <div className="space-y-1">
          <p className="text-xs text-red-600">⚠ Focus stolen — keyboard position disrupted</p>
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input autoFocus placeholder="Search" className="border border-zinc-300 rounded px-2 py-1 text-xs w-full" />
        </div>
      )}
    </div>
  );
};

const SessionBadDemo: React.FC = () => {
  const [t, setT] = useState(14);
  useEffect(() => {
    if (t <= 0) return;
    const id = setTimeout(() => setT(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [t]);
  return (
    <div className="p-3 bg-yellow-50 border border-yellow-300 rounded text-xs space-y-1">
      <p className="font-semibold">Session expiring</p>
      <p>You will be logged out in <strong>0:{String(t).padStart(2, '0')}</strong></p>
      {t === 0 && <p className="text-red-600 font-medium">Logged out.</p>}
    </div>
  );
};

const SessionGoodDemo: React.FC = () => {
  const [t, setT] = useState(14);
  useEffect(() => {
    if (t <= 0) return;
    const id = setTimeout(() => setT(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [t]);
  return (
    <div className="p-3 bg-yellow-50 border border-yellow-300 rounded text-xs space-y-2">
      <p className="font-semibold">Session expiring</p>
      <p>You will be logged out in <strong>0:{String(t).padStart(2, '0')}</strong></p>
      <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs" onClick={() => setT(14)}>
        Need more time? Extend session (+15 min)
      </button>
    </div>
  );
};

const LinksGrayscaleBadDemo: React.FC = () => {
  const [gray, setGray] = useState(false);
  return (
    <div className="space-y-2">
      <div style={{ filter: gray ? 'grayscale(1)' : 'none' }}>
        <p className="text-xs">See our <span style={{ color: '#2563eb', cursor: 'pointer' }}>pricing</span> or read the <span style={{ color: '#2563eb', cursor: 'pointer' }}>docs</span>.</p>
      </div>
      <button className="text-xs px-2 py-1 border border-zinc-300 rounded" onClick={() => setGray(g => !g)}>
        {gray ? 'Restore color' : 'Simulate grayscale'}
      </button>
    </div>
  );
};

const AutoplayBadDemo: React.FC = () => {
  const [show, setShow] = useState(false);
  return !show ? (
    <button className="px-3 py-1 bg-zinc-700 text-white rounded text-xs" onClick={() => setShow(true)}>
      Show autoplay example
    </button>
  ) : (
    <div className="space-y-1">
      <pre className="text-xs bg-red-50 border border-red-200 p-2 rounded overflow-auto">{`<audio autoPlay loop src="clip.mp3">`}</pre>
      <p className="text-xs text-red-600">⚠ Would instantly start playing audio</p>
    </div>
  );
};

const SeizureBadDemo: React.FC = () => {
  const [show, setShow] = useState(false);
  return !show ? (
    <button
      className="px-3 py-1 bg-orange-500 text-white rounded text-xs"
      onClick={() => { if (window.confirm('Show STATIC simulated bad example only — no actual flashing. Continue?')) setShow(true); }}
    >
      Show simulated bad demo (static)
    </button>
  ) : (
    <div className="relative rounded overflow-hidden" style={{ height: '80px' }}>
      <div style={{ background: 'repeating-linear-gradient(45deg,#ef4444 0,#ef4444 10px,#fff 10px,#fff 20px)', width: '100%', height: '100%' }} />
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs text-center p-2">
        ⚠ Imagine this strobing red/white at 5 Hz — NOT animated (would cause seizures)
      </div>
    </div>
  );
};

const TextResizeBadDemo: React.FC = () => {
  const [z, setZ] = useState(false);
  return (
    <div className="space-y-2">
      <div style={{ width: '160px', height: '56px', overflow: 'hidden', border: '1px solid #d4d4d8', borderRadius: '4px', padding: '8px', fontSize: z ? '200%' : '14px' }}>
        Card content here
      </div>
      <button className="text-xs px-2 py-1 border border-zinc-300 rounded" onClick={() => setZ(v => !v)}>
        {z ? 'Reset to 100%' : 'Simulate 200% zoom'}
      </button>
    </div>
  );
};

const TextResizeGoodDemo: React.FC = () => {
  const [z, setZ] = useState(false);
  return (
    <div className="space-y-2">
      <div style={{ minHeight: '56px', overflow: 'visible', border: '1px solid #d4d4d8', borderRadius: '4px', padding: '8px', fontSize: z ? '200%' : '14px' }}>
        Card content here
      </div>
      <button className="text-xs px-2 py-1 border border-zinc-300 rounded" onClick={() => setZ(v => !v)}>
        {z ? 'Reset to 100%' : 'Simulate 200% zoom'}
      </button>
    </div>
  );
};

const MediaPauseGoodDemo: React.FC = () => {
  const [paused, setPaused] = useState(false);
  return (
    <div className="space-y-2">
      <div className="rounded bg-zinc-800 flex items-center justify-center text-white text-xs" style={{ height: '56px' }}>
        🎬 {paused ? '⏸ Paused' : '▶ Playing…'}
      </div>
      <button className="px-3 py-1 bg-zinc-700 text-white rounded text-xs" onClick={() => setPaused(p => !p)}>
        {paused ? 'Resume' : 'Pause all media'}
      </button>
    </div>
  );
};

const PauseBgGoodDemo: React.FC = () => {
  const [paused, setPaused] = useState(false);
  return (
    <div className="relative rounded overflow-hidden" style={{ height: '80px' }}>
      {!paused && <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />}
      {paused && <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700" />}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white font-bold text-sm">Hero Section</p>
      </div>
      <button className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded" aria-pressed={paused} onClick={() => setPaused(p => !p)}>
        {paused ? '▶ Resume' : '⏸ Pause background'}
      </button>
    </div>
  );
};

const MuteGoodDemo: React.FC = () => {
  const [muted, setMuted] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <button aria-pressed={muted} onClick={() => setMuted(m => !m)} className="px-2 py-1 rounded border border-zinc-300 text-xs">
        {muted ? 'Unmute' : 'Mute'}
      </button>
      <input type="range" min="0" max="100" defaultValue="50" aria-label="Volume" className="w-24" />
    </div>
  );
};

// ── Checklist data ────────────────────────────────────────────────────────────

export const CHECKLIST: ChecklistItem[] = [
  // ══ CONTENT ══
  {
    id: 'use-plain-language',
    title: 'Use plain language and avoid figures of speech, idioms, and complicated metaphors.',
    category: 'content', wcag: '3.1.5', wcagTitle: 'Reading Level', level: 'AAA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html',
    description: 'Write content at an 8th grade reading level.',
    whyItMatters: 'Plain language lowers cognitive load for users with cognitive disabilities, non-native readers, and stressed users.',
    badDemo: () => (
      <p className="text-xs">It is a no-brainer that we will move the needle and circle back once we have boiled the ocean on this synergistic, paradigm-shifting deliverable.</p>
    ),
    goodDemo: () => (
      <p className="text-xs">This is a simple choice. We will work on it together and update you next week.</p>
    ),
  },
  {
    id: 'descriptive-link-text',
    title: 'Make sure that button, a, and label element content is unique and descriptive.',
    category: 'content', wcag: '1.3.1', wcagTitle: 'Info and Relationships', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
    description: 'Terms like "click here" and "read more" do not provide any context. Some people navigate using a list of all buttons or links on a page or view.',
    whyItMatters: 'Screen reader users who navigate by links hear link text out of context — "click here" gives no useful information.',
    badDemo: () => (
      <div className="flex flex-col gap-1">
        {['Read more', 'Click here', 'Learn more'].map(t => (
          <a key={t} href="#" className="text-blue-600 underline text-xs">{t}</a>
        ))}
      </div>
    ),
    goodDemo: () => (
      <div className="flex flex-col gap-1">
        <a href="#" className="text-blue-600 underline text-xs">Read the 2025 accessibility report</a>
        <a href="#" className="text-blue-600 underline text-xs">Download the WCAG quick-reference PDF</a>
        <a href="#" className="text-blue-600 underline text-xs">View pricing for the Pro plan</a>
      </div>
    ),
  },
  {
    id: 'text-alignment',
    title: 'Use left-aligned text for left-to-right (LTR) languages, and right-aligned text for right-to-left (RTL) languages.',
    category: 'content', wcag: '1.4.8', wcagTitle: 'Visual Presentation', level: 'AAA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html',
    description: 'Centered-aligned or justified text is difficult to read.',
    whyItMatters: 'Justified text creates uneven word spacing ("rivers of white space") that makes reading harder, especially for users with dyslexia.',
    badDemo: () => (
      <p className="text-xs text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.</p>
    ),
    goodDemo: () => (
      <p className="text-xs text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.</p>
    ),
  },
  // ══ GLOBAL CODE ══
  {
    id: 'validate-html',
    title: 'Validate your HTML.',
    category: 'global-code', wcag: '4.1.1', wcagTitle: 'Parsing', level: 'A', obsolete: true,
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/parsing.html',
    description: 'Valid HTML helps to provide a consistent, expected experience across all browsers and assistive technology.',
    whyItMatters: 'Malformed HTML can confuse screen readers and cause unpredictable behavior in assistive technologies.',
    badDemo: () => (
      <div className="text-xs font-mono space-y-1">
        <div dangerouslySetInnerHTML={{ __html: '<p>Hello <strong>world</p></strong>' }} />
        <div dangerouslySetInnerHTML={{ __html: '<div><li>orphan list item</li></div>' }} />
        <p className="text-red-600 font-sans mt-1">⚠ Malformed nesting</p>
      </div>
    ),
    goodDemo: () => (
      <div className="text-xs font-mono space-y-1">
        <p>Hello <strong>world</strong></p>
        <ul><li>list item</li></ul>
        <p className="text-emerald-600 font-sans mt-1">✓ Valid HTML</p>
      </div>
    ),
  },
  {
    id: 'lang-attribute',
    title: 'Use a lang attribute on the html element.',
    category: 'global-code', wcag: '3.1.1', wcagTitle: 'Language of Page', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html',
    description: 'This helps assistive technology such as screen readers to pronounce content correctly.',
    whyItMatters: 'Without a lang attribute, screen readers may use the wrong language pronunciation engine, making content unintelligible.',
    badDemo: () => (
      <pre className="text-xs bg-red-50 border border-red-200 p-2 rounded overflow-auto">{`<html>\n  <head>...</head>\n</html>`}</pre>
    ),
    goodDemo: () => (
      <pre className="text-xs bg-emerald-50 border border-emerald-200 p-2 rounded overflow-auto">{`<html lang="en">\n  <head>...</head>\n</html>`}</pre>
    ),
  },
  {
    id: 'unique-page-title',
    title: 'Provide a unique title for each page or view.',
    category: 'global-code', wcag: '2.4.2', wcagTitle: 'Page Titled', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html',
    description: "The title element, contained in the document's head element, is often the first piece of information announced by assistive technology.",
    whyItMatters: 'Unique page titles help users understand where they are, especially when switching between multiple browser tabs.',
    badDemo: () => (
      <div className="space-y-1">
        {['Untitled', 'Untitled', 'Untitled'].map((t, i) => (
          <div key={i} className="flex items-center gap-2 bg-zinc-100 px-2 py-1 rounded text-xs">📄 {t}</div>
        ))}
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        {['Pricing — Acme', 'Contact — Acme', 'Docs — Acme'].map((t, i) => (
          <div key={i} className="flex items-center gap-2 bg-zinc-100 px-2 py-1 rounded text-xs">📄 {t}</div>
        ))}
      </div>
    ),
  },
  {
    id: 'viewport-zoom-enabled',
    title: 'Ensure that viewport zoom is not disabled.',
    category: 'global-code', wcag: '1.4.4', wcagTitle: 'Resize text', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html',
    description: 'Some people need to increase the size of text to a point where they can read it.',
    whyItMatters: 'Disabling zoom prevents low-vision users from being able to read your content at all.',
    badDemo: () => (
      <pre className="text-xs bg-red-50 border border-red-200 p-2 rounded overflow-auto whitespace-pre-wrap">{`<meta name="viewport" content=\n  "width=device-width,\n  initial-scale=1,\n  maximum-scale=1,\n  user-scalable=no">`}</pre>
    ),
    goodDemo: () => (
      <pre className="text-xs bg-emerald-50 border border-emerald-200 p-2 rounded overflow-auto">{`<meta name="viewport" content=\n  "width=device-width,\n  initial-scale=1">`}</pre>
    ),
  },
  {
    id: 'landmark-elements',
    title: 'Use landmark elements to indicate important content regions.',
    category: 'global-code', wcag: '4.1.2', wcagTitle: 'Name, Role, Value', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
    description: 'Landmark regions help communicate the layout and important areas of a page or view.',
    whyItMatters: 'Screen reader users rely on landmark regions to skip directly to navigation, main content, or other sections.',
    badDemo: () => (
      <div className="text-xs font-mono space-y-1">
        {['header', 'nav', 'main'].map(t => (
          <div key={t} className="bg-zinc-200 px-2 py-1 rounded">{`<div class="${t}">…</div>`}</div>
        ))}
      </div>
    ),
    goodDemo: () => (
      <div className="text-xs font-mono space-y-1">
        {['header', 'nav', 'main', 'footer'].map(t => (
          <div key={t} className="bg-emerald-100 px-2 py-1 rounded">{`<${t}>…</${t}>`}</div>
        ))}
      </div>
    ),
  },
  {
    id: 'logical-tab-order',
    title: 'Avoid using positive tabindex attribute values.',
    category: 'global-code', wcag: '2.4.3', wcagTitle: 'Focus Order', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html',
    description: 'Having an illogical tab order makes navigation confusing for those using assistive technology.',
    whyItMatters: 'Positive tabindex values create jumbled keyboard navigation order that confuses keyboard-only and screen reader users.',
    badDemo: () => (
      <div className="space-y-2">
        <p className="text-xs text-zinc-500">Tab order: 3→1→4→2</p>
        <div className="flex gap-1 flex-wrap">
          <button tabIndex={4} className="px-2 py-1 border border-zinc-300 rounded text-xs">A (tab:4)</button>
          <button tabIndex={2} className="px-2 py-1 border border-zinc-300 rounded text-xs">B (tab:2)</button>
          <button tabIndex={1} className="px-2 py-1 border border-zinc-300 rounded text-xs">C (tab:1)</button>
          <button tabIndex={3} className="px-2 py-1 border border-zinc-300 rounded text-xs">D (tab:3)</button>
        </div>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-2">
        <p className="text-xs text-zinc-500">Natural DOM order: A→B→C→D</p>
        <div className="flex gap-1 flex-wrap">
          {['A', 'B', 'C', 'D'].map(l => (
            <button key={l} className="px-2 py-1 border border-zinc-300 rounded text-xs">{l}</button>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'no-autofocus',
    title: 'Avoid using the autofocus attribute.',
    category: 'global-code', wcag: '2.4.3', wcagTitle: 'Focus Order', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html',
    description: 'People who are blind or who have low vision may be disoriented when focus is moved without their permission.',
    whyItMatters: 'Autofocus disrupts screen reader users who may be mid-sentence when focus is forcibly stolen.',
    badDemo: AutofocusBadDemo,
    goodDemo: () => (
      <div className="space-y-1">
        <label className="text-xs font-medium block" htmlFor="good-srch">Search</label>
        <input id="good-srch" type="search" placeholder="Search…" className="border border-zinc-300 rounded px-2 py-1 text-xs w-full" />
        <p className="text-xs text-emerald-600">✓ No autofocus — user controls where focus goes</p>
      </div>
    ),
  },
  {
    id: 'extend-session-timeouts',
    title: 'Allow extending session timeouts.',
    category: 'global-code', wcag: '2.2.1', wcagTitle: 'Timing Adjustable', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html',
    description: 'If you cannot remove session timeouts altogether, then let the person using your site easily turn off, adjust, or extend their session well before it ends.',
    whyItMatters: 'Users with cognitive or motor disabilities need extra time and will lose data if sessions expire without warning or extension options.',
    badDemo: SessionBadDemo,
    goodDemo: SessionGoodDemo,
  },
  {
    id: 'no-title-tooltips',
    title: 'Remove title attribute tooltips.',
    category: 'global-code', wcag: '4.1.2', wcagTitle: 'Name, Role, Value', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
    description: 'The title attribute has numerous issues, and should not be used if the information provided is important for all people to access.',
    whyItMatters: 'title tooltips are inaccessible on touch screens, inconsistent across screen readers, and invisible to keyboard-only users.',
    badDemo: () => (
      <div className="space-y-2">
        <button title="Save your work" className="px-3 py-2 border border-zinc-300 rounded text-xl">💾</button>
        <p className="text-xs text-red-600">⚠ Info hidden in title — not accessible</p>
      </div>
    ),
    goodDemo: () => (
      <button className="flex items-center gap-2 px-3 py-2 border border-zinc-300 rounded text-sm">
        <Save className="h-4 w-4" aria-hidden="true" />
        <span>Save</span>
      </button>
    ),
  },
  // ══ KEYBOARD ══
  {
    id: 'visible-focus-style',
    title: 'Make sure there is a visible focus style for interactive elements that are navigated to via keyboard input.',
    category: 'keyboard', wcag: '2.4.7', wcagTitle: 'Focus Visible', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html',
    description: 'Let your focus styles flow from your brand. For example, if you use rounded buttons, make your focus ring rounded as well.',
    whyItMatters: 'Keyboard-only users rely entirely on the visible focus indicator to know which element is currently active.',
    badDemo: () => (
      <div className="space-y-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded text-xs" style={{ outline: 'none' }}>
          Click me (no focus ring)
        </button>
        <p className="text-xs text-zinc-500">Tab to this button — no indicator appears</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          Click me (visible focus ring)
        </button>
        <p className="text-xs text-zinc-500">Tab here — a clear blue ring appears</p>
      </div>
    ),
  },
  {
    id: 'focus-order-matches-visual',
    title: 'Check to see that keyboard focus order matches the visual layout.',
    category: 'keyboard', wcag: '1.3.2', wcagTitle: 'Meaningful Sequence', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html',
    description: 'Check to see that keyboard focus order matches the visual layout. Use the tab key to navigate.',
    whyItMatters: 'Mismatched focus order causes keyboard users to jump unpredictably across the page, losing their place and context.',
    badDemo: () => (
      <div className="space-y-1">
        <p className="text-xs text-zinc-500">DOM order: Right, Left, Right, Left</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="order-2 px-2 py-1 border border-zinc-300 rounded text-xs">Left 1 (Tab 2)</button>
          <button className="order-1 px-2 py-1 border border-zinc-300 rounded text-xs">Right 1 (Tab 1)</button>
          <button className="order-4 px-2 py-1 border border-zinc-300 rounded text-xs">Left 2 (Tab 4)</button>
          <button className="order-3 px-2 py-1 border border-zinc-300 rounded text-xs">Right 2 (Tab 3)</button>
        </div>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <p className="text-xs text-zinc-500">DOM order matches reading order</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-2 py-1 border border-zinc-300 rounded text-xs">Left 1 (Tab 1)</button>
          <button className="px-2 py-1 border border-zinc-300 rounded text-xs">Right 1 (Tab 2)</button>
          <button className="px-2 py-1 border border-zinc-300 rounded text-xs">Left 2 (Tab 3)</button>
          <button className="px-2 py-1 border border-zinc-300 rounded text-xs">Right 2 (Tab 4)</button>
        </div>
      </div>
    ),
  },
  {
    id: 'remove-invisible-focusable',
    title: 'Remove invisible focusable elements.',
    category: 'keyboard', wcag: '2.4.3', wcagTitle: 'Focus Order', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html',
    description: 'Remove the ability to focus on elements that are not presently meant to be discoverable. This includes things like inactive drop down menus, off screen navigations, or modals.',
    whyItMatters: 'Invisible focusable elements create ghost tab stops that confuse keyboard users who cannot see where focus went.',
    badDemo: () => (
      <div className="space-y-2 overflow-hidden relative" style={{ minHeight: '80px' }}>
        <button className="px-2 py-1 border border-zinc-300 rounded text-xs">Visible Button 1</button>
        <div style={{ transform: 'translateX(-9999px)', position: 'absolute' }}>
          <button className="px-2 py-1 border rounded text-xs">Off-screen (still in tab order!)</button>
        </div>
        <button className="px-2 py-1 border border-zinc-300 rounded text-xs">Visible Button 2</button>
        <p className="text-xs text-red-600">Tab twice — focus vanishes to hidden element</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-2">
        <button className="px-2 py-1 border border-zinc-300 rounded text-xs">Visible Button 1</button>
        <button hidden className="px-2 py-1 border rounded text-xs">Hidden (skipped by Tab)</button>
        <button className="px-2 py-1 border border-zinc-300 rounded text-xs">Visible Button 2</button>
        <p className="text-xs text-emerald-600">✓ Tab moves directly between visible buttons</p>
      </div>
    ),
  },
  // ══ IMAGES ══
  {
    id: 'img-has-alt',
    title: 'Make sure that all img elements have an alt attribute.',
    category: 'images', wcag: '1.1.1', wcagTitle: 'Non-text Content', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
    description: 'Alternate text provides a textual alternative to non-text content in web pages.',
    whyItMatters: 'Without alt text, screen readers announce the raw filename which is meaningless or confusing to users.',
    badDemo: () => (
      <div className="space-y-1">
        <div className="w-20 h-14 bg-zinc-200 rounded flex items-center justify-center text-2xl">🐱</div>
        <code className="text-xs block">&lt;img src="cat.jpg"&gt;</code>
        <p className="text-xs text-red-600">Screen reader: "cat.jpg"</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <div className="w-20 h-14 bg-zinc-200 rounded flex items-center justify-center text-2xl">🐱</div>
        <code className="text-xs block">&lt;img src="cat.jpg" alt="A ginger tabby cat on a windowsill"&gt;</code>
        <p className="text-xs text-emerald-600">✓ Descriptive alt text</p>
      </div>
    ),
  },
  {
    id: 'decorative-img-empty-alt',
    title: 'Make sure that decorative images use null alt (empty) attribute values.',
    category: 'images', wcag: '1.1.1', wcagTitle: 'Non-text Content', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
    description: 'Decorative images are images that do not provide additional content or context. Using a null alt attribute means these images are hidden from assistive technology.',
    whyItMatters: 'Decorative images with descriptive alt text create noise for screen reader users trying to understand content.',
    badDemo: () => (
      <div className="space-y-1">
        <p className="text-xs">Paragraph one.</p>
        <div className="h-1 bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200" role="img" aria-label="decorative line divider image png" />
        <p className="text-xs">Paragraph two.</p>
        <p className="text-xs text-red-600">SR announces: "decorative line divider image png"</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <p className="text-xs">Paragraph one.</p>
        <div className="h-1 bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200" role="presentation" aria-hidden="true" />
        <p className="text-xs">Paragraph two.</p>
        <p className="text-xs text-emerald-600">✓ Screen reader skips the divider</p>
      </div>
    ),
  },
  {
    id: 'complex-image-text-alt',
    title: 'Provide a text alternative for complex images such as charts, graphs, and maps.',
    category: 'images', wcag: '1.1.1', wcagTitle: 'Non-text Content', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
    description: 'Is the information presented in the chart, graph, or map also available in text format?',
    whyItMatters: 'Screen readers cannot interpret visual data — a text alternative ensures no information is lost for blind users.',
    badDemo: () => (
      <div className="space-y-1">
        <div className="flex gap-1 items-end h-14 border-b border-zinc-300 px-1">
          {[40, 70, 50, 90, 60].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-400 rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
        <p className="text-xs text-red-600">No description — SR: "chart"</p>
      </div>
    ),
    goodDemo: () => (
      <figure className="space-y-1">
        <div className="flex gap-1 items-end h-14 border-b border-zinc-300 px-1">
          {[40, 70, 50, 90, 60].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-400 rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
        <figcaption className="text-xs text-zinc-600">Monthly sales: Jan 40, Feb 70, Mar 50, Apr 90, May 60 units</figcaption>
      </figure>
    ),
  },
  {
    id: 'text-in-image-alt',
    title: "For images containing text, make sure the alt description includes the image's text.",
    category: 'images', wcag: '1.1.1', wcagTitle: 'Non-text Content', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
    description: 'For example, the FedEx logo should have an alt value of "FedEx."',
    whyItMatters: 'If text is embedded in an image, it must be in the alt text so blind users receive the same information.',
    badDemo: () => (
      <div className="space-y-1">
        <div className="inline-flex items-center bg-purple-700 text-white px-2 py-0.5 rounded font-bold text-sm">
          <span style={{ color: '#ff6600' }}>Fed</span><span>Ex</span>
        </div>
        <code className="block text-xs">alt="company logo"</code>
        <p className="text-xs text-red-600">SR: "company logo"</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <div className="inline-flex items-center bg-purple-700 text-white px-2 py-0.5 rounded font-bold text-sm">
          <span style={{ color: '#ff6600' }}>Fed</span><span>Ex</span>
        </div>
        <code className="block text-xs">alt="FedEx"</code>
        <p className="text-xs text-emerald-600">SR: "FedEx" ✓</p>
      </div>
    ),
  },
  // ══ HEADINGS ══
  {
    id: 'headings-introduce-content',
    title: 'Use heading elements to introduce content.',
    category: 'headings', wcag: '2.4.6', wcagTitle: 'Headings and Labels', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html',
    description: 'Do not use a heading element for a subheading, title, or tagline that is not introducing a section or article of content.',
    whyItMatters: 'Semantic headings let screen reader users navigate page structure — styled paragraphs are completely invisible to them.',
    badDemo: () => (
      <div>
        <p className="text-xl font-bold">Pricing</p>
        <p className="text-xs text-zinc-500">Plans for every team</p>
        <p className="text-xs text-red-600 mt-1">⚠ Visual heading, semantic paragraph</p>
      </div>
    ),
    goodDemo: () => (
      <div>
        <h2 className="text-xl font-bold">Pricing</h2>
        <p className="text-xs text-zinc-500">Plans for every team</p>
        <p className="text-xs text-emerald-600 mt-1">✓ Semantic h2</p>
      </div>
    ),
  },
  {
    id: 'single-h1',
    title: 'Use only one h1 element per page or view.',
    category: 'headings', wcag: '2.4.6', wcagTitle: 'Headings and Labels', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html',
    description: 'The h1 element should describe the page or view a person is on. Use a heading hierarchy to label content.',
    whyItMatters: 'Multiple h1 elements confuse the document outline, making it harder for screen reader users to understand page structure.',
    badDemo: () => (
      <div className="space-y-1">
        {['Page Title', 'Section Title', 'Article Title'].map(t => (
          <h1 key={t} className="text-base font-bold text-red-700">{t} (h1)</h1>
        ))}
        <p className="text-xs text-red-600">⚠ Three h1 elements!</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-0.5">
        <h1 className="text-base font-bold">Page Title (h1)</h1>
        <h2 className="text-sm font-semibold pl-2">Section Title (h2)</h2>
        <h3 className="text-xs font-medium pl-4">Article Title (h3)</h3>
        <p className="text-xs text-emerald-600 mt-1">✓ Single h1, then h2, h3</p>
      </div>
    ),
  },
  {
    id: 'headings-logical-sequence',
    title: 'Heading elements should be written in a logical sequence.',
    category: 'headings', wcag: '2.4.6', wcagTitle: 'Headings and Labels', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html',
    description: 'Heading hierarchy should only increase by one level at a time.',
    whyItMatters: 'Out-of-order headings break the logical document outline that screen reader users navigate by.',
    badDemo: () => (
      <div className="space-y-0.5 text-xs">
        <div className="flex gap-1"><span className="text-red-500">✗</span><span className="font-bold">h1: Page</span></div>
        <div className="flex gap-1 ml-3"><span className="text-red-500">✗</span><span className="font-medium">h4: Skipped to 4!</span></div>
        <div className="flex gap-1 ml-1"><span className="text-red-500">✗</span><span className="font-semibold">h2: Back to 2</span></div>
        <div className="flex gap-1 ml-6"><span className="text-red-500">✗</span><span>h6: Jumped to 6!</span></div>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-0.5 text-xs">
        <div className="flex gap-1"><span className="text-emerald-500">✓</span><span className="font-bold">h1: Page</span></div>
        <div className="flex gap-1 ml-3"><span className="text-emerald-500">✓</span><span className="font-semibold">h2: Section</span></div>
        <div className="flex gap-1 ml-5"><span className="text-emerald-500">✓</span><span className="font-medium">h3: Subsection</span></div>
        <div className="flex gap-1 ml-3"><span className="text-emerald-500">✓</span><span className="font-semibold">h2: Next Section</span></div>
      </div>
    ),
  },
  {
    id: 'no-skipped-headings',
    title: "Don't skip heading levels.",
    category: 'headings', wcag: '2.4.6', wcagTitle: 'Headings and Labels', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html',
    description: 'A user with a screen reader may use heading navigation to explore a page. Skipping heading levels can cause confusion when navigating.',
    whyItMatters: 'Skipped heading levels break the expected document outline and cause confusion for AT navigation.',
    badDemo: () => (
      <div className="space-y-1">
        <h2 className="font-semibold text-xs">h2: Overview</h2>
        <h4 className="font-medium text-xs text-red-600 ml-4">h4: Details — skipped h3!</h4>
        <p className="text-xs text-red-600">⚠ h3 was skipped</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-0.5">
        <h2 className="font-semibold text-xs">h2: Overview</h2>
        <h3 className="font-medium text-xs ml-3">h3: Subsection</h3>
        <h4 className="font-normal text-xs ml-5">h4: Details</h4>
        <p className="text-xs text-emerald-600">✓ Sequential levels</p>
      </div>
    ),
  },
  // ══ LISTS ══
  {
    id: 'use-list-elements',
    title: 'Use list elements (ol, ul, and dl elements) for list content.',
    category: 'lists', wcag: '1.3.1', wcagTitle: 'Info and Relationships', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
    description: 'Using list elements communicates to assistive technology that content is a list.',
    whyItMatters: 'Semantic lists tell screen readers how many items are in the list, enabling efficient navigation.',
    badDemo: () => (
      <div className="text-xs">
        • Apples<br />• Pears<br />• Plums
        <p className="text-red-600 mt-1">⚠ Plain text — no list semantics</p>
      </div>
    ),
    goodDemo: () => (
      <div>
        <ul className="text-xs list-disc list-inside space-y-0.5">
          <li>Apples</li><li>Pears</li><li>Plums</li>
        </ul>
        <p className="text-xs text-emerald-600 mt-1">✓ SR: "list, 3 items"</p>
      </div>
    ),
  },
  // ══ CONTROLS ══
  {
    id: 'a-element-for-links',
    title: 'Use the a element for links.',
    category: 'controls', wcag: '1.3.1', wcagTitle: 'Info and Relationships', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
    description: 'Links created by the a element have functionality that is expected by a person using assistive technology.',
    whyItMatters: 'Only real <a> elements appear in screen reader link lists, are bookmarkable, and open correctly with middle-click.',
    badDemo: () => (
      <div className="space-y-1">
        <span className="text-blue-600 underline cursor-pointer text-xs" role="button" tabIndex={0}>
          Pricing (span with onClick)
        </span>
        <p className="text-xs text-red-600">⚠ Not a real link</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <a href="#" className="text-blue-600 underline text-xs">Pricing (real anchor)</a>
        <p className="text-xs text-emerald-600">✓ Keyboard navigable, bookmarkable</p>
      </div>
    ),
  },
  {
    id: 'links-recognizable',
    title: 'Ensure that links are recognizable as links.',
    category: 'controls', wcag: '1.4.1', wcagTitle: 'Use of Color', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html',
    description: 'Identify links with more than just color to ensure that people who cannot distinguish colors can navigate without issue.',
    whyItMatters: 'Color alone is insufficient — colorblind users and high-contrast mode users may not see color differences.',
    badDemo: LinksGrayscaleBadDemo,
    goodDemo: () => (
      <div className="space-y-2">
        <p className="text-xs">Visit our <a href="#" className="text-blue-600 underline">pricing page</a> or read the <a href="#" className="text-blue-600 underline">docs</a>.</p>
        <p className="text-xs text-emerald-600">✓ Color AND underline — visible in grayscale</p>
      </div>
    ),
  },
  {
    id: 'controls-focus-states',
    title: 'Ensure that controls have :focus states.',
    category: 'controls', wcag: '2.4.7', wcagTitle: 'Focus Visible', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html',
    description: 'Do not suppress CSS outline styles without providing an alternative focus style.',
    whyItMatters: 'Without visible focus states, keyboard users cannot tell which interactive element is currently active.',
    badDemo: () => (
      <div className="flex gap-2">
        {['Home', 'About', 'Contact'].map(l => (
          <button key={l} className="px-2 py-1 border border-zinc-300 rounded text-xs" style={{ outline: 'none' }}>{l}</button>
        ))}
      </div>
    ),
    goodDemo: () => (
      <div className="flex gap-2">
        {['Home', 'About', 'Contact'].map(l => (
          <button key={l} className="px-2 py-1 border border-zinc-300 rounded text-xs focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1">{l}</button>
        ))}
      </div>
    ),
  },
  {
    id: 'button-element-for-buttons',
    title: 'Use the button element for buttons.',
    category: 'controls', wcag: '1.3.1', wcagTitle: 'Info and Relationships', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
    description: 'Buttons created by the button element have functionality that is expected by a person using assistive technology.',
    whyItMatters: 'Only real <button> elements activate with Space/Enter, are in tab order by default, and are announced as buttons by screen readers.',
    badDemo: () => (
      <div className="space-y-1">
        <div role="button" className="px-4 py-2 bg-zinc-700 text-white rounded text-xs cursor-pointer inline-block">
          Submit (div)
        </div>
        <p className="text-xs text-red-600">⚠ No keyboard activation, no Enter/Space</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <button type="button" className="px-4 py-2 bg-zinc-700 text-white rounded text-xs">Submit (button)</button>
        <p className="text-xs text-emerald-600">✓ Keyboard activatable, proper role</p>
      </div>
    ),
  },
  {
    id: 'skip-link',
    title: 'Provide a skip link and make sure that it is visible when focused.',
    category: 'controls', wcag: '2.4.1', wcagTitle: 'Bypass Blocks', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html',
    description: 'A skip link can be used to provide quick access to a single portion of the document.',
    whyItMatters: 'Without a skip link, keyboard users must Tab through every navigation item on every page load before reaching content.',
    badDemo: () => (
      <div className="border rounded text-xs overflow-hidden">
        <div className="bg-zinc-100 p-2 space-y-0.5">
          <p className="font-medium mb-1">No skip link — must Tab through all nav:</p>
          {['Home', 'About', 'Services', 'Blog', 'Contact', 'FAQ', '…28 more items'].map(i => (
            <a key={i} href="#" className="block text-blue-600 hover:underline pl-1">{i}</a>
          ))}
        </div>
      </div>
    ),
    goodDemo: () => (
      <div className="border rounded text-xs overflow-hidden">
        <div className="p-2 bg-emerald-50 border-b border-emerald-200">
          <a href="#main-demo" className="inline-block bg-blue-600 text-white px-3 py-1 rounded">
            Skip to main content ↓
          </a>
          <p className="text-zinc-500 mt-1">(Visible on focus — first tab stop)</p>
        </div>
        <div className="p-2" id="main-demo"><span className="font-medium">Main content here</span></div>
      </div>
    ),
  },
  {
    id: 'new-tab-warning',
    title: 'Identify links that open in a new tab or window.',
    category: 'controls', wcag: 'G201', wcagTitle: 'Technique', level: 'Technique',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Techniques/general/G201',
    description: 'While this technique is technically not required for compliance, it is an often-cited area of frustration for many different kinds of assistive technology users.',
    whyItMatters: 'Unexpectedly opening a new tab disorients screen reader users and breaks the back-button navigation flow.',
    badDemo: () => (
      <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
        Read more (opens new tab — no warning)
      </a>
    ),
    goodDemo: () => (
      <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs inline-flex items-center gap-1">
        Read more
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">(opens in new tab)</span>
      </a>
    ),
  },
  // ══ TABLES ══
  {
    id: 'use-table-element',
    title: 'Use the table element to describe tabular data.',
    category: 'tables', wcag: '1.3.1', wcagTitle: 'Info and Relationships', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
    description: 'Do any tables exist? If so, are they marked up semantically to describe the table data?',
    whyItMatters: 'CSS grid divs have no table semantics — screen readers cannot navigate by row/column or announce cell relationships.',
    badDemo: () => (
      <div className="grid text-xs" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {['Name', 'Role', 'Team', 'Alice', 'Dev', 'Alpha'].map((c, i) => (
          <div key={i} className={`border border-zinc-200 p-1 ${i < 3 ? 'font-bold bg-zinc-100' : ''}`}>{c}</div>
        ))}
      </div>
    ),
    goodDemo: () => (
      <table className="text-xs w-full border-collapse">
        <thead><tr>
          <th scope="col" className="border border-zinc-200 p-1 font-bold text-left bg-emerald-50">Name</th>
          <th scope="col" className="border border-zinc-200 p-1 font-bold text-left bg-emerald-50">Role</th>
          <th scope="col" className="border border-zinc-200 p-1 font-bold text-left bg-emerald-50">Team</th>
        </tr></thead>
        <tbody><tr>
          <td className="border border-zinc-200 p-1">Alice</td>
          <td className="border border-zinc-200 p-1">Dev</td>
          <td className="border border-zinc-200 p-1">Alpha</td>
        </tr></tbody>
      </table>
    ),
  },
  {
    id: 'th-with-scope',
    title: 'Use the th element for table headers (with appropriate scope attributes).',
    category: 'tables', wcag: '4.1.1', wcagTitle: 'Parsing', level: 'A', obsolete: true,
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/parsing.html',
    description: 'Scope attributes on th elements improve support in some older browsers.',
    whyItMatters: 'Without scope attributes, screen readers may not correctly associate header cells with their data cells.',
    badDemo: () => (
      <table className="text-xs w-full border-collapse">
        <thead><tr>
          <td className="border border-zinc-200 p-1 font-bold bg-red-50">Product</td>
          <td className="border border-zinc-200 p-1 font-bold bg-red-50">Price</td>
        </tr></thead>
        <tbody><tr>
          <td className="border border-zinc-200 p-1">Widget</td>
          <td className="border border-zinc-200 p-1">$9.99</td>
        </tr></tbody>
      </table>
    ),
    goodDemo: () => (
      <table className="text-xs w-full border-collapse">
        <thead><tr>
          <th scope="col" className="border border-zinc-200 p-1 font-bold text-left bg-emerald-50">Product</th>
          <th scope="col" className="border border-zinc-200 p-1 font-bold text-left bg-emerald-50">Price</th>
        </tr></thead>
        <tbody><tr>
          <th scope="row" className="border border-zinc-200 p-1 font-medium text-left">Widget</th>
          <td className="border border-zinc-200 p-1">$9.99</td>
        </tr></tbody>
      </table>
    ),
  },
  {
    id: 'table-caption',
    title: 'Use the caption element to provide a title for the table.',
    category: 'tables', wcag: '2.4.6', wcagTitle: 'Headings and Labels', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html',
    description: 'The caption element identifies the overall topic of a table and is useful in most circumstances.',
    whyItMatters: 'Screen reader users hear the caption before navigating a table, giving crucial context about its contents.',
    badDemo: () => (
      <div className="space-y-1">
        <h3 className="font-semibold text-xs">Q3 2025 Sales</h3>
        <table className="text-xs w-full border-collapse">
          <thead><tr><th scope="col" className="border border-zinc-200 p-1 text-left">Region</th><th scope="col" className="border border-zinc-200 p-1 text-left">Total</th></tr></thead>
          <tbody><tr><td className="border border-zinc-200 p-1">North</td><td className="border border-zinc-200 p-1">$120k</td></tr></tbody>
        </table>
        <p className="text-xs text-red-600">⚠ Title is outside the table</p>
      </div>
    ),
    goodDemo: () => (
      <table className="text-xs w-full border-collapse">
        <caption className="font-semibold text-left pb-1">Q3 2025 Sales by Region</caption>
        <thead><tr><th scope="col" className="border border-zinc-200 p-1 text-left">Region</th><th scope="col" className="border border-zinc-200 p-1 text-left">Total</th></tr></thead>
        <tbody><tr><td className="border border-zinc-200 p-1">North</td><td className="border border-zinc-200 p-1">$120k</td></tr></tbody>
      </table>
    ),
  },
  // ══ FORMS ══
  {
    id: 'inputs-have-labels',
    title: 'All inputs in a form are associated with a corresponding label element.',
    category: 'forms', wcag: '3.2.2', wcagTitle: 'On Input', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/on-input.html',
    description: 'Use a for/id pairing to guarantee the highest level of browser/assistive technology support.',
    whyItMatters: 'Without associated labels, screen readers only announce "edit text" when a user focuses an input — no purpose is communicated.',
    badDemo: () => (
      <div className="space-y-1">
        <input type="email" placeholder="Email" className="border border-zinc-300 rounded px-2 py-1 text-xs w-full" />
        <p className="text-xs text-red-600">⚠ No label — SR: "edit text"</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <label htmlFor="demo-em" className="text-xs font-medium block">Email address</label>
        <input id="demo-em" type="email" className="border border-zinc-400 rounded px-2 py-1 text-xs w-full" />
        <p className="text-xs text-emerald-600">✓ SR: "Email address, edit text"</p>
      </div>
    ),
  },
  {
    id: 'fieldset-legend',
    title: 'Use fieldset and legend elements where appropriate.',
    category: 'forms', wcag: '1.3.1', wcagTitle: 'Info and Relationships', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
    description: 'Does your form contain multiple inputs that relate to the same topic? Use fieldset to group them and legend to provide a label for the group.',
    whyItMatters: 'Without fieldset/legend, screen reader users hear radio button labels without knowing what group they belong to.',
    badDemo: () => (
      <div className="space-y-1">
        <p className="text-xs font-medium">Shipping speed</p>
        <div className="space-y-0.5">
          {['Standard', 'Express', 'Overnight'].map(s => (
            <label key={s} className="flex items-center gap-2 text-xs"><input type="radio" name="bs" /> {s}</label>
          ))}
        </div>
        <p className="text-xs text-red-600">⚠ Group label not programmatically associated</p>
      </div>
    ),
    goodDemo: () => (
      <fieldset className="border rounded p-2 space-y-0.5">
        <legend className="text-xs font-medium px-1">Shipping speed</legend>
        {['Standard', 'Express', 'Overnight'].map(s => (
          <label key={s} className="flex items-center gap-2 text-xs"><input type="radio" name="gs" /> {s}</label>
        ))}
      </fieldset>
    ),
  },
  {
    id: 'inputs-autocomplete',
    title: 'Inputs use autocomplete where appropriate.',
    category: 'forms', wcag: '1.3.5', wcagTitle: 'Identify Input Purpose', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html',
    description: 'Inputs that collect information about a person should use appropriate autocomplete values.',
    whyItMatters: 'Autocomplete tokens let browsers and AT auto-fill forms for users with cognitive or motor disabilities.',
    badDemo: () => (
      <div className="space-y-1">
        <input name="fn" placeholder="First name" className="border border-zinc-300 rounded px-2 py-1 text-xs w-full" />
        <input name="addr" placeholder="Address" className="border border-zinc-300 rounded px-2 py-1 text-xs w-full" />
        <p className="text-xs text-red-600">⚠ No autocomplete attributes</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <input name="fn" autoComplete="given-name" placeholder="First name" className="border border-zinc-400 rounded px-2 py-1 text-xs w-full" />
        <input name="addr" autoComplete="street-address" placeholder="Address" className="border border-zinc-400 rounded px-2 py-1 text-xs w-full" />
        <p className="text-xs text-emerald-600">✓ Browser can auto-fill correctly</p>
      </div>
    ),
  },
  {
    id: 'error-summary-list',
    title: 'Make sure that form input errors are displayed in list above the form after submission.',
    category: 'forms', wcag: '3.3.1', wcagTitle: 'Error Identification', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html',
    description: 'Providing a list of errors at the top of the form helps with recognition, context, and navigation.',
    whyItMatters: 'Inline-only errors can be missed by screen reader users who have already moved past the field.',
    badDemo: () => (
      <div className="space-y-1">
        <div className="space-y-0.5">
          <label className="text-xs">Email</label>
          <input className="border border-red-400 rounded px-2 py-1 text-xs w-full" />
          <p className="text-xs text-red-600">Email is required</p>
        </div>
        <p className="text-xs text-zinc-500">No summary — user must find errors by tabbing</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-2">
        <div role="alert" tabIndex={-1} className="border border-red-400 bg-red-50 rounded p-2">
          <h3 className="font-semibold text-xs text-red-700 mb-1">2 errors found:</h3>
          <ul className="list-disc list-inside text-xs text-red-700 space-y-0.5">
            <li><a href="#f-email" className="underline">Email is required</a></li>
            <li><a href="#f-zip" className="underline">ZIP must be 5 digits</a></li>
          </ul>
        </div>
        <p className="text-xs text-emerald-600">✓ Focus jumps here on submit fail</p>
      </div>
    ),
  },
  {
    id: 'error-aria-describedby',
    title: 'Associate input error messaging with the input it corresponds to.',
    category: 'forms', wcag: '3.3.1', wcagTitle: 'Error Identification', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html',
    description: 'Use the aria-describedby attribute to associate the error message with the corresponding input element.',
    whyItMatters: 'Without aria-describedby, screen readers announce the input name but silently skip the adjacent error message.',
    badDemo: () => (
      <div className="space-y-1">
        <input type="email" className="border border-red-400 rounded px-2 py-1 text-xs w-full" defaultValue="" />
        <p className="text-xs text-red-600">Email is required</p>
        <p className="text-xs text-zinc-500">⚠ Error not linked to input</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <input type="email" aria-invalid="true" aria-describedby="demo-email-err" className="border border-red-400 rounded px-2 py-1 text-xs w-full" defaultValue="" />
        <p id="demo-email-err" className="text-xs text-red-600">Email is required</p>
        <p className="text-xs text-emerald-600">✓ SR announces error when field is focused</p>
      </div>
    ),
  },
  {
    id: 'state-not-color-only',
    title: 'Make sure that error, warning, and success states are not visually communicated by just color.',
    category: 'forms', wcag: '1.4.1', wcagTitle: 'Use of Color', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html',
    description: 'Color is not perceived by all users; additional indicators ensure everyone receives the same information.',
    whyItMatters: '8% of men have red-green colorblindness — they cannot distinguish red "error" from green "success" states.',
    badDemo: () => (
      <div className="space-y-1">
        <input className="border-2 border-red-500 rounded px-2 py-1 text-xs w-full" defaultValue="bad@" />
        <input className="border-2 border-green-500 rounded px-2 py-1 text-xs w-full" defaultValue="valid@example.com" />
        <p className="text-xs text-zinc-500">Color alone — fails for colorblind users</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3 text-red-600 shrink-0" />
          <input className="border border-red-400 rounded px-2 py-1 text-xs flex-1" defaultValue="bad@" aria-label="Error: invalid email" />
          <span className="text-xs text-red-600 font-medium">Error</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
          <input className="border border-emerald-400 rounded px-2 py-1 text-xs flex-1" defaultValue="valid@example.com" aria-label="Valid email" />
          <span className="text-xs text-emerald-600 font-medium">Valid</span>
        </div>
      </div>
    ),
  },
  // ══ MEDIA ══
  {
    id: 'no-autoplay',
    title: 'Make sure that media does not autoplay.',
    category: 'media', wcag: '1.4.2', wcagTitle: 'Audio Control', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html',
    description: 'Automatically playing audio can interfere with screen readers.',
    whyItMatters: 'Autoplaying audio overrides screen reader output — users who navigate by listening cannot hear their AT.',
    badDemo: AutoplayBadDemo,
    goodDemo: () => (
      <div className="space-y-1">
        <pre className="text-xs bg-emerald-50 border border-emerald-200 p-2 rounded">{`<audio controls preload="none">\n  <source src="clip.mp3">\n</audio>`}</pre>
        <p className="text-xs text-emerald-600">✓ User controls when audio plays</p>
      </div>
    ),
  },
  {
    id: 'media-controls-markup',
    title: 'Ensure that media controls use appropriate markup.',
    category: 'media', wcag: '1.3.1', wcagTitle: 'Info and Relationships', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
    description: 'Examples include making sure an audio mute button has a pressed toggle state when active, or that a volume slider uses <input type="range">.',
    whyItMatters: 'Div-based media controls are not keyboard-operable and do not communicate state changes to screen readers.',
    badDemo: () => (
      <div className="flex items-center gap-3">
        <div onClick={() => {}} className="cursor-pointer text-xl" role="presentation">🔇</div>
        <div className="h-2 bg-zinc-300 rounded w-24 cursor-pointer"><div className="h-2 w-1/2 bg-blue-500 rounded" /></div>
        <span className="text-xs text-red-600">div controls</span>
      </div>
    ),
    goodDemo: MuteGoodDemo,
  },
  {
    id: 'media-pausable',
    title: 'Check to see that all media can be paused.',
    category: 'media', wcag: '2.1.1', wcagTitle: 'Keyboard', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html',
    description: 'Providing a pause mechanism is important for those who may find movement distracting.',
    whyItMatters: 'Constantly moving media distracts users with attention disorders and can interfere with screen reader output.',
    badDemo: () => (
      <div className="space-y-1">
        <div className="rounded bg-zinc-800 flex items-center justify-center text-white text-xs" style={{ height: '56px' }}>
          🎬 Video (autoPlay loop — no controls)
        </div>
        <p className="text-xs text-red-600">⚠ No way to pause</p>
      </div>
    ),
    goodDemo: MediaPauseGoodDemo,
  },
  // ══ VIDEO ══
  {
    id: 'captions-present',
    title: 'Confirm the presence of captions.',
    category: 'video', wcag: '1.2.2', wcagTitle: 'Captions (Prerecorded)', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html',
    description: 'Do all videos have caption tracks?',
    whyItMatters: 'Deaf and hard-of-hearing users rely on captions to access spoken content in videos.',
    badDemo: () => (
      <div className="space-y-1">
        <div className="bg-zinc-800 rounded h-12 flex items-center justify-center text-white text-xs">🎬 Video</div>
        <code className="text-xs block">&lt;video controls&gt;&lt;source src="talk.mp4"&gt;&lt;/video&gt;</code>
        <p className="text-xs text-red-600">⚠ No &lt;track&gt; element</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <div className="bg-zinc-800 rounded h-12 flex items-center justify-center text-white text-xs">🎬 [CC] Video with captions</div>
        <code className="text-xs block">&lt;track kind="captions" srclang="en" src="talk.vtt" default&gt;</code>
        <p className="text-xs text-emerald-600">✓ Caption track present</p>
      </div>
    ),
  },
  {
    id: 'no-seizure-triggers',
    title: 'Remove seizure triggers.',
    category: 'video', wcag: '2.3.1', wcagTitle: 'Three Flashes or Below Threshold', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html',
    description: 'Rapidly flashing content can trigger seizures in people with photosensitive epilepsy.',
    whyItMatters: 'Content flashing more than 3 times/second can trigger seizures in people with photosensitive epilepsy.',
    badDemo: SeizureBadDemo,
    goodDemo: () => (
      <div className="space-y-1">
        <div className="rounded h-12 flex items-center justify-center text-sm font-medium bg-emerald-100 text-emerald-800 animate-pulse">
          ✓ Slow pulse (1 Hz — well below threshold)
        </div>
        <p className="text-xs text-zinc-500">Also respects prefers-reduced-motion</p>
      </div>
    ),
  },
  // ══ AUDIO ══
  {
    id: 'audio-transcripts',
    title: 'Confirm that transcripts are available.',
    category: 'audio', wcag: '1.1.1', wcagTitle: 'Non-text Content', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
    description: 'Do all podcasts and audio-only content have a text transcript?',
    whyItMatters: 'Deaf users and those in sound-sensitive environments rely on transcripts to access audio content.',
    badDemo: () => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 bg-zinc-100 rounded p-2 text-xs">
          <Volume2 className="h-4 w-4" aria-hidden="true" /> Podcast Episode 42
        </div>
        <p className="text-xs text-red-600">⚠ No transcript available</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 bg-zinc-100 rounded p-2 text-xs">
          <Volume2 className="h-4 w-4" aria-hidden="true" /> Podcast Episode 42
        </div>
        <details className="text-xs border border-zinc-200 rounded">
          <summary className="p-2 cursor-pointer font-medium">Transcript</summary>
          <div className="p-2 border-t border-zinc-200 text-zinc-600">
            [Host]: Welcome to episode 42. Today we discuss web accessibility standards and their real-world impact on users with disabilities…
          </div>
        </details>
      </div>
    ),
  },
  // ══ APPEARANCE ══
  {
    id: 'specialized-browsing-modes',
    title: 'Check your content in specialized browsing modes.',
    category: 'appearance', wcag: '1.4.1', wcagTitle: 'Use of Color', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html',
    description: 'Browsing modes such as Windows High Contrast Mode, Night Mode, and grayscale displays can affect your design.',
    whyItMatters: 'CSS gradient backgrounds and shadow-only borders disappear in Windows High Contrast Mode, making buttons invisible.',
    badDemo: () => (
      <div className="space-y-2">
        <button style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px' }}>
          Save (gradient, no border)
        </button>
        <p className="text-xs text-red-600">⚠ Gradient disappears in high contrast mode</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-2">
        <button style={{ backgroundColor: 'ButtonFace', color: 'ButtonText', border: '1px solid currentColor', padding: '8px 16px', borderRadius: '6px', fontSize: '13px' }}>
          Save (system colors + border)
        </button>
        <p className="text-xs text-emerald-600">✓ Visible in all contrast modes</p>
      </div>
    ),
  },
  {
    id: 'text-resize-200',
    title: 'Increase text size to 200%.',
    category: 'appearance', wcag: '1.4.4', wcagTitle: 'Resize text', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html',
    description: 'Content or functionality should not be lost when text is resized up to 200% of its original size.',
    whyItMatters: 'Fixed-height containers clip text when users increase font size, hiding content from low-vision users.',
    badDemo: TextResizeBadDemo,
    goodDemo: TextResizeGoodDemo,
  },
  {
    id: 'proximity-maintained',
    title: 'Double-check that good proximity between content is maintained.',
    category: 'appearance', wcag: '1.3.3', wcagTitle: 'Sensory Characteristics', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html',
    description: 'Labels and their form controls should be visually adjacent to each other.',
    whyItMatters: 'Visual proximity helps users with cognitive disabilities associate labels with inputs, and is critical for screen magnification users.',
    badDemo: () => (
      <div className="flex justify-between items-center gap-2">
        <label className="text-xs font-medium shrink-0">Email</label>
        <div className="flex-1 border-b border-dashed border-zinc-300" />
        <input type="email" className="border border-zinc-300 rounded px-2 py-1 text-xs w-28" placeholder="user@example.com" />
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-0.5">
        <label className="text-xs font-medium block">Email</label>
        <input type="email" className="border border-zinc-400 rounded px-2 py-1 text-xs w-full" placeholder="user@example.com" />
      </div>
    ),
  },
  {
    id: 'color-not-only-cue',
    title: "Make sure color isn't the only way information is conveyed.",
    category: 'appearance', wcag: '1.4.1', wcagTitle: 'Use of Color', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html',
    description: 'Do not rely on color alone to convey information to users.',
    whyItMatters: '8% of men have red-green colorblindness — color-only indicators are invisible to them.',
    badDemo: () => (
      <div className="space-y-0.5 text-xs">
        <div style={{ color: '#dc2626' }}>report.pdf — (color only: red)</div>
        <div style={{ color: '#16a34a' }}>data.csv — (color only: green)</div>
        <div style={{ color: '#dc2626' }}>styles.css — (color only: red)</div>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-0.5 text-xs">
        <div className="flex items-center gap-1"><AlertCircle className="h-3 w-3 text-red-600" /><span>report.pdf</span><span className="text-red-600 font-medium ml-auto">Error</span></div>
        <div className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-600" /><span>data.csv</span><span className="text-emerald-600 font-medium ml-auto">Passing</span></div>
        <div className="flex items-center gap-1"><AlertCircle className="h-3 w-3 text-red-600" /><span>styles.css</span><span className="text-red-600 font-medium ml-auto">Error</span></div>
      </div>
    ),
  },
  {
    id: 'instructions-multimodal',
    title: 'Make sure instructions are not visual or audio-only.',
    category: 'appearance', wcag: '1.3.3', wcagTitle: 'Sensory Characteristics', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html',
    description: 'Instructions that are purely sensory (e.g. "the round button" or "the button on the right") do not make sense to all users.',
    whyItMatters: 'Instructions that rely on shape, color, or position exclude blind users who cannot perceive those visual characteristics.',
    badDemo: () => (
      <div className="space-y-1">
        <p className="text-xs">Click the green button on the right to continue.</p>
        <p className="text-xs text-red-600">⚠ "Green" and "right" are visual-only cues</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <p className="text-xs">Click the green "Continue" button to proceed to the next step.</p>
        <p className="text-xs text-emerald-600">✓ Names the element — no visual cues needed</p>
      </div>
    ),
  },
  {
    id: 'simple-layout',
    title: 'Use a simple, straightforward, and consistent layout.',
    category: 'appearance', wcag: '1.4.10', wcagTitle: 'Reflow', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/reflow.html',
    description: 'A simple layout supports cognitive accessibility and makes responsive design more achievable.',
    whyItMatters: 'Complex, inconsistent layouts increase cognitive load and break when text is zoomed or windows are narrowed.',
    badDemo: () => (
      <div className="text-xs space-y-1">
        <div className="flex gap-1">
          <div className="bg-zinc-200 p-1 rounded w-1/4 text-center">Nav 1</div>
          <div className="bg-zinc-200 p-1 rounded w-1/4 text-center">Nav 2</div>
          <div className="bg-zinc-300 p-1 rounded w-1/2 text-center">Sidebar</div>
        </div>
        <div className="flex gap-1">
          <div className="bg-zinc-100 p-1 rounded w-2/3">Content (overlaps)</div>
          <div className="bg-zinc-200 p-1 rounded w-1/3">Ads</div>
        </div>
        <div className="flex gap-1">
          {['Footer 1', 'Footer 2', 'Footer 3'].map(f => <div key={f} className="bg-zinc-200 p-1 rounded flex-1 text-center">{f}</div>)}
        </div>
      </div>
    ),
    goodDemo: () => (
      <div className="text-xs space-y-1">
        <div className="bg-zinc-200 p-1 rounded text-center">Nav</div>
        <div className="bg-zinc-100 p-1 rounded">Main content</div>
        <div className="bg-zinc-200 p-1 rounded text-center">Footer</div>
      </div>
    ),
  },
  // ══ ANIMATION ══
  {
    id: 'subtle-animations',
    title: 'Ensure animations are subtle and do not flash too much.',
    category: 'animation', wcag: '2.3.1', wcagTitle: 'Three Flashes or Below Threshold', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html',
    description: 'Flashing or very rapid animations can be a trigger for people with photosensitive epilepsy.',
    whyItMatters: 'Rapid, large-scale animations can trigger vestibular disorders and photosensitive epilepsy seizures.',
    badDemo: () => (
      <div className="flex justify-center items-center h-14">
        <div className="w-12 h-12 bg-red-500 rounded animate-bounce" style={{ animationDuration: '0.2s' }} />
        <p className="text-xs text-red-600 ml-2">Fast + large motion</p>
      </div>
    ),
    goodDemo: () => (
      <div className="flex justify-center items-center h-14">
        <div className="w-12 h-12 bg-emerald-500 rounded transition-opacity duration-500 hover:opacity-50" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
        <p className="text-xs text-emerald-600 ml-2">Subtle, slow fade</p>
      </div>
    ),
  },
  {
    id: 'pause-bg-video',
    title: 'Provide a mechanism to pause background video.',
    category: 'animation', wcag: '2.2.2', wcagTitle: 'Pause, Stop, Hide', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html',
    description: 'Ensure that media that starts playing automatically can also be paused.',
    whyItMatters: 'Moving background content distracts users with attention disorders and can interfere with screen reader output.',
    badDemo: () => (
      <div className="relative rounded overflow-hidden" style={{ height: '80px' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center"><p className="text-white font-bold text-sm">Hero Section</p></div>
        <p className="absolute bottom-1 right-2 text-xs text-white/70">No pause control</p>
      </div>
    ),
    goodDemo: PauseBgGoodDemo,
  },
  {
    id: 'prefers-reduced-motion',
    title: 'Make sure all animation obeys the prefers-reduced-motion media query.',
    category: 'animation', wcag: '2.3.3', wcagTitle: 'Animation from Interactions', level: 'AAA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html',
    description: 'Remove animations when the "Reduce motion" accessibility setting is activated.',
    whyItMatters: 'Users with vestibular disorders experience nausea and dizziness from animations — prefers-reduced-motion lets them opt out.',
    badDemo: () => (
      <div className="flex justify-center items-center h-14 gap-2">
        <Settings className="w-10 h-10 text-zinc-700 animate-spin" />
        <p className="text-xs text-red-600">Spins forever — no motion guard</p>
      </div>
    ),
    goodDemo: () => (
      <div className="flex justify-center items-center h-14 gap-2">
        <Settings className="w-10 h-10 text-zinc-700 motion-safe:animate-spin" />
        <p className="text-xs text-emerald-600">Still when reduce-motion is on ✓</p>
      </div>
    ),
  },
  // ══ COLOR CONTRAST ══
  {
    id: 'contrast-normal-text',
    title: 'Check the contrast for all normal-sized text.',
    category: 'color-contrast', wcag: '1.4.3', wcagTitle: 'Contrast (Minimum)', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
    description: 'Normal text must have a contrast ratio of at least 4.5:1 against its background.',
    whyItMatters: 'Low-contrast text is unreadable for people with low vision, color deficiencies, or in bright lighting.',
    badDemo: () => (
      <p style={{ color: '#a1a1aa', background: '#fff', padding: '8px', borderRadius: '4px', fontSize: '14px' }}>
        This text has ~2.5:1 contrast (fails 4.5:1 minimum)
      </p>
    ),
    goodDemo: () => (
      <p style={{ color: '#18181b', background: '#fff', padding: '8px', borderRadius: '4px', fontSize: '14px' }}>
        This text has ~19:1 contrast (well above 4.5:1)
      </p>
    ),
  },
  {
    id: 'contrast-large-text',
    title: 'Check the contrast for all large-sized text.',
    category: 'color-contrast', wcag: '1.4.3', wcagTitle: 'Contrast (Minimum)', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
    description: 'Large-scale text and images of large-scale text have a contrast ratio of at least 3:1.',
    whyItMatters: 'Large text needs at least 3:1 contrast — still too low can make headings illegible for low-vision users.',
    badDemo: () => (
      <h2 style={{ color: '#d4d4d8', background: '#fff', margin: 0, fontSize: '22px', padding: '4px' }}>
        Heading (fails 3:1)
      </h2>
    ),
    goodDemo: () => (
      <h2 style={{ color: '#3f3f46', background: '#fff', margin: 0, fontSize: '22px', padding: '4px' }}>
        Heading (passes 3:1 ✓)
      </h2>
    ),
  },
  {
    id: 'contrast-icons',
    title: 'Check the contrast for all icons.',
    category: 'color-contrast', wcag: '1.4.11', wcagTitle: 'Non-text Contrast', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html',
    description: 'Icons used as UI controls or conveying information need at least 3:1 contrast against their background.',
    whyItMatters: 'Low-contrast icons are invisible to low-vision users and in bright sunlight on mobile screens.',
    badDemo: () => (
      <div className="flex gap-3 items-center p-2 bg-white rounded border border-zinc-100">
        <Search style={{ color: '#d4d4d8', width: '24px', height: '24px' }} />
        <span className="text-xs" style={{ color: '#d4d4d8' }}>Search (~1.5:1 — fails)</span>
      </div>
    ),
    goodDemo: () => (
      <div className="flex gap-3 items-center p-2 bg-white rounded border border-zinc-100">
        <Search style={{ color: '#3f3f46', width: '24px', height: '24px' }} />
        <span className="text-xs" style={{ color: '#3f3f46' }}>Search (~8:1 — passes ✓)</span>
      </div>
    ),
  },
  {
    id: 'contrast-input-borders',
    title: 'Check the contrast of borders for input elements (text input, radio buttons, checkboxes, etc.).',
    category: 'color-contrast', wcag: '1.4.11', wcagTitle: 'Non-text Contrast', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html',
    description: 'Input borders must be distinguishable from their background at 3:1 contrast ratio.',
    whyItMatters: 'Invisible input borders make it impossible for low-vision users to identify where form fields are.',
    badDemo: () => (
      <div className="space-y-1">
        <input style={{ border: '1px solid #e4e4e7', borderRadius: '4px', padding: '6px 8px', fontSize: '13px', width: '100%' }} placeholder="Border ~1.2:1 — barely visible" />
        <p className="text-xs text-red-600">Fails 3:1</p>
      </div>
    ),
    goodDemo: () => (
      <div className="space-y-1">
        <input style={{ border: '1px solid #71717a', borderRadius: '4px', padding: '6px 8px', fontSize: '13px', width: '100%' }} placeholder="Border ~4.5:1 — clear" />
        <p className="text-xs text-emerald-600">Passes 3:1 ✓</p>
      </div>
    ),
  },
  {
    id: 'contrast-text-on-image',
    title: 'Check text that overlaps images or video.',
    category: 'color-contrast', wcag: '1.4.3', wcagTitle: 'Contrast (Minimum)', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
    description: 'When text is placed on top of images or video, ensure sufficient contrast by using a scrim, solid background, or text shadow.',
    whyItMatters: 'Busy photo backgrounds can make overlaid text unreadable, especially for low-vision users.',
    badDemo: () => (
      <div className="relative rounded overflow-hidden" style={{ height: '70px' }}>
        <div style={{ background: 'linear-gradient(135deg,#94a3b8,#64748b)', width: '100%', height: '100%' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <p style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>Overlaid Text (no scrim)</p>
        </div>
      </div>
    ),
    goodDemo: () => (
      <div className="relative rounded overflow-hidden" style={{ height: '70px' }}>
        <div style={{ background: 'linear-gradient(135deg,#94a3b8,#64748b)', width: '100%', height: '100%' }} />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <p style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>Overlaid Text (dark scrim ✓)</p>
        </div>
      </div>
    ),
  },
  {
    id: 'selection-contrast',
    title: 'Check custom ::selection colors.',
    category: 'color-contrast', wcag: '1.4.3', wcagTitle: 'Contrast (Minimum)', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
    description: 'Custom text selection colors must still maintain sufficient contrast.',
    whyItMatters: 'Custom ::selection styles using light colors on light backgrounds make selected text invisible.',
    badDemo: () => (
      <div>
        <style dangerouslySetInnerHTML={{ __html: '.bad-sel::selection{background:rgba(255,255,255,0.3);color:#fff}' }} />
        <p className="bad-sel text-xs" style={{ background: '#1e293b', color: '#fff', padding: '8px', borderRadius: '4px' }}>
          Select this text — selection is invisible!
        </p>
      </div>
    ),
    goodDemo: () => (
      <div>
        <style dangerouslySetInnerHTML={{ __html: '.good-sel::selection{background:#1e40af;color:#fff}' }} />
        <p className="good-sel text-xs" style={{ background: '#f8fafc', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
          Select this text — clear blue highlight ✓
        </p>
      </div>
    ),
  },
  // ══ MOBILE AND TOUCH ══
  {
    id: 'orientation-rotation',
    title: 'Check that the site can be rotated to any orientation.',
    category: 'mobile-touch', wcag: '1.3.4', wcagTitle: 'Orientation', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/orientation.html',
    description: 'Make sure your site is not restricted to only landscape or portrait orientations.',
    whyItMatters: 'Some wheelchair users have their device mounted in a fixed orientation — locking orientation makes the site unusable for them.',
    badDemo: () => (
      <div className="space-y-2">
        <div className="border rounded p-3 text-center text-xs bg-zinc-50">
          <p className="font-medium">📱 Please rotate to landscape</p>
          <p className="text-zinc-500 mt-1">Page locked — portrait not supported</p>
        </div>
      </div>
    ),
    goodDemo: () => (
      <div className="border rounded p-3 text-xs bg-emerald-50">
        <p className="font-medium">✓ Content adapts to any orientation</p>
        <p className="text-zinc-600 mt-1">Works in both portrait and landscape</p>
      </div>
    ),
  },
  {
    id: 'no-horizontal-scroll',
    title: 'Remove horizontal scrolling.',
    category: 'mobile-touch', wcag: '1.4.10', wcagTitle: 'Reflow', level: 'AA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/reflow.html',
    description: 'Ensure content does not require horizontal scrolling.',
    whyItMatters: 'Horizontal scrolling on mobile is disorienting and prevents magnification users from reading content in a single flow.',
    badDemo: () => (
      <div className="overflow-x-auto border rounded" style={{ maxWidth: '200px' }}>
        <div style={{ width: '400px', background: '#f1f5f9', padding: '8px', fontSize: '11px', whiteSpace: 'nowrap' }}>
          This content is 400px wide → forces horizontal scroll on small screens
        </div>
      </div>
    ),
    goodDemo: () => (
      <div className="border rounded overflow-hidden" style={{ maxWidth: '200px' }}>
        <div style={{ maxWidth: '100%', background: '#f0fdf4', padding: '8px', fontSize: '11px', overflowWrap: 'break-word' }}>
          Content wraps within the container — no horizontal scroll ✓
        </div>
      </div>
    ),
  },
  {
    id: 'large-touch-targets',
    title: 'Ensure that button and link icons can be activated with ease.',
    category: 'mobile-touch', wcag: '2.5.5', wcagTitle: 'Target Size (Enhanced)', level: 'AAA',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html',
    description: "It's good to make sure things like hamburger menus, social icons, gallery viewers, and other touch controls are usable by a wide range of hand and stylus sizes.",
    whyItMatters: 'Small touch targets cause users with motor impairments or tremors to frequently activate the wrong element.',
    badDemo: () => (
      <div className="flex gap-1 items-center">
        {['🏠', '⭐', '📧'].map((ic, i) => (
          <button key={i} style={{ width: '18px', height: '18px', border: '1px solid #ccc', borderRadius: '2px', fontSize: '9px', padding: 0, cursor: 'pointer', lineHeight: 1 }}>
            {ic}
          </button>
        ))}
        <span className="text-xs text-red-600 ml-1">18×18px</span>
      </div>
    ),
    goodDemo: () => (
      <div className="flex gap-2 items-center">
        {['🏠', '⭐', '📧'].map((ic, i) => (
          <button key={i} className="flex items-center justify-center" style={{ minWidth: '44px', minHeight: '44px', border: '1px solid #d4d4d8', borderRadius: '6px', fontSize: '18px', cursor: 'pointer' }}>
            {ic}
          </button>
        ))}
        <span className="text-xs text-emerald-600 ml-1">44×44px ✓</span>
      </div>
    ),
  },
  {
    id: 'interactive-spacing',
    title: 'Ensure sufficient space between interactive items in order to provide a scroll area.',
    category: 'mobile-touch', wcag: '2.4.1', wcagTitle: 'Bypass Blocks', level: 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html',
    description: 'No space between buttons makes it harder for users with physical disabilities to scroll past without activating something.',
    whyItMatters: 'Dense interactive elements make it impossible for users with tremors to scroll past them on touch screens.',
    badDemo: () => (
      <div className="flex flex-col" style={{ gap: 0 }}>
        {['Option A', 'Option B', 'Option C', 'Option D'].map(item => (
          <button key={item} className="px-3 py-2 border border-zinc-300 text-xs text-left" style={{ borderBottom: 'none' }}>
            {item}
          </button>
        ))}
        <p className="text-xs text-red-600 mt-1">⚠ No gap — can't scroll without triggering</p>
      </div>
    ),
    goodDemo: () => (
      <div className="flex flex-col gap-3">
        {['Option A', 'Option B', 'Option C', 'Option D'].map(item => (
          <button key={item} className="px-3 py-2 border border-zinc-300 rounded text-xs text-left">
            {item}
          </button>
        ))}
        <p className="text-xs text-emerald-600">✓ Gaps = scroll dead zones</p>
      </div>
    ),
  },
];
