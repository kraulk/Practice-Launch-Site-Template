# Practice Launch Site Template

An [Astro](https://astro.build) website template for **school psychologists launching a private
practice or consulting business**. It covers family-facing evaluation practices, consulting for
schools and districts, and telehealth.

- **Low maintenance:** a static site on Cloudflare Pages with no server, database, or plugins
- **Client-editable:** [Pages CMS](https://pagescms.org) edits content in the repo, and every change is a git commit
- **Privacy-first:** no forms that could collect health info, appointment requests link out to the
  client's EHR portal, and no third-party trackers
- **Accessible:** built to WCAG 2.2 AA
- **Agent-ready:** `AGENTS.md` plus playbooks, so Claude Code, Codex, Cursor, and others build it the same way

> **Status:** Phase 1 (foundation: layout, header, footer, booking CTA, SEO). Pages come in
> Phase 2. The build plan is in [`docs/roadmap.md`](docs/roadmap.md).

## Quick start

```bash
npm install
npm run dev
```

## Starting a new client site

1. Send the client [`docs/client-intake.md`](docs/client-intake.md).
2. Create their repo from this template (**Use this template** on GitHub).
3. Give the completed intake to your agent and ask it to "set up this client site". It follows
   [`docs/playbooks/new-client.md`](docs/playbooks/new-client.md).
4. Deploy with [`docs/deploy.md`](docs/deploy.md) (Cloudflare Pages + Pages CMS).
5. `npm run launch-check` must pass before go-live.

## Documentation

| Doc                                              | What's in it                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| [`AGENTS.md`](AGENTS.md)                         | Rules for AI agents (and a good overview for humans)               |
| [`docs/roadmap.md`](docs/roadmap.md)             | Build phases and acceptance criteria                               |
| [`docs/architecture.md`](docs/architecture.md)   | Decisions and why                                                  |
| [`docs/content-model.md`](docs/content-model.md) | Every content field and its CMS mapping                            |
| [`docs/compliance.md`](docs/compliance.md)       | PHI, tracking, title laws, ethics, required notices, accessibility |
| [`docs/deploy.md`](docs/deploy.md)               | Cloudflare Pages, Pages CMS, domains, launch checklist             |
| [`docs/playbooks/`](docs/playbooks)              | Step-by-step procedures for recurring jobs                         |

## Where to edit

| You want to change…                              | Edit                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| Practice info, booking link, which sections show | `src/content/site/settings.yml` (or Pages CMS → Practice settings) |
| Page copy, services, fees, FAQ, articles         | `src/content/**` (or Pages CMS)                                    |
| Brand colors and fonts                           | `src/styles/theme.css`                                             |
| Anything else                                    | Template code. See the layer map in `AGENTS.md`                    |
