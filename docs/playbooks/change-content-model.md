# Playbook: change the content model

**Use when:** adding, renaming, removing, or retyping any content field or collection. This is a
**template-layer** change.

The schema lives in three places that must agree:

| File                    | Role                                                                      |
| ----------------------- | ------------------------------------------------------------------------- |
| `src/content.config.ts` | Build-time schema (Zod). Source of truth.                                 |
| `.pages.yml`            | Pages CMS editor: same field names and nesting, plus labels and help text |
| `docs/content-model.md` | Human documentation                                                       |

## Steps

1. **Schema:** edit `src/content.config.ts`. Non-required fields use `optional()`, `list()`, or
   `flag(default)`. Images use the `image` / `optionalImage` shape `{src, alt}`. Use Zod 4 syntax
   (`z.email()`, `z.url()`, `{ error: "…" }`).
2. **CMS:** mirror the change in `.pages.yml`, keeping the same `name`s, nesting, and `list`-ness.
   Map types this way:

   | Zod                       | Pages CMS                                |
   | ------------------------- | ---------------------------------------- |
   | `z.string()` (short)      | `type: string`                           |
   | `z.string()` (multi-line) | `type: text`                             |
   | Markdown body             | `name: body` + `component: body`         |
   | `z.enum([...])`           | `type: select`, `options.values`         |
   | `list(z.enum([...]))`     | `type: select`, `options.multiple: true` |
   | `flag(x)`                 | `type: boolean`, `default: x`            |
   | `z.number()`              | `type: number`                           |
   | `z.coerce.date()`         | `type: date`                             |
   | `list(z.string())`        | `type: string`, `list: true`             |
   | `z.object({...})`         | `type: object`, `fields:`                |
   | `list(z.object(...))`     | `type: object`, `list: true`, `fields:`  |
   | image `{src, alt}`        | `component: image`                       |
   | PDF path                  | `type: file`, `options.media: documents` |

   Write a `label` in plain language and a `description` wherever a client might hesitate.

3. **Seed content:** update every affected file in `src/content/` (all locales) so the build passes.
   New placeholder text starts with `EXAMPLE`.
4. **Consumers:** update `src/lib/content.ts`, views, and components that read the field.
5. **Docs:** update `docs/content-model.md`.
6. **Verify:** `npm run verify`. If the field is a rename or removal, note in the commit message
   that client repos need a content migration when they sync, and describe it in
   `docs/playbooks/sync-template.md` under "Migrations".
