import * as THREE from 'three';

const vertexShader = `
uniform float time;
uniform float angle;
uniform float radius;
uniform vec2 uScrollOffset;
varying vec2 vUv;
#define PI 3.14159265359

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat4(
    oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s, 0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s, 0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,          0.0,
    0.0, 0.0, 0.0, 1.0
  );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  return (rotationMatrix(axis, angle) * vec4(v, 1.0)).xyz;
}

void main() {
  vUv = uv;
  vec3 newposition = position;
  float finalAngle = angle;
  newposition = rotate(newposition, vec3(0.0, 0.0, 1.0), finalAngle);
  newposition.x += radius;
  newposition = rotate(newposition, vec3(0.0, 1.0, 0.0), uScrollOffset.x);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0);
}
`;

const fragmentShader = `
uniform float opacity;
uniform sampler2D texture1;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(texture1, vUv);
  float grad = smoothstep(0.3, 0.9, 1.0 - distance(vec2(0.5), vUv));
  color.a *= grad;
  color.a *= opacity;
  gl_FragColor = color;
}
`;

function generateTextTexture(text: string, fontSize = 60, font = 'DM Sans'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${fontSize}px ${font}`;
  const textWidth = ctx.measureText(text).width;
  const w = textWidth * 0.8;
  const h = w;
  canvas.width = w;
  canvas.height = h;
  ctx.font = `${fontSize}px ${font}`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(text, w / 2, h / 2 + fontSize * 0.35);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export class TextCylinderScene {
  container: HTMLElement;
  width: number;
  height: number;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  clock: THREE.Clock;
  textMesh1!: THREE.Mesh;
  textMesh2!: THREE.Mesh;
  disposed: boolean;
  rafId: number;

  constructor(container: HTMLElement) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.clock = new THREE.Clock();
    this.disposed = false;
    this.rafId = 0;
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';

    this.scene = new THREE.Scene();

    const params = { font: 'DM Sans', text: 'EVERY CHILD MATTERS \u00b7 EVERY CHILD MATTERS \u00b7 ', size: 0.8 };
    const geometry = new THREE.CylinderGeometry(1, 1, 0.3, 64, 1, true);
    const textTexture = generateTextTexture(params.text);
    textTexture.needsUpdate = true;

    const mat1 = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        time: { value: 0 },
        angle: { value: Math.PI / 1 },
        radius: { value: params.size },
        texture1: { value: textTexture },
        opacity: { value: 0.12 },
        uScrollOffset: { value: new THREE.Vector2() },
      },
      side: THREE.DoubleSide,
    });

    this.textMesh1 = new THREE.Mesh(geometry, mat1);
    this.textMesh1.position.z = 0;
    this.scene.add(this.textMesh1);

    this.textMesh2 = this.textMesh1.clone();
    this.textMesh2.scale.x = -1;
    this.textMesh2.position.z = 0.1;
    this.textMesh2.rotation.y = Math.PI;
    const mat2 = mat1.clone();
    mat2.uniforms = {
      time: { value: 0 },
      angle: { value: Math.PI / 1 },
      radius: { value: params.size },
      texture1: { value: textTexture },
      opacity: { value: 0.08 },
      uScrollOffset: { value: new THREE.Vector2() },
    };
    this.textMesh2.material = mat2;
    this.scene.add(this.textMesh2);

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 10000);
    this.camera.position.set(0, 0, 10);

    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  onResize = () => {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  };

  animate = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);

    const scrollSpeed = 0.0004;
    const time = this.clock.getElapsedTime();

    const mat1 = this.textMesh1.material as THREE.ShaderMaterial;
    mat1.uniforms.time.value = time;
    mat1.uniforms.angle.value = time * scrollSpeed;
    mat1.uniforms.uScrollOffset.value.x = time * scrollSpeed;

    const mat2 = this.textMesh2.material as THREE.ShaderMaterial;
    mat2.uniforms.time.value = time;
    mat2.uniforms.angle.value = -time * scrollSpeed;
    mat2.uniforms.uScrollOffset.value.x = -time * scrollSpeed;

    this.renderer.render(this.scene, this.camera);
  };

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
    }
  }
}
