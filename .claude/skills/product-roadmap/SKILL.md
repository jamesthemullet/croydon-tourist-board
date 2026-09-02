---
name: product-roadmap
description: Build or refresh a product roadmap for Croydon Tourist Board — new features, pages, and content, PLUS making existing content easier to find, SEO, and improvements to features/pages that already exist — grounded in what the app already has. Writes a plain markdown ROADMAP.md at the repo root, grouped into Now/Next/Later, with each feature broken into a sequence of ~15-minute-reviewable PR steps. Use when the user asks for a roadmap, growth ideas, "what should we build next", or to update/rescope the existing roadmap.
---

# Product roadmap

Produces (or refreshes) **`ROADMAP.md`** at the repo root for `croydon-tourist-board`: a small,
comedic Astro 7 site ("the official* guide to visiting Croydon") listing attractions (the world's
largest tombstone, a decaying shopping mall, the Chicken Mile). Currently just an `index.astro`
landing page and an `attractions/` section. Roadmap items are scored against what actually grows
and deepens engagement with a small joke/local-culture site. Covers more than new features:

- **Findability** — making attractions easier to browse/discover as the list grows.
- **SEO** — individual attraction pages, structured data, sharing.
- **Improving what already exists** — the `index.astro` landing page and `attractions/` section
  are real and live; extending them is often cheaper than a new feature.

Note: the user has a separate, related site `croydon-chicken-mile` (also on the roadmap-rollout
list) — don't assume shared infra between the two unless the user says they're merged/linked;
treat cross-linking between them as an acquisition idea, not an assumption.

## Grounding the roadmap in the real app

- `README.md` — states the site's comedic/satirical tone ("Not actually official") — keep
  proposed feature names/content in that voice, not generic SaaS language.
- `AUDIT.md` if present — don't duplicate known bugs/gaps as roadmap features.
- `package.json` — Astro + `@vercel/analytics` + `@astrojs/sitemap`; no database, no CMS, no
  auth — content is presumably hardcoded/static; confirm before proposing anything needing
  persistence.
- `src/pages/index.astro` and `src/pages/attractions/` — the real, current structure.

## Output format

Plain markdown. Write directly to `ROADMAP.md` at the repo root, overwriting the previous
version. Structure: intro + 4 goal-tag lenses (Acquisition/Engagement/Retention/Fun) →
PR-sequence explainer → Now/Next/Later sections, each feature as `### N. Name — *Goal tags*` +
description + numbered PR-step list → Mise en place table (if any infra is proposed) → footer
`*Croydon Tourist Board — product roadmap, <date>*`.

## Breaking a feature into PR steps

Sequence content/data → UI → wiring, splitting wherever a step could stand alone:

- A step needing new written content (attraction write-ups, jokes, copy) gets a GitHub issue via
  `mcp__github__create_issue` rather than a PR, referenced from the roadmap line — likely to be
  the most common step type on a site this content-driven.
- No feature-flag system exists here — don't propose gating behind flags.
- If a feature is small enough that splitting produces nothing independently reviewable, write
  **"One PR."** instead.

## Notes

- This is a tiny, personal/joke project — keep proposals proportionate: individual attraction
  pages, sharing, a bit of interactivity, not accounts/backends/monetization infra unless asked.
- Don't re-propose anything already in `AUDIT.md`.
- Do not commit, push, or open a PR for `ROADMAP.md` changes unless the user explicitly asks.
