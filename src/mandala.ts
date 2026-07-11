import * as THREE from 'three';

export interface MandalaParams {
  seed: number;
  symmetry: number;
  layers: number;
  complexity: number; // 0..1
  colors: number[];
}

type Rand = () => number;

// PRNG determinist (mulberry32) — același seed produce aceeași mandala.
function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: Rand, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

// Petale: un tub închis pe o curbă Catmull-Rom, clonat cu simetrie radială.
function petalRing(
  rand: Rand,
  material: THREE.Material,
  symmetry: number,
  rInner: number,
  rOuter: number,
  z: number,
): THREE.Group {
  const group = new THREE.Group();
  const spread = (0.3 + rand() * 0.5) * (rOuter - rInner);
  const lift = (rand() - 0.5) * 1.4;
  const mid = (rInner + rOuter) / 2;
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(rInner, 0, 0),
      new THREE.Vector3(mid, spread, lift * 0.6),
      new THREE.Vector3(rOuter, 0, lift),
      new THREE.Vector3(mid, -spread, lift * 0.6),
    ],
    true,
  );
  const geometry = new THREE.TubeGeometry(curve, 64, 0.02 + rand() * 0.04, 8, true);
  for (let k = 0; k < symmetry; k++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.z = (k / symmetry) * Math.PI * 2;
    mesh.position.z = z;
    group.add(mesh);
  }
  return group;
}

// Inel segmentat: arce de tor cu goluri, cu simetrie radială.
function arcRing(
  rand: Rand,
  material: THREE.Material,
  symmetry: number,
  radius: number,
  z: number,
): THREE.Group {
  const group = new THREE.Group();
  const fill = 0.45 + rand() * 0.4;
  const arc = ((Math.PI * 2) / symmetry) * fill;
  const geometry = new THREE.TorusGeometry(radius, 0.02 + rand() * 0.03, 8, 48, arc);
  for (let k = 0; k < symmetry; k++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.z = (k / symmetry) * Math.PI * 2;
    mesh.position.z = z;
    group.add(mesh);
  }
  return group;
}

// Cerc de "bijuterii": mici poliedre orbitând la aceeași rază, cu zigzag pe Z.
function dotRing(
  rand: Rand,
  material: THREE.Material,
  symmetry: number,
  radius: number,
  z: number,
): THREE.Group {
  const group = new THREE.Group();
  const size = 0.08 + rand() * 0.14;
  const zigzag = (rand() - 0.5) * 0.7;
  const geometry = pick<THREE.BufferGeometry>(rand, [
    new THREE.OctahedronGeometry(size),
    new THREE.TetrahedronGeometry(size * 1.2),
    new THREE.BoxGeometry(size, size, size),
  ]);
  for (let k = 0; k < symmetry; k++) {
    const angle = (k / symmetry) * Math.PI * 2;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, z + (k % 2) * zigzag);
    mesh.rotation.z = angle;
    group.add(mesh);
  }
  return group;
}

// Spițe: bare radiale subțiri între raza interioară și cea exterioară.
function spokeRing(
  rand: Rand,
  material: THREE.Material,
  symmetry: number,
  rInner: number,
  rOuter: number,
  z: number,
): THREE.Group {
  const group = new THREE.Group();
  const width = 0.02 + rand() * 0.03;
  const length = rOuter - rInner;
  const geometry = new THREE.BoxGeometry(length, width, width);
  for (let k = 0; k < symmetry; k++) {
    const angle = (k / symmetry) * Math.PI * 2;
    const mesh = new THREE.Mesh(geometry, material);
    const r = rInner + length / 2;
    mesh.position.set(Math.cos(angle) * r, Math.sin(angle) * r, z);
    mesh.rotation.z = angle;
    group.add(mesh);
  }
  return group;
}

// Pânză stelată: linii care leagă fiecare al n-lea punct de pe cerc.
function starWeb(
  rand: Rand,
  color: number,
  symmetry: number,
  radius: number,
  z: number,
): THREE.LineSegments {
  const step = 1 + Math.floor(rand() * Math.max(1, Math.floor(symmetry / 2) - 1));
  const positions: number[] = [];
  for (let k = 0; k < symmetry; k++) {
    const a = (k / symmetry) * Math.PI * 2;
    const b = (((k + step) % symmetry) / symmetry) * Math.PI * 2;
    positions.push(Math.cos(a) * radius, Math.sin(a) * radius, z);
    positions.push(Math.cos(b) * radius, Math.sin(b) * radius, z);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.55 });
  return new THREE.LineSegments(geometry, material);
}

