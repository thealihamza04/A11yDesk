#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ── Load data ────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
let CHECKLIST = [];
try {
  const dataPath = join(__dirname, 'data', 'checklist.json');
  const fileContent = readFileSync(dataPath, 'utf-8');
  const parsed = JSON.parse(fileContent);
  CHECKLIST = parsed.items || [];
} catch (error) {
  console.error('Failed to load checklist database:', error);
  process.exit(1);
}

// ── Server setup ─────────────────────────────────────────────────────────────
const server = new Server(
  { name: 'a11y-checklist', version: '1.0.2' },
  { capabilities: { tools: {} } }
);

const VALID_LEVELS = ['A', 'AA', 'AAA', 'Technique'];
const VALID_MODES = ['auto', 'snippet', 'document', 'component'];
const VALID_CATEGORIES = [...new Set(CHECKLIST.map((rule) => rule.category))].sort();

const toText = (data) => JSON.stringify(data, null, 2);

const respond = (summary, data, isError = false) => ({
  content: [
    { type: 'text', text: summary },
    { type: 'text', text: toText(data) }
  ],
  structuredContent: data,
  isError
});

const respondError = (summary, data) => respond(summary, data, true);

const stripJsxComments = (value) => value.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

const stripTags = (value) =>
  stripJsxComments(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getLineNumber = (source, index) => source.slice(0, index).split('\n').length;

const getLinePreview = (source, index) => {
  const line = source.split('\n')[getLineNumber(source, index) - 1] || '';
  return line.trim().slice(0, 160);
};

const inferAuditContext = (code, filename = '', mode = 'auto') => {
  const normalizedFilename = filename.toLowerCase();
  const explicitDocument = mode === 'document';
  const explicitComponent = mode === 'component';
  const hasHtmlTag = /<html\b/i.test(code);
  const hasBodyTag = /<body\b/i.test(code);
  const looksLikeJsx =
    /\bclassName\s*=/.test(code) ||
    /\bon[A-Z][a-zA-Z]+\s*=/.test(code) ||
    /\{[^}]+\}/.test(code);
  const componentFile = /\.(jsx|tsx|vue|svelte|astro)$/.test(normalizedFilename);
  const documentFile = /\.(html?)$/.test(normalizedFilename);
  const isDocument = explicitDocument || hasHtmlTag || hasBodyTag || (documentFile && !explicitComponent);
  const isComponent = explicitComponent || componentFile || (looksLikeJsx && !isDocument);

  return {
    filename,
    mode,
    hasHtmlTag,
    hasBodyTag,
    isDocument,
    isComponent,
    looksLikeJsx
  };
};

const findWrappingLabelRanges = (code) => {
  const ranges = [];
  const regex = /<label\b[^>]*>[\s\S]*?<\/label>/gi;
  for (const match of code.matchAll(regex)) {
    const start = match.index ?? 0;
    ranges.push([start, start + match[0].length]);
  }
  return ranges;
};

const isInsideRanges = (index, ranges) => ranges.some(([start, end]) => index >= start && index < end);

const buildFinding = (code, ruleId, matchIndex, evidence, confidence = 'medium') => ({
  id: ruleId,
  matchIndex,
  line: getLineNumber(code, matchIndex),
  evidence: evidence || getLinePreview(code, matchIndex),
  confidence
});

const buildHeuristicFinding = (
  code,
  finding,
  matchIndex,
  evidence,
  confidence = 'medium'
) => ({
  ...finding,
  kind: 'heuristic',
  matchIndex,
  line: getLineNumber(code, matchIndex),
  evidence: evidence || getLinePreview(code, matchIndex),
  confidence
});

