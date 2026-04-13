import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ViewStyle,
} from 'react-native';
import WebView from 'react-native-webview';

// ─────────────────────────────────────────────────────────────────────────────
// Vertex Shader
// THREE.ShaderMaterial auto-injects: position, uv, modelViewMatrix,
// projectionMatrix — no need to redeclare them.
// ─────────────────────────────────────────────────────────────────────────────
const VERTEX_SHADER = `
precision highp float;

uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3  distortionAxis;
uniform vec3  rotationAxis;
uniform float uDistortion;

varying vec2 vUv;

const float PI = 3.141592653589793;

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s  = sin(angle);
  float c  = cos(angle);
  float oc = 1.0 - c;
  return mat4(
    oc*axis.x*axis.x + c,         oc*axis.x*axis.y - axis.z*s, oc*axis.z*axis.x + axis.y*s, 0.0,
    oc*axis.x*axis.y + axis.z*s,  oc*axis.y*axis.y + c,        oc*axis.y*axis.z - axis.x*s, 0.0,
    oc*axis.z*axis.x - axis.y*s,  oc*axis.y*axis.z + axis.x*s, oc*axis.z*axis.z + c,        0.0,
    0.0, 0.0, 0.0, 1.0
  );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  return (rotationMatrix(axis, angle) * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5
    ? 16.0 * pow(t, 5.0)
    : -0.5 * abs(pow(2.0*t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;
  float norm   = 0.5;
  vec3  newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.0) / norm;
  float lp     = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset)
    / (1.0 - 0.01 * uDistortion),
    0.0, 2.0
  );
  lp     = qinticInOut(lp) * PI;
  newpos = rotate(newpos, rotationAxis, lp);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2      uImageSize;
uniform vec2      uPlaneSize;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  float imageAspect = uImageSize.x / uImageSize.y;
  float planeAspect = uPlaneSize.x  / uPlaneSize.y;
  vec2  scale       = vec2(1.0);
  if (planeAspect > imageAspect) {
    scale.x = imageAspect / planeAspect;
  } else {
    scale.y = planeAspect / imageAspect;
  }
  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;
  gl_FragColor = texture2D(tMap, uv);
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// HTML Builder
// ─────────────────────────────────────────────────────────────────────────────
interface BuildHTMLParams {
  items: string[];
  planeWidth: number;
  planeHeight: number;
  distortion: number;
  scrollEase: number;
  cameraFov: number;
  cameraZ: number;
}

function buildHTML({
  items,
  planeWidth,
  planeHeight,
  distortion,
  scrollEase,
  cameraFov,
  cameraZ,
}: BuildHTMLParams): string {
  const esc = (s: string) => s.replace(/`/g, '\\`').replace(/\$/g, '\\$');

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0,
        maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent;
    }
    canvas {
      display: block;
      width: 100% !important;
      height: 100% !important;
      touch-action: none;
      background: transparent;
    }
  </style>
</head>
<body>
<canvas id="c"></canvas>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
// ── Config ────────────────────────────────────────────────────────────────
const ITEMS = ${JSON.stringify(items)};
const CFG   = {
  planeWidth : ${planeWidth},
  planeHeight: ${planeHeight},
  distortion : ${distortion},
  scrollEase : ${scrollEase},
  cameraFov  : ${cameraFov},
  cameraZ    : ${cameraZ},
};

