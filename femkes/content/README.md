This folder holds the real content pulled from
https://en.femkesrooftoptents.com/ — copy, fonts, colors, and UI notes —
so the redesign is built from actual site content, not placeholder text.

## Workflow

1. Open https://en.femkesrooftoptents.com/ in Chrome with the Claude for
   Chrome extension enabled.
2. Paste the prompt below into Claude for Chrome and let it browse every
   page/section of the site.
3. Save its output as `content/extracted-content.md` in this folder (or
   paste it back into the Claude Code chat).
4. Save any images/logos it finds into `../Assets/` (see that folder's
   README).

## Prompt for Claude for Chrome

```
Go to https://en.femkesrooftoptents.com/ and do a full content + design
audit of the site so I can rebuild it. Visit every page and section you
can reach from the main navigation and footer, including any language
switcher, and report back a single structured Markdown document with:

1. COPY — every piece of real text on the site, organized by page/section:
   - Site title, tagline/slogan, meta description
   - All headings and subheadings (H1–H4), verbatim
   - All body paragraphs, verbatim
   - Navigation menu labels and their structure (including dropdowns)
   - Button and CTA labels (e.g. "Shop now", "Find a dealer", "Request a quote")
   - Footer content: links, legal text, addresses, social links
   - Contact info: phone, email, physical address, opening hours, any
     contact/order form fields and their labels
   - Product names, categories, variants, sizes, and descriptions
   - Pricing if shown
   - Testimonials, reviews, certifications, partner/dealer logos mentioned by name

2. TYPOGRAPHY — inspect computed styles (DevTools) for headings and body
   text and report:
   - Font-family name(s) used, and whether they're a Google Font, Adobe
     font, or a custom/licensed webfont
   - Font weights and sizes used for H1, H2, H3, body, and buttons
   - Letter-spacing / text-transform if used

3. COLOR PALETTE — extract from computed styles / brand elements:
   - Primary brand color(s) with hex codes
   - Secondary/accent colors with hex codes
   - Background colors (light/dark sections if any)
   - Text colors (headings vs body vs muted/secondary text)

4. LOGOTYPE & IMAGERY:
   - Where the logo lives (header, footer) and its image URL
   - Favicon URL
   - List every meaningful image on the site with its URL and alt text
     (hero images, product photos, lifestyle/camping photos, icons), and
     note the apparent resolution/quality of each if you can tell
   - Flag explicitly if a logo or key image appears low-resolution —
     don't just save whatever renders in the page if a larger source is
     discoverable (e.g. check if the image URL supports a size parameter,
     or if there's a higher-res version linked elsewhere like a press kit)

5. UI / BUTTON STYLES:
   - Describe button shapes (pill, rounded, square), borders, shadows,
     and any hover/active state changes you can trigger and observe
   - Describe card/section styling patterns (borders, shadows, spacing)
   - Note any animations, transitions, or scroll effects already present

6. SITE STRUCTURE:
   - Full sitemap of pages/sections you found
   - Any forms (contact, order, newsletter, dealer signup) and their
     exact fields
   - Note whether the site sells direct-to-consumer (e-commerce/checkout)
     or is B2B/dealer-oriented, since that changes what a redesign needs

Be exhaustive and literal — quote real text rather than summarizing it, and
flag clearly anything you couldn't access (e.g. content behind a form,
image that failed to load, blocked page) instead of guessing at it.
```

## Note

Do not invent or paraphrase content that Claude for Chrome couldn't
retrieve — mark it as missing so we can ask about it directly instead of
guessing.
