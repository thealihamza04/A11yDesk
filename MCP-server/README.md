# A11Y Project MCP Server (`a11y-mcp-server`)

An elegant, production-grade Model Context Protocol (MCP) server that exposes all **64 accessibility rules** from the A11Y Project WCAG 2.2 checklist as queryable tools for AI coding assistants.

Integrating this server into your developer workflow empowers coding agents (like Claude Code, Cursor, and Windsurf) to proactively fetch accessibility requirements, verify compliant HTML/JSX code blocks, and diagnose common accessibility failures on demand.

---

## 🌟 Features

- **Full WCAG 2.2 Coverage**: Seamlessly query 64 rules spanning all 16 category sections defined by the A11Y Project checklist.
- **Detailed Rule Metadata**: Each rule exposes standard WCAG success criteria (e.g., `1.1.1`, `1.4.3`), compliance level (`A`, `AA`, `AAA`, or `Technique`), complete standard description, professional "Why It Matters" rationale, and exact accessible/inaccessible code patterns.
- **Pattern-Based Auditing**: Use static analysis patterns to audit code snippets for missing attributes, bad practices, or non-semantic layouts, and get immediate compliance results.
- **Seamless Local Setup**: Connects via a standard stdio transport, easily integrated with all popular AI developer tools.

---

## 🛠️ Installation

First, install the MCP server globally on your local machine using npm:

```bash
npm install -g @thealihamza04/a11y-mcp-server
```

This installs the `a11y-mcp` executable used in the config examples below.

If your editor supports `npx`, you can also run the server without a global install:

```bash
npx -y @thealihamza04/a11y-mcp-server
```

---

## ⚙️ Configuration & Integration

Add the server under the identifier `a11y` or `a11y-checklist` to the standard configuration file of your preferred AI editor.

### 1. Claude Desktop / Claude Code

Add the server to your Claude desktop config file (usually located at `~/.claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "a11y-checklist": {
      "command": "a11y-mcp"
    }
  }
}
```

Or, without a global install:

```json
{
  "mcpServers": {
    "a11y-checklist": {
      "command": "npx",
      "args": ["-y", "@thealihamza04/a11y-mcp-server"]
    }
  }
}
```

### 2. Cursor

1. Open Cursor and go to **Settings** -> **Features** -> **MCP**.
2. Click **+ Add New MCP Server**.
3. Configure the following details:
   - **Name**: `a11y-checklist`
   - **Type**: `stdio`
   - **Command**: `a11y-mcp`
4. Click **Save**.

Or edit your global Cursor MCP config file (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "a11y-checklist": {
      "command": "a11y-mcp"
    }
  }
}
```

Or use `npx` directly:

```json
{
  "mcpServers": {
    "a11y-checklist": {
      "command": "npx",
      "args": ["-y", "@thealihamza04/a11y-mcp-server"]
    }
  }
}
```

### 3. Windsurf

Add the server to your Windsurf configuration file (usually located at `~/.codeium/windsurf/mcp_config.json`):

```json
{
  "mcpServers": {
    "a11y-checklist": {
      "command": "a11y-mcp"
    }
  }
}
```

Or, if you prefer not to install globally:

```json
{
  "mcpServers": {
    "a11y-checklist": {
      "command": "npx",
      "args": ["-y", "@thealihamza04/a11y-mcp-server"]
    }
  }
}
```

---

## 🧰 Available Tools

The MCP server exposes five high-performance tools under the registered capabilities.

### 1. `get_rule`
Finds a specific accessibility rule by its ID (e.g., `img-has-alt`) or its associated WCAG Success Criterion number (e.g., `1.1.1`).
* **Arguments**:
  - `query` (string, required): The ID or WCAG number of the rule.
* **Example Prompt**: `"Get details on WCAG 1.4.3"` or `"Look up the rule img-has-alt"`

### 2. `get_category_rules`
Retrieves all accessibility rules belonging to one of the 16 standard A11Y Project categories.
* **Arguments**:
  - `category` (string, required): One of the 16 categories:
    - `content`
    - `global-code`
    - `keyboard`
    - `images`
    - `headings`
    - `lists`
    - `controls`
    - `tables`
    - `forms`
    - `media`
    - `video`
    - `audio`
    - `appearance`
    - `animation`
    - `color-contrast`
    - `mobile-touch`
* **Example Prompt**: `"Show me all accessibility rules for form elements"`

### 3. `get_rules_by_level`
Lists all rules matching a specific WCAG compliance level (`A`, `AA`, `AAA`, or `Technique`).
* **Arguments**:
  - `level` (string, required): Compliance level to list.
* **Validation**: Invalid values now return a guided error with the allowed levels.
* **Example Prompt**: `"What are the required Level AA criteria?"`

### 4. `check_code`
Runs lightweight static analysis on an HTML or JSX snippet across images, forms, keyboard, controls, headings, tables, media, and animation. The audit is now context-aware, so document-only rules such as `<html lang>` and page heading structure can be scoped more accurately when you provide file context.
* **Arguments**:
  - `code` (string, required): The HTML or JSX code snippet to audit.
  - `filename` (string, optional): Source filename such as `Header.tsx` or `index.html` to improve snippet vs page inference.
  - `mode` (string, optional): `auto`, `snippet`, `component`, or `document`.
* **Response shape**: The server returns both human-readable text and structured JSON content so MCP clients can display or parse results more reliably.
* **Example Prompt**: `"Check this code snippet for accessibility issues: <img src='logo.png' />"`

### 5. `get_all_rules`
Dumps the complete database of all 64 accessibility rules with their titles, levels, WCAG criteria, descriptions, rationales, and compliant/non-compliant examples.
* **Arguments**: None.
* **Example Prompt**: `"Provide a full list of all 64 WCAG 2.2 rules"`

---

## 🗄️ Database Structure

The server is backed by a highly complete and curated JSON database containing detailed guidelines:

```json
{
  "id": "img-has-alt",
  "title": "All images have alt attributes",
  "category": "images",
  "wcag": "1.1.1",
  "wcagTitle": "Non-text Content",
  "wcagUrl": "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
  "level": "A",
  "obsolete": false,
  "description": "Every <img> element must have an alt attribute.",
  "whyItMatters": "Screen readers read alt text aloud to visually impaired users. Without alt text, the browser reads the file name, which is unhelpful and confusing.",
  "bad": "<img src=\"/cat.jpg\">",
  "good": "<img src=\"/cat.jpg\" alt=\"A ginger tabby cat sitting on a sunlit windowsill\">"
}
```

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more details.
