import { en, type UiStrings } from "./en";

export type { UiStrings };

/** Add a locale here (and in astro.config.mjs) when following docs/playbooks/add-locale.md. */
export const ui: Record<string, UiStrings> = { en };

export type Locale = keyof typeof ui;
export const defaultLocale: Locale = "en";

export function t(locale: string | undefined): UiStrings {
  return ui[locale ?? defaultLocale] ?? ui[defaultLocale];
}
