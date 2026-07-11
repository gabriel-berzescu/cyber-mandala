# Idee: cyber-mandala

Generator interactiv de **mandale 3D** în browser, construit cu **Three.js**,
cu estetică neon / cyberpunk.

## Idee de bază

- Geometrie 3D simetrică generată procedural (simetrie radială configurabilă),
  randată în timp real cu Three.js / WebGL.
- Mandala nu mai e un desen plat: are adâncime, straturi, elemente care se
  rotesc pe orbite diferite — poate fi explorată din orice unghi cu o cameră
  orbitală.
- Estetică neon / cyberpunk: materiale emissive, bloom / glow prin
  post-processing, linii luminoase, paletă întunecată.
- Controale live: număr de axe de simetrie, adâncime / număr de straturi,
  culori, viteză de animație, complexitate.

## Tradeoff

Rămâne un proiect „de show" — frumos vizual, dar mic ca scop. Three.js ne dă
însă din start mai multă adâncime tehnică decât varianta 2D Canvas. Direcții
de creștere ulterioară:

- shadere custom (GLSL) pentru efecte mai bogate decât materialele standard,
- export de screenshot / animație (PNG / GIF / video),
- salvare / partajare de presets (link-uri cu parametri),
- moduri extra: audio-reactiv, VR / WebXR.

## Status

Direcția aleasă: **3D cu Three.js**, cel mai probabil pe o structură
Vite + Three.js (import de module, dev server). Urmează scheletul de proiect
și prima mandala generată procedural.
