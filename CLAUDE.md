@AGENTS.md

## Claude Code notes

- Project skills in `.claude/skills/` are thin wrappers around `docs/playbooks/`. Edit the
  playbook, not the skill, so every agent tool stays in sync.
- The Astro Docs MCP server is configured in `.mcp.json`. Use it for any Astro API question.
- Shared permissions live in `.claude/settings.json`. Personal overrides go in
  `.claude/settings.local.json`, which is git-ignored.
