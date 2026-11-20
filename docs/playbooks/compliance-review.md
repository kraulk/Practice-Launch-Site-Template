# Playbook: compliance and quality review

**Use when:** before shipping any new or changed copy, page, or component, and always before a
client launch. Background and reasoning: `docs/compliance.md`.

Report findings as a list: **file:line, issue, suggested fix**, grouped as _Must fix_ /
_Should fix_ / _Ask the client_. Don't silently rewrite clinical or credential claims. Flag them.

## Checklist

### Privacy

- [ ] No `<form>`, chat widget, upload, or embed that could collect health or student information
- [ ] Email/phone CTAs show the email caution, and nothing invites sending records or details by email
- [ ] No tracking scripts or third-party font/CDN requests (`npm run launch-check`)

### Credentials and claims

- [ ] Title, credentials, and licenses match the intake **exactly**. Nothing inferred or upgraded.
- [ ] NCSP (if present) is shown as a certification, not a license
- [ ] Telehealth states listed only where the client is authorized. PSYPACT only for licensed psychologists with APIT.
- [ ] No outcome guarantees ("guarantee", "ensure eligibility", "cure", "fix")
- [ ] No diagnostic claims beyond the client's stated scope
- [ ] No testimonials, reviews, or star ratings
- [ ] No images of clients or identifiable students

### Required notices

- [ ] Crisis notice in footer
- [ ] Good Faith Estimate on `/fees/` (if fees enabled) and linked from footer/contact
- [ ] License state, type, and number visible
- [ ] Privacy and accessibility pages are reviewed by the client, with no `EXAMPLE` left

### Accessibility

- [ ] One `<h1>` per page, and no skipped heading levels
- [ ] Every image has meaningful alt text (or `alt=""` if purely decorative, in template code only)
- [ ] Link text makes sense on its own (no bare "click here" / "read more" without context)
- [ ] Theme contrast ≥ 4.5:1 for text and ≥ 3:1 for UI boundaries and focus rings
- [ ] Keyboard: everything reachable, visible focus, and the menu closes with Escape

### Clarity

- [ ] Family-facing copy is plain language. Acronyms (IEE, IEP, 504, MTSS) are expanded on first use.
- [ ] District copy states scope, turnaround, and how records are exchanged securely
- [ ] Each page has one clear next step (the booking CTA)
