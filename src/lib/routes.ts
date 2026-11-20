/**
 * Route registry: the single list of site sections, which feature flag (if any)
 * gates each one, and helpers that turn it into nav links and static paths.
 * Header, footer, and feature-gated pages all read from here, so turning off a
 * flag in settings removes the nav link and the route together.
 */
import { getRelativeLocaleUrl } from "astro:i18n";
import type { UiStrings } from "@/i18n";
import type { Settings } from "@/lib/content";

export type Feature = keyof Settings["features"];
type NavKey = keyof UiStrings["nav"];

interface Section {
  key: NavKey;
  path: string;
  feature?: Feature;
}

/** Main navigation, in display order. Home is reached through the wordmark. */
const sections: Section[] = [
  { key: "about", path: "about/" },
  { key: "services", path: "services/" },
  { key: "schools", path: "schools/", feature: "schools" },
  { key: "fees", path: "fees/", feature: "fees" },
  { key: "faq", path: "faq/", feature: "faq" },
  { key: "resources", path: "resources/", feature: "blog" },
  { key: "contact", path: "contact/" },
];

/** Locale-aware URL for a site path such as `"about/"` (`""` is home). */
export const href = (path: string, locale: string) => getRelativeLocaleUrl(locale, path);

export interface NavItem {
  key: NavKey;
  href: string;
}

export function mainNav(features: Settings["features"], locale: string): NavItem[] {
  return sections
    .filter((s) => !s.feature || features[s.feature])
    .map((s) => ({ key: s.key, href: href(s.path, locale) }));
}

/**
 * The Good Faith Estimate notice must always be reachable. It lives on the
 * fees page when fees are on, and on its own page when they're off.
 */
export function goodFaithEstimateHref(features: Settings["features"], locale: string) {
  return features.fees
    ? `${href("fees/", locale)}#good-faith-estimate`
    : href("good-faith-estimate/", locale);
}

/**
 * `getStaticPaths` result for a feature-gated route. Gated pages are written as
 * `src/pages/<section>/[...gate].astro`: an undefined rest param renders the
 * section index, and returning no paths removes the route from the build (and
 * therefore from the sitemap).
 */
export const gatedPaths = (enabled: boolean) => (enabled ? [{ params: { gate: undefined } }] : []);

/** Is `pathname` the page `itemHref` points to, or inside its section? */
export const isCurrent = (pathname: string, itemHref: string) =>
  pathname === itemHref || (itemHref !== "/" && pathname.startsWith(itemHref));
