Drop the real Femkes brand assets in this folder:

- Logo (SVG or PNG, transparent background — light + dark variants if you have them)
- Favicon
- Product / hero / lifestyle photography (rooftop tents, vehicles, camping scenes)
- Any icon set, brand guideline PDF, or imagery currently in use on the site

Nothing in this folder is placeholder content. The site build will reference
files here by their real names once they're uploaded — nothing renders until
the actual asset exists.

## How to get these files

Easiest path: while running the Claude for Chrome extraction pass on
en.femkesrooftoptents.com (see the prompt in `../content/README.md`),
right-click and "Save image as…" the logo, favicon, and any hero/product
photos you want used, then drop them straight into this folder
(drag-and-drop into the chat, or commit them to the branch on GitHub).

Note from the Horrex build: if a saved image turns out low-resolution or
has real transparency, say so when you upload — some post-processing
(sharpening, or compositing transparency onto the right background) may
be needed, and it's better I know upfront than guess.
