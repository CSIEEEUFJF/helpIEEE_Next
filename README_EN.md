# HELPIEEE Next

Portuguese documentation: [`README.md`](./README.md)

Last reviewed: `2026-09-05`

## Overview

HELPIEEE is an onboarding guide for first-year **Exact Sciences and Engineering students at UFJF**. The application brings together practical guidance, study resources, academic life, community, opportunities, and curriculum flows in a React/Next.js interface.

The rebuild replaced the old injected HTML, CSS, and JavaScript delivery with:

- native React pages and components;
- structured editorial content;
- curricula centralized as data;
- stable routes with redirects for old addresses;
- a visual layer consistent with the [IEEE UFJF Student Branch](https://www.ieeeufjf.com.br/).

## Audience and principles

General content serves students arriving at the Institute of Exact Sciences and the School of Engineering. Guidance that is specific to a course, unit, campus, or service must state its scope in the content itself.

Editorial principles:

- welcome readers without assuming prior knowledge of the university;
- use direct, inclusive language across different programs;
- prioritize official UFJF and IEEE UFJF pages;
- identify the source and review date of changeable information;
- never treat one curriculum as universal;
- do not publish expired calendars, staff assignments, or assessment dates.

## Visual system

The design follows the institutional language of the IEEE UFJF website:

- IEEE blue `#00629b` as the primary color;
- official IEEE Master Brand with automatic black/white switching based on the header background;
- light surfaces, editorial hierarchy, and strong contrast;
- Open Sans loaded through `next/font`;
- shared institutional header and footer;
- responsive components and accessible mobile navigation;
- light/dark theme with a locally stored preference;
- visible focus states and semantic navigation structure.

Global tokens and styles live in [`app/globals.css`](./app/globals.css). The shared shell is defined in [`app/layout.js`](./app/layout.js). Brand usage, palette, typography, official files, and the release checklist are documented in [`BRAND.md`](./BRAND.md).

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home, editorial search, course overview, and entry points |
| `/guia` | Index of the six content tracks |
| `/guia/[slug]` | Structured page for one track |
| `/fluxo` | Interactive curriculum explorer |

Available `/guia/[slug]` values:

- `chegada` — first steps;
- `faculdade` — academic life;
- `estudos` — resources and studying;
- `comunidade` — community and support;
- `oportunidades` — IEEE and opportunities;
- `projeto` — about HELPIEEE.

Supporting routes:

- `/oportunidades` redirects to the opportunities track;
- `/sobre` redirects to the project track.

Backward-compatible routes:

- `/index.html` redirects to `/`;
- `/fluxo.html` and `/pages/fluxo.html` redirect to `/fluxo`;
- `/pages/*.html` uses the `legacySlugMap` in [`lib/guides.js`](./lib/guides.js) to redirect each old page to its equivalent track.

Aliases preserve already-shared links but do not render or depend on legacy documents.

## Architecture

### Platform

- Next.js `16.3.4` with the App Router;
- React and React DOM `19.2.8`;
- ESLint `9`;
- static rendering for content tracks and on-demand rendering for the flow route with a course parameter.

### Editorial content

[`lib/guides.js`](./lib/guides.js) is the source of truth for the guides. It exports:

- `guides`: all six complete tracks;
- `guideCategories`: summarized navigation data;
- `guidesBySlug` and `getGuideBySlug`: slug-based access;
- `officialLinks`: reused institutional links;
- `legacySlugMap`: redirect targets for old aliases;
- `editorialNotes`: scope decisions, removed temporal content, and publication checks.

Each guide includes a title, summary, audience, scope, keywords, `reviewedAt`, `sourceLabel`, legacy slugs, and sections. Sections contain paragraphs and items with text, lists, links, and item-level source/review metadata when needed.

### Curriculum flows

[`lib/curricula.js`](./lib/curricula.js) centralizes periods, courses, workload/credits, and prerequisites. The 21 registered curricula cover:

- the Electrical Engineering tracks;
- Computational Engineering and Civil Engineering;
- Computer Science — full-time and evening;
- Information Systems;
- the Exact Sciences bachelor's program;
- Chemistry, Physics, and Mathematics bachelor's and teaching degrees;
- Statistics.

The explorer supports curriculum selection, search by name or code, prerequisite and unlock inspection, completion tracking, and progress summaries. Progress remains in the browser through `localStorage`.

The flow is a planning aid: enrollment and equivalence decisions must always be confirmed in SIGA and with the relevant program office.

### Main components

- [`SiteHeader`](./components/SiteHeader.jsx), [`SiteFooter`](./components/SiteFooter.jsx), and [`siteNavigation`](./components/siteNavigation.js): institutional shell and navigation;
- [`MobileNavigation`](./components/MobileNavigation.jsx): mobile menu with Escape and outside-click handling;
- [`ThemeToggle`](./components/ThemeToggle.jsx): browser-persisted theme preference;
- [`GuideCard`](./components/GuideCard.jsx): reusable entry point for tracks;
- [`GuideArticle`](./components/GuideArticle.jsx): semantic rendering of sections, sources, and review dates;
- [`HomeSearch`](./components/HomeSearch.jsx): local search across guides and sections;
- [`CurriculumExplorer`](./components/CurriculumExplorer.jsx) and its [CSS Module](./components/CurriculumExplorer.module.css): curriculum interaction, search, relationships, and progress.

### Sites deployment

The project keeps the conventional Next.js workflow and a dedicated Sites output. [`vite.config.mjs`](./vite.config.mjs) combines Vinext, Vite, and the Cloudflare adapter to produce a Worker-compatible application; [`worker/index.js`](./worker/index.js) serves the App Router and image optimization. Hosting configuration lives in `.openai/hosting.json`, and its internal identifiers must not be copied into documentation, issues, or logs.

- `npm run build:sites` validates content and generates the Sites production output;
- `npm run start:sites` starts that output locally for verification;
- `npm run build` and `npm run start` remain available for the conventional Next.js runtime.

Set `NEXT_PUBLIC_SITE_URL` to the environment's canonical origin before building. [`app/layout.js`](./app/layout.js) uses it as `metadataBase`; when unset, it falls back to `https://help.ieeeufjf.com.br`.

## Social image

[`public/og.png`](./public/og.png) is the project's `1200 × 630` Open Graph/Twitter image and uses the official Master Brand. It is declared in [`app/layout.js`](./app/layout.js), which resolves its absolute URL from `NEXT_PUBLIC_SITE_URL`. Whenever the name, positioning, domain, or visual identity changes, review the image and its alternative text together.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Available scripts:

```bash
npm run dev
npm run validate:content
npm run validate:links
npm run lint
npm run build
npm run build:sites
npm run start
npm run start:sites
npm run check
```

`npm run validate:content` checks guide and curriculum structure, unique slugs and IDs, link format, review dates, and references to closed terms. `npm run validate:links` requests the published external URLs. `npm run build` runs structural validation automatically through `prebuild`; `npm run check` chains content validation, lint, and build.

## Validation

Before delivering a change:

1. run `npm run validate:content`;
2. run `npm run validate:links` before publishing content; timeouts and bot protection require manual confirmation;
3. run `npm run lint`;
4. run `npm run build`;
5. for a Sites release, set `NEXT_PUBLIC_SITE_URL` and run `npm run build:sites`;
6. inspect `/`, `/guia`, one `/guia/[slug]` page, and `/fluxo` on desktop and mobile;
7. test theme, menu, search, external links, and flow persistence;
8. confirm that old aliases redirect correctly.

In the `2026-09-05` review, `npm run validate:content`, `npm run validate:links`, `npm run lint`, `npm run test:flow`, and `npm run build` completed without errors. The validator checked 6 guides, 21 curricula, and 19 elective catalogs; all 29 pages processed by the build were generated successfully.

## Updating content

1. Find the official source responsible for the information.
2. Update the matching item in [`lib/guides.js`](./lib/guides.js).
3. Set `sourceLabel` and change `reviewedAt` only after reviewing both content and link.
4. Remove closed dates; do not accumulate calendars, assessments, or staff assignments from past terms.
5. Record temporal exclusions or scope decisions in `editorialNotes`.
6. When changing a curriculum, confirm program, version, periods, codes, workloads, and prerequisites before editing [`lib/curricula.js`](./lib/curricula.js).
7. Run validation and visually inspect the affected pages.

Do not copy information from informal groups as if it were official. Older materials may remain only when still useful, properly sourced, and clearly contextualized.

## Key files for resuming work

- [`CURRENT_STATE_EN.md`](./CURRENT_STATE_EN.md)
- [`BRAND.md`](./BRAND.md)
- [`app/layout.js`](./app/layout.js)
- [home](<./app/(home)/page.js>)
- [guide index](./app/guia/page.js)
- [dynamic guide route](<./app/guia/[slug]/page.js>)
- [curriculum flow](./app/fluxo/page.js)
- [`lib/guides.js`](./lib/guides.js)
- [`lib/curricula.js`](./lib/curricula.js)
- [`app/globals.css`](./app/globals.css)
- [`vite.config.mjs`](./vite.config.mjs)
- [`worker/index.js`](./worker/index.js)
