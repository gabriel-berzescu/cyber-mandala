---
name: verify
description: Build, launch, and visually verify the cyber-mandala Three.js app headless.
---

# Verify cyber-mandala

## Build & launch

```bash
npm install
npm run build                          # tsc typecheck + vite build
npm run dev -- --port 5173 --strictPort &   # dev server for driving
```

## Drive headless (WebGL)

Chromium is preinstalled at `/opt/pw-browsers/chromium`. Use `playwright-core`
(no browser download) with SwiftShader for headless WebGL:

```js
chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
```

Wait for `canvas`, then ~3s for the render loop before screenshotting.

## Gotchas

- lil-gui v0.21 prefixes CSS classes: controllers are `.lil-gui .lil-controller`
  (NOT `.controller`). Number controllers expose a text `input`; dropdowns a `select`.
- Flows worth driving: change `symmetry`/`layers` (full rebuild), switch `palette`
  (colors + scene background), spam `regenerate` (dispose/rebuild churn), resize
  viewport (composer resize).
- A `/favicon.ico` 404 in the console is expected noise, not a failure.
