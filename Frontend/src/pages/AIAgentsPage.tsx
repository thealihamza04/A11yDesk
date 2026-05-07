import React, { useState, useCallback } from 'react';
import {
  Bot, Copy, Check, ExternalLink, Download, Terminal,
  Globe, FileCode, Cpu, BookOpen, ChevronDown, ChevronUp,
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return { copied, copy };
}

function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const { copied, copy } = useCopy(text);
  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded font-medium transition-all ${
        copied ? 'bg-emerald-900/40 text-emerald-300' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
      }`}
      aria-label={copied ? 'Copied!' : label}
    >
      {copied ? <Check className="h-3 w-3" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  return (
    <div className="rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
        <span className="text-xs text-zinc-500 font-mono">{language}</span>
        <CopyBtn text={code} />
      </div>
      <pre className="p-4 text-sm text-zinc-300 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionCard({ icon, badge, title, description, children }: {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      <div className="p-6 border-b border-zinc-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded">
                {badge}
              </span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
            <p className="text-sm text-zinc-500 mt-1">{description}</p>
          </div>
        </div>
      </div>
      {children && <div className="p-6 space-y-4">{children}</div>}
    </div>
  );
}

// ── Download File Card ────────────────────────────────────────────────────────

function DownloadFileCard({ name, filename, href, curl, description, icon }: {
  name: string;
  filename: string;
  href: string;
  curl: string;
  description: string;
  icon: string;
}) {
  const [showCurl, setShowCurl] = useState(false);
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-zinc-900">{name}</span>
            <code className="text-xs bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded font-mono">{filename}</code>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <a
          href={href}
          download={filename}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-zinc-900 text-white rounded font-medium hover:bg-zinc-700 transition-colors"
        >
          <Download className="h-3 w-3" aria-hidden="true" />
          Download {filename}
        </a>
        <button
          onClick={() => setShowCurl(v => !v)}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-zinc-300 text-zinc-600 rounded font-medium hover:bg-zinc-100 transition-colors"
          aria-expanded={showCurl}
        >
          <Terminal className="h-3 w-3" aria-hidden="true" />
          curl command
          {showCurl ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>
      {showCurl && (
        <div className="rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900">
            <span className="text-xs text-zinc-500 font-mono">bash</span>
            <CopyBtn text={curl} />
          </div>
          <pre className="p-3 text-xs text-zinc-300 font-mono overflow-x-auto">{curl}</pre>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AIAgentsPage() {
  const base = typeof window !== 'undefined' ? window.location.origin : '';

  const downloadFiles = [
    {
      name: 'Claude Code',
      filename: 'CLAUDE.md',
      href: '/downloads/CLAUDE.md',
      curl: `curl -o CLAUDE.md ${base}/downloads/CLAUDE.md`,
      description: 'Automatically read by Claude Code before every coding session.',
      icon: '🤖',
    },
    {
      name: 'Cursor',
      filename: '.cursorrules',
      href: '/downloads/.cursorrules',
      curl: `curl -o .cursorrules ${base}/downloads/.cursorrules`,
      description: 'Placed in your project root — Cursor reads it automatically.',
      icon: '✦',
    },
    {
      name: 'Windsurf / Cascade',
      filename: '.windsurfrules',
      href: '/downloads/.windsurfrules',
      curl: `curl -o .windsurfrules ${base}/downloads/.windsurfrules`,
      description: 'Same as .cursorrules — Windsurf reads .windsurfrules from project root.',
      icon: '🌊',
    },
    {
      name: 'GitHub Copilot',
      filename: 'copilot-instructions.md',
      href: '/downloads/copilot-instructions.md',
      curl: `mkdir -p .github && curl -o .github/copilot-instructions.md ${base}/downloads/copilot-instructions.md`,
      description: 'Place at .github/copilot-instructions.md — Copilot reads it automatically.',
      icon: '🐙',
    },
  ];

  const mcpInstall = `# Install globally
npm install -g @thealihamza04/a11y-mcp-server

# Or use npx directly (recommended for seamless setup)
# Add to Claude Code config (~/.claude/claude_desktop_config.json)
{
  "mcpServers": {
    "a11y": {
      "command": "npx",
      "args": [
        "-y",
        "@thealihamza04/a11y-mcp-server"
      ]
    }
  }
}

