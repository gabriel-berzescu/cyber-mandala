# Idee: cyber-mandala

Generator interactiv de mandale în browser, cu estetică neon / cyberpunk.

## Idee de bază

- Geometrie simetrică generată procedural (simetrie radială configurabilă).
- Estetică neon / cyberpunk: linii luminoase, glow, paletă întunecată.
- Controale live: număr de axe de simetrie, culori, viteză de animație, complexitate.
- Rulează ca un **Artifact single-file HTML + Canvas**, fără build step.

## Tradeoff

Rămâne un proiect „de show" — frumos vizual, dar mic ca scop. Dacă vrem mai multă
adâncime tehnică putem trece ulterior la:

- WebGL / shaders pentru efecte mai bogate,
- export SVG / GIF,
- salvare / partajare de presets,
- structură Vite + TypeScript pentru un mini-proiect real.

## Status

Pornim în stil Artifact (single-file HTML) ca să vedem cum arată, apoi decidem
dacă îl transformăm în ceva mai mare.
