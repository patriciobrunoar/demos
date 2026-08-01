## Puna Vanlife — 2026 Concept Redesign

Status: **scaffolding only — waiting on real content and assets.**

This will be a single-page concept redesign of https://punavanlife.lv/, in
the same style as the other demos in this repo (`esitalia/`, `femkes/`,
`scalabros/`, `zwaardvis/`, `horrex/`): plain HTML/CSS/JS, real brand
content only, no placeholder copy or stock imagery.

### Folder layout

- `Assets/` — real logos, photography, favicon (see its README)
- `content/` — extracted site copy/typography/colors, plus the Claude for
  Chrome prompt used to gather them (see its README)
- `css/`, `js/`, `index.html` — the build itself, added once content and
  assets are in place

### 2026 design direction

Once content and assets land, the build will focus on:

- Scroll-driven parallax and reveal animations (hero imagery, section
  transitions, staggered content reveals on scroll)
- A bold, modern type scale with generous whitespace and asymmetric,
  editorial-style layouts
- Subtle grain/gradient texture and depth (soft shadows, layered imagery)
- Magnetic/hover micro-interactions on buttons and cards
- Smooth page-load and section-to-section transitions
- A sticky/morphing navigation bar that reacts to scroll direction and
  position
- Fully responsive, mobile-first layout, matching the bar set by
  `horrex/` in this repo

### Next steps

1. Run the Claude for Chrome prompt in `content/README.md` against
   https://punavanlife.lv/ (and its English version if one exists) to pull
   real copy, fonts, colors, and UI notes.
2. Drop real logos/photos into `Assets/` (see that folder's README).
3. Anything the audit can't retrieve (pricing, van specs, availability,
   contact details, legal text, etc.) will be asked about directly —
   nothing here is invented or filled with placeholders.
