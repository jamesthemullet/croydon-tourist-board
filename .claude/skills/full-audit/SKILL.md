---
name: full-audit
description: Run a full audit of the Croydon Tourist Board site (Astro static site on Vercel) covering test coverage (unit + e2e gaps), accessibility, performance, SEO, responsive/UX, security, content/roadmap alignment, and code quality (strict typing, duplication, bad patterns, dead code). Appends new findings to a persistent AUDIT.md checklist in the repo (existing checked-off items are preserved). Use when the user asks to audit, review the health of, or find improvements for the whole site — not for reviewing a single PR/diff (use /code-review for that).
---

# Full site audit

Produces a holistic health report for the Croydon Tourist Board site: a single Astro (v7,
TypeScript "strict" tsconfig) static site deployed to Vercel (`@astrojs/vercel` adapter,
`site: https://croydontouristboard.co.uk`, sitemap via `@astrojs/sitemap`, Vercel Web Analytics
enabled). There is no backend — every page is static/server-rendered content, no auth, no
database, no API routes as of this writing (re-verify, don't assume). This is NOT a PR/diff
review — lint (`biome check`) and type-check (`astro check`) are already enforced as quality
gates, so **do not re-check whether the app lints/type-checks/builds — that's not this skill's
job**. This audit looks at things no single PR's gates catch: test coverage gaps, cross-cutting
site quality (a11y, perf, SEO, security, UX), content accuracy, and code quality that a passing
type-check doesn't guarantee (e.g. `any` and unsafe casts still compile cleanly — see category 8).

## When to run this

User asks to "audit the site", "find ways to improve the website", "do a full review of the
app", or similar whole-site requests. If they ask about a single PR or the current diff, use
`/code-review` instead.

## Output

Findings live in a single persistent file at the repo root: **`AUDIT.md`**. This is not a
one-off report — it's a living checklist that accumulates across runs. Each run **appends**,
never replaces:

- `AUDIT.md` has one `## <n>. <Category>` section per category below, in the same order, each
  containing a flat markdown checklist (`- [ ] finding text (found: YYYY-MM-DD)`).
- **Before writing anything**, read the current `AUDIT.md` in full (create it from the template
  below if it doesn't exist yet).
- For each category, compare this run's findings against what's already listed in that section:
  - If a finding already exists (same issue, same file/route — wording may differ slightly),
    **do not duplicate it**. Leave the existing line untouched.
  - If an existing unchecked item no longer reproduces (verify, don't assume — re-check it),
    check it off and add `(resolved: YYYY-MM-DD, verified during audit)` rather than deleting
    the line, so there's a record.
  - **Never touch a line that's already checked off (`- [x]`)** — those are the user's own
    record of completed work. Leave them exactly as-is, in place.
  - Genuinely new findings get appended to the bottom of that section's list as new `- [ ]`
    items, dated.
- Add a line to the `## Run log` section at the top with today's date and a one-line summary
  (e.g. "2026-08-30 — 4 new findings (2 a11y, 1 SEO, 1 code quality), 1 item resolved").
- Do not renumber, reorder, or rewrite prose outside the checklists — this file is meant to be
  readable as a diff over time.

Do not modify application code during the audit unless the user explicitly asks you to fix
something after seeing the report — this skill is read-only/diagnostic aside from editing
`AUDIT.md` itself.

### AUDIT.md template (use this structure if the file doesn't exist yet)

```markdown
# Site Audit

Living checklist maintained by the `/full-audit` skill. Findings are appended, never rewritten;
check an item off (`- [x]`) once you've fixed it and it won't be touched again. Re-running the
audit adds new findings to the bottom of each section and leaves checked items alone.

## Run log

- YYYY-MM-DD — initial audit

## 1. Test coverage — unit gaps and e2e

## 2. Accessibility

## 3. Performance

## 4. SEO / metadata

## 5. Responsive / UX

## 6. Security

## 7. Content & roadmap alignment

## 8. Code quality
```

## How to run it

Fan out the categories below as parallel forks or a general-purpose subagent per category (they
are independent and read-heavy — keep the raw output out of your main context). Have each one
**report findings back as text**, not write to `AUDIT.md` directly — only you should touch that
file, in a single merge pass at the end, so the dedup/checked-item rules above are applied
consistently in one place. Categories needing the browser (a11y/perf/responsive/link-walkthrough)
should run together in one browser-driving pass since they all need the app running.

Before starting, check whether a dev server is already running; if not, start it yourself
(`yarn dev`, Astro's default port 4321) for the duration of the audit, and stop it when done
unless the user is already running it. Since this is a static site with no backend, one dev
server is all that's needed — there's no second service to bring up.

### 1. Test coverage — unit gaps and e2e

- Run `yarn test` (Vitest, via `vitest.config.ts`'s `getViteConfig`). As of this writing there
  are **no test files anywhere in `src/`** — re-verify, don't assume, but if that's still true,
  treat "zero unit test coverage" itself as the headline finding rather than listing files
  individually.
- **E2e coverage**: there is no e2e framework present (no Playwright/Cypress — re-verify, don't
  assume). Treat "no e2e tooling" itself as a finding, then assess actual coverage of key flows
  by walking them in the browser via `claude-in-chrome` as a manual substitute:
  - Home page loads and renders all attraction cards from the `attractions` array in
    `src/pages/index.astro`
  - Each internal attraction route (`/attractions/boxpark`, `/attractions/chicken-mile`,
    `/attractions/fairfield-halls`, `/attractions/the-mall`, `/attractions/tombstone`) resolves
    and renders without error
  - The external attraction link (`https://croydon-chicken-mile.vercel.app`, marked
    `external: true` in `index.astro`) actually opens and doesn't 404
  - Sitemap (`/sitemap-index.xml`, `/sitemap-0.xml`) generates and lists all live routes
  For each flow, report whether it currently has automated coverage, and recommend Playwright
  as the addition if e2e coverage is deemed worthwhile for a site this size (weigh this against
  the "Notes" section below — a 6-page static site may not warrant a full e2e suite; say so if
  that's the honest assessment rather than recommending it reflexively).

### 2. Accessibility

- Automated pass per route (axe via browser console injection, or Lighthouse a11y score through
  `claude-in-chrome`)
- Manual: color contrast (note the site's custom palette in `src/layouts/Layout.astro` — red,
  yellow, orange, cream, dark, brown — check contrast ratios for text-on-background pairs),
  focus order/visible focus states, alt text on all images, semantic landmark usage (`<nav>`,
  `<main>`, `<footer>`), heading hierarchy per page (`h1`/`h2`/`h3` usage, note headings use the
  decorative "Bangers" display font — check they remain legible)

### 3. Performance

- Lighthouse performance score and Core Web Vitals (LCP, CLS, INP) per route
- Astro build output (`yarn build` → `dist/`): bundle size, unused JS/CSS, render-blocking
  resources — especially the Google Fonts `<link>` tags loaded in `Layout.astro` (check
  `font-display`, whether self-hosting would help), image weight (check `public/` and any
  images referenced per attraction page), whether `modulePreload: { polyfill: false }` in
  `astro.config.mjs` is actually appropriate for the target browser support
- Since this is a static/SSG site with no backend, there's no server response-time check to do —
  skip that entirely rather than inventing one

### 4. SEO / metadata

- `Layout.astro`'s title/description props: confirm every page passes a distinct, accurate
  `title` and `description` rather than falling back to the shared default meant for the home
  page
- Open Graph and Twitter card tags (already present in `Layout.astro` — verify they render
  correctly per page, not just on the home page)
- `sitemap-index.xml` presence and correctness (via `@astrojs/sitemap`), `robots.txt` presence
  in `public/` (currently only `favicon.svg` exists there — re-verify, don't assume)
- Semantic heading structure per route, canonical URL correctness (`Astro.url.pathname` based —
  verify no duplicate-content routes)

### 5. Responsive / UX

- Screenshot each route (home + all 5 attraction pages) at ~375px and ~1280px via
  `claude-in-chrome` — look for layout breakage, especially around the attraction card grid and
  the display-font headings at small widths
- Console errors on load/navigation (`read_console_messages`), broken links (internal routes and
  the one external attraction link), dead-end states (e.g. a 404 page — check one exists and is
  styled, not the default Astro/Vercel one)

### 6. Security

- Dependency vulnerabilities: `yarn audit` against `yarn.lock`
- External links: any `target="_blank"` (e.g. the external chicken-mile link) should carry
  `rel="noopener noreferrer"` — check for reverse-tabnabbing exposure
- Response headers set at the Vercel edge (CSP, HSTS, X-Content-Type-Options, Referrer-Policy) —
  check for a `vercel.json` defining these; note if none exists and Vercel's defaults are being
  relied on entirely
- No secrets should be needed for this static site (no `.env` committed — `.gitignore` already
  excludes `.env`/`.env.production`), but check for accidental inline API keys or analytics IDs
  that shouldn't be public in `astro.config.mjs` or page source
- (No auth, sessions, CORS, or database in this app — skip those checks entirely; they don't
  apply here)

### 7. Content & roadmap alignment

There's no `ROADMAP.md` in this repo. Instead, treat the `README.md` and the site's own copy as
the source of truth and check for drift:
- Does every attraction described in `README.md` ("the world's largest tombstone, a decaying
  shopping mall, the Chicken Mile") actually have a live, working page or link?
- Do any pages contain placeholder/lorem-ipsum text, TODO/FIXME comments, or obviously
  unfinished sections that read as shipped but aren't?
- Cross-check the `attractions` array in `src/pages/index.astro` against the actual files in
  `src/pages/attractions/` — anything listed that doesn't resolve, or anything present that
  isn't linked from the home page?

### 8. Code quality

A passing lint/type-check/build only proves the code compiles cleanly, not that it's precisely
typed, non-duplicated, or free of dead weight — that's what this category covers.

- **Strict typing** — the project already runs `astro/tsconfigs/strict` with `strict: true` and
  `noImplicitAny: true`, so look for what still slips through: explicit `any`, unsafe `as Type`
  casts, missing or loose `Props` interfaces in `.astro` frontmatter (e.g. `Layout.astro`'s
  `interface Props`), non-null assertions (`!`) that could be replaced with a proper guard.
- **Code duplication** — repeated markup/styling between `src/pages/index.astro` and the
  individual `src/pages/attractions/*.astro` pages (e.g. card layout, nav/footer markup if not
  fully centralized in `Layout.astro`), repeated color literals that should reference the CSS
  custom properties already defined in `Layout.astro`'s `:root` block instead of being re-typed
  as hex codes, values inlined 3+ times that should be a named constant.
- **Bad patterns** — inline `<style>` blocks duplicated per page instead of shared/global styles,
  magic strings for routes/URLs (e.g. the external chicken-mile URL hardcoded in `index.astro`),
  hardcoded copy that should live in a shared data file if it's referenced in more than one
  place, non-semantic HTML where a semantic element exists.
- **Dead code** — exported symbols/components not imported anywhere in the project, commented-
  out code blocks left in files, unused CSS selectors in global styles.

## Notes

- This is a personal/small project (a 6-page static content site) — keep findings proportionate.
  Don't recommend enterprise-scale tooling (e.g. a full CI a11y pipeline, a large e2e suite) as
  a "blocker"; note it as a "nice to have" instead unless it's actually broken for a real user.
- Cite every finding with a route, file:line, or screenshot — no vague "could be improved"
  entries.
- **Every checklist item must be independently reviewable as one small PR**. If a finding is
  actually a bundle of unrelated or large changes (e.g. "add Playwright e2e coverage", "improve
  accessibility across the site", "fix all the color contrast issues"), split it into several
  separate `- [ ]` lines, each scoped to a single reviewable change (e.g. one line per page's
  a11y fix, one line per broken link, one line per SEO metadata gap). Never write a checklist
  item a reviewer couldn't approve or reject on its own without also weighing in on unrelated
  changes bundled into it.
