/**
 * Typed accessors for content. Pages and components read content through here
 * (not `getCollection` directly) so locale, draft, and feature-flag rules stay in one place.
 */
import { getCollection, getEntry } from "astro:content";
import { defaultLocale } from "@/i18n";

const inLocale = (id: string, locale: string) => id.startsWith(`${locale}/`);
const publish = import.meta.env.PROD;

export async function getSettings() {
  const entry = await getEntry("settings", "settings");
  if (!entry) throw new Error("Missing src/content/site/settings.yml");
  return entry.data;
}

export async function getSingleton<C extends "home" | "fees" | "faq">(collection: C, locale = defaultLocale) {
  const entry = await getEntry(collection, locale);
  if (!entry) throw new Error(`Missing ${collection} content for locale "${locale}"`);
  return entry;
}

export async function getPage(slug: string, locale = defaultLocale) {
  const entry = await getEntry("pages", `${locale}/${slug}`);
  if (!entry) throw new Error(`Missing page src/content/pages/${locale}/${slug}.md`);
  return entry;
}

export async function getServices(locale = defaultLocale) {
  const all = await getCollection("services", (e) => inLocale(e.id, locale) && (!publish || !e.data.draft));
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export async function getPosts(locale = defaultLocale) {
  const all = await getCollection("posts", (e) => inLocale(e.id, locale) && (!publish || !e.data.draft));
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Strip the locale prefix from an entry id to get its URL slug. */
export const slugOf = (id: string) => id.split("/").slice(1).join("/");
