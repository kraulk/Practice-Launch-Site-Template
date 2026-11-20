// @ts-check
import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

/**
 * The production URL is client content, so it lives in the CMS-editable
 * settings file rather than here. We read the single top-level `url:` line
 * instead of pulling in a YAML parser. SITE_URL overrides it (e.g. staging).
 */
function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  const settings = readFileSync(new URL("./src/content/site/settings.yml", import.meta.url), "utf8");
  const match = settings.match(/^url:\s*["']?([^"'\s#]+)/m);
  return match?.[1] ?? "http://localhost:4321";
}

export default defineConfig({
  site: siteUrl(),
  // Fully static output: Cloudflare Pages serves `dist/` with no adapter.
  output: "static",
  trailingSlash: "always",
  i18n: {
    // English ships by default. To add a language, follow docs/playbooks/add-locale.md.
    defaultLocale: "en",
    locales: ["en"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
