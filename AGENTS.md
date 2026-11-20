# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, and others) working in this
repository. This is the single source of truth. `CLAUDE.md` imports it, so don't duplicate rules
elsewhere.

## What this is

An **Astro site template for school psychologists** opening a private practice or consulting
business for the first time. Each client gets their own copy of this repo. Clients range from
family-facing evaluation practices (psychoeducational evaluations, IEEs, parent consultation) to
consultants contracting with schools and districts, and many do both, often with telehealth.

The product goals, in priority order:

1. **Trustworthy and compliant.** No health information is ever collected by the site, and
   credentials are stated accurately. Required notices are present. See `docs/compliance.md`.
2. **Low maintenance.** A static site with no server, database, or plugins to patch. Clients
   edit content in Pages CMS, and every edit is a git commit.
3. **Accessible and fast.** WCAG 2.2 AA, near-zero client JavaScript, and good Core Web Vitals.
4. **Easy to re-skin per client.** One theme file plus content.

When goals conflict, the higher one wins. **Lean is a feature.** Don't add a dependency,
integration, or client-side framework without a clear need and an ADR note in
`docs/architecture.md`.

## Stack

| Concern   | Choice                                                                    |
| --------- | ------------------------------------------------------------------------- |
| Framework | Astro 7, `output: "static"`, no adapter                                   |
| Styling   | Tailwind CSS v4 via `@tailwindcss/vite`, tokens in `src/styles/theme.css` |
| Content   | Astro content collections (`src/content.config.ts`) + Markdown/YAML files |
| CMS       | [Pages CMS](https://pagescms.org), configured in `.pages.yml`, git-based  |
| Hosting   | Cloudflare Pages: build `npm run build`, output `dist/`                   |
| Booking   | Link out to the client's EHR portal. **The site has no intake forms.**    |
| i18n      | Astro i18n, English only, locale-ready (`docs/playbooks/add-locale.md`)   |
| Runtime   | Node ≥ 22.23.4 (`.node-version`), npm                                     |

Look up current Astro APIs with the **Astro Docs MCP server** (`.mcp.json`) rather than from
memory, since Astro 7 differs from older training data. Pages CMS docs are at
<https://pagescms.org/docs/>.

## Commands

```bash
npm install          # first time only
npm run dev          # local dev server at http://localhost:4321
npm run check        # astro check: types + content schema validation
npm run format       # prettier (Astro + Tailwind class sorting)
npm run build        # static build to dist/
npm run verify       # check + format:check + build. Run before you say you're done.
npm run launch-check # placeholder/tracker scan. Must pass before a client site goes live.
```

## Repository map: template layer vs. client layer

Keeping these layers separate is what lets client sites pull template updates without conflicts
(`docs/playbooks/sync-template.md`).

**Client layer** (differs per client, and is the only thing a client site should change):

- `src/content/**`: all copy, settings, services, fees, FAQ, posts
- `public/uploads/**`: images and PDFs uploaded through Pages CMS
- `src/styles/theme.css`: brand colors, fonts, radius
- `public/_redirects`: per-client redirects

**Template layer** (shared and identical across clients, improved here and synced out):

- `src/content.config.ts`: content schema (the contract)
- `.pages.yml`: CMS editor config (must mirror the schema)
- `src/layouts/`, `src/components/`, `src/views/`, `src/pages/`: markup
- `src/lib/`: content accessors (`getSettings`, `getServices`, …)
- `src/i18n/`: fixed interface copy, including the crisis and Good Faith Estimate notices
- `src/styles/global.css`, `astro.config.mjs`, `scripts/`, `docs/`

If a client needs something the template layer can't express, prefer adding a **feature flag or
content field to the template** over forking markup in the client repo.

## Rules

### Content and CMS

- **`src/content.config.ts` and `.pages.yml` must stay in sync**, field for field. Any schema
  change follows `docs/playbooks/change-content-model.md`, which also updates
  `docs/content-model.md` and the seed content.
- Read content only through `src/lib/content.ts`. It applies locale, draft, and ordering rules.
- Every optional schema field uses the `optional()` / `list()` / `flag()` helpers. Pages CMS writes
  `""` or `null` for empty fields, and the build must not break when a client leaves a field blank.
- Images are `{ src, alt }` objects, and alt text is required whenever `src` is set.
- Don't reformat files in `src/content/`. Pages CMS owns their formatting, and noisy diffs make
  client edits hard to review. They're excluded in `.prettierignore`.
- Placeholder copy starts with `EXAMPLE`. Never remove that marker without writing real,
  client-approved content.

### Compliance (summary; full reasoning in `docs/compliance.md`)

- **No PHI.** Don't add forms, chat widgets, or uploads that could collect health, diagnostic,
  or student-record information. Appointment requests link to the client's EHR portal.
- **No third-party tracking**: no Google Analytics/Tag Manager, Meta Pixel, session replay, or ad
  scripts. Cloudflare Web Analytics (cookieless) is the only analytics option. Self-host fonts.
  Avoid embeds that set cookies.
- **Never invent or embellish credentials, licenses, titles, or outcomes.** If information is
  missing, leave the `EXAMPLE` placeholder and ask. "School psychologist" and "psychologist" are
  regulated titles that vary by state.
- **No testimonials or reviews feature.** Ethics codes restrict them.
- The crisis notice and the Good Faith Estimate notice are template copy in `src/i18n/` and must
  stay on every site that shows fees.

### Code

- Astro components first. Add client-side JS only for real interactivity (e.g. a mobile nav
  toggle), as a small inline `<script>`, with no UI framework.
- Semantic HTML first, and ARIA only when HTML can't express it. Every page has one `<h1>`, a skip
  link, and landmarks. Interactive elements are keyboard-operable with visible focus.
- Use theme tokens (`bg-primary`, `text-ink-muted`), never raw hex values, in markup.
- Pages in `src/pages/` are thin. They load content and render a view from `src/views/` that
  takes a `locale` prop, so adding a language means adding thin route files only.
- TypeScript is strict. Import from `@/…` (maps to `src/`).

## Playbooks

Step-by-step procedures for recurring jobs live in `docs/playbooks/`. Follow them when the task
matches, whichever agent you are:

| Playbook                                 | Use when                                            |
| ---------------------------------------- | --------------------------------------------------- |
| `docs/playbooks/new-client.md`           | Turning this template into a specific client's site |
| `docs/playbooks/compliance-review.md`    | Reviewing copy or a page before it ships            |
| `docs/playbooks/change-content-model.md` | Adding, removing, or changing any content field     |
| `docs/playbooks/add-locale.md`           | Adding Spanish or another language                  |
| `docs/playbooks/sync-template.md`        | Pulling template improvements into a client repo    |

## Where things are documented

- `docs/roadmap.md`: build phases with acceptance criteria. **Start here when building the template.**
- `docs/architecture.md`: decisions and their reasons (ADR log)
- `docs/content-model.md`: every collection and field, and how it maps to the CMS
- `docs/compliance.md`: privacy, ethics, title use, required notices, accessibility
- `docs/deploy.md`: Cloudflare Pages, Pages CMS, domains
- `docs/client-intake.md`: questionnaire to send a new client

## Definition of done

1. `npm run verify` passes.
2. `.pages.yml`, `src/content.config.ts`, and `docs/content-model.md` agree, if content changed.
3. New UI is keyboard-navigable and meets the contrast rules in `src/styles/theme.css`.
4. Copy changes pass `docs/playbooks/compliance-review.md`.
5. The relevant `docs/` page is updated if behavior or a decision changed.
