# CLAUDE.md

Guidelines for Claude Code when working in the SNUMPR Lab website repo. Read README.md alongside this file — README is for human operators (the professor and students); this file is for you. Stay consistent with the patterns below so the site remains easy for non-React maintainers to manage.

## 1. Project overview

- Static research-lab homepage for the SNU Machine Perception and Reasoning Lab.
- Stack: **Next.js 16 (App Router)** + **React 19** + **TypeScript**. CSS Modules for styling (no Tailwind, no styled-components).
- Deployed via Vercel from the `main` branch to https://snumpr.vercel.app.
- Primary users editing this repo: a professor with HTML/CSS/JS background but no React experience, and students adding gallery items. Default response language is **Korean** unless the request is clearly in English.

## 2. Directory map

```
public/
  data/               JSON content sources (people, publications, gallery, news, highlights, links)
  images/             Static images, organized by purpose (people/, publications/, gallery/, news/, highlights/, join-us/)
  icons/              Per-page SVG icons (home/, publication/, sns/, team/)
  research-pdfs/      Locally hosted paper PDFs
  logo.svg

src/
  app/
    layout.tsx        Root layout: registers Figtree font, renders Navbar/Footer, wraps children in NuqsAdapter
    globals.css       Global styles + --nav-height, --font-main, --font-secondary
    theme.css         All color CSS variables (single source of truth for color)
    page.tsx          Home (news carousel + highlights preview)
    <route>/page.tsx  Each page lives in its own folder: team, publications, highlights, gallery, join-us
  components/
    Navbar.tsx        Top nav (edit this when adding a route to the menu)
    Footer.tsx        Footer with SNS icons (driven by links.json)
    Title.tsx         Page title component used across pages
    FadeIn.tsx        Scroll fade-in wrapper
    Icons.tsx         Inline SVG icons (GithubIcon, HuggingFaceIcon, etc.)
  types/index.ts      TypeScript interfaces for every JSON data shape — source of truth for data schemas
  utils/              Small helpers (smoothScroll, etc.)
```

## 3. Conventions you must follow

### Pages

- One page = one folder under `src/app/<route>/` containing `page.tsx` (and usually `page.module.css`). The folder name is the URL path.
- If the new page should appear in the top nav, also add a `<Link>` to `src/components/Navbar.tsx` (preserve the active-state pattern that uses `usePathname()`).
- Wrap visible sections in `<FadeIn>` from `src/components/FadeIn.tsx` so scroll animation matches the rest of the site.
- Use `<Title>` from `src/components/Title.tsx` for page headings when the page has a top title bar (see existing pages for usage).

### Content data

- All content goes in `public/data/*.json` and is imported via `import data from '../../public/data/<name>.json'` (or `'../../../public/data/...'` from a subroute). Do **not** inline content arrays in `page.tsx` long-term — that breaks the JSON-driven editing model the professor relies on.
- For every new JSON shape, add a matching `interface` to `src/types/index.ts` and import it where the JSON is consumed (`const items: Foo[] = data;`).
- `people.json` is a **nested object** (`members.<section>` arrays); news/highlights/gallery/publications are **flat arrays**; `links.json` is a flat object. Don't change these top-level shapes without a clear reason.

### Styling

- **Always use CSS variables** from `theme.css` and `globals.css`. Never hardcode hex colors, named colors, or `rgb(...)` directly in component styles. If a color you need doesn't exist, **add a new variable to `theme.css`** rather than hardcoding.
- New page styles → CSS Module file (`page.module.css`) co-located with `page.tsx`. New component styles → `<Component>.module.css` co-located with the `.tsx`.
- Don't introduce Tailwind, styled-components, emotion, or any CSS-in-JS. Stay with CSS Modules.
- Don't rename existing CSS variables without grepping the full repo and updating every `*.module.css` consumer.

### Fonts

- Registered in `src/app/layout.tsx` via `next/font/google` (currently Figtree) or `next/font/local` (for fonts not on Google Fonts, e.g. Pretendard — keep variable woff2 files under `src/fonts/`).
- Each font is exposed as a CSS variable like `--font-figtree`. Pages consume fonts indirectly through `--font-main` / `--font-secondary` defined in `globals.css`. To switch the site font, change `--font-main` to point at a different `--font-<name>` — don't edit individual `*.module.css` files.

### Images

- Store in `public/images/<purpose>/`. Reference as `/images/...` (the leading `/` matters; `public/` is implicit).
- Use Next.js `<Image>` rather than `<img>` for content images. Use `fill` inside a wrapper that sets explicit dimensions, with a sensible `sizes` attribute (mirror the patterns in `src/app/page.tsx`).
- Filenames: lowercase, English/digits/hyphens only. No spaces, parentheses, or Korean characters in image filenames — they break URL handling.

### Icons

- Reusable inline SVG icons go in `src/components/Icons.tsx` as React components. Import them where needed.
- One-off page-specific icons can live as static SVGs under `public/icons/<page>/` and be loaded via plain `<img src="/icons/..." />` (see Home arrow).

### Tag/badge color mappings

- Gallery `color` field (`red | orange | yellow | green | teal | blue | purple | pink`) maps to `--color-swatch-<color>` in `theme.css`. If you add a new color option, also update `BadgeColor` in `src/types/index.ts`.
- Publication `links[].label` maps to `--color-tag-<label-lowercased>` (PDF, Code, Data, Page, Supp, Media, Slides). Encourage the professor to use those labels; if a new label is needed, add a corresponding `--color-tag-*` variable in `theme.css`.

## 4. Don'ts

- Don't add new top-level dependencies without a clear need. The dep list is intentionally minimal (`next`, `react`, `react-dom`, `nuqs`).
- Don't add backend/API routes, auth, or a database. This site is fully static. If a request requires server state, flag it and ask before introducing infrastructure.
- Don't hardcode colors, fonts, or font sizes that already have a variable.
- Don't break the JSON-driven content model by inlining content the user will want to edit later.
- Don't reorganize folders, rename routes, or rename CSS variables as a side effect of an unrelated task.
- Don't write multi-paragraph code comments. Identifiers should explain the code; only comment for non-obvious *why*.

## 5. Workflow expectations

- The user runs `npm run dev` themselves — you don't need to start or manage the server.
- For multi-file changes (e.g., new page = `app/<route>/page.tsx` + `page.module.css` + Navbar edit + types + JSON), end with a brief summary listing every file you touched.
- After non-trivial changes, optionally run `npm run lint` to confirm there are no lint errors. Don't run `npm run format` unprompted (it rewrites unrelated files).
- When the user reports a `npm run dev` error, treat the terminal message as authoritative — fix the actual cause rather than guessing from the description.
- Default response language: **Korean** for user-facing text; English is fine for code/comments.

## 6. Useful scripts

- `npm run dev` — local dev server (hot reload).
- `npm run build` — production build (use to surface errors before pushing).
- `npm run lint` — ESLint check.
- `npm run format` — Prettier + ESLint auto-fix (run only when explicitly asked).

## 7. Out-of-scope

If a request needs authentication, a database, server-side APIs, payments, real-time features, or anything that would force this repo away from being a fully static site, **flag it explicitly and confirm before adding infrastructure**. The maintainers value the simplicity of "edit JSON + push to main."
