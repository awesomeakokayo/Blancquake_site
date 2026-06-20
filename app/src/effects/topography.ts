import * as THREE from 'three';
import { SimplexNoise } from 'three-stdlib';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function createNumberGenerator(seed: number) {
  const rng = seededRandom(seed);
  return { random: rng };
}

class RDP {
  threshold: number;
  constructor(threshold = 0.8) {
    this.threshold = threshold;
  }
  static distToSegment(p: THREE.Vector2, v: THREE.Vector2, w: THREE.Vector2): number {
    const l2 = v.distanceToSquared(w);
    if (l2 === 0) return p.distanceTo(v);
    const t = Math.max(0, Math.min(1, p.clone().sub(v).dot(w.clone().sub(v)) / l2));
    return p.distanceTo(v.clone().add(w.clone().sub(v)).multiplyScalar(t));
  }
  simplify(points: THREE.Vector2[]): THREE.Vector2[] {
    if (points.length < 3) return points;
    let maxIndex = 0;
    let maxDist = 0;
    for (let i = 1; i < points.length - 1; i++) {
      const d = RDP.distToSegment(points[i], points[0], points[points.length - 1]);
      if (d > maxDist) {
        maxDist = d;
        maxIndex = i;
      }
    }
    if (maxDist > this.threshold) {
      const left = this.simplify(points.slice(0, maxIndex + 1));
      const right = this.simplify(points.slice(maxIndex));
      return [...left, ...right.slice(1)];
    }
    return [points[0], points[points.length - 1]];
  }
}

class NoiseSample {
  ns: SimplexNoise;
  constructor(seed: number) {
    this.ns = new SimplexNoise(createNumberGenerator(seed));
  }
  sample(x: number, y: number, z: number): number {
    const e = this.ns.noise(x, y);
    const de = 0.75 * this.ns.noise(x + 80, y + 80);
    // Use z as additional offset for time evolution
    const timeOffset = z * 0.1;
    return clamp(THREE.MathUtils.mapLinear(e + de + timeOffset, -1.5, 1.5, 0.2, 0.8), 0, 1);
  }
}

