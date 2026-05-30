# Pulse

A calm, at-a-glance personal dashboard. One URL that shows the time, local weather, quick-launch links to active projects, and a persistent scratch note — nothing more. No accounts, no backend, no clutter.

Built as a single-file React app (no build step) and installable as a PWA on any device.

---

## Features

- **Clock** — large, clean time and date with a time-aware greeting.
- **Weather** — current conditions for Gilroy, CA via the free [Open-Meteo](https://open-meteo.com) API (no key required). Pixel-art condition icon, feels-like, humidity, and wind. Auto-refreshes every 15 minutes; tap ↻ to refresh manually.
- **Projects** — tap-to-launch cards with version pills. Tap the ✎ button to edit names, URLs, and versions, or add/remove projects. Saved to `localStorage`.
- **Scratch note** — a free-text field that autosaves to `localStorage` as you type.
- **Responsive** — single column on mobile, multi-column grid on desktop.
- **Offline-ready** — the app shell is cached by a service worker; only the live weather call needs a connection.

---

## Tech stack

- React 18 via CDN (`React.createElement`, no JSX, no bundler)
- `localStorage` for all persistence (projects + note)
- PWA: `manifest.json` + `sw.js` service worker
- Capacitor-ready structure (relative paths throughout) if wrapped as an Android APK later

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire app (markup, styles, React) |
| `sw.js` | Service worker — caches the app shell, bypasses the weather API |
| `manifest.json` | PWA manifest (name, colors, embedded icon) |
| `version.txt` | Current version string |
| `.nojekyll` | Tells GitHub Pages to skip Jekyll processing |

---

## Deploy (GitHub Pages)

1. Put all files in the repository root.
2. In the repo: **Settings → Pages → Build and deployment**, set the source to your default branch, root folder.
3. Open the published URL. Install it from the browser menu ("Add to Home Screen" / "Install app") to run it standalone.

To run locally, serve the folder with any static server (PWAs need `http`, not `file://`):

```bash
npx serve .
```

---

## Customization

- **Projects** — edit in-app with the ✎ button. Defaults are placeholders; correct the URLs and version numbers once and they persist.
- **Weather location** — change `LAT` and `LON` near the top of the `<script>` in `index.html`. Units default to Fahrenheit and mph; adjust the `temperature_unit` / `wind_speed_unit` parameters in the weather URL to switch.

---

## Version

`1.0.0`
