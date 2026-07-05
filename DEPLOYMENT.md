# Deployment — فعلستان (English)

How this app is built, hosted, and updated. Reference for future maintenance.

## TL;DR

- **Live URL:** https://nvdomidi.github.io/english/
- **Host:** GitHub Pages (free, public repo `nvdomidi/english`), HTTPS enforced.
- **Deploy trigger:** every `git push` to `main` runs a GitHub Actions workflow that builds and publishes automatically. No manual steps.
- **App type:** static Vite + React site, no backend. Also a **PWA** (installable, works offline).

To ship a change:

```bash
git add -A
git commit -m "your message"
git push
```

Wait ~1–2 min for the Action to finish, then hard-refresh the site.

---

## Hosting: GitHub Pages

- Repo: `nvdomidi/english` (**public** — GitHub Pages is free only on public repos; a private repo needs a paid GitHub plan). This repo started private and was made public specifically to enable Pages.
- Pages is configured with **build type = GitHub Actions** (not the legacy "deploy from branch" mode). This was set once via:
  ```bash
  gh api -X POST repos/nvdomidi/english/pages -f build_type=workflow
  ```
- Because the site is served from a sub-path (`/english/`), Vite's `base` **must** stay `'/english/'` in `vite.config.js`. If the repo is ever renamed, update `base` to match, or every asset 404s.

### Why the sub-path matters
`nvdomidi.github.io/english/` is a sub-folder, not a root domain. `base: '/english/'` makes all asset URLs and the PWA `scope`/`start_url` resolve correctly. (A repo named `nvdomidi.github.io` would serve at root and need `base: '/'`.)

---

## CI/CD: GitHub Actions

Workflow file: `.github/workflows/deploy.yml`

- Triggers on push to `main` (and manual `workflow_dispatch`).
- Steps: checkout → `npm ci` → `npm run build` → upload `dist/` as a Pages artifact → deploy.
- Needs `pages: write` and `id-token: write` permissions (already set in the file).
- Check runs: `gh run list --repo nvdomidi/english` or the repo's **Actions** tab.

Known cosmetic warning: a "Node.js 20 is deprecated" note on the runner. Harmless; the build passes. Bump `node-version` in the workflow if desired.

---

## PWA (installable / offline)

Added via `vite-plugin-pwa` (configured in `vite.config.js`).

- `registerType: 'autoUpdate'` — new versions activate silently on next load.
- **Manifest:** RTL, `lang: fa`, `display: standalone`, theme `#6a4cff`, scoped to `/english/`.
- **Service worker (Workbox):** precaches the app shell so it loads offline.
- **iOS:** manifest is mostly ignored on iOS, so `apple-touch-icon` + `apple-mobile-web-app-*` meta tags live in `index.html`.

### Installing on a device
- **Android (Chrome):** open URL → menu → "Install app" / "Add to Home screen".
- **iOS (Safari):** open URL → Share → "Add to Home Screen".

### Important PWA gotcha
The service worker only runs in a **production build**, not `npm run dev`. To test install/offline locally use `npm run build && npm run preview`. Over a plain-HTTP LAN IP the SW won't register (needs HTTPS or `localhost`) — that's why we test installability on the real HTTPS Pages URL.

---

## App icons

- Source art: `scripts/icon.svg` (standard) and `scripts/icon-maskable.svg` (extra padding for Android adaptive icons). Simple "ف" brand mark on the app's purple→orange gradient — **placeholder art, replace with real branding when ready.**
- Generated PNGs live in `public/`: `pwa-192x192`, `pwa-512x512`, `pwa-maskable-512x512`, `apple-touch-icon` (180, opaque), `favicon-32x32`.

### Regenerating icons
`sharp` is used only for generation and is **not** a kept dependency. To regenerate after editing the SVGs:

```bash
npm i -D sharp
node scripts/gen-icons.mjs
npm uninstall sharp
git add public/ && git commit -m "Update icons" && git push
```

---

## User data / progress

- Progress is stored in the browser's **`localStorage`** (see `src/utils/progress.js`). No cookies, no backend.
- Consequence: progress is **per-device / per-browser** — it does not sync between a user's phone and desktop, and is lost if they clear browsing data (or on iOS after ~7 days of not visiting).
- Cross-device sync would require adding a backend + login (not currently planned).

---

## Local development

```bash
npm install          # first time
npm run dev          # dev server (no service worker), binds 0.0.0.0 for LAN testing
npm run build        # production build into dist/
npm run preview      # serve the production build locally (SW active) at /english/
```

To test on a phone during development: run `npm run dev` and open the printed **Network** URL on a device on the same Wi‑Fi (layout only — PWA install needs the HTTPS Pages URL).

---

## Troubleshooting

- **Blank page / nothing loads after a deploy:** almost always local cache. Open in a private/incognito window, hard-refresh (Ctrl+Shift+R), or append `?v=1`. A fresh browser profile loads fine once the Action has finished.
- **Assets 404:** `base` in `vite.config.js` doesn't match the repo/sub-path.
- **Deploy didn't run:** confirm you pushed to `main`; check the Actions tab for failures.
- **First deploy after enabling Pages:** allow a couple of minutes for global CDN propagation.

---

## Git / versioning

- Local git repo; remote `origin` = `https://github.com/nvdomidi/english`.
- `node_modules`, `dist`, and `.vite` are gitignored. `dist` is built fresh in CI, never committed.
