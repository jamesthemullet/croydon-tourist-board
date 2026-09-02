# Site Audit

Living checklist maintained by the `/full-audit` skill. Findings are appended, never rewritten;
check an item off (`- [x]`) once you've fixed it and it won't be touched again. Re-running the
audit adds new findings to the bottom of each section and leaves checked items alone.

## Run log

- 2026-09-02 — initial audit: 16 findings (2 test coverage, 6 a11y, 1 perf, 2 SEO, 1 UX, 3 security, 1 content, 4 code quality — some categories overlap in cause, e.g. duplicated CSS underlies several)
- 2026-09-02 — resolved: "Zero unit test files anywhere in `src/`" (test coverage #1) — added `test/attractions.test.ts`, a Vitest test verifying the homepage's `attractions` array data and cross-checking internal hrefs against files in `src/pages/attractions/`.
- 2026-09-02 — resolved: "No e2e framework present" (test coverage #2) — added `test/build-smoke.test.ts`, a Vitest smoke test that runs `yarn build` and asserts the homepage, sitemap, and every attraction route are present in `dist/`.

## 1. Test coverage — unit gaps and e2e

- [x] Zero unit test files anywhere in `src/` — `yarn test` fails immediately with "No test files found, exiting with code 1". Vitest is configured (`vitest.config.ts`) but nothing exercises it. (found: 2026-09-02) (resolved: 2026-09-02, PR #3)
- [x] No e2e framework present (no Playwright/Cypress in `package.json`). Manually walked the golden path via browser: home page renders all 5 attraction cards, all 5 internal attraction routes (`/attractions/boxpark`, `/attractions/chicken-mile`, `/attractions/fairfield-halls`, `/attractions/the-mall`, `/attractions/tombstone`) resolve without console errors, the external Chicken Mile link redirects correctly to `https://croydonchickenmile.co.uk`, and `yarn build` generates `dist/sitemap-index.xml` + `dist/sitemap-0.xml` listing all 6 live routes — none of this has automated coverage. Given this is a 6-page static site with essentially no client-side JS, a full Playwright suite is disproportionate; a lightweight CI smoke test (`astro build` + assert expected files exist in `dist/`, or a Vitest test asserting the `attractions` array in `index.astro` matches the files under `src/pages/attractions/`) would be a proportionate nice-to-have rather than a blocker. (found: 2026-09-02) (resolved: 2026-09-02, PR #TBD)

## 2. Accessibility

- [ ] `.back` link color-contrast fails WCAG AA — `src/pages/attractions/boxpark.astro:26-30` (`color: var(--red)` `#E8210A` on `--cream` `#FFF8EE`, axe-core `color-contrast`, impact: serious, measured ≈4.28-4.6:1 against the 4.5:1 required for 16px bold text). `--red-dark` (`#B01808`) is already defined in `Layout.astro:54` and would likely pass. (found: 2026-09-02)
- [ ] Same `.back` link contrast issue — `src/pages/attractions/chicken-mile.astro:32-36`. (found: 2026-09-02)
- [ ] Same `.back` link contrast issue — `src/pages/attractions/fairfield-halls.astro:26-30`. (found: 2026-09-02)
- [ ] Same `.back` link contrast issue — `src/pages/attractions/the-mall.astro:27-31`. (found: 2026-09-02)
- [ ] Same `.back` link contrast issue — `src/pages/attractions/tombstone.astro:26-30` (identical CSS pattern to the other four; one axe run reported no violation here but coincided with a browser session interruption during testing, so treat as unverified rather than a genuine pass). (found: 2026-09-02)
- [ ] All 5 attraction pages render with no `<nav>` or `<footer>` landmark — `<nav>`/`<footer>` are defined inline only in `src/pages/index.astro:39-43,77-85` rather than in the shared `Layout.astro`, so subpages have no persistent site chrome, no footer landmark/legal text, and the only way back to the homepage is a single "Back" text link. (found: 2026-09-02)

## 3. Performance

- [ ] Google Fonts (`Bangers`, `Nunito`) loaded via a synchronous `<link rel="stylesheet">` in `src/layouts/Layout.astro:37`, blocking render until the external stylesheet loads. Preconnect hints and `display=swap` are already in place, which mitigates most of the impact. Self-hosting the two font files would remove the external round-trip entirely — worth doing as a nice-to-have given there are only two families, not urgent for a site this size. (found: 2026-09-02)

## 4. SEO / metadata

- [ ] `public/robots.txt` does not exist — confirmed 404 in dev (`/robots.txt`) and absent from `yarn build` output (`dist/`). (found: 2026-09-02)
- [ ] No `og:image`/`twitter:image` tags in `src/layouts/Layout.astro:24-32` — `twitter:card` is set to `summary_large_image` (line 30), which expects an image; without one, links shared on social platforms render as text-only cards rather than the large-image format the card type implies. (found: 2026-09-02)

## 5. Responsive / UX

- [ ] No custom 404 page exists (no `src/pages/404.astro`; `find dist -iname "404*"` returns nothing after `yarn build`) — visiting an unknown route falls back to Astro's default unstyled dev 404 page, and in production would fall back to Vercel's generic 404 rather than a page styled to match the site's red/yellow/cream identity. (found: 2026-09-02)

## 6. Security

- [ ] External Chicken Mile link uses `rel="noopener"` without `noreferrer` — `src/pages/index.astro:65`. (found: 2026-09-02)
- [ ] Same `rel="noopener"` without `noreferrer` — `src/pages/attractions/chicken-mile.astro:19`. (found: 2026-09-02)
- [ ] No `vercel.json` defining security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy) — the site relies entirely on Vercel's platform defaults. No inline secrets/API keys found in `astro.config.mjs` or page source, `.env`/`.env.production` are correctly gitignored, and `yarn audit` reports 0 vulnerabilities across 502 packages — no findings on those fronts. (found: 2026-09-02)

## 7. Content & roadmap alignment

- [ ] `src/pages/attractions/chicken-mile.astro` is orphaned — the homepage's Chicken Mile card (`src/pages/index.astro:6-11`) sets `external: true` and links directly to `https://croydon-chicken-mile.vercel.app`, bypassing the site's own `/attractions/chicken-mile` page entirely. That internal page is fully written (with its own CTA out to the external site) but has zero internal links pointing to it — reachable only by guessing the URL. Fix: either point the homepage card at `/attractions/chicken-mile` (which itself links out) for consistency with the other 4 attractions, or delete the orphaned file if the external site is meant to fully replace it. (found: 2026-09-02)

No other findings this run — every other attraction described in `README.md` has a live page linked from the home page, and no placeholder/lorem-ipsum/TODO/FIXME text was found anywhere in `src/`.

## 8. Code quality

- [ ] All 5 attraction pages (`src/pages/attractions/boxpark.astro`, `chicken-mile.astro`, `fairfield-halls.astro`, `the-mall.astro`, `tombstone.astro`) duplicate an identical ~25-line `<style>` block (`.container`, `.back`, `h1`, `.lede`, `p`) instead of sharing it via a global stylesheet or a shared sub-layout. (found: 2026-09-02)
- [ ] `<nav>`/`<footer>` are defined only inline in `src/pages/index.astro:39-43,77-85` rather than centralized in `src/layouts/Layout.astro`, so they can't be reused by the attraction pages (see also finding under Accessibility, category 2). (found: 2026-09-02)
- [ ] External Chicken Mile URL (`https://croydon-chicken-mile.vercel.app`) is hardcoded as a magic string in two places — `src/pages/index.astro:8` and `src/pages/attractions/chicken-mile.astro:19` — rather than a single shared constant. (found: 2026-09-02)
- [ ] The `attractions` array in `src/pages/index.astro:4-36` has no explicit TypeScript interface — relies on inferred literal types rather than e.g. `interface Attraction { name: string; blurb: string; href: string; external?: boolean; tag: string }`, which would self-document the shape and catch typos in future entries. (found: 2026-09-02)