// ── Shaders ───────────────────────────────────────────────────────────────
const vertexShader   = \`${esc(VERTEX_SHADER)}\`;
const fragmentShader = \`${esc(FRAGMENT_SHADER)}\`;

// ── Helpers ───────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const map  = (n, a, b, c, d) => (n - a) / (b - a) * (d - c) + c;

// ── Renderer ──────────────────────────────────────────────────────────────
const canvas   = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha             : true,
  antialias         : true,
  premultipliedAlpha: false,
});
renderer.setClearColor(0x000000, 0); // fully transparent clear
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CFG.cameraFov, 1, 0.1, 100);
camera.position.z = CFG.cameraZ;

// widthSegments:100 reproduces the smooth OGL distortion curve
const planeGeo = new THREE.PlaneGeometry(1, 1, 100, 1);

const scroll = { ease: CFG.scrollEase, current: 0, target: 0, last: 0 };

function getViewport() {
  const fov = (camera.fov * Math.PI) / 180;
  const h   = 2 * Math.tan(fov / 2) * camera.position.z;
  return { width: h * camera.aspect, height: h };
}

// ── Media (one poster) ────────────────────────────────────────────────────
class Media {
  constructor(image, index, length) {
    this.index       = index;
    this.length      = length;
    this.extra       = 0;
    this.padding     = 0;
    this.height      = 0;
    this.heightTotal = 0;
    this.y           = 0;

    const loader  = new THREE.TextureLoader();
    const texture = loader.load(image, (tex) => {
      const w = tex.image.naturalWidth  || tex.image.width  || 512;
      const h = tex.image.naturalHeight || tex.image.height || 512;
      this.uniforms.uImageSize.value.set(w, h);
    });
    texture.generateMipmaps = false;
    texture.minFilter       = THREE.LinearFilter;
    texture.magFilter       = THREE.LinearFilter;

    this.uniforms = {
      tMap          : { value: texture },
      uPosition     : { value: 0 },
      uPlaneSize    : { value: new THREE.Vector2(1, 1) },
      uImageSize    : { value: new THREE.Vector2(512, 512) },
      uSpeed        : { value: 0 },
      rotationAxis  : { value: new THREE.Vector3(0, 1, 0) },
      distortionAxis: { value: new THREE.Vector3(1, 1, 0) },
      uDistortion   : { value: CFG.distortion },
      uViewportSize : { value: new THREE.Vector2(1, 1) },
      uTime         : { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms   : this.uniforms,
      side       : THREE.DoubleSide,
      transparent: true,
      depthTest  : false,
      depthWrite : false,
    });

    this.mesh = new THREE.Mesh(planeGeo, material);
    scene.add(this.mesh);
    this.onResize();
  }

  onResize() {
    const vp = getViewport();
    const sw = window.innerWidth;
    const sh = window.innerHeight;

    this.mesh.scale.x = (vp.width  * CFG.planeWidth)  / sw;
    this.mesh.scale.y = (vp.height * CFG.planeHeight) / sh;
    this.mesh.position.x = 0;

    this.uniforms.uPlaneSize.value.set(this.mesh.scale.x, this.mesh.scale.y);
    this.uniforms.uViewportSize.value.set(vp.width, vp.height);

    this.padding     = 5;
    this.height      = this.mesh.scale.y + this.padding;
    this.heightTotal = this.height * this.length;
    this.y           = -this.heightTotal / 2 + (this.index + 0.5) * this.height;
  }

  update(sc) {
    this.mesh.position.y = this.y - sc.current - this.extra;

    const vp       = getViewport();
    const position = map(this.mesh.position.y, -vp.height, vp.height, 5, 15);

    this.uniforms.uPosition.value  = position;
    this.uniforms.uTime.value     += 0.04;
    this.uniforms.uSpeed.value     = sc.current;

    const planeH = this.mesh.scale.y;
    const vpH    = vp.height;
    const top    = this.mesh.position.y + planeH / 2;
    const bot    = this.mesh.position.y - planeH / 2;

    if (top < -vpH / 2) this.extra -= this.heightTotal;
    else if (bot > vpH / 2) this.extra += this.heightTotal;
  }
}

// ── Build posters ─────────────────────────────────────────────────────────
const medias = ITEMS.map((src, i) => new Media(src, i, ITEMS.length));

// ── Resize ────────────────────────────────────────────────────────────────
function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  medias.forEach(m => m.onResize());
}
window.addEventListener('resize', onResize);
onResize();

// ── Animation loop ────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  scroll.current = lerp(scroll.current, scroll.target, scroll.ease);
  medias.forEach(m => m.update(scroll));
  renderer.render(scene, camera);
  scroll.last = scroll.current;
}
animate();

// ── Input: Wheel ──────────────────────────────────────────────────────────
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  scroll.target += e.deltaY * 0.005;
}, { passive: false });

// ── Input: Mouse ──────────────────────────────────────────────────────────
let isDown = false, startY = 0, savedPos = 0;

canvas.addEventListener('mousedown', (e) => {
  isDown = true; savedPos = scroll.current; startY = e.clientY;
});
window.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  scroll.target = savedPos + (startY - e.clientY) * 0.1;
});
window.addEventListener('mouseup', () => { isDown = false; });

// ── Input: Touch (Android) ────────────────────────────────────────────────
canvas.addEventListener('touchstart', (e) => {
  isDown = true; savedPos = scroll.current; startY = e.touches[0].clientY;
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!isDown) return;
  scroll.target = savedPos + (startY - e.touches[0].clientY) * 0.1;
}, { passive: false });

canvas.addEventListener('touchend', () => { isDown = false; });
</script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FlyingPosters — React Native Component
// ─────────────────────────────────────────────────────────────────────────────
interface FlyingPostersProps {
  items?: string[];
  planeWidth?: number;
  planeHeight?: number;
  distortion?: number;
  scrollEase?: number;
  cameraFov?: number;
  cameraZ?: number;
  style?: ViewStyle;
}

function FlyingPosters({
  items       = [],
  planeWidth  = 320,
  planeHeight = 320,
  distortion  = 3,
  scrollEase  = 0.01,
  cameraFov   = 45,
  cameraZ     = 20,
  style,
}: FlyingPostersProps) {
  const html = buildHTML({
    items, planeWidth, planeHeight,
    distortion, scrollEase, cameraFov, cameraZ,
  });

  return (
    <View style={[styles.fpContainer, style]}>
      <WebView
        source={{ html }}
        /**
         * ✅ FIX 1: backgroundColor prop removed (unreliable on Android).
         *    Transparency is now handled in THREE.js via setClearColor(0,0)
         *    and in CSS via background:transparent.
         *    Here we use style={{ backgroundColor:'transparent' }} instead.
         *
         * ✅ FIX 2: androidLayerType="hardware" prevents the white flash
         *    on first render on Android.
         */
        style={[styles.webview, { backgroundColor: 'transparent' }]}
        scrollEnabled={false}
        javaScriptEnabled
        originWhitelist={['*']}
        mixedContentMode="always"
        androidLayerType="hardware"
        renderLoading={() => <></>}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App — Entry Point
// ─────────────────────────────────────────────────────────────────────────────
const ITEMS: string[] = [
  'https://picsum.photos/500/500?grayscale',
  'https://picsum.photos/600/600?grayscale',
  'https://picsum.photos/400/400?grayscale',
];

export default function App() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* 600px tall container — mirrors height:'600px' from the web version */}
      <View style={styles.posterContainer}>
        <FlyingPosters
          items={ITEMS}
          planeWidth={320}
          planeHeight={320}
          distortion={3}
          scrollEase={0.01}
          cameraFov={45}
          cameraZ={20}
        />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── App ───────────────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  posterContainer: {
    height: 600,
  },

  // ── FlyingPosters ─────────────────────────────────────────────────────────
  fpContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    // ✅ FIX: backgroundColor via style prop, not standalone prop
    backgroundColor: 'transparent',
  },
});