# Content model

Three files define content, and they must agree:

1. `src/content.config.ts`: the schema the build validates against (source of truth)
2. `.pages.yml`: the Pages CMS editor (labels, help text, widgets)
3. This document: the human-readable map

Change all three together using `docs/playbooks/change-content-model.md`.

## Collections

| Collection | Files                                     | CMS entry          | Shape                  | Route(s)                                                            |
| ---------- | ----------------------------------------- | ------------------ | ---------------------- | ------------------------------------------------------------------- |
| `settings` | `src/content/site/settings.yml`           | Practice settings  | single, locale-neutral | used everywhere                                                     |
| `home`     | `src/content/home/{locale}.yml`           | Home page          | single per locale      | `/`                                                                 |
| `pages`    | `src/content/pages/{locale}/{slug}.md`    | Pages (fixed set)  | one per page           | `/about/`, `/schools/`, `/contact/`, `/privacy/`, `/accessibility/` |
| `services` | `src/content/services/{locale}/{slug}.md` | Services           | many                   | `/services/`, `/services/{slug}/`                                   |
| `fees`     | `src/content/fees/{locale}.md`            | Fees and insurance | single per locale      | `/fees/`                                                            |
| `faq`      | `src/content/faq/{locale}.yml`            | FAQ                | single per locale      | `/faq/`                                                             |
| `posts`    | `src/content/posts/{locale}/{slug}.md`    | Resources          | many                   | `/resources/`, `/resources/{slug}/`                                 |

Entry ids include the locale (`en/about`, or `en` for single files). Use `src/lib/content.ts`
(`getSettings`, `getSingleton`, `getPage`, `getServices`, `getPosts`, `slugOf`) rather than
calling `getCollection` directly.

## `settings`

| Field                                                               | Type                           | Notes                                                                              |
| ------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| `practiceName`                                                      | string                         | Shown in header, `<title>`, JSON-LD                                                |
| `tagline`                                                           | string?                        |                                                                                    |
| `logo`                                                              | image `{src, alt}`?            | Header logo. Empty → practice name shown as a text wordmark                        |
| `url`                                                               | https URL                      | Production origin. Read by `astro.config.mjs` (keep it top-level, one line)        |
| `clinician.name` / `professionalTitle` / `credentials` / `pronouns` | strings                        | Title must be exactly what the license allows ([compliance](compliance.md#titles)) |
| `clinician.headshot`                                                | image `{src, alt}`             |                                                                                    |
| `licenses[]`                                                        | `{state, type, number?}`       | Footer and About                                                                   |
| `contact.phone` / `email` / `hours`                                 | strings                        |                                                                                    |
| `contact.showAddress` + `contact.address`                           | bool + object                  | Many new practices are telehealth-first or don't want a home address public        |
| `serviceArea.summary` / `regions[]`                                 |                                | `areaServed` in JSON-LD                                                            |
| `telehealth.enabled` / `states[]` / `psypact` / `note`              |                                |                                                                                    |
| `booking.mode`                                                      | `portal` \| `email` \| `phone` | Drives every booking CTA                                                           |
| `booking.ehrName` / `url` / `label`                                 |                                | `url` is required in practice when `mode: portal` (launch-check will enforce this) |
| `features.schools` / `fees` / `faq` / `blog`                        | booleans                       | Toggle routes, nav, and sitemap entries (`src/lib/routes.ts`)                      |
| `social[]`                                                          | `{label, url}`                 | e.g. LinkedIn, Psychology Today profile                                            |
| `seo.defaultDescription` (≤160) / `seo.ogImage`                     |                                |                                                                                    |

## `home`

`seoTitle?`, `seoDescription?`, `hero {heading, subheading?, image}`, `intro?`,
`audiences.families` / `audiences.schools` `{heading, text, linkLabel}`, `highlights[] {title, text}` (max 4),
`closing {heading, text?}`. Featured services come from `services[].featured`.

## `pages`

`title`, `description` (≤160), `heading?` (defaults to title), `image?`,
`downloads[] {label, file}` (PDFs from the Documents media folder), `cta? {label, href}`, and a Markdown body.
The CMS cannot create, rename, or delete pages, because routes are fixed in `src/pages/`.

## `services`

`title`, `summary` (≤200), `audience` (`families` | `schools` | `both`), `formats[]`
(`in-person` | `telehealth` | `hybrid` | `on-site`), `duration?`, `priceNote?`, `order` (default 100),
`featured`, `draft`, and a Markdown body. The filename (slug) comes from the title when created in
the CMS.

## `fees`

`title`, `description`, `items[] {service, price, note?}`, `insurance {status, networks[], superbills}`,
`paymentMethods[]`, `cancellationPolicy?`, and an optional body. Prices are strings so clients can
write "Starting at $2,400" or "Contact for district rates". The Good Faith Estimate notice is **not**
a field. It's fixed template copy.

## `faq`

`title`, `description`, `items[] {question, answer}`. Answers are plain text, and blank lines
become paragraphs.

## `posts`

`title`, `description` (≤160), `pubDate`, `updatedDate?`, `image?`, `tags[]`, `draft`, and a Markdown body.

Analytics isn't a content field. It's enabled in the Cloudflare dashboard (`docs/deploy.md`).

## Conventions

- **Empty values:** Pages CMS may write `""` or `null`. The schema helpers `optional()`, `list()`, and
  `flag()` normalize these, so always use them for non-required fields.
- **Images:** always `{ src, alt }`, and the schema rejects a `src` without `alt`. Paths look like
  `/uploads/images/...`.
- **Placeholders:** seed copy starts with `EXAMPLE` and `npm run launch-check` fails until it's replaced.
- **Drafts:** `draft: true` entries render in `npm run dev` but are excluded from production builds.