class Marcher {
  thresholdList: number[];
  pointsList: THREE.Vector2[][];
  lines: THREE.Vector2[];
  constructor() {
    this.thresholdList = [];
    this.pointsList = [];
    this.lines = [];
  }
  march(sampler: (x: number, y: number) => number, size: number, minHeight: number, maxHeight: number, _maxLen = 200) {
    const heightList = [...Array(10)].map((_, i) =>
      THREE.MathUtils.mapLinear(1 - Math.pow(Math.abs(i - 5) / 5, 1 / 3), 0, 1, minHeight, maxHeight)
    );
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        const offsetX = j * size;
        const offsetY = k * size;
        const res = 100;
        const segmentSize = size / res;
        for (let x = 0; x < res; x++) {
          for (let y = 0; y < res; y++) {
            const gx = x * segmentSize + offsetX;
            const gy = y * segmentSize + offsetY;
            const x1 = gx + segmentSize;
            const y1 = gy + segmentSize;
            const v1 = sampler(gx, gy);
            const v2 = sampler(x1, gy);
            const v3 = sampler(x1, y1);
            const v4 = sampler(gx, y1);
            const cell = [v1, v2, v3, v4];
            for (const threshold of heightList) {
              this.processCell(cell, threshold, gx, gy, segmentSize);
            }
          }
        }
      }
    }
  }
  processCell(cell: number[], threshold: number, x: number, y: number, size: number) {
    let c1: THREE.Vector2, c2: THREE.Vector2, c3: THREE.Vector2;
    const bits = ((cell[0] < threshold ? 1 : 0) << 3) | ((cell[1] < threshold ? 1 : 0) << 2) | ((cell[2] < threshold ? 1 : 0) << 1) | (cell[3] < threshold ? 1 : 0);
    switch (bits) {
      case 0: return;
      case 1:
        c1 = this.interpolate(x, y + size, x, y, cell[3], cell[0], threshold);
        c2 = this.interpolate(x + size, y, x, y, cell[1], cell[0], threshold);
        this.addLine(c1, c2);
        break;
      case 2:
        c1 = this.interpolate(x + size, y, x, y, cell[1], cell[0], threshold);
        c2 = this.interpolate(x + size, y + size, x + size, y, cell[2], cell[1], threshold);
        this.addLine(c1, c2);
        break;
      case 3:
        c1 = this.interpolate(x, y + size, x, y, cell[3], cell[0], threshold);
        c2 = this.interpolate(x + size, y + size, x + size, y, cell[2], cell[1], threshold);
        this.addLine(c1, c2);
        break;
      case 4:
        c1 = this.interpolate(x + size, y + size, x + size, y, cell[2], cell[1], threshold);
        c2 = this.interpolate(x, y + size, x + size, y + size, cell[3], cell[2], threshold);
        this.addLine(c1, c2);
        break;
      case 5:
        c1 = this.interpolate(x, y + size, x, y, cell[3], cell[0], threshold);
        c2 = this.interpolate(x + size, y, x, y, cell[1], cell[0], threshold);
        c3 = this.interpolate(x, y + size, x + size, y + size, cell[3], cell[2], threshold);
        this.addLine(c1, c2);
        this.addLine(c3, c1);
        break;
      case 6:
        c1 = this.interpolate(x + size, y, x, y, cell[1], cell[0], threshold);
        c2 = this.interpolate(x, y + size, x + size, y + size, cell[3], cell[2], threshold);
        this.addLine(c1, c2);
        break;
      case 7:
        c1 = this.interpolate(x, y + size, x, y, cell[3], cell[0], threshold);
        c2 = this.interpolate(x, y + size, x + size, y + size, cell[3], cell[2], threshold);
        this.addLine(c1, c2);
        break;
      case 8:
        c1 = this.interpolate(x, y + size, x, y, cell[3], cell[0], threshold);
        c2 = this.interpolate(x, y + size, x + size, y + size, cell[3], cell[2], threshold);
        this.addLine(c1, c2);
        break;
      case 9:
        c1 = this.interpolate(x + size, y, x, y, cell[1], cell[0], threshold);
        c2 = this.interpolate(x, y + size, x + size, y + size, cell[3], cell[2], threshold);
        this.addLine(c1, c2);
        break;
      case 10:
        c1 = this.interpolate(x + size, y, x, y, cell[1], cell[0], threshold);
        c2 = this.interpolate(x, y + size, x, y, cell[3], cell[0], threshold);
        c3 = this.interpolate(x + size, y + size, x + size, y, cell[2], cell[1], threshold);
        this.addLine(c1, c2);
        this.addLine(c3, c1);
        break;
      case 11:
        c1 = this.interpolate(x + size, y + size, x + size, y, cell[2], cell[1], threshold);
        c2 = this.interpolate(x, y + size, x + size, y + size, cell[3], cell[2], threshold);
        this.addLine(c1, c2);
        break;
      case 12:
        c1 = this.interpolate(x, y + size, x, y, cell[3], cell[0], threshold);
        c2 = this.interpolate(x + size, y + size, x + size, y, cell[2], cell[1], threshold);
        this.addLine(c1, c2);
        break;
      case 13:
        c1 = this.interpolate(x + size, y, x, y, cell[1], cell[0], threshold);
        c2 = this.interpolate(x + size, y + size, x + size, y, cell[2], cell[1], threshold);
        this.addLine(c1, c2);
        break;
      case 14:
        c1 = this.interpolate(x, y + size, x, y, cell[3], cell[0], threshold);
        c2 = this.interpolate(x + size, y, x, y, cell[1], cell[0], threshold);
        this.addLine(c1, c2);
        break;
      case 15: return;
    }
  }
  interpolate(x1: number, y1: number, x2: number, y2: number, v1: number, v2: number, threshold: number): THREE.Vector2 {
    const t = (threshold - v1) / (v2 - v1);
    return new THREE.Vector2(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
  }
  addLine(a: THREE.Vector2, b: THREE.Vector2) {
    this.lines.push(a, b);
  }
  update(sampler: (x: number, y: number) => number, size: number, minHeight: number, maxHeight: number, config: any) {
    this.march(sampler, size, minHeight, maxHeight, config.maxLen);
    const pairs: THREE.Vector2[][] = [];
    for (let i = 0; i < this.lines.length; i += 2) {
      pairs.push([this.lines[i], this.lines[i + 1]]);
    }
    const lines = pairs.filter((pt) => pt[0].distanceTo(pt[1]) < config.maxLen);
    this.lines = [];
    for (const line of lines) {
      this.lines.push(line[0], line[1]);
    }
    this.groupLines();
    this.pointsList = this.pointsList.map((pt) => new RDP().simplify(pt));
  }
  groupLines() {
    let line: THREE.Vector2[] = [this.lines[0], this.lines[1]];
    for (let i = 2; i < this.lines.length; i += 2) {
      if (this.lines[i].distanceTo(this.lines[i - 1]) < 1e-4) {
        line.push(this.lines[i + 1]);
      } else {
        this.pointsList.push(line);
        line = [this.lines[i], this.lines[i + 1]];
      }
    }
    this.pointsList.push(line);
  }
}

class ContourLineSystem {
  scene: THREE.Scene;
  lines: THREE.Mesh[];
  maxLines: number;
  baseMaterial: MeshLineMaterial;
  resolution: THREE.Vector2;

