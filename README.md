# TATLEARN — Tattoo Learning Studio

A mobile-first, Thai-language tattoo practice website built with React and Vite. Visual style: minimal dark-red glass UI without excessive cards or carousels.

## Local development

```bash
npm install
npm run check
npm run build
npm run dev
```

## Main features

- 34 Thai technique lessons: foundations, linework, black & grey, color, hygiene and career preparation
- 10 illustrated A4 practice worksheets in `public/worksheets/` as scalable, printable/downloadable SVG files
- Image-first mobile worksheet library: full-screen preview, zoom, download, practice instructions, completion checklists, related lessons
- Digital line practice canvas with touch, mouse and stylus input; guides, undo/redo and PNG export
- 8-stage metallic gold/silver graphic demonstration (optical contrast, not actual metallic pigments)
- 9-stage Anubis vector masterclass with exportable SVG and guided study
- 30-day training tracker, equipment checklist, sleeve-composition study and 20-question knowledge check
- Session notes and progress in browser localStorage, including export/import of JSON
- No authentication, generated image dependency or backend required

## Printable worksheet library

| File | Study subject |
|---|---|
| `01-linework.svg` | straight lines, curves, circles, parallel lines, mandala |
| `02-shading.svg` | 6 values, gradients, dotwork and 3D shading |
| `03-metallic-gold.svg` | 6 visual gold-armor layers and tracing |
| `04-anubis.svg` | Anubis outline, shaded reference, armor shapes |
| `05-dotwork.svg` | point densities and geometric symmetry |
| `06-metal-light.svg` | gold and silver reflection studies |
| `07-3rl.svg` | 3RL fine line control |
| `08-5rl.svg` | 5RL general outlines |
| `09-7rl.svg` | 7RL bold outlines |
| `10-9rm.svg` | 9RM soft shading |

Use the Worksheets tab to open a sheet at full size, zoom, open for printing, save a standalone SVG and record completion. SVG is resolution independent and suits A4 or smaller practice stencils. These are **new hand-coded vector exercises based on the requested topics**; they are not binary copies of images from the conversation.

## Visual Academy — all colors

- 10 locally hosted, self-contained vector study graphics under `public/visual-lessons/`: setup, needle groups, line control, black-and-grey shading, red/blue/green/purple color studies, common color mistakes, blends and gemstone lighting, metallic gold, silver/rose gold, and Anubis
- Dedicated image-first visual learning page, accessible from mobile bottom navigation and desktop sidebar; thumbnail gallery and searchable categories
- Full-screen visual guide with learn-by-steps, manual self-check, related lesson links, and progress stored in the same browser as the rest of the app
- Interactive study palette: red/orange, blue/teal, green, purple, gold, silver and rose gold with values shown visually, **not tattoo ink recipes**
- Relevant diagrams embedded in existing technique lessons and linked from the dashboard
- These are structured vector illustrations of the topics, **not the original generated PNG posters**. They keep text selectable and avoid the inconsistent equipment depictions in AI-generated images.
- Digital previews are educational, not a substitute for hands-on instruction or professional infection-control training.

## Needle Studio / synthetic-skin exercises

- Visual closeups of 3RL, 5RL, 7RL and 9RM group arrangements (diagrams are illustrative only, not to scale)
- Side-by-side ideal vs. common mistake examples: wobble, overlaps, breaks, irregular outlines, banding, patchy shading and harsh edges
- 4 printable A4 needle-specific SVG worksheets: `07-3rl.svg`, `08-5rl.svg`, `09-7rl.svg`, `10-9rm.svg`
- Three practice drills for each cartridge, manual 3-criterion 0–6 rubric, practice-note entry and local-only ephemeral photo preview
- Saved practice sessions in the existing journal and browser-local JSON export/import
- The site does not specify universal voltage, needle penetration depth or any real-skin technique

## Deploy to Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Production output has static routes for all printable SVG assets under `/worksheets/`

## Safety boundary

The practice exercises and teaching diagrams are intended for paper and synthetic skin only. Online study and synthetic skin practice do not qualify someone to tattoo a person. Real-skin work requires skilled in-person mentorship, infection control and compliance with local regulations. Do not inject practice inks or non-tattoo pigments, including metallic art powders, into human skin.

Public health references are linked in the Safety section.
