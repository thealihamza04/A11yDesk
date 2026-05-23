#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TARGET_FILES = [
  '../Frontend/src/App.tsx',
  '../Frontend/src/pages/AIAgentsPage.tsx',
  '../Frontend/src/components/ChecklistItemCard.tsx',
  '../Frontend/src/components/DemoPanel.tsx',
  '../Frontend/src/components/Sidebar.tsx',
  '../Frontend/src/components/WCAGBadge.tsx'
];

async function callMcpTool(toolName, args) {
  return new Promise((resolve, reject) => {
    const serverPath = join(__dirname, 'index.mjs');
    const child = spawn('node', [serverPath], { stdio: ['pipe', 'pipe', 'inherit'] });

    let stdoutData = '';

    child.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        reject(new Error(`MCP Server exited with code ${code}`));
        return;
      }
      try {
        const response = JSON.parse(stdoutData.trim());
        if (response.error) {
          reject(new Error(response.error.message || 'JSON-RPC Error'));
        } else {
          resolve(response.result);
        }
      } catch (err) {
        reject(new Error(`Failed to parse MCP response: ${err.message}. Raw output: ${stdoutData}`));
      }
    });

    // Write standard JSON-RPC 2.0 Request for tool calling
    const request = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      },
      id: 1
    };

    child.stdin.write(JSON.stringify(request) + '\n');
    child.stdin.end();
  });
}

async function run() {
  console.log('\n\x1b[1m\x1b[36m==================================================\x1b[0m');
  console.log('\x1b[1m\x1b[36m   A11Y MCP Server - Local Code Accessibility Audit\x1b[0m');
  console.log('\x1b[1m\x1b[36m==================================================\x1b[0m\n');

  let totalViolations = 0;
  let totalFilesScanned = 0;

  for (const relativePath of TARGET_FILES) {
    const absolutePath = join(__dirname, relativePath);
    if (!existsSync(absolutePath)) {
      console.log(`\x1b[33m⚠️  Skipping: ${relativePath} (File not found)\x1b[0m`);
      continue;
    }

    totalFilesScanned++;
    const code = readFileSync(absolutePath, 'utf-8');
    const filename = relativePath.split('/').pop();

    console.log(`\x1b[1m🔍 Auditing ${filename}...\x1b[0m`);

    try {
      const response = await callMcpTool('check_code', {
        code,
        filename,
        mode: 'component'
      });

      // Response contents are structured as: { content: [...], structuredContent: { status, violations, ... } }
      const auditResult = response.structuredContent;
      if (!auditResult) {
        console.log('  \x1b[31m❌ Failed to parse audit result format\x1b[0m\n');
        continue;
      }

      if (auditResult.status === 'pass' || auditResult.violations.length === 0) {
        console.log('  \x1b[32m✅ PASSED: No accessibility violations found!\x1b[0m\n');
      } else {
        console.log(`  \x1b[31m❌ FAILED: Found ${auditResult.violationCount} distinct violation(s)\x1b[0m`);
        
        auditResult.violations.forEach((v) => {
          totalViolations += v.occurrenceCount;
          console.log(`\n  \x1b[1m\x1b[33m• Violation: ${v.title} [WCAG ${v.wcag} - Level ${v.level}]\x1b[0m`);
          console.log(`    Category:   ${v.category}`);
          console.log(`    Definition: ${v.description}`);
          console.log(`    Why it matters: ${v.whyItMatters}`);
          
          v.occurrences.forEach((occ) => {
            console.log(`    \x1b[36mLine ${occ.line}:\x1b[0m \x1b[90m${occ.evidence.trim()}\x1b[0m`);
          });
          
          if (v.good) {
            console.log(`    \x1b[32mRecommended pattern:\x1b[0m`);
            console.log(`      \x1b[32m${v.good.trim()}\x1b[0m`);
          }
        });
        console.log('\n--------------------------------------------------\n');
      }
    } catch (err) {
      console.log(`  \x1b[31m❌ Error running audit: ${err.message}\x1b[0m\n`);
    }
  }

  console.log('\x1b[1m\x1b[36m==================================================\x1b[0m');
  console.log(`\x1b[1mScan Complete: ${totalFilesScanned} files evaluated.\x1b[0m`);
  if (totalViolations === 0) {
    console.log('\x1b[1m\x1b[32m🎉 EXCELLENT! 0 accessibility issues detected.\x1b[0m');
  } else {
    console.log(`\x1b[1m\x1b[31m🚨 WARNING: Detected ${totalViolations} total accessibility violations!\x1b[0m`);
    console.log('\x1b[33mReview the highlighted violations and implement correct WAI-ARIA and WCAG structures.\x1b[0m');
  }
  console.log('\x1b[1m\x1b[36m==================================================\x1b[0m\n');
}

run();
