import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import GUI from 'lil-gui';
import { createMandala, animateMandala, disposeMandala } from './mandala';
import { PALETTES } from './palettes';
import './style.css';

let seed = Math.floor(Math.random() * 2 ** 31);

const settings = {
  symmetry: 8,
  layers: 5,
  complexity: 0.6,
  palette: PALETTES[0].name,
  speed: 1,
  bloom: 1.15,
  autoRotate: true,
  regenerate: () => {
    seed = Math.floor(Math.random() * 2 ** 31);
    rebuild();
  },
};

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, -5, 12);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = settings.autoRotate;
controls.autoRotateSpeed = 0.6;
controls.minDistance = 3;
controls.maxDistance = 60;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  settings.bloom,
  0.55,
  0.1,
);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

// Câmp de stele discret, pentru adâncime în fundal.
function createStars(): THREE.Points {
  const count = 600;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 30 + Math.random() * 40;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0x8899bb,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
  });
  return new THREE.Points(geometry, material);
}
scene.add(createStars());

let mandala: THREE.Group | null = null;

function rebuild(): void {
  if (mandala) {
    scene.remove(mandala);
    disposeMandala(mandala);
  }
  const palette = PALETTES.find((p) => p.name === settings.palette) ?? PALETTES[0];
  scene.background = new THREE.Color(palette.background);
  mandala = createMandala({
    seed,
    symmetry: settings.symmetry,
    layers: settings.layers,
    complexity: settings.complexity,
    colors: palette.colors,
  });
  scene.add(mandala);
}
rebuild();

const gui = new GUI({ title: 'cyber-mandala' });
gui.add(settings, 'symmetry', 3, 16, 1).onChange(rebuild);
gui.add(settings, 'layers', 2, 8, 1).onChange(rebuild);
gui.add(settings, 'complexity', 0, 1, 0.05).onChange(rebuild);
gui.add(settings, 'palette', PALETTES.map((p) => p.name)).onChange(rebuild);
gui.add(settings, 'speed', 0, 3, 0.05);
gui.add(settings, 'bloom', 0, 3, 0.05).onChange((value: number) => {
  bloomPass.strength = value;
});
gui.add(settings, 'autoRotate').onChange((value: boolean) => {
  controls.autoRotate = value;
});
gui.add(settings, 'regenerate');

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  if (mandala) animateMandala(mandala, clock.elapsedTime, delta, settings.speed);
  controls.update();
  composer.render();
});
