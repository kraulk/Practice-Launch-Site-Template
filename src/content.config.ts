/**
 * Content contract for the site.
 *
 * Every collection here is mirrored field-for-field in `/.pages.yml` (the Pages CMS
 * editor config) and documented in `docs/content-model.md`. Change all three together:
 * see `docs/playbooks/change-content-model.md`.
 *
 * Locale convention: translatable content lives under a locale folder or file
 * (`services/en/…`, `home/en.yml`). Entry ids therefore start with the locale
 * (`en/initial-evaluation`), and `src/lib/content.ts` filters by it.
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// ---------------------------------------------------------------------------
// Helpers: Pages CMS can write `""` or `null` for fields left empty. Treat both
// as "not set" so an empty optional field never breaks the build.
// ---------------------------------------------------------------------------
const isBlank = (v: unknown) => v === "" || v === null;

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (isBlank(v) ? undefined : v), schema.optional());

const list = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (isBlank(v) || v === undefined ? [] : v), z.array(schema));

const flag = (fallback: boolean) =>
  z.preprocess((v) => (isBlank(v) || v === undefined ? fallback : v), z.boolean());

/** Public URL path (e.g. `/uploads/images/headshot.jpg`) or absolute URL. */
const path = z.string().regex(/^(\/|https?:\/\/)/, { error: "Must start with / or http(s)://" });

/** An image must always travel with alt text. */
const image = z
  .object({ src: optional(path), alt: optional(z.string()) })
  .refine((img) => !img.src || !!img.alt, { error: "Images need alt text" });

const optionalImage = z.preprocess((v) => (isBlank(v) ? undefined : v), image.optional());

const cta = z.object({ label: z.string(), href: z.string() });

// ---------------------------------------------------------------------------
// settings: locale-neutral practice facts. Single file.
// ---------------------------------------------------------------------------
const settings = defineCollection({
  loader: glob({ pattern: "settings.yml", base: "./src/content/site" }),
  schema: z.object({
    practiceName: z.string(),
    tagline: optional(z.string()),
    url: z.url(),
    clinician: z.object({
      name: z.string(),
      /** Exact legal title permitted by the clinician's state. See docs/compliance.md#titles. */
      professionalTitle: z.string(),
      credentials: optional(z.string()),
      pronouns: optional(z.string()),
      headshot: optionalImage,
    }),
    licenses: list(
      z.object({
        state: z.string(),
        type: z.string(),
        number: optional(z.string()),
      }),
    ),
    contact: z.object({
      phone: optional(z.string()),
      email: optional(z.email()),
      showAddress: flag(false),
      address: optional(
        z.object({
          street: optional(z.string()),
          city: optional(z.string()),
          region: optional(z.string()),
          postalCode: optional(z.string()),
        }),
      ),
      hours: optional(z.string()),
    }),
    serviceArea: z.object({
      summary: optional(z.string()),
      regions: list(z.string()),
    }),
    telehealth: z.object({
      enabled: flag(false),
      states: list(z.string()),
      /** Only licensed psychologists can hold PSYPACT authority. */
      psypact: flag(false),
      note: optional(z.string()),
    }),
    booking: z.object({
      /** `portal` links to the EHR client portal. No form ever collects clinical info. */
      mode: z.enum(["portal", "email", "phone"]),
      ehrName: optional(z.string()),
      url: optional(z.url()),
      label: z.string(),
    }),
    features: z.object({
      schools: flag(true),
      fees: flag(true),
      faq: flag(true),
      blog: flag(false),
    }),
    social: list(z.object({ label: z.string(), url: z.url() })),
    seo: z.object({
      defaultDescription: z.string().max(160),
      ogImage: optional(path),
    }),
  }),
});

// ---------------------------------------------------------------------------
// home: structured home page, one file per locale (`home/en.yml`).
// ---------------------------------------------------------------------------
const audiencePanel = z.object({
  heading: z.string(),
  text: z.string(),
  linkLabel: z.string(),
});

const home = defineCollection({
  loader: glob({ pattern: "*.yml", base: "./src/content/home" }),
  schema: z.object({
    seoTitle: optional(z.string()),
    seoDescription: optional(z.string().max(160)),
    hero: z.object({
      heading: z.string(),
      subheading: optional(z.string()),
      image: optionalImage,
    }),
    intro: optional(z.string()),
    audiences: z.object({
      families: audiencePanel,
      schools: audiencePanel,
    }),
    highlights: list(z.object({ title: z.string(), text: z.string() })),
    closing: z.object({
      heading: z.string(),
      text: optional(z.string()),
    }),
  }),
});

// ---------------------------------------------------------------------------
// pages: fixed-route prose pages (about, schools, contact, privacy, accessibility).
// ---------------------------------------------------------------------------
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    heading: optional(z.string()),
    image: optionalImage,
    downloads: list(z.object({ label: z.string(), file: path })),
    cta: optional(cta),
  }),
});

// ---------------------------------------------------------------------------
// services: one file per service, per locale.
// ---------------------------------------------------------------------------
const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    audience: z.enum(["families", "schools", "both"]),
    formats: list(z.enum(["in-person", "telehealth", "hybrid", "on-site"])),
    duration: optional(z.string()),
    priceNote: optional(z.string()),
    order: z.preprocess((v) => (isBlank(v) ? 100 : v), z.number()),
    featured: flag(false),
    draft: flag(false),
  }),
});

// ---------------------------------------------------------------------------
// fees: one file per locale (`fees/en.md`). The Good Faith Estimate notice text
// itself is fixed template copy in src/i18n, not editable content.
// ---------------------------------------------------------------------------
const fees = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/fees" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    items: list(z.object({ service: z.string(), price: z.string(), note: optional(z.string()) })),
    insurance: z.object({
      status: z.enum(["out-of-network", "in-network", "not-accepted"]),
      networks: list(z.string()),
      superbills: flag(true),
    }),
    paymentMethods: list(z.string()),
    cancellationPolicy: optional(z.string()),
  }),
});

// ---------------------------------------------------------------------------
// faq: one file per locale (`faq/en.yml`).
// ---------------------------------------------------------------------------
const faq = defineCollection({
  loader: glob({ pattern: "*.yml", base: "./src/content/faq" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    items: list(z.object({ question: z.string(), answer: z.string() })),
  }),
});

// ---------------------------------------------------------------------------
// posts: resources / blog articles.
// ---------------------------------------------------------------------------
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: optional(z.coerce.date()),
    image: optionalImage,
    tags: list(z.string()),
    draft: flag(false),
  }),
});

export const collections = { settings, home, pages, services, fees, faq, posts };
