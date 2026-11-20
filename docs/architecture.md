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

## ADR-010: Analytics enabled in the Cloudflare dashboard, not in code

**Decision:** Cloudflare Web Analytics is turned on per project in the Cloudflare Pages dashboard,
which injects the beacon at deploy time. The template has no analytics field or snippet.
**Why:** It's one less setting to maintain, clients can toggle it without editing the site or
asking a developer, and the analytics data stays with the Cloudflare account that owns the site.
**Consequence:** any future Content-Security-Policy must allow Cloudflare's beacon hosts
(`docs/compliance.md#tracking`).

## ADR-011: One route registry drives nav, footer links, and feature-gated routes

**Decision:** `src/lib/routes.ts` lists every site section, the feature flag that gates it, and
its path. The header nav, footer links, and `getStaticPaths` of gated pages all read from it.
Gated pages are written as `src/pages/<section>/[...gate].astro` and return
`gatedPaths(settings.features.<flag>)`: an undefined rest param renders the section index, and
returning no paths removes the page from the build and therefore from the sitemap.
**Why:** Turning off a flag has to remove the nav link, the route, and the sitemap entry together.
One list keeps them from drifting, and Phase 2 pages need no extra wiring.
**Consequence:** Feature-gated route files use the `[...gate].astro` name instead of
`index.astro`. Adding a section means one registry line plus its route file.

## ADR-012: Booking links resolved in one place

**Decision:** `src/lib/booking.ts` turns `settings.booking` into a link, and `BookingCta.astro` is
the only component that renders it. Portal links open in the **same tab** (`rel="noopener"`, no
`target`), which is the most predictable behavior for keyboard and screen-reader users. In
`email`/`phone` mode the header button links to `/contact/`, because the required caution doesn't
fit in the header. Everywhere else the link is a direct `mailto:`/`tel:` with its caution. A
missing portal URL, email, or phone falls back to `/contact/` with a build warning instead of
failing the build.
**Why:** A half-finished CMS edit should never take the live site down. `launch-check` (Phase 4)
is the gate that blocks launch on a missing value.

## ADR-013: Search indexing only on the production branch

**Decision:** `Seo.astro` emits `<meta name="robots" content="noindex, nofollow">` when
`CF_PAGES_BRANCH` is set and isn't the production branch (`PRODUCTION_BRANCH`, default `main`).
Builds outside Cloudflare count as production. `public/_headers` adds `X-Robots-Tag: noindex` on
`*.pages.dev` hosts, as Cloudflare documents.
**Why:** Preview and branch deploys must never compete with the client's real domain in search.
Defaulting to indexable outside Cloudflare keeps a site from being hidden by accident if it's
ever deployed elsewhere.

## ADR-014: Optional logo with a text wordmark fallback

**Decision:** `settings.logo` is an optional `{src, alt}` image. The header shows it when set and
otherwise shows `practiceName` in the display font.
**Why:** Most new practices launch without a logo. The intake asks for one, so the template should
take it without a code change.
