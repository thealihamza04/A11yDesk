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
  { name: 'a11y-checklist', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

const respond = (data) => ({
  content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
});

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
      description: 'Run basic, pattern-based static analysis on an HTML or JSX code snippet to check for common accessibility violations.',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The HTML or JSX code snippet to audit.'
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
    const match = CHECKLIST.find(
      r => r.id.toLowerCase() === q.toLowerCase() || r.wcag === q
    );
    return respond(
      match ?? { error: `No rule found matching "${q}". Try checking rule IDs or WCAG criteria (e.g., "img-has-alt" or "1.1.1").` }
    );
  }

  // get_category_rules
  if (name === 'get_category_rules') {
    const cat = (args.category || '').trim().toLowerCase();
    const matches = CHECKLIST.filter(r => r.category === cat);
    return respond(
      matches.length > 0
        ? { category: cat, count: matches.length, rules: matches }
        : {
            error: `No rules found for category "${cat}".`,
            validCategories: [
              'content', 'global-code', 'keyboard', 'images', 'headings',
              'lists', 'controls', 'tables', 'forms', 'media', 'video',
              'audio', 'appearance', 'animation', 'color-contrast', 'mobile-touch'
            ]
          }
    );
  }

  // get_rules_by_level
  if (name === 'get_rules_by_level') {
    const lvl = (args.level || '').trim();
    const matches = CHECKLIST.filter(r => r.level === lvl);
    return respond({
      level: lvl,
      count: matches.length,
      rules: matches
    });
  }

  // get_all_rules
  if (name === 'get_all_rules') {
    return respond({
      total: CHECKLIST.length,
      rules: CHECKLIST
    });
  }

  // check_code
  if (name === 'check_code') {
    const code = args.code || '';
    const patterns = [
      {
        test: () => /<img(?![^>]*\balt\s*=)/i.test(code),
        id: 'img-has-alt'
      },
      {
        test: () => /<input(?![^>]*\b(id|aria-label|aria-labelledby)\s*=)/i.test(code),
        id: 'inputs-have-labels'
      },
      {
        test: () => /outline\s*:\s*none/i.test(code) || /outline\s*:\s*0\b/i.test(code),
        id: 'visible-focus-style'
      },
      {
        test: () => /user-scalable\s*=\s*no/i.test(code) || /maximum-scale=1/i.test(code),
        id: 'viewport-zoom-enabled'
      },
      {
        test: () => /<div[^>]*\b(onclick|onClick)\b/i.test(code) && !/<div[^>]*\b(role=["']button["'])/i.test(code),
        id: 'button-element-for-buttons'
      },
      {
        test: () => /<span[^>]*\b(onclick|onClick)\b/i.test(code) && !/<span[^>]*\b(role=["']button["'])/i.test(code),
        id: 'button-element-for-buttons'
      },
      {
        test: () => /<audio[^>]*\bautoplay\b/i.test(code) || /<video[^>]*\bautoplay\b/i.test(code),
        id: 'no-autoplay'
      },
      {
        test: () => /<html(?![^>]*\blang\s*=)/i.test(code),
        id: 'lang-attribute'
      },
      {
        test: () => /\b(click here|read more|learn more)\b/i.test(code),
        id: 'descriptive-link-text'
      },
      {
        test: () => /title\s*=\s*["'][^"']+["']/i.test(code) && !/<(input|img|button)/i.test(code),
        id: 'no-title-tooltips'
      }
    ];

    const violations = patterns
      .filter(p => p.test())
      .map(p => {
        const rule = CHECKLIST.find(r => r.id === p.id);
        return rule
          ? {
              id: rule.id,
              title: rule.title,
              wcag: rule.wcag,
              level: rule.level,
              description: rule.description,
              whyItMatters: rule.whyItMatters,
              good: rule.good,
              bad: rule.bad
            }
          : { id: p.id };
      })
      // deduplicate by id
      .filter((v, idx, arr) => arr.findIndex(x => x.id === v.id) === idx);

    return respond({
      status: violations.length === 0 ? 'pass' : 'fail',
      violationCount: violations.length,
      violations: violations,
      note: 'This tool performs pattern-based static analysis only and cannot catch complex runtime dynamic issues (e.g., contrast ratios or focus trapping). Always test with real screen readers, keyboard traversal, and automated tools like axe-core or Lighthouse.'
    });
  }

  return respond({ error: `Unknown tool: ${name}` });
});

// ── Connect and start ─────────────────────────────────────────────────────────
try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
} catch (error) {
  console.error('Failed to connect standard input/output transport:', error);
  process.exit(1);
}
