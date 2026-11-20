# Client intake questionnaire

Send this to a new client before building their site. Each answer maps to a content field, shown
in brackets, so an agent can fill `src/content/` directly from the completed form
(`docs/playbooks/new-client.md`).

## Practice basics

1. Practice name, exactly as registered. [`settings.practiceName`]
2. A one-line description of what you do and for whom. [`settings.tagline`]
3. Domain name, if you have one. [`settings.url`]

## You and your credentials

4. Your full name as you want it displayed, and pronouns (optional). [`clinician.name`, `pronouns`]
5. **Your exact professional title as your license or credential allows** (e.g. "Licensed
   Psychologist", "Licensed Specialist in School Psychology", "Licensed Educational
   Psychologist"). [`clinician.professionalTitle`]
6. Credentials after your name (e.g. PhD, EdS, NCSP). [`clinician.credentials`]
7. Every license you hold: state, type, and number. Which ones authorize private practice?
   [`licenses`]
8. Do you hold PSYPACT authority to practice interjurisdictional telepsychology (APIT)? [`telehealth.psypact`]
9. A professional headshot (at least 1200 px on the long edge) and a short bio, or bullet points
   we can draft from. [`clinician.headshot`, `pages/about.md`]

## Who you serve and how

10. Do you serve **families**, **schools/districts**, or both? [`features.schools`, `services[].audience`]
11. List each service: name, a one- or two-sentence summary, typical length, and in person,
    telehealth, hybrid, or on site at school. [`services/*`]
12. Ages or grades you serve, and referral questions you specialize in (e.g. learning
    disabilities, ADHD, autism, giftedness, IEEs).
13. Where you see clients in person (cities/counties), and which states you can serve by
    telehealth. [`serviceArea`, `telehealth.states`]
14. For districts: typical scope, turnaround times, and whether you can provide a W-9, certificate
    of insurance, or capability statement (PDF). [`pages/schools.md`, `downloads`]

## Booking and contact

15. Which EHR / practice-management system do you use (SimplePractice, TherapyNotes, Jane,
    etc.)? Send the link to your client portal or appointment-request page. [`booking`]
16. Public phone, public email, and hours. [`contact`]
17. Should your office address be shown? (Many home-based or telehealth-first practices say
    no.) [`contact.showAddress`]

## Fees

18. Fees for each service, or "starting at" ranges. Free consultation? [`fees.items`]
19. Insurance: in-network (which plans), out-of-network with superbills, or private pay only?
    [`fees.insurance`]
20. Payment methods, sliding scale or payment plans, and your cancellation policy.
    [`fees.paymentMethods`, `cancellationPolicy`]

## Look and feel

21. Logo (SVG preferred) and any brand colors. If you have none, which of these words fit:
    calm, warm, professional, playful, modern? [`src/styles/theme.css`]
22. Two or three websites you like the look of, and why.
23. Photos you own or have licensed. (Please no photos of clients or identifiable students.)

## Extras

24. Should we include an FAQ? List the questions families or schools ask you most. [`faq`]
25. Do you plan to write articles or resources for parents? [`features.blog`]
26. Professional profiles to link (LinkedIn, Psychology Today, state association). [`social`]
27. Do you need a Spanish (or other language) version now or later?
