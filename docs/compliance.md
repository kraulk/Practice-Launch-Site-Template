# Compliance, ethics, and trust

> This is practical guidance for building the template, **not legal advice**. Each client is
> responsible for confirming requirements with their state licensing board, their professional
> association, and, where warranted, an attorney. When in doubt, agents must ask rather than guess.

Visitors are parents worried about their kids and school administrators doing vendor due
diligence. Both groups judge credibility fast. Compliance here also builds trust.

## PHI

**The site never collects health information.** No forms, chat widgets, file uploads, or third-party scripts that could receive
protected health information (PHI) or student education records.

- Appointment requests use the client's **EHR client portal** (SimplePractice, TherapyNotes,
  etc.). The EHR vendor signs a Business Associate Agreement. Cloudflare and Pages CMS do not, and
  shouldn't need to.
- `booking.mode` can be `portal` (preferred), `email`, or `phone`. Email CTAs always show the
  `emailCaution` notice and phone CTAs the `phoneCaution` (voicemail) notice from `src/i18n/`.
  The header button has no room for a caution, so in email and phone modes it links to the
  Contact page instead of straight to `mailto:`/`tel:`. All of this lives in `src/lib/booking.ts`.
- District partners exchange referrals and records through the district's or EHR's secure channel,
  never through this site. The Schools page says so.
- `npm run launch-check` warns on any `<form>` or `<iframe>`. A newsletter signup (name + email
  only, with no clinical fields) is acceptable later, but needs an ADR in `docs/architecture.md`.

## Tracking

HHS OCR guidance on online tracking technologies treats tracking on health-provider websites as a
HIPAA risk. A 2024 federal court decision (_AHA v. Becerra_) vacated part of that guidance as
applied to unauthenticated pages. The template takes the conservative position regardless,
because it costs nothing:

- **Allowed:** Cloudflare Web Analytics (cookieless, no cross-site identifiers), enabled in the
  Cloudflare Pages dashboard. Cloudflare adds the beacon at deploy time, so nothing goes in the
  code. If a Content-Security-Policy header is ever added to `public/_headers`, it must allow
  `static.cloudflareinsights.com` (script) and `cloudflareinsights.com` (connect).
- **Not allowed:** Google Analytics / Tag Manager, Meta Pixel, LinkedIn Insight, TikTok, Hotjar,
  Microsoft Clarity, FullStory, or any ad or retargeting tag. `launch-check` fails on known ones.
- **Fonts are self-hosted.** No Google Fonts / Typekit requests, since they disclose visitor IPs to a
  third party.
- **Embeds:** prefer links. If a video is essential, use `youtube-nocookie.com` or self-host.
- No cookie banner is needed because the site sets no non-essential cookies. Keep it that way.

## Titles

This is the most common way a new practice website gets into trouble.

- **"Psychologist" is a protected title** in every US state, and so is "school psychologist" in
  many. A state department of education credential (e.g. a school psychologist certificate)
  typically authorizes practice **in schools only**. Private practice usually requires a separate
  license, which varies by state. Examples: Licensed Psychologist; LSSP in Texas (with practice
  limits); Licensed Educational Psychologist (LEP) in California; Licensed School Psychologist
  in some states.
- **NCSP is a national certification, not a license.** Show it as a credential, never as
  authorization to practice.
- `clinician.professionalTitle` must be the exact title the client's license permits. Agents
  must **never** infer, upgrade, or "normalize" a title or credential.
- List each license with state, type, and number (`licenses`). Many boards require license numbers
  in advertising. Show them in the footer or on the About page.
- **Telehealth:** list only states where the client is authorized (`telehealth.states`). Turn on
  `psypact` only for licensed psychologists who hold PSYPACT authority to practice
  interjurisdictional telepsychology (APIT). School psychologist credentials are not covered by
  PSYPACT.

## Advertising and claims

