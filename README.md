# cyber-mandala

Generator interactiv de **mandale 3D** în browser, construit cu **Three.js** —
geometrie sacră întâlnește estetica neon / cyberpunk.

## Concept

- Mandale **3D generate procedural**, cu simetrie radială configurabilă,
  randate în timp real cu Three.js (WebGL).
- Estetică neon / cyberpunk: materiale emissive, glow / bloom (post-processing),
  linii luminoase pe fundal întunecat.
- Cameră orbitală: mandala poate fi rotită, apropiată, explorată din orice unghi.
- Controale live: număr de axe de simetrie, adâncime / straturi 3D, paletă de
  culori, viteză de animație, complexitate.

Mai multe detalii despre idee și tradeoff-uri în [IDEA.md](IDEA.md).

## Tehnologii

- [Three.js](https://threejs.org/) — scenă 3D, geometrie procedurală, materiale, lumini
- Post-processing (`EffectComposer` + `UnrealBloomPass`) pentru glow-ul neon
- `OrbitControls` pentru navigarea camerei

## Dezvoltare

```bash
npm install       # instalează dependențele
npm run dev       # dev server pe http://localhost:5173
npm run build     # typecheck (tsc) + build de producție în dist/
npm run preview   # servește build-ul de producție local
```

## Structură

- `index.html` — pagina gazdă (canvas-ul e creat din cod)
- `src/main.ts` — scenă, cameră, renderer, bloom, controale GUI, bucla de animație
- `src/mandala.ts` — generatorul procedural de mandale (seed determinist, straturi, simetrie radială)
- `src/palettes.ts` — paletele de culori neon
