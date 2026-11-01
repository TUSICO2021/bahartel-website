# Bahartel company profile

React catalogue source imported from the supplied project archive. Requires Node.js 22.12+ (validated with Node.js 24).

From this directory:

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

Build with `npm run build`. Serve the production build with `npm run preview -- --host 127.0.0.1 --port 4173`.

The project uses npm and the included package-lock.json to reproduce the validated dependency versions. The original pnpm lockfile was not included in the supplied archive. No environment variables or credentials are required. Google Fonts are optional; system fonts are used when unavailable.

## Mobile scroll regression checks

After `npm run build`, run `python3 tests/mobile_scroll.py` with Python Playwright installed (`python3 -m pip install playwright`; `python3 -m playwright install chromium` if no system Chromium is installed). The checks cover all 11 pages at six portrait/tablet/landscape sizes, native touch and wheel scrolling, nested timeline controls, page navigation, desktop layout, portfolio brand and distributor orbits, reduced-motion animation preferences, client-name search and full-list scrolling, the cloud network, and counter restart/final values.
