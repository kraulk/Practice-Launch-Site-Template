# Playbook: add a language

**Use when:** a client needs a Spanish (or other) version. The example below uses `es`.

1. **Config:** in `astro.config.mjs` → `i18n.locales: ["en", "es"]`. Keep `defaultLocale: "en"`
   and `prefixDefaultLocale: false`, so English stays at `/` and Spanish lives at `/es/`.
2. **Interface strings:** copy `src/i18n/en.ts` → `src/i18n/es.ts`, translate it, and register it in
   `src/i18n/index.ts`. For the Good Faith Estimate, use CMS's official Spanish-language
   materials if they're published (check <https://www.cms.gov/nosurprises>). Otherwise use a
   professional translation. Don't machine-translate the legal notice.
3. **Content:** copy each locale folder or file and translate it:
   `home/en.yml → home/es.yml`, `pages/en/ → pages/es/`, `services/en/ → services/es/`,
   `fees/en.md → fees/es.md`, `faq/en.yml → faq/es.yml`, `posts/en/ → posts/es/`.
   `settings.yml` is shared. Keep the same slugs across locales so pages can link to their
   translations.
4. **Routes:** add thin route files under `src/pages/es/` that render the same views with
   `locale="es"`.
5. **CMS:** in `.pages.yml`, duplicate each localized content entry with an `es` path and a label
   suffix, e.g. `name: services_es`, `label: Services (Español)`, `path: src/content/services/es`.
6. **SEO:** `Seo.astro` emits `hreflang` alternates for entries that exist in both locales, and
   `<html lang>` uses the locale.
7. **Header:** add a language switcher link (a plain link, no JS) that points to the translated
   page when one exists and to `/es/` otherwise.
8. **Review:** a fluent human reviews all translated copy. Run `compliance-review.md` on the
   Spanish pages, then `npm run verify`.
