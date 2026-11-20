# Architecture decisions

A lightweight ADR log. Add an entry when you make a choice someone might later question. Newest
entries go at the bottom.

## ADR-001: Static Astro site, no adapter

**Decision:** `output: "static"`, deployed as plain files to Cloudflare Pages.
**Why:** No server means nothing to patch, no runtime cost, and no place for PHI to land. Every
current requirement (content pages, a booking link-out, a sitemap) is static.
**Revisit if:** a feature truly needs request-time logic. Prefer a single Cloudflare Pages
Function over switching the whole site to SSR.

## ADR-002: Pages CMS for client editing

**Decision:** [Pages CMS](https://pagescms.org) edits the Markdown/YAML in this repo through a
GitHub App. It's configured by `.pages.yml`.
**Why:** It's git-based, so there's no database or hosted backend to maintain, and every edit is
a reviewable commit. It works with any static generator. Clients log in with GitHub, and the
practitioner (or an agent) can edit the same files directly.
**Consequences:** `.pages.yml` duplicates the shape of `src/content.config.ts` and must be kept in
sync (`docs/playbooks/change-content-model.md`). Clients need a GitHub account with write
access to their repo. The in-app config editor is hidden (`settings.config: false`).

## ADR-003: Link out to the EHR. No forms.

**Decision:** "Request an appointment" links to the client's EHR portal (or `mailto:`/`tel:`).
**Why:** The site can never receive PHI, so it needs no BAA, form backend, or spam handling.
EHRs already provide HIPAA-compliant intake. See `docs/compliance.md#phi`.

## ADR-004: Tailwind CSS v4 with semantic tokens

**Decision:** Tailwind v4 via the Vite plugin. Brand values are CSS variables in
`src/styles/theme.css` (`--color-primary`, `--color-ink`, …), and markup uses only the semantic
utilities they generate.
**Why:** Re-skinning a client means editing one file, and agents produce consistent markup.

## ADR-005: Template layer vs. client layer

**Decision:** Client-specific changes are limited to `src/content/`, `public/uploads/`,
`src/styles/theme.css`, and `public/_redirects`. Everything else is template code.
**Why:** Client repos can merge template improvements with few or no conflicts
(`docs/playbooks/sync-template.md`).

## ADR-006: Locale-ready content layout, English only

**Decision:** Translatable content is stored under a locale folder or file (`services/en/`,
`home/en.yml`). Interface strings are in `src/i18n/`. Astro i18n has `prefixDefaultLocale: false`,
and routes are thin wrappers around views that take a `locale` prop.
**Why:** Adding Spanish later means adding content and route files only, with no restructuring.

## ADR-007: Uploaded media in `public/uploads/`

**Decision (for now):** Pages CMS uploads to `public/uploads/{images,documents}` and writes
`/uploads/...` paths.
**Why:** It's simplest, and it works with Pages CMS and plain `<img>`. **Trade-off:** no automatic
Astro image optimization. Revisit in Roadmap Phase 5.

## ADR-008: Settings URL read by regex in `astro.config.mjs`

**Decision:** `astro.config.mjs` reads the `url:` line from `src/content/site/settings.yml` with a
regex. `SITE_URL` overrides it.
**Why:** The production domain is client content and should be editable in the CMS. A regex avoids
adding a YAML parser dependency. Keep `url` a top-level, single-line key.

## ADR-009: TypeScript 6.x

**Decision:** Pin `typescript@^6`. **Why:** `@astrojs/check` 0.9.x declares peer support for
TypeScript 5–6 only, and TS 7 (the native compiler) isn't supported yet. Revisit when
`@astrojs/check` widens its peer range.
