# Playbook: set up a new client site

**Use when:** turning a fresh copy of this template into a specific practitioner's site.
**Inputs:** a completed `docs/client-intake.md` (pasted, attached, or summarized by the user).

## Steps

1. **Confirm the repo is a client copy**, not the template itself (`git remote -v`). If it's the
   template, stop and ask. Client edits never go into the template.
2. **Fill `src/content/site/settings.yml`** from the intake.
   - Copy `professionalTitle`, `credentials`, and `licenses` **verbatim**. If anything is
     ambiguous (for example, an "LSSP" who also lists "psychologist"), leave `EXAMPLE` and add it to
     the open-questions list. Read `docs/compliance.md#titles` first.
   - Set `features.*` from the intake (schools / fees / faq / blog).
   - Set `booking` from the EHR answers. Use `mode: portal` whenever a portal URL exists.
3. **Write content** for `home/en.yml`, `pages/en/*.md`, `services/en/*.md`, `fees/en.md`,
   and `faq/en.yml`.
   - Voice: warm, plain language at an 8th-grade reading level for families, and concise and
     professional for district pages. Use second person ("your child"). No jargon without a
     one-line explanation (IEE, 504, MTSS).
   - Delete seed services that don't apply, and create new ones (slug = kebab-case title).
   - Don't invent facts (years of experience, degrees, outcomes). Missing → `EXAMPLE` + question.
4. **Theme** `src/styles/theme.css` from brand colors or adjectives. Check every text/background
   pair for ≥ 4.5:1 contrast (calculate it and write the ratios in the commit message). Self-host
   any font.
5. **Media:** put supplied images in `public/uploads/images/` (resize to ≤ 2000 px, WebP or JPEG)
   with alt text in content. Put PDFs in `public/uploads/documents/`.
6. **Run** `npm run launch-check` and `npm run verify`. Fix everything except `EXAMPLE` markers
   tied to open questions.
7. **Run** `docs/playbooks/compliance-review.md` over all content.
8. **Report back** to the user with:
   - the open-questions list (every remaining `EXAMPLE`, and why)
   - compliance-review findings
   - the next steps from `docs/deploy.md` (Cloudflare Pages, Pages CMS, domain)

## Don't

- Don't change template-layer files (see `AGENTS.md`) for one client. Propose a template change
  instead.
- Don't add analytics other than Cloudflare Web Analytics, or any form or embed.