Under the NASP _Principles for Professional Ethics_ and the APA _Ethical Principles_ (Standard
5.01, avoidance of false or deceptive statements, and 5.05, testimonials):

- **No testimonials or reviews feature.** Soliciting testimonials from current clients, or from
  others vulnerable to undue influence, is prohibited. The template deliberately has no
  testimonial collection, and agents must not add one.
- **No outcome guarantees.** Avoid "guaranteed eligibility", "get your child an IEP", "cure", or
  "fix". Describe the process and deliverables instead.
- **No diagnostic claims beyond scope.** Whether a clinician can diagnose (e.g. ADHD, specific
  learning disorder) depends on their license. Mirror the client's own wording.
- **No client or student imagery.** Use licensed stock, the clinician's own photos, or illustration.
  Never use images of real clients or identifiable students.
- **Accurate comparisons.** Don't disparage schools or districts. Many clients also market to them.

## Required and recommended notices

| Notice                                 | Where                                         | Source of truth                         |
| -------------------------------------- | --------------------------------------------- | --------------------------------------- |
| Crisis notice (988 / 911)              | Footer, every page                            | `src/i18n/en.ts` → `crisis`             |
| Good Faith Estimate (No Surprises Act) | Fees page, and linked from footer and Contact | `src/i18n/en.ts` → `goodFaithEstimate`  |
| Email caution (no clinical info)       | Contact page, near any email CTA              | `src/i18n/en.ts` → `emailCaution`       |
| Voicemail caution (no clinical info)   | Next to any phone (`tel:`) booking CTA        | `src/i18n/en.ts` → `phoneCaution`       |
| License(s) and number(s)               | Footer and/or About                           | `settings.licenses`                     |
| Privacy policy                         | `/privacy/`                                   | `src/content/pages/en/privacy.md`       |
| Accessibility statement                | `/accessibility/`                             | `src/content/pages/en/accessibility.md` |

**Good Faith Estimate.** Health care providers, including psychologists, must give uninsured and
self-pay clients a Good Faith Estimate and post notice of that right on their website
(45 CFR 149.610). The template uses the CMS model notice wording. Re-check it against
<https://www.cms.gov/nosurprises> when updating the template. The notice is template copy, not CMS
content, so a client can't delete it by accident.

The notice is **always reachable**, whether or not the client publishes prices. With
`features.fees` on, it's part of `/fees/`. With it off, `/good-faith-estimate/` renders the same
notice. The footer links to whichever exists (`goodFaithEstimateHref()` in `src/lib/routes.ts`).
There's intentionally no switch to hide it: a consultant who only contracts with districts loses
nothing by showing it, while an individual practice that hides it is out of compliance.

The HIPAA **Notice of Privacy Practices** is the client's own document. It's usually delivered
through the EHR. It can be linked as a PDF download, but the site doesn't generate it.

## Accessibility (WCAG 2.2 AA)

- Target **WCAG 2.2 AA** on every page. Visitors include parents with disabilities and children
  with the very conditions being evaluated.
- District buyers increasingly require it. The DOJ's 2024 ADA Title II rule sets WCAG 2.1 AA as the
  standard for state and local government web content, school districts included, and districts
  pass that expectation on to vendors. Private practices are covered by ADA Title III.
- Practical rules: semantic landmarks, one `<h1>`, a logical heading order, a skip link, visible
  focus, AA contrast (enforced by token rules in `theme.css`), alt text (schema-enforced), link text
  that makes sense out of context, honoring `prefers-reduced-motion`, 44×44 px minimum touch targets,
  and no information conveyed by color alone.
- PDFs uploaded for download (capability statements, CVs) should be tagged/accessible. Mention
  this in the client handoff.

## FERPA and district work

The site never receives education records. Consulting pages should describe how records are
exchanged (district secure file transfer, EHR portal) without inviting anyone to send them via the
site or email.

## Agent checklist

Before finishing any copy or page change, run `docs/playbooks/compliance-review.md`.