function setLayerMotion(layer: THREE.Object3D, rand: Rand, index: number): void {
  const direction = index % 2 === 0 ? 1 : -1;
  layer.userData.spin = direction * (0.05 + rand() * 0.25);
  layer.userData.pulsePhase = rand() * Math.PI * 2;
  layer.userData.pulseAmp = 0.015 + rand() * 0.03;
  layer.userData.pulseFreq = 0.5 + rand() * 1.2;
}

export function createMandala(params: MandalaParams): THREE.Group {
  const rand = mulberry32(params.seed);
  const root = new THREE.Group();

  // Materialele sunt partajate per culoare, ca să nu multiplicăm resursele GPU.
  const materials = new Map<number, THREE.MeshBasicMaterial>();
  const materialFor = (color: number): THREE.MeshBasicMaterial => {
    let material = materials.get(color);
    if (!material) {
      material = new THREE.MeshBasicMaterial({ color });
      materials.set(color, material);
    }
    return material;
  };

  const coreRadius = 0.5;
  const maxRadius = 6;
  const ringStep = (maxRadius - coreRadius) / params.layers;
  const depth = 0.4 + params.complexity * 1.4;

  // Nucleul: un icosaedru plin într-o colivie wireframe, cu rotație 3D proprie.
  const core = new THREE.Group();
  core.add(new THREE.Mesh(new THREE.IcosahedronGeometry(coreRadius * 0.7, 1), materialFor(pick(rand, params.colors))));
  core.add(
    new THREE.Mesh(
      new THREE.IcosahedronGeometry(coreRadius * 1.2, 1),
      new THREE.MeshBasicMaterial({ color: pick(rand, params.colors), wireframe: true }),
    ),
  );
  core.userData.tumble = true;
  setLayerMotion(core, rand, 0);
  root.add(core);

  for (let i = 0; i < params.layers; i++) {
    const rInner = coreRadius + i * ringStep + ringStep * 0.15;
    const rOuter = rInner + ringStep * 0.8;
    const rMid = (rInner + rOuter) / 2;
    const layer = new THREE.Group();
    const componentCount = 1 + (rand() < params.complexity ? 1 : 0);
    for (let c = 0; c < componentCount; c++) {
      const color = pick(rand, params.colors);
      const z = (rand() - 0.5) * depth;
      switch (Math.floor(rand() * 5)) {
        case 0:
          layer.add(petalRing(rand, materialFor(color), params.symmetry, rInner, rOuter, z));
          break;
        case 1:
          layer.add(arcRing(rand, materialFor(color), params.symmetry, rMid, z));
          break;
        case 2:
          layer.add(dotRing(rand, materialFor(color), params.symmetry, rMid, z));
          break;
        case 3:
          layer.add(spokeRing(rand, materialFor(color), params.symmetry, rInner, rOuter, z));
          break;
        default:
          layer.add(starWeb(rand, color, params.symmetry, rOuter, z));
          break;
      }
    }
    setLayerMotion(layer, rand, i + 1);
    root.add(layer);
  }

  return root;
}

export function animateMandala(root: THREE.Group, time: number, delta: number, speed: number): void {
  for (const layer of root.children) {
    const data = layer.userData;
    layer.rotation.z += (data.spin ?? 0) * delta * speed;
    if (data.tumble) {
      layer.rotation.x += 0.2 * delta * speed;
      layer.rotation.y += 0.3 * delta * speed;
    }
    const scale = 1 + data.pulseAmp * Math.sin(time * data.pulseFreq * speed + data.pulsePhase);
    layer.scale.setScalar(scale);
  }
}

export function disposeMandala(root: THREE.Group): void {
  const materials = new Set<THREE.Material>();
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        materials.add(material);
      }
    }
  });
  for (const material of materials) material.dispose();
}
