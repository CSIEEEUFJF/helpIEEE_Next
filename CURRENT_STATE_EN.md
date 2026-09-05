# Current state — HELPIEEE Next

Last updated: `2026-09-05`

## Summary

HELPIEEE has been rebuilt as a React/Next.js guide for first-year **Exact Sciences and Engineering students at UFJF**. The old interface and legacy document renderer were removed; content and curricula are now structured data rendered by native components.

## Delivered

- a visual identity aligned with IEEE Brand Experience, using the institutional palette, Open Sans, a dynamic official Master Brand, official favicon, and social image;
- a shared, responsive, accessible shell with header, footer, and mobile menu;
- a home page with local search, explicit audience, and track entry points;
- the `/guia` index and six static `/guia/[slug]` pages;
- the `/fluxo` curriculum explorer with 21 curricula, side-by-side periods, drag scrolling, dependency arrows, search, prerequisites, unlocks, and local progress;
- an elective explorer with 19 catalogs and official-matrix fallbacks;
- a recovery simulator at the end of the flow page;
- preserved old `.html` aliases through redirects, with no legacy HTML dependency;
- a `1200 × 630` Open Graph/Twitter image at [`public/og.png`](./public/og.png);
- global metadata for the “Exact Sciences and Engineering guide at UFJF” positioning and a `metadataBase` configurable through `NEXT_PUBLIC_SITE_URL`;
- Next.js `16.3.4` with React/React DOM `19.2.8`;
- a Vinext/Vite Sites deployment layer with Cloudflare Worker-compatible output.

## Canonical routes

- `/`
- `/guia`
- `/guia/chegada`
- `/guia/faculdade`
- `/guia/estudos`
- `/guia/comunidade`
- `/guia/oportunidades`
- `/guia/projeto`
- `/fluxo`

`/index.html`, `/fluxo.html`, `/pages/fluxo.html`, and the old `/pages/*.html` addresses redirect to current routes. `/oportunidades` and `/sobre` are convenience shortcuts.

## Sources of truth

- [`lib/guides.js`](./lib/guides.js): six guides, official links, `reviewedAt`, `sourceLabel`, editorial notes, and alias mapping;
- [`lib/curricula.js`](./lib/curricula.js): 21 curricula with periods, courses, workloads/credits, and prerequisites;
- [`lib/electives`](./lib/electives): 19 elective catalogs and official sources;
- [`BRAND.md`](./BRAND.md): brand, palette, typography, official asset, and release rules;
- [`app/globals.css`](./app/globals.css): tokens and visual system;
- [`components/GuideArticle.jsx`](./components/GuideArticle.jsx): editorial renderer;
- [`components/CurriculumExplorer.jsx`](./components/CurriculumExplorer.jsx): explorer and progress persistence;
- [`app/layout.js`](./app/layout.js): shell, font, social metadata, and configurable canonical origin;
- [`vite.config.mjs`](./vite.config.mjs) and [`worker/index.js`](./worker/index.js): Sites build and runtime.

## Editorial governance

- Institutional or volatile information must state its source and review date.
- Change `reviewedAt` only after reviewing both text and link.
- Closed academic dates, assessments, and staff assignments from past terms must not remain on pages.
- Course-, unit-, or campus-specific content must declare its scope.
- Curricula must be checked against official documentation before editing.

See [`README_EN.md`](./README_EN.md) for the full process.

## Latest validation

Completed successfully on `2026-09-05`:

- `npm run validate:content` — 6 guides, 20 sections, 81 items, 67 links, 21 curricula, 1,140 courses, 19 catalogs, and 1,795 electives
- `npm run validate:links` — 46 of 46 links valid
- `npm run lint`
- `npm run test:flow` — 41 passing tests
- `npm run build`
- all 29 pages processed by the production build

`npm run build` invokes content validation through `prebuild`; `npm run check` runs content, lint, and build in sequence.

For Sites, `npm run build:sites` generates the production output and `npm run start:sites` runs it locally for verification. Set the canonical domain through `NEXT_PUBLIC_SITE_URL` before building. Internal hosting identifiers do not belong in documentation.

## Ongoing care

- run visual checks on desktop and mobile after layout changes;
- test theme, menu, search, links, redirects, and flow `localStorage`;
- keep [`public/og.png`](./public/og.png) aligned with the current visual positioning;
- run `npm run build:sites` before a Sites release;
- review links and editorial metadata each term without reintroducing expired dates.