const EMPTY_BUTTON_FINDING = {
  id: 'button-accessible-name',
  title: 'Give every button an accessible name',
  category: 'controls',
  wcag: '4.1.2',
  wcagTitle: 'Name, Role, Value',
  wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
  level: 'A',
  description: 'Buttons need visible text or an accessible name via aria-label or aria-labelledby.',
  whyItMatters: 'Screen reader and voice-control users need a stable name to understand and activate a button.',
  good: '<button type="button" aria-label="Save"><SaveIcon aria-hidden="true" /></button>',
  bad: '<button></button>'
};

// ── Tool definitions ─────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_rule',
      description: 'Get a specific WCAG 2.2 accessibility rule by its ID (e.g., "img-has-alt") or WCAG success criterion number (e.g., "1.1.1").',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Rule ID like "img-has-alt" or WCAG success criterion like "1.1.1" or "1.4.3".'
          }
        },
        required: ['query']
      }
    },
    {
      name: 'get_category_rules',
      description: 'Get all accessibility rules for a given category (e.g., "forms", "images", "keyboard").',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Category name. Valid options: content, global-code, keyboard, images, headings, lists, controls, tables, forms, media, video, audio, appearance, animation, color-contrast, mobile-touch.'
          }
        },
        required: ['category']
      }
    },
    {
      name: 'get_rules_by_level',
      description: 'Get all WCAG 2.2 rules for a specific compliance level.',
      inputSchema: {
        type: 'object',
        properties: {
          level: {
            type: 'string',
            enum: ['A', 'AA', 'AAA', 'Technique'],
            description: 'WCAG compliance level: A (minimum/required), AA (industry standard/recommended), AAA (extended guidelines), or Technique.'
          }
        },
        required: ['level']
      }
    },
    {
      name: 'check_code',
      description: 'Run pattern-based static analysis on an HTML or JSX code snippet to check for common accessibility violations. Covers 24 patterns across images, forms, keyboard, controls, headings, tables, media, and animation.',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The HTML or JSX code snippet to audit.'
          },
          filename: {
            type: 'string',
            description: 'Optional source filename to improve rule context (e.g., "Header.tsx", "index.html").'
          },
          mode: {
            type: 'string',
            enum: ['auto', 'snippet', 'document', 'component'],
            description: 'Optional audit mode. Use "document" for full pages, "component" for JSX/UI snippets, or leave "auto" to infer from the code.'
          }
        },
        required: ['code']
      }
    },
    {
      name: 'get_all_rules',
      description: 'Retrieve the complete database of all 64 WCAG 2.2 accessibility rules.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    }
  ]
}));

