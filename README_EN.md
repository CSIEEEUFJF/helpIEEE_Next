# HELPIEEE Next

Versao em portugues disponivel em [`README.md`](README.md)

Main documentation for the `helpieee-next` project.

Last documentation revision: `2026-04-09`

## 1. Overview

This project migrates the original HELPIEEE demo to **React with Next.js**, preserving:

- the original page structure
- legacy `.html` paths
- legacy HTML
- legacy CSS
- legacy scripts
- original assets

The goal of this stage was not to redesign the product. The priority was to move the delivery to a modern React/Next foundation without breaking the navigation and behavior already known from the demo.

## 2. Current state

Working today:

- home at `/` and `/index.html`
- legacy pages at `/pages/*.html`
- curriculum flow at `/pages/fluxo.html`
- `/fluxo.html` alias redirecting to `/pages/fluxo.html`
- faithful rendering of the copied demo HTML
- legacy CSS and script loading in original order
- light/dark theme preserved by legacy scripts
- curriculum flow with completed-course tracking via `localStorage`
- curriculum flow with prerequisites, unlocks and arrows
- curriculum flow with Electrical Engineering, Computational Engineering and Computer Science curricula

Important notes about the current state:

- the app uses the Next **App Router**, but still serves legacy HTML
- HTML is rendered from copies inside `legacy-source/`
- changes in `legacy-source` are reloaded by file `mtime`, preventing stale in-memory cache during development
- `html` and `body` use `suppressHydrationWarning` because legacy scripts mutate attributes before hydration
- the curriculum flow still relies on legacy JavaScript, with data centralized in `public/assets/js/pages/fluxo-data.js`
- the fixed horizontal bar in the flow is a synchronized mirror of the main scroll area to keep it always reachable on desktop

## 3. Stack and technical base

### 3.1 Platform

- framework: `Next.js 16.2.3`
- view layer: `React 19.2.4`
- lint: `ESLint 9`
- routing: `App Router`

### 3.2 Migration strategy

The project does not yet rewrite the demo as equivalent React UI components. Instead, it:

- copies the original HTML into `legacy-source/`
- extracts `body`, `link rel="stylesheet"` and `script`
- injects that content into Next routes

This approach reduces visual and functional regression risk during the initial migration.

## 4. Repository structure

Main directories:

- [`app`](./app): Next routes and layouts
- [`components`](./components): legacy page renderer
- [`lib`](./lib): legacy HTML loading and shared metadata
- [`legacy-source`](./legacy-source): copied HTML from the original demo
- [`public/assets`](./public/assets): copied assets from the original demo

Support files:

- [`CURRENT_STATE_EN.md`](./CURRENT_STATE_EN.md): quick resume snapshot
- [`package.json`](./package.json): scripts and dependencies
- [`next.config.mjs`](./next.config.mjs): minimal Next configuration

## 5. Software architecture

## 5.1 Main modules

- [`components/LegacyPageRenderer.jsx`](./components/LegacyPageRenderer.jsx)
  - injects legacy page styles
  - injects `head` scripts
  - injects `body` HTML
  - injects `body` scripts
  - preserves the original execution order

- [`lib/legacyDocuments.js`](./lib/legacyDocuments.js)
  - reads HTML files from `legacy-source/`
  - extracts title, `body` attributes, styles and scripts
  - strips scripts from the main HTML and re-inserts them explicitly
  - uses `mtime`-aware in-memory caching

- [`app/(home)`](./app/%28home%29)
  - serves the original home page
  - applies `body.page-home`

- [`app/(content)`](./app/%28content%29)
  - serves legacy content pages
  - applies `body.page-content`

- [`app/(flow)`](./app/%28flow%29)
  - serves the curriculum flow
  - applies `body.page-flow`
  - preserves `/pages/fluxo.html`
  - redirects `/fluxo.html`

- [`public/assets/js/pages/fluxo-data.js`](./public/assets/js/pages/fluxo-data.js)
  - centralizes curriculum data
  - defines courses, periods, workloads and prerequisites

- [`public/assets/js/pages/fluxo.js`](./public/assets/js/pages/fluxo.js)
  - builds the flow at runtime
  - draws arrows
  - handles selection and progress
  - synchronizes the fixed horizontal scrollbar

## 5.2 Layouts and hydration

Each route group uses its own layout to reproduce the original demo `body` classes:

- [`app/(home)/layout.js`](./app/%28home%29/layout.js)
- [`app/(content)/layout.js`](./app/%28content%29/layout.js)
- [`app/(flow)/layout.js`](./app/%28flow%29/layout.js)

All of them use:

- `lang="pt-BR"`
- `suppressHydrationWarning` on `html`
- `suppressHydrationWarning` on `body`

This is necessary because theme and flow scripts mutate attributes such as:

- `data-theme`
- `style.colorScheme`
- `data-curriculum`

before React hydrates the page.

## 5.3 Main routing model

Main routes:

