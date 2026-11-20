/**
 * Facts about the current build, read once at build time (the site is static).
 *
 * Cloudflare Pages sets `CF_PAGES_BRANCH` on every build. Only the production
 * branch is indexable. Preview and branch deploys get `noindex`. Builds outside
 * Cloudflare (local, CI) are treated as production so the HTML matches what
 * ships. `public/_headers` also sends `X-Robots-Tag: noindex` on *.pages.dev hosts.
 */
const branch = process.env.CF_PAGES_BRANCH;
const productionBranch = process.env.PRODUCTION_BRANCH || "main";

export const isIndexable = !branch || branch === productionBranch;