// ── Tool handlers ─────────────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  // get_rule
  if (name === 'get_rule') {
    const q = (args.query || '').trim();
    if (!q) {
      return respondError(
        'Rule lookup failed: provide a rule ID or WCAG criterion.',
        {
          error: 'The "query" argument is required.',
          exampleQueries: ['img-has-alt', '1.1.1']
        }
      );
    }
    const match = CHECKLIST.find(
      r => r.id.toLowerCase() === q.toLowerCase() || r.wcag === q
    );
    return match
      ? respond(`Found rule "${match.id}".`, match)
      : respondError(
          `No rule matched "${q}".`,
          {
            error: `No rule found matching "${q}". Try checking rule IDs or WCAG criteria.`,
            exampleQueries: ['img-has-alt', '1.1.1']
          }
        );
  }

  // get_category_rules
  if (name === 'get_category_rules') {
    const cat = (args.category || '').trim().toLowerCase();
    if (!cat) {
      return respondError(
        'Category lookup failed: provide a category name.',
        {
          error: 'The "category" argument is required.',
          validCategories: VALID_CATEGORIES
        }
      );
    }
    const matches = CHECKLIST.filter(r => r.category === cat);
    return matches.length > 0
      ? respond(`Found ${matches.length} rules in category "${cat}".`, {
          category: cat,
          count: matches.length,
          rules: matches
        })
      : respondError(
          `No rules matched category "${cat}".`,
          {
            error: `No rules found for category "${cat}".`,
            validCategories: VALID_CATEGORIES
          }
        );
  }

  // get_rules_by_level
  if (name === 'get_rules_by_level') {
    const lvl = (args.level || '').trim();
    if (!VALID_LEVELS.includes(lvl)) {
      return respondError(
        `Invalid level "${lvl || '(empty)'}".`,
        {
          error: 'The "level" argument must be one of the supported WCAG levels.',
          validLevels: VALID_LEVELS
        }
      );
    }
    const matches = CHECKLIST.filter(r => r.level === lvl);
    return respond(`Found ${matches.length} rules at level "${lvl}".`, {
      level: lvl,
      count: matches.length,
      rules: matches
    });
  }

  // get_all_rules
  if (name === 'get_all_rules') {
    return respond(`Returned all ${CHECKLIST.length} accessibility rules.`, {
      total: CHECKLIST.length,
      rules: CHECKLIST
    });
  }

  // check_code
  if (name === 'check_code') {
    const code = args.code || '';
    const filename = args.filename || '';
    const mode = args.mode || 'auto';
    if (!code.trim()) {
      return respondError(
        'Audit failed: provide HTML or JSX code to inspect.',
        {
          error: 'The "code" argument is required.',
          validModes: VALID_MODES
        }
      );
    }
    if (!VALID_MODES.includes(mode)) {
      return respondError(
        `Audit failed: unsupported mode "${mode}".`,
        {
          error: 'The "mode" argument must be one of the supported audit modes.',
          validModes: VALID_MODES
        }
      );
    }
    const ctx = inferAuditContext(code, filename, mode);
    const labelRanges = findWrappingLabelRanges(code);
    const findings = [];

    for (const match of code.matchAll(/<img\b[^>]*>/gi)) {
      if (!/\balt\s*=/.test(match[0])) {
        findings.push(buildFinding(code, 'img-has-alt', match.index ?? 0, match[0], 'high'));
      }
    }

    for (const match of code.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
      const tag = match[0];
      const index = match.index ?? 0;
      const typeMatch = tag.match(/\btype\s*=\s*["']?([a-z-]+)["']?/i);
      const type = typeMatch?.[1]?.toLowerCase() || 'text';
      if (type === 'hidden' || tag.startsWith('</')) continue;

      const hasProgrammaticName =
        /\b(aria-label|aria-labelledby)\s*=/.test(tag) ||
        /\bid\s*=/.test(tag);

      if (!hasProgrammaticName && !isInsideRanges(index, labelRanges)) {
        findings.push(buildFinding(code, 'inputs-have-labels', index, tag, 'medium'));
      }

      if (/^(email|tel|name|given-name|family-name)$/.test(type) &&
          !/\b(autoComplete|autocomplete)\b\s*=/.test(tag)) {
        findings.push(buildFinding(code, 'inputs-autocomplete', index, tag, 'medium'));
      }
    }

    const groupedChoiceInputs = [...code.matchAll(/<input\b[^>]*type=["'](radio|checkbox)["'][^>]*>/gi)];
    if (groupedChoiceInputs.length > 1 && !/<fieldset\b/i.test(code)) {
      findings.push(buildFinding(code, 'fieldset-legend', groupedChoiceInputs[0].index ?? 0, groupedChoiceInputs[0][0], 'medium'));
    }

    for (const match of code.matchAll(/(?:outline\s*:\s*none|outline\s*:\s*0\b)/gi)) {
      findings.push(buildFinding(code, 'visible-focus-style', match.index ?? 0, getLinePreview(code, match.index ?? 0), 'high'));
    }

    for (const match of code.matchAll(/(?:tabindex=["'][1-9][0-9]*|tabIndex=\{[1-9][0-9]*\})/g)) {
      findings.push(buildFinding(code, 'linear-content-flow', match.index ?? 0, getLinePreview(code, match.index ?? 0), 'high'));
    }

    for (const match of code.matchAll(/\b(?:autofocus|autoFocus)\b/g)) {
      findings.push(buildFinding(code, 'no-autofocus', match.index ?? 0, getLinePreview(code, match.index ?? 0), 'high'));
    }

    for (const match of code.matchAll(/(?:user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?!\d))/gi)) {
      findings.push(buildFinding(code, 'viewport-zoom-enabled', match.index ?? 0, getLinePreview(code, match.index ?? 0), 'high'));
    }

    if (ctx.hasHtmlTag) {
      for (const match of code.matchAll(/<html\b[^>]*>/gi)) {
        if (!/\blang\s*=/.test(match[0])) {
          findings.push(buildFinding(code, 'lang-attribute', match.index ?? 0, match[0], 'high'));
        }
      }
    }

    for (const match of code.matchAll(/<(div|span)\b[^>]*\b(onclick|onClick)\b[^>]*>/gi)) {
      const tag = match[0];
      const hasButtonRole = /\brole\s*=\s*["']button["']/i.test(tag);
      const hasKeyboardSupport = /\b(onKeyDown|onKeyUp|onKeyPress)\b/.test(tag);
      const hasTabStop = /\b(tabIndex|tabindex)\s*=/.test(tag);
      if (!hasButtonRole || !hasKeyboardSupport || !hasTabStop) {
        findings.push(buildFinding(code, 'button-element-for-buttons', match.index ?? 0, tag, hasButtonRole ? 'medium' : 'high'));
      }
    }

    for (const match of code.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
      const tag = match[0];
      const innerText = stripTags(match[1] || '');
      const hasAccessibleName = /\b(aria-label|aria-labelledby)\s*=/.test(tag) || innerText.length > 0;
      if (!hasAccessibleName) {
        findings.push(buildHeuristicFinding(
          code,
          EMPTY_BUTTON_FINDING,
          match.index ?? 0,
          getLinePreview(code, match.index ?? 0),
          'high'
        ));
      }
    }

    for (const match of code.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
      const tag = match[0];
      const innerText = stripTags(match[1] || '');
      if (/\b(click here|read more|learn more)\b/i.test(innerText) || innerText.length === 0) {
        findings.push(buildFinding(code, 'descriptive-link-text', match.index ?? 0, getLinePreview(code, match.index ?? 0), 'medium'));
      }
      if (/\btarget=["']_blank["']/i.test(tag) &&
          !/opens[- ]in[- ](a[- ])?new[- ](tab|window)/i.test(tag) &&
          !/\b(aria-label|aria-labelledby)\s*=/.test(tag) &&
          !/sr-only|visually-hidden/i.test(tag)) {
        findings.push(buildFinding(code, 'new-tab-warning', match.index ?? 0, getLinePreview(code, match.index ?? 0), 'medium'));
      }
    }

    for (const match of code.matchAll(/\btitle\s*=\s*["'][^"']+["']/gi)) {
      const line = getLinePreview(code, match.index ?? 0);
      if (!/<(input|img|button|iframe)\b/i.test(line)) {
        findings.push(buildFinding(code, 'no-title-tooltips', match.index ?? 0, line, 'low'));
      }
    }

    for (const match of code.matchAll(/<(audio|video)\b[^>]*\bautoplay\b[^>]*>/gi)) {
      findings.push(buildFinding(code, 'no-autoplay', match.index ?? 0, match[0], 'high'));
    }

    for (const match of code.matchAll(/<(audio|video)\b(?![^>]*\bcontrols\b)[^>]*>/gi)) {
      findings.push(buildFinding(code, 'no-autoplay', match.index ?? 0, match[0], 'medium'));
    }

    if (/<video\b/i.test(code) && !/<track\b/i.test(code)) {
      const match = code.match(/<video\b[^>]*>/i);
      findings.push(buildFinding(code, 'captions-present', match?.index ?? 0, match?.[0], 'medium'));
    }

    const headingMatches = [...code.matchAll(/<h([1-6])[\s>]/gi)];
    if (ctx.isDocument) {
      const h1Matches = headingMatches.filter((match) => match[1] === '1');
      if (h1Matches.length > 1) {
        findings.push(buildFinding(code, 'single-h1', h1Matches[1].index ?? 0, getLinePreview(code, h1Matches[1].index ?? 0), 'medium'));
      }

      const levels = headingMatches.map((match) => ({
        level: Number.parseInt(match[1], 10),
        index: match.index ?? 0
      }));
      for (let i = 1; i < levels.length; i += 1) {
        if (levels[i].level - levels[i - 1].level > 1) {
          findings.push(buildFinding(code, 'no-skipped-headings', levels[i].index, getLinePreview(code, levels[i].index), 'medium'));
          break;
        }
      }
    }

    if (/<table\b/i.test(code) && !/<caption\b/i.test(code)) {
      const match = code.match(/<table\b[^>]*>/i);
      findings.push(buildFinding(code, 'table-caption', match?.index ?? 0, match?.[0], 'medium'));
    }

    for (const match of code.matchAll(/<th(?![^>]*\bscope\s*=)[^>]*>/gi)) {
      findings.push(buildFinding(code, 'th-with-scope', match.index ?? 0, match[0], 'medium'));
    }

    if (/animation\s*:/i.test(code) && !/prefers-reduced-motion/i.test(code)) {
      const match = code.match(/animation\s*:/i);
      findings.push(buildFinding(code, 'prefers-reduced-motion', match?.index ?? 0, getLinePreview(code, match?.index ?? 0), 'medium'));
    }

    const groupedFindings = [...findings.reduce((acc, finding) => {
      const existing = acc.get(finding.id) || [];
      existing.push(finding);
      acc.set(finding.id, existing);
      return acc;
    }, new Map()).entries()];

    const violations = groupedFindings
      .map(([ruleId, matches]) => {
        const rule = CHECKLIST.find(r => r.id === ruleId);
        const firstFinding = matches[0];
        const metadata = rule || firstFinding;
        return {
          id: metadata.id,
          title: metadata.title,
          category: metadata.category || rule?.category || null,
          wcag: metadata.wcag || null,
          wcagTitle: metadata.wcagTitle || null,
          wcagUrl: metadata.wcagUrl || null,
          level: metadata.level || null,
          kind: metadata.kind || 'checklist-rule',
          description: metadata.description || null,
          whyItMatters: metadata.whyItMatters || null,
          good: metadata.good || null,
          bad: metadata.bad || null,
          line: firstFinding.line,
          evidence: firstFinding.evidence,
          confidence: firstFinding.confidence,
          occurrenceCount: matches.length,
          occurrences: matches.map((match) => ({
            line: match.line,
            evidence: match.evidence,
            confidence: match.confidence
          }))
        };
      });

    const result = {
      status: violations.length === 0 ? 'pass' : 'fail',
      violationCount: violations.length,
      summary: {
        passed: violations.length === 0,
        totalDistinctViolations: violations.length,
        totalOccurrences: findings.length
      },
      violations,
      auditContext: {
        mode: ctx.mode,
        filename: ctx.filename || null,
        inferredDocument: ctx.isDocument,
        inferredComponent: ctx.isComponent
      },
      note: 'This tool performs lightweight static analysis only. It is now context-aware for snippet vs document usage, but it still cannot validate runtime issues such as contrast ratios, focus trapping, announcement timing, or live keyboard behavior. Pair it with axe-core, Lighthouse, and manual screen reader testing.'
    };

    return respond(
      violations.length === 0
        ? 'Accessibility audit passed with no detected violations.'
        : `Accessibility audit found ${violations.length} distinct violations across ${findings.length} occurrence(s).`,
      result
    );
  }

  return respondError(`Unknown tool "${name}".`, { error: `Unknown tool: ${name}` });
});

// ── Connect and start ─────────────────────────────────────────────────────────
try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
} catch (error) {
  console.error('Failed to connect standard input/output transport:', error);
  process.exit(1);
}
