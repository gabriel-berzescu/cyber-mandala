import { defineConfig } from 'vite';

export default defineConfig({
  // Bază relativă, ca build-ul să funcționeze și pe GitHub Pages
  // (servit din /cyber-mandala/), și pe orice alt hosting static.
  base: './',
});
