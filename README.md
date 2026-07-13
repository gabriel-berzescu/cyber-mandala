# cyber-mandala

Generator interactiv de **mandale 3D** în browser, construit cu **Three.js** —
geometrie sacră întâlnește estetica neon / cyberpunk.

**Demo live:** <https://gabriel-berzescu.github.io/cyber-mandala/>
(publicat automat pe GitHub Pages la fiecare push pe `main`)

## Concept

- Mandale **3D generate procedural**, cu simetrie radială configurabilă,
  randate în timp real cu Three.js (WebGL).
- Generare **deterministă pe bază de seed**: același seed produce aceeași
  mandala; butonul *regenerate* alege un seed nou, aleator.
- Fiecare strat combină elemente alese aleator din cinci tipuri: petale
  (tuburi pe curbe Catmull-Rom), arce de tor segmentate, inele de „bijuterii"
  poliedrice, spițe radiale și pânze stelate din linii.
- Estetică neon / cyberpunk: culori saturate pe fundal întunecat, glow prin
  bloom (post-processing), câmp de stele discret pentru adâncime.
- Straturile se rotesc în sensuri alternate și pulsează ușor; nucleul —
  un icosaedru într-o colivie wireframe — se rostogolește 3D.
- Cameră orbitală: mandala poate fi rotită, apropiată, explorată din orice unghi.

Mai multe detalii despre idee și tradeoff-uri în [IDEA.md](IDEA.md).

## Controale (panoul GUI)

| Control      | Interval | Efect                                        |
|--------------|----------|----------------------------------------------|
| `symmetry`   | 3–16     | numărul de axe de simetrie radială           |
| `layers`     | 2–8      | numărul de inele concentrice                 |
| `complexity` | 0–1      | densitatea elementelor și adâncimea pe Z     |
| `palette`    | 5 palete | Neon Sunset, Cyber Ice, Toxic Grid, Vaporwave, Blood Chrome |
| `speed`      | 0–3      | viteza de rotație și pulsație                |
| `bloom`      | 0–3      | intensitatea glow-ului neon                  |
| `autoRotate` | on/off   | rotația automată a camerei                   |
| `regenerate` | buton    | seed nou → mandala complet nouă              |

## Tehnologii

- [Three.js](https://threejs.org/) — scenă 3D, geometrie procedurală, materiale, lumini
- Post-processing (`EffectComposer` + `UnrealBloomPass`) pentru glow-ul neon
- `OrbitControls` pentru navigarea camerei
- [lil-gui](https://lil-gui.georgealways.com/) pentru panoul de controale
- [Vite](https://vite.dev/) + TypeScript pentru build și dev server

## Dezvoltare

```bash
npm install       # instalează dependențele
npm run dev       # dev server pe http://localhost:5173
npm run build     # typecheck (tsc) + build de producție în dist/
npm run preview   # servește build-ul de producție local
```

### Deploy

Workflow-ul din `.github/workflows/deploy-pages.yml` face build și publică
`dist/` pe GitHub Pages la fiecare push pe `main` (build-ul folosește
`base: './'`, deci funcționează servit de la orice cale).

## Structură

- `index.html` — pagina gazdă (canvas-ul e creat din cod)
- `src/main.ts` — scenă, cameră, renderer, bloom, controale GUI, bucla de animație
- `src/mandala.ts` — generatorul procedural de mandale (seed determinist, straturi, simetrie radială)
- `src/palettes.ts` — paletele de culori neon
- `src/style.css` — stilurile paginii