  constructor(scene: THREE.Scene, width: number, height: number) {
    this.scene = scene;
    this.lines = [];
    this.maxLines = 500;
    this.resolution = new THREE.Vector2(width, height);
    this.baseMaterial = new MeshLineMaterial({
      lineWidth: 0.05,
      dashArray: 0,
      dashOffset: 0,
      dashRatio: 0.99,
      opacity: 2,
      color: new THREE.Color('#F7C518'),
      resolution: this.resolution,
    });
    this.baseMaterial.transparent = true;
    this.baseMaterial.depthWrite = false;
  }

  clear() {
    for (const line of this.lines) {
      this.scene.remove(line);
      const geom = line.geometry as MeshLineGeometry;
      if (geom) geom.dispose();
      const mat = line.material as MeshLineMaterial;
      if (mat) mat.dispose();
    }
    this.lines = [];
  }

  addLine(points: THREE.Vector2[]) {
    if (this.lines.length >= this.maxLines) return;
    const pts: THREE.Vector3[] = [];
    for (const p of points) {
      pts.push(new THREE.Vector3(p.x, p.y, 0));
    }
    const geometry = new MeshLineGeometry();
    geometry.setPoints(pts);
    const mat = new MeshLineMaterial({
      lineWidth: 0.05,
      dashArray: 0,
      dashOffset: 0,
      dashRatio: 0.99,
      opacity: 2,
      color: new THREE.Color('#F7C518'),
      resolution: this.resolution.clone(),
    });
    mat.transparent = true;
    mat.depthWrite = false;
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.renderOrder = 10;
    this.scene.add(mesh);
    this.lines.push(mesh);
  }

  updateColors() {
    const c = new THREE.Color();
    for (let i = 0; i < this.lines.length; i++) {
      c.setHSL(THREE.MathUtils.mapLinear(i % 256, 0, 256, 0.3, 0.5), 1, 0.5);
      (this.lines[i].material as MeshLineMaterial).color = c.clone();
    }
  }
}

export class TopographyScene {
  container: HTMLElement;
  width: number;
  height: number;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  clock: THREE.Clock;
  mesh!: THREE.Mesh;
  cm!: ContourLineSystem;
  config: any;
  disposed: boolean;
  rafId: number;
  t: number;
  mouseX: number;
  mouseY: number;

  constructor(container: HTMLElement) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.clock = new THREE.Clock();
    this.disposed = false;
    this.rafId = 0;
    this.t = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.config = {
      scale: 32,
      size: 0.9,
      minHeight: 0.2,
      maxHeight: 0.8,
      speed: 0.12,
      strokeThickness: 1.1,
      numStrokeColors: 256,
      lightColor: '#F7C518',
      darkColor: '#2C2A6B',
      strokeColor: '#C14B3C',
      maxLen: 200,
    };
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#2C2A6B');

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 10000);
    this.camera.position.set(0, 0, 14);

    const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.6);
    this.scene.add(ambientLight);

    const lightPositions = [[0, 20, 0], [0, -20, 0]];
    for (const pos of lightPositions) {
      const dirLight = new THREE.DirectionalLight(new THREE.Color('#ffffff'), 0.6);
      dirLight.position.set(pos[0], pos[1], pos[2]);
      dirLight.castShadow = true;
      this.scene.add(dirLight);
    }

    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30, 500, 500),
      new THREE.MeshStandardMaterial({
        polygonOffset: true,
        polygonOffsetFactor: 1,
        side: THREE.DoubleSide,
        color: new THREE.Color('#2C2A6B'),
        transparent: true,
        opacity: 0.3,
      })
    );
    this.scene.add(this.mesh);

    this.cm = new ContourLineSystem(this.scene, this.width * window.devicePixelRatio, this.height * window.devicePixelRatio);

    this.container.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);

    this.animate();
  }

  onMouseMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  onResize = () => {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.cm.resolution.set(this.width * window.devicePixelRatio, this.height * window.devicePixelRatio);
  };

  animate = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);

    this.t += this.config.speed * 0.01;
    const ns = new NoiseSample(Math.floor(Math.random() * 2 ** 16));
    const sampler = (x: number, y: number) => ns.sample(x * this.config.scale, y * this.config.scale, this.t);
    const marcher = new Marcher();
    marcher.update(sampler, this.config.size, this.config.minHeight, this.config.maxHeight, this.config);

    this.cm.clear();
    for (let i = 0; i < marcher.pointsList.length; i++) {
      if (marcher.pointsList[i].length > 1) {
        this.cm.addLine(marcher.pointsList[i]);
      }
    }
    this.cm.updateColors();

    this.mesh.rotation.z += 0.002;

    const targetRotX = this.mouseY * 0.1;
    const targetRotY = this.mouseX * 0.1;
    this.mesh.rotation.x += (targetRotX - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (targetRotY - this.mesh.rotation.y) * 0.05;

    this.renderer.render(this.scene, this.camera);
  };

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
    this.cm.clear();
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
    }
  }
}
