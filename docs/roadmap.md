# Roadmap

Build phases for the template itself. Each phase ends with `npm run verify` passing and a commit.
Agents: pick the first unchecked item, read its acceptance criteria, and build only that. Tick
items here as they land.

## Phase 0: Workspace ✅

- [x] Agent instructions (`AGENTS.md`, `CLAUDE.md`, `.claude/`), playbooks, docs
- [x] Content schema (`src/content.config.ts`) + Pages CMS config (`.pages.yml`) + seed content
- [x] Tailwind v4 theme tokens, i18n strings (crisis + Good Faith Estimate notices)
- [x] `launch-check` script, Cloudflare `_headers`, smoke-test home page
- [x] Dependencies declared in `package.json` (**not yet installed**)

## Phase 1: Foundation

- [ ] `npm install`, commit `package-lock.json`, and confirm `npm run verify` passes on the smoke page.
- [ ] `src/layouts/Base.astro`: `<html lang>`, head via `<Seo>`, skip link, `<Header>`, `<main id="main">`, `<Footer>`.
- [ ] `src/components/Seo.astro`: title template (`Page | Practice`), description, canonical, Open Graph/Twitter, and robots `noindex` on non-production builds (Cloudflare preview URLs).
- [ ] `Header.astro`: practice name/wordmark, nav built from `settings.features`, booking CTA, and an accessible mobile menu (a `<button aria-expanded>` with a small inline script that works without JS by falling back to a visible list).
- [ ] `Footer.astro`: contact details, licenses (state, type, number), telehealth states, crisis notice, and links to Privacy, Accessibility, and the Good Faith Estimate.
- [ ] `BookingCta.astro`: one component for every "request appointment" button, driven by `settings.booking` (portal → external link with `rel="noopener"`; email → `mailto:` + caution; phone → `tel:`).
- [ ] Typography: `prose` styles mapped to theme tokens for Markdown bodies.
- [ ] Cloudflare Web Analytics beacon, rendered only when `analytics.cloudflareToken` is set.

**Accepts when:** keyboard-only navigation works across header, menu, and footer; turning off a feature flag removes the nav item and route; Lighthouse accessibility = 100 on the smoke page.

## Phase 2: Pages

Each route is a thin file in `src/pages/` that renders a view from `src/views/` with a `locale` prop.

- [ ] `/`: hero, intro, audience panels (Schools panel hidden when `features.schools` is false), featured services, highlights, closing CTA.
- [ ] `/about/`: headshot, title and credentials, body.
- [ ] `/services/`: grouped into "For families" and "For schools" (by `audience`; `both` appears in each), with format badges.
- [ ] `/services/[slug]/`: detail page with duration, price note, formats, and CTA.
- [ ] `/schools/`: only if `features.schools`. Body, school-audience services, and downloads (capability statement/CV).
- [ ] `/fees/`: only if `features.fees`. Fee table, insurance status, payment methods, cancellation policy, and the **Good Faith Estimate notice** (always present on this page).
- [ ] `/faq/`: only if `features.faq`. Uses `<details>/<summary>` (no JS), plus `FAQPage` JSON-LD.
- [ ] `/resources/` and `/resources/[slug]/`: only if `features.blog`. Lists newest first and excludes drafts in production.
- [ ] `/contact/`: booking CTA, phone/email/hours, optional address and map _link_ (no embed), and the email caution.
- [ ] `/privacy/`, `/accessibility/`, and `404`.

**Accepts when:** every route builds from seed content; disabling each feature flag removes its route, nav link, and sitemap entry; no page ships client JS except the menu toggle.

## Phase 3: SEO and structured data

- [ ] `src/pages/robots.txt.ts` with an absolute `Sitemap:` URL (delete `public/robots.txt`); sitemap excludes disabled features.
- [ ] JSON-LD: `ProfessionalService`/`LocalBusiness` (name, url, telephone, areaServed, address only if `showAddress`) and a `Person` for the clinician. Verify current schema.org types first.
- [ ] Default Open Graph image: generated at build from practice name + theme colors, or `seo.ogImage`.
- [ ] RSS feed for resources (only if `features.blog`).

## Phase 4: Quality gates

- [ ] GitHub Actions CI on PRs: `npm ci && npm run verify`.
- [ ] Automated accessibility: Playwright + `@axe-core/playwright` over every built route (dev dependency; run in CI).
- [ ] `launch-check` extended: settings sanity (https URL, booking URL present when `mode: portal`, at least one license) and the Good Faith Estimate on `/fees/`.
- [ ] Schema ↔ CMS drift check: a script that compares field names in `.pages.yml` to `src/content.config.ts`.
- [ ] Performance budget: total JS < 10 KB per page, LCP image preloaded, images sized.

## Phase 5: Theming and client polish

- [ ] 2–3 preset themes in `docs/themes.md` (calm teal, warm clay, navy/professional) with verified contrast ratios.
- [ ] Self-hosted font workflow (Astro Fonts API or `@fontsource-variable/*`). Document the choice in `architecture.md`.
- [ ] Image handling: decide whether CMS uploads stay in `public/` (simple) or move to `src/assets/` for Astro image optimization. Record an ADR.
- [ ] Client editing guide (`docs/client-guide.md`): plain-language Pages CMS walkthrough with screenshots.

## Phase 6: Second language (proof)

- [ ] Follow `docs/playbooks/add-locale.md` to add `es` on a branch and confirm the playbook is complete. Don't merge Spanish content into the template.

## Later / not planned

- Newsletter signup (needs an ADR; non-clinical fields only).
- Multi-clinician group practices (a `clinicians` collection).
- Testimonials: **intentionally excluded** (see `docs/compliance.md`).