# Add to Cursor config (~/.cursor/mcp.json)
{
  "mcpServers": {
    "a11y": {
      "command": "npx",
      "args": [
        "-y",
        "@thealihamza04/a11y-mcp-server"
      ]
    }
  }
}`;

  return (
    <main id="main" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4 py-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 ring-1 ring-zinc-800 mb-2">
          <Bot className="h-7 w-7 text-emerald-400" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900">AI Agent Integration</h1>
        <p className="text-base text-zinc-500 max-w-xl mx-auto">
          Four ready-to-ship files that make your A11Y checklist usable by every AI coding agent — automatically, before they write a single line of code.
        </p>
        <div className="flex flex-wrap gap-2 justify-center pt-1">
          {['Claude Code', 'Cursor', 'Windsurf', 'GitHub Copilot', 'Gemini'].map(tool => (
            <span key={tool} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-medium">
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Deliverable 1: llms.txt */}
      <SectionCard
        icon={<Globe className="h-5 w-5 text-blue-400" aria-hidden="true" />}
        badge="Deliverable 1"
        title="/llms.txt"
        description="A plain-text rules file served from your site root. AI crawlers read this the same way browsers read robots.txt."
      >
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            View /llms.txt
            <span className="sr-only">(opens in new tab)</span>
          </a>
          <CopyBtn text={`${base}/llms.txt`} label="Copy URL" />
        </div>
        <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-xs font-mono text-zinc-600 space-y-1 max-h-48 overflow-y-auto">
          <p className="text-zinc-400"># A11Y Project Checklist — WCAG 2.2 Rules for AI Agents</p>
          <p className="text-zinc-400"># Version: 1.0.0 | Standard: WCAG 2.2</p>
          <p className="mt-2 text-zinc-700">&gt; When generating HTML, JSX, or any web component, you MUST</p>
          <p className="text-zinc-700">&gt; follow every Level A rule. Level AA rules required for production.</p>
          <p className="mt-2 text-zinc-500">## CONTENT</p>
          <p>- [A] 1.3.1 | descriptive-link-text | Never use "click here"...</p>
          <p>- [AAA] 3.1.5 | use-plain-language | Write at 8th grade level...</p>
          <p className="text-zinc-400">... and 62 more rules</p>
        </div>
      </SectionCard>

      {/* Deliverable 2: /api/checklist.json */}
      <SectionCard
        icon={<FileCode className="h-5 w-5 text-amber-400" aria-hidden="true" />}
        badge="Deliverable 2"
        title="/api/checklist.json"
        description="All 64 WCAG 2.2 rules in structured JSON format — queryable by AI agents, tools, and scripts."
      >
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="/api/checklist.json"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            View /api/checklist.json
            <span className="sr-only">(opens in new tab)</span>
          </a>
          <CopyBtn text={`${base}/api/checklist.json`} label="Copy URL" />
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Schema — each item contains:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['id','title','category','wcag','wcagTitle','wcagUrl','level','obsolete','description','whyItMatters','bad','good'].map(f => (
              <code key={f} className="text-xs bg-zinc-100 text-zinc-700 px-2 py-1 rounded font-mono">{f}</code>
            ))}
          </div>
        </div>
        <CodeBlock language="json" code={`{
  "meta": {
    "version": "1.0.0",
    "standard": "WCAG 2.2",
    "totalItems": 64,
    "byLevel": { "A": 40, "AA": 19, "AAA": 4, "Technique": 1 }
  },
  "items": [
    {
      "id": "img-has-alt",
      "title": "All img elements must have an alt attribute",
      "category": "images",
      "wcag": "1.1.1",
      "level": "A",
      "bad": "<img src=\\"cat.jpg\\">",
      "good": "<img src=\\"cat.jpg\\" alt=\\"A ginger tabby cat\\">"
    },
    ...63 more items
  ]
}`} />
      </SectionCard>

      {/* Deliverable 3: Dev Files */}
      <SectionCard
        icon={<BookOpen className="h-5 w-5 text-purple-400" aria-hidden="true" />}
        badge="Deliverable 3"
        title="Downloadable Dev Files"
        description="Drop into any project root. Each AI agent reads its own file automatically before writing code."
      >
        <div className="space-y-3">
          {downloadFiles.map(f => (
            <DownloadFileCard key={f.filename} {...f} />
          ))}
        </div>
      </SectionCard>

      {/* Deliverable 4: MCP Server */}
      <SectionCard
        icon={<Cpu className="h-5 w-5 text-emerald-400" aria-hidden="true" />}
        badge="Deliverable 4"
        title="MCP Server"
        description={
          <>
            A Node.js server exposing your checklist as queryable tools. Published on npm as{' '}
            <a
              href="https://www.npmjs.com/package/@thealihamza04/a11y-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline text-emerald-600 hover:text-emerald-700 hover:opacity-90 inline-flex items-center gap-0.5"
            >
              @thealihamza04/a11y-mcp-server
              <ExternalLink className="h-3 w-3 inline" />
            </a>
            .
          </>
        }
      >
        <div className="space-y-3">
          <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4">
            <p className="text-sm font-semibold text-zinc-900 mb-2">Available MCP Tools:</p>
            <ul className="space-y-1.5">
              {[
                ['get_rule', 'Get a specific rule by ID or WCAG criterion (e.g. "img-has-alt", "1.1.1")'],
                ['get_category_rules', 'Get all rules for a category (images, forms, keyboard, etc.)'],
                ['get_rules_by_level', 'Get all rules for A, AA, or AAA compliance level'],
                ['check_component', 'Check HTML/JSX snippet against all A11Y rules and return violations'],
                ['get_all_rules', 'Fetch all 64 WCAG 2.2 accessibility rules at once'],
              ].map(([name, desc]) => (
                <li key={name} className="flex gap-2 text-xs">
                  <code className="shrink-0 bg-zinc-800 text-emerald-300 px-1.5 py-0.5 rounded font-mono">{name}</code>
                  <span className="text-zinc-600">{desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <CodeBlock language="bash" code={mcpInstall} />
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Once installed, ask your AI agent:</p>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>"Check this form component for accessibility issues"</li>
              <li>"What are all the Level A image rules?"</li>
              <li>"How do I fix WCAG 1.4.3?"</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Footer */}
      <footer className="pt-4 border-t border-zinc-200 text-center text-xs text-zinc-400 space-y-1">
        <p>
          Checklist content adapted from{' '}
          <a href="https://www.a11yproject.com/checklist/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600">
            The A11Y Project
            <span className="sr-only">(opens in new tab)</span>
          </a>
          {' '}(APLv2). WCAG levels resolved against{' '}
          <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600">
            W3C WCAG 2.2
            <span className="sr-only">(opens in new tab)</span>
          </a>.
        </p>
      </footer>
    </main>
  );
}
