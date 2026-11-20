#!/usr/bin/env node
/**
 * Pre-launch guardrails for a client site. Zero dependencies, so it runs before `npm install`.
 *
 *   npm run launch-check
 *
 * Errors (exit 1): leftover template placeholders, third-party trackers, or font CDNs.
 * Warnings: things a human should confirm (forms, embeds).
 *
 * This complements, and does not replace, the human review in docs/playbooks/compliance-review.md.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const errors = [];
const warnings = [];

function walk(dir, exts) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full, exts));
    else if (exts.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

function scan(files, rules) {
  for (const file of files) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (/^\s*#/.test(line) && /\.ya?ml$/.test(file)) return; // YAML comments
      for (const { pattern, message, level } of rules) {
        if (pattern.test(line)) {
          (level === "warn" ? warnings : errors).push(`${relative(root, file)}:${i + 1}  ${message}`);
        }
      }
    });
  }
}

// 1. Placeholder content must be replaced.
scan(walk(join(root, "src/content"), [".md", ".yml", ".yaml", ".json"]), [
  { pattern: /\bEXAMPLE\b/, message: "Template placeholder (EXAMPLE) not replaced" },
  { pattern: /\bexample\.com\b/, message: "Placeholder domain example.com not replaced" },
]);

// 2. No third-party tracking, ad pixels, session replay, or font CDNs anywhere in code.
const codeFiles = [
  ...walk(join(root, "src"), [".astro", ".ts", ".js", ".mjs", ".css", ".md"]),
  ...walk(join(root, "public"), [".html", ".js"]),
];
scan(codeFiles, [
  {
    pattern: /googletagmanager\.com|google-analytics\.com|gtag\(/,
    message: "Google Analytics/Tag Manager is not allowed (see docs/compliance.md#tracking)",
  },
  { pattern: /connect\.facebook\.net|fbq\(/, message: "Meta Pixel is not allowed" },
  {
    pattern: /hotjar|clarity\.ms|fullstory|logrocket|mouseflow/i,
    message: "Session replay / heatmap scripts are not allowed",
  },
  {
    pattern: /fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net/,
    message: "Self-host fonts; don't load them from a third-party CDN",
  },
  {
    pattern: /<form\b/i,
    message: "A <form> exists. Confirm it cannot collect health information (docs/compliance.md#phi)",
    level: "warn",
  },
  {
    pattern: /<iframe\b/i,
    message: "An <iframe> embed exists. Confirm it sets no tracking cookies",
    level: "warn",
  },
]);

for (const w of warnings) console.warn(`warn   ${w}`);
for (const e of errors) console.error(`error  ${e}`);
console.log(`\nlaunch-check: ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
