import * as THREE from 'three';

const noiseGLSL = `
// Classic 3D Simplex Noise by Stefan Gustavson
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0) )
           + i.y + vec4(0.0, i1.y, i2.y, 1.0) )
           + i.x + vec4(0.0, i1.x, i2.x, 1.0) );

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform float uHeights[10];
uniform float uLineWidth;
uniform float uScale;
uniform float uSpeed;

varying vec2 vUv;
varying vec3 vPosition;

${noiseGLSL}

void main() {
  // Scale position for noise density
  vec3 noisePos = vec3(vPosition.xy * uScale, uTime * uSpeed);
  
  // Calculate simplex noise (two octaves)
  float e = snoise(noisePos);
  float de = 0.75 * snoise(noisePos + vec3(80.0, 80.0, 80.0));
  
  // Combine noise and map to [0.0, 1.0]
  float h = clamp(((e + 0.75 * de) / 1.75) * 0.5 + 0.5, 0.0, 1.0);
  
  // Compute distance-field contour lines using derivatives for uniform width
  float lineMask = 0.0;
  float dh = fwidth(h);
  for (int i = 0; i < 10; i++) {
    float dist = abs(h - uHeights[i]) / (dh + 0.0001);
    float intensity = smoothstep(uLineWidth, uLineWidth - 1.0, dist);
    lineMask = max(lineMask, intensity);
  }
  
  // Brand color scheme colors
  vec3 bgCol = vec3(44.0/255.0, 42.0/255.0, 107.0/255.0); // #2C2A6B (Dark Blue)
  vec3 goldCol = vec3(247.0/255.0, 197.0/255.0, 24.0/255.0); // #F7C518 (Yellow/Gold)
  vec3 coralCol = vec3(193.0/255.0, 75.0/255.0, 60.0/255.0); // #C14B3C (Coral/Red)
  
  // Map line colors dynamically to height
  vec3 lineCol = mix(coralCol, goldCol, h);
  
  // Combine background and contour lines
  vec3 finalColor = mix(bgCol, lineCol, lineMask);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface TopographyConfig {
  scale: number;
  speed: number;
  lineWidth: number;
  minHeight: number;
  maxHeight: number;
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
  material!: THREE.ShaderMaterial;
  config: TopographyConfig;
  disposed: boolean;
  paused: boolean;
  rafId: number;
  mouseX: number;
  mouseY: number;

  constructor(container: HTMLElement) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.clock = new THREE.Clock();
    this.disposed = false;
    this.paused = false;
    this.rafId = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    
    this.config = {
      scale: 0.12, // Adjusted spatial noise density
      speed: 0.08,  // Temporal evolution speed
      lineWidth: 1.2, // Width in pixels on-screen
      minHeight: 0.25,
      maxHeight: 0.75,
    };
  }

  init() {
    // Create Renderer with optimized pixel ratio capped at 1.5
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.container.appendChild(this.renderer.domElement);
    
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#2C2A6B');

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 14);

    // Compute spacing list for the 10 contour thresholds (matches original spacing curve)
    const minHeight = this.config.minHeight;
    const maxHeight = this.config.maxHeight;
    const heights = new Float32Array(
      Array.from({ length: 10 }, (_, i) =>
        THREE.MathUtils.mapLinear(1 - Math.pow(Math.abs(i - 5) / 5, 1.0 / 3.0), 0, 1, minHeight, maxHeight)
      )
    );

    // Custom ShaderMaterial
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uHeights: { value: heights },
        uLineWidth: { value: this.config.lineWidth },
        uScale: { value: this.config.scale },
        uSpeed: { value: this.config.speed },
      },
      depthWrite: false,
    });

    // Create simple flat PlaneGeometry with only 4 vertices (instead of 250,000!)
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(32, 32, 1, 1), this.material);
    this.scene.add(this.mesh);

    this.container.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    this.animate();
  }

  onMouseMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  onResize = () => {
    if (this.disposed) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  };

  pause() {
    this.paused = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  resume() {
    if (this.disposed) return;
    if (this.paused) {
      this.paused = false;
      this.clock.getDelta(); // Reset clock delta
      this.animate();
    }
  }

  animate = () => {
    if (this.disposed || this.paused) return;
    this.rafId = requestAnimationFrame(this.animate);

    const time = this.clock.getElapsedTime();
    this.material.uniforms.uTime.value = time;

    // Apply rotation and tilt based on mouse interaction
    this.mesh.rotation.z = time * 0.005;
    
    const targetRotX = this.mouseY * 0.08;
    const targetRotY = this.mouseX * 0.08;
    this.mesh.rotation.x += (targetRotX - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (targetRotY - this.mesh.rotation.y) * 0.05;

    this.renderer.render(this.scene, this.camera);
  };

  destroy() {
    this.disposed = true;
    this.paused = true;
    cancelAnimationFrame(this.rafId);
    
    this.container.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
    
    if (this.mesh) {
      if (this.mesh.geometry) this.mesh.geometry.dispose();
      this.scene.remove(this.mesh);
    }
    if (this.material) {
      this.material.dispose();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
    }
  }
}
