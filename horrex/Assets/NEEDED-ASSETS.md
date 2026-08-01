Real files needed to finish the Horrex redesign. Network policy in this
build environment blocks static.wixstatic.com, so I could not download
these automatically even though the audit found their URLs — please grab
them yourself (right-click → Save image as… on horrex.nl, or re-run the
Claude for Chrome pass) and drop them in this folder with these exact
filenames:

| Filename | What it is | Source (from the audit) |
|---|---|---|
| `horrex-logo.png` | Main wordmark logo, header + footer | https://static.wixstatic.com/media/14074c_a308d82d386944018b90b3222c1d08e3~mv2.jpg — a transparent PNG version is preferred if you have one, otherwise the JPG is fine |
| `favicon.png` | Browser tab icon | https://static.wixstatic.com/media/14074c_83109ad002904748975216ea0472cb79~mv2_d_2000_1416_s_2.png |
| `driving-change-logo.png` | "Part of Driving Change Group" footer logo | https://static.wixstatic.com/media/14074c_14c0c8404af543dcb8547b0036b49dc5~mv2.png |
| `hero-background.jpg` | Full-bleed hero photo (RV/van/landscape) | The audit described this type of image but didn't capture an exact URL — grab the homepage hero photo directly |
| `about-team.jpg` | One real "life at Horrex" office/team photo for the About section | Same — grab one from the About Us gallery |

## Design decision on the rest of the imagery

To avoid using stock-photo placeholders for things I don't have real files
for, the build uses:
- **Original SVG icons** (not photos) for the 9 product category cards
  (Windows, UCS Blinds, Flyscreen Doors, etc.) — clean, icon-driven product
  grids are a strong 2026 pattern and don't require pretending to have real
  product photography.
- **Typographic wordmark chips** (styled company names, not logo images)
  for the OEM client trust strip (Adria Mobil, Rapido, Swift Leisure,
  Trigano, Hymer, Groupe Pilote, Coachman, nuCamp RV) and the dealer/
  wholesaler list — since I don't have their actual logo files and won't
  fabricate them.

If you'd rather have real product photography or the actual OEM/dealer
logo files in any of those spots, drop them in this folder (any sensible
filename) and tell me — I'll wire them in and drop the icon/wordmark
fallback.