- `/`
- `/index.html`
- `/pages/primeiros-passos.html`
- `/pages/faculdade.html`
- `/pages/materiais.html`
- `/pages/materiais-algoritmos.html`
- `/pages/materiais-calculo.html`
- `/pages/materiais-geometria-analitica.html`
- `/pages/materiais-introducao-engenharia-eletrica.html`
- `/pages/materiais-laboratorio-ciencias-fisicas.html`
- `/pages/materiais-laboratorio-quimica.html`
- `/pages/materiais-quimica-fundamental.html`
- `/pages/comunidade.html`
- `/pages/ieee.html`
- `/pages/fluxo.html`
- `/fluxo.html`

Note:

- the dynamic content route uses `generateStaticParams()` to pre-render legacy slugs, except for `fluxo.html`

## 6. Curriculum flow

## 6.1 What the flow currently provides

The current curriculum flow supports:

- curriculum selection
- prerequisite highlighting
- unlock highlighting
- arrows between courses
- navigate mode and completed-course marking mode
- local progress persistence per curriculum
- light/dark theme
- fixed and synchronized horizontal scrollbar

## 6.2 Curricula currently registered

Available curricula today:

- Electrical Engineering - Electronic Systems
- Electrical Engineering - Power Systems
- Electrical Engineering - Robotics and Industrial Automation
- Electrical Engineering - Energy
- Computational Engineering
- Computer Science (Full-time)
- Computer Science (Evening)

Notes:

- the Computer Science curricula were added from official UFJF documentation
- the flow currently represents prerequisites by course code
- workload-based requirements, such as `TCC I` in Computer Science, appear only as textual notes in the card title

## 6.3 Main flow files

- [`legacy-source/pages/fluxo.html`](./legacy-source/pages/fluxo.html)
- [`public/assets/css/pages/fluxo.css`](./public/assets/css/pages/fluxo.css)
- [`public/assets/js/pages/fluxo-data.js`](./public/assets/js/pages/fluxo-data.js)
- [`public/assets/js/pages/fluxo.js`](./public/assets/js/pages/fluxo.js)

## 7. Assets and content strategy

Demo assets were copied into `public/assets/` to preserve:

- original relative paths
- existing images and icons
- page-level CSS
- original scripts

HTML files were copied into `legacy-source/` to:

- avoid changing the original demo
- let the Next project evolve in isolation
- keep a local source of truth for the legacy layer

## 8. Available scripts

Main commands:

```bash
npm run dev
npm run lint
npm run build
npm run start
```

Typical usage:

1. `npm install`
2. `npm run dev`
3. open `http://localhost:3000`

## 9. Validation

Validations already executed on this codebase:

- `npm run lint`
- `npm run build`

These checks help confirm:

- basic integrity of the Next routes
- absence of lint errors in the new code
- successful static generation of mapped pages

## 10. Most important files for maintenance

- [`components/LegacyPageRenderer.jsx`](./components/LegacyPageRenderer.jsx)
- [`lib/legacyDocuments.js`](./lib/legacyDocuments.js)
- [`lib/metadata.js`](./lib/metadata.js)
- [`app/(home)/page.js`](./app/%28home%29/page.js)
- [`app/(content)/pages/[slug]/page.js`](./app/%28content%29/pages/%5Bslug%5D/page.js)
- [`app/(flow)/pages/fluxo.html/page.js`](./app/%28flow%29/pages/fluxo.html/page.js)
- [`app/(flow)/fluxo.html/page.js`](./app/%28flow%29/fluxo.html/page.js)
- [`legacy-source/pages/fluxo.html`](./legacy-source/pages/fluxo.html)
- [`public/assets/js/pages/fluxo-data.js`](./public/assets/js/pages/fluxo-data.js)
- [`public/assets/js/pages/fluxo.js`](./public/assets/js/pages/fluxo.js)
- [`public/assets/css/pages/fluxo.css`](./public/assets/css/pages/fluxo.css)

## 11. Limitations and care points

### 11.1 Migration scope

The project has not yet converted legacy pages into semantically rewritten React components.

Today:

- the visual layer is still mostly legacy HTML
- interaction scripts still rely on the original implementation

### 11.2 Hydration and pre-React mutations

Because legacy scripts mutate `html` and `body` early:

- hydration warnings may return if new mutations are introduced carelessly
- layouts should continue to respect `suppressHydrationWarning`

### 11.3 HTML cache and loading

The legacy loader uses an `mtime`-aware in-memory cache.

Because of that:

- changes in `legacy-source` are reflected without stale cache issues
- future changes should preserve this behavior

### 11.4 Curriculum flow model

The current flow does not model:

- workload-based prerequisites
- formal co-requisites
- more complex conditional curriculum rules

If that becomes necessary, the format of `fluxo-data.js` will need to be expanded.

## 12. Quick validation checklist

After important changes, it is worth validating:

1. Home at `/` and `/index.html`.
2. Navigation across legacy pages in `/pages/*.html`.
3. `/fluxo.html` alias.
4. Theme switching.
5. Curriculum switching in the flow.
6. Prerequisite and unlock highlights.
7. Completed-course marking.
8. Local progress persistence.
9. Fixed horizontal scrollbar in the flow.
10. `npm run lint`.
11. `npm run build`.

## 13. Auxiliary documents

For additional context:

- [`CURRENT_STATE_EN.md`](./CURRENT_STATE_EN.md): quick resume snapshot
- [`README.md`](./README.md): Portuguese version of this documentation

This `README_EN.md` should be treated as the main complete English documentation for the project.
