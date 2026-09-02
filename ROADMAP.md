# Product Roadmap — Croydon Tourist Board

The site has a landing page and an attractions section, but each attraction isn't yet its own
shareable, crawlable thing — the joke works best when a single attraction can be sent to a
friend or found by someone searching "world's largest tombstone Croydon". Everything below is
scored against four jobs:

- **Acquisition** — brings new visitors in
- **Engagement** — deepens a single visit
- **Retention** — earns a repeat visit
- **Fun** — no metric, just delight

Every feature is broken into a **PR sequence** — each step small enough for a human to review in
about 15 minutes. Genuinely atomic changes are left as one PR.

## Now (ship in weeks — reuses existing infra)

### 1. Individual attraction pages — *Acquisition, Fun*
Each attraction gets its own URL, not just a listing entry — so "the Chicken Mile" is a page you
can link to directly.

1. **One PR.** Static per-attraction pages under `attractions/[slug].astro`, built from whatever
   attraction data already backs the listing page — self-contained, reuses existing content.

### 2. Share button — *Acquisition, Fun*
A one-tap "send this to someone who doesn't believe Croydon has the world's largest tombstone"
share link on each attraction page (depends on feature 1 existing first).

1. **One PR.** A share component using the Web Share API with a URL/text fallback, added to the
   attraction page template from feature 1.

### 3. Attraction structured data — *SEO, Acquisition*
TouristAttraction structured data on each attraction page so it can surface directly in search.

1. **One PR.** A single JSON-LD block added to the attraction page template — no new logic.

## Next (this quarter — more content, needs more attractions written first)

### 4. More attractions — *Acquisition, Fun*
The roadmap's biggest lever is simply more content — more absurd/genuine Croydon landmarks
written up in the site's voice.

1. **Not a PR — a content task.** Write up 5-10 more attractions in the existing comedic voice.
   Raise as a GitHub issue rather than a PR, since it's editorial writing, not code.

### 5. "Chicken Mile crossover" link — *Acquisition*
A simple outbound link/mention from the Chicken Mile attraction entry to the standalone
`croydon-chicken-mile` site, if the user wants the two connected.

1. **One PR, only once confirmed with the user** — don't assume the two sites should cross-link
   without asking first, since they're separate repos with no shared infra today.

---
*Croydon Tourist Board — product roadmap, 2 September 2026*
