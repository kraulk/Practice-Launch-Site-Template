# Playbook: sync template updates into a client repo

**Use when:** the template has improved (bug fixes, new components, accessibility fixes) and a
client site should get them.

Because client repos only change the **client layer** (`src/content/`, `public/uploads/`,
`src/styles/theme.css`, `public/_redirects`), template changes should merge cleanly.

## One-time setup (in the client repo)

```bash
git remote add template https://github.com/<owner>/Practice-Launch-Site-Template.git
```

## Each sync

```bash
git fetch template
git checkout -b sync-template
git merge template/main --allow-unrelated-histories   # first sync only needs the flag
```

1. **Conflicts in client-layer files:** keep the client's version (`git checkout --ours <file>`),
   unless the conflict is in seed content the client never edited.
2. **Conflicts in template-layer files:** take the template's version. If the client repo had a
   local change there, it should become a template feature instead. Raise it with the user.
3. Apply any **Migrations** listed below for the template versions you're crossing.
4. `npm install && npm run verify && npm run launch-check`
5. Open a PR in the client repo and check the Cloudflare preview deployment before merging.

## Migrations

Record content-shape changes here, newest first, so client repos can update their content.

_None yet._
