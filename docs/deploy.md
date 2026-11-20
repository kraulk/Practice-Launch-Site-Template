# Deploying a client site

Every client site is its own GitHub repo, one Cloudflare Pages project, and one Pages CMS
connection. There's no server.

```
Client edits in Pages CMS ──commit──▶ GitHub repo (main) ──webhook──▶ Cloudflare Pages build ──▶ live site
You / an agent edit files ──push────┘
```

## 0. Ownership: set it up so the client can leave with everything

Create the GitHub repo, Cloudflare account, and domain registration **in the client's name** (or
transfer them at handoff), and add yourself as a collaborator or member. Pages CMS access,
analytics data, and the domain then stay with the practice if you stop working together.

## 1. Create the client repo

1. On GitHub, mark this repo as a **Template repository** (Settings → General), one time only.
2. **Use this template → Create a new repository.** Name it e.g. `brightpath-site`. Private is fine.
3. Add the template as a remote so updates can be pulled later. See `docs/playbooks/sync-template.md`.

## 2. Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → **Connect to Git** → pick the repo.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version comes from `.node-version` (22). Set `NODE_VERSION` only to override it.
3. Production branch: `main`. Preview deployments for other branches are fine. Builds of any other
   branch get a `noindex` robots meta (`src/lib/build-env.ts`, from Cloudflare's `CF_PAGES_BRANCH`).
   If the production branch isn't `main`, set the `PRODUCTION_BRANCH` environment variable to its
   name. `public/_headers` also sends `X-Robots-Tag: noindex` on every `*.pages.dev` host, so only
   the custom domain is indexed.
4. Custom domain: Pages project → Custom domains → add the apex and `www`. Redirect one to the
   other in `public/_redirects`.
5. Optional analytics: Pages project → **Metrics** → **Web Analytics** → **Enable**. Cloudflare
   adds its cookieless beacon on the next deploy. There's no token or code change, and the client
   can turn it on or off themselves. Don't add any other analytics (`docs/compliance.md#tracking`).

Security and caching headers ship in `public/_headers`.

> Cloudflare also offers static sites on **Workers** with static assets. If you move there,
> `_headers` and `_redirects` keep working. Record the change as an ADR.

## 3. Pages CMS

1. Go to <https://app.pagescms.org>, sign in with GitHub, and install the Pages CMS GitHub App on
   the client repo only.
2. Open the repo and branch `main`. The editor reads `.pages.yml` automatically.
3. Invite the client: give their GitHub account write access to the repo, or use Pages CMS
   collaborator invites (email login) if the client has no GitHub account.
4. Make a test edit. It should appear as a commit on `main` and trigger a Cloudflare build within
   about a minute.

## 4. Before going live

- [ ] `npm run launch-check` passes (no `EXAMPLE`, no `example.com`, no trackers)
- [ ] `npm run verify` passes
- [ ] `docs/playbooks/compliance-review.md` completed with the client
- [ ] `settings.url` matches the custom domain
- [ ] Booking link opens the real EHR portal
- [ ] Good Faith Estimate notice visible on `/fees/` (if fees are enabled)
- [ ] Test on a phone, with keyboard only, and with a screen reader (VoiceOver/NVDA) on home + contact
