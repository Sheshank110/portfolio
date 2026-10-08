import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
// SCHWARZSCHILD BLACK HOLE — 500,000 PARTICLE RELATIVISTIC GPU SIMULATION
// ═══════════════════════════════════════════════════════════════════════════
//
// Physics: Schwarzschild Metric (G = c = 1)
// Literature:
//   - Luminet, J.-P. (1979) "Image of a spherical black hole with thin accretion disk"
//   - Cunningham & Bardeen (1973) "The Optical Appearance of a Star Orbiting an Extreme Kerr Black Hole"
//   - Page & Thorne (1974) "Disk-Accretion by Black Holes"
//
// Key Spacetime Parameters (Rs = 10.0 visual units):
//   Event Horizon:  r_eh   = 1.00 Rs = 10.0
//   Photon Sphere:  r_ph   = 1.50 Rs = 15.0
//   ISCO:           r_isco = 3.00 Rs = 30.0
//   Apparent Shadow: b_crit = (3√3/2) Rs ≈ 25.98
//
// Particle Types (Total = 500,000):
//   0: Main Accretion Disk (240k) — Continuous Keplerian disk + smooth lensing
//   1: Photon Ring (50k)          — Spherically symmetric critical photon sphere (always a perfect circle!)
//   2: Inner ISCO Glow Rim (60k)  — Dense white-hot matter at inner edge (seamless circle face-on)
//   3: Relativistic Streaks (40k) — Orbiting photon packets with trailing arcs
//   4: Background Stars (60k)     — Celestial sphere field with twinkling
//   5: Secondary Lensed Arch (30k)— Underside light bent underneath shadow (Luminet secondary image)
//   Atmosphere (20k)              — Volumetric disk bloom
// ═══════════════════════════════════════════════════════════════════════════

const blackHoleVertexShader = `
  uniform float uTime;
  uniform float uInclination; // 0.0 = pure face-on, PI/2 = edge-on
  uniform float uAzimuth;

  attribute float aRadius;
  attribute float aBaseAngle;
  attribute float aSpeed;
  attribute float aVertical;
  attribute float aTrailIdx;
  attribute float aParticleType;  // 0=disk, 1=photonRing, 2=iscoGlow, 3=streak, 4=bgStar, 5=secArch
  attribute vec3 aColor;
  attribute float aSize;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vGlow;

  const float Rs = 10.0;
  const float r_shadow = 25.9808;

  void main() {
    float alpha_out = 1.0;
    float sizeFactor = aSize;
    vec3 finalColor = aColor;
    float glowFactor = 0.0;

    // ═══════════════════════════════════════════════════════════════
    // TYPE 4: Background Stars — Fixed in celestial space
    // ═══════════════════════════════════════════════════════════════
    if (aParticleType > 3.5 && aParticleType < 4.5) {
      float twinkle = 0.65 + 0.35 * sin(uTime * aSpeed + aBaseAngle);
      vec3 starPos = vec3(
        aRadius * cos(aBaseAngle),
        aVertical,
        aRadius * sin(aBaseAngle)
      );

      vec4 mvPos = modelViewMatrix * vec4(starPos, 1.0);
      gl_PointSize = clamp(sizeFactor * 190.0 / -mvPos.z, 0.8, 3.2);
      gl_Position = projectionMatrix * mvPos;

      vColor = finalColor * twinkle;
      vAlpha = twinkle * 0.85;
      vGlow = 0.0;
      return;
    }

    // ═══════════════════════════════════════════════════════════════
    // TYPE 1: Photon Ring — Optical projection of spherical photon sphere
    // To ANY observer from ANY rotation/angle, it is ALWAYS A PERFECT CIRCLE
    // at the critical impact parameter b_crit ≈ 25.98!
    // ═══════════════════════════════════════════════════════════════
    if (aParticleType > 0.5 && aParticleType < 1.5) {
      float ringAngle = aBaseAngle + aSpeed * uTime + uAzimuth;
      float ringRadius = aRadius; // clustered tightly at 25.98..26.6

      float x_ring = ringRadius * cos(ringAngle);
      float y_ring = ringRadius * sin(ringAngle);

      // Relativistic orbital beaming around the photon ring
      float v_los = 0.45 * sin(ringAngle);
      float g_dopp = 1.0 / (1.0 + v_los);
      float boost = clamp(g_dopp * g_dopp * g_dopp, 0.35, 2.8);

      vec3 viewPos = vec3(x_ring, y_ring, -295.0 + 1.5);
      vec4 mvPos = vec4(viewPos, 1.0);
      gl_PointSize = clamp((sizeFactor * 250.0) / -mvPos.z, 0.8, 5.0);
      gl_Position = projectionMatrix * mvPos;

      vColor = vec3(1.7, 1.7, 1.95) * boost;
      vAlpha = 0.95;
      vGlow = 0.15;
      return;
    }

    // ═══════════════════════════════════════════════════════════════
    // TYPE 5: Secondary Lensed Arch (Luminet 1979 secondary image)
    // Underside light bent underneath the black hole, hugging shadow bottom
    // ═══════════════════════════════════════════════════════════════
    if (aParticleType > 4.5) {
      float trailLag = aTrailIdx * 0.0015;
      float theta = aBaseAngle + aSpeed * uTime - trailLag + uAzimuth;
      float sinI = sin(uInclination);

      float oneMinusRsOverR = max(0.01, 1.0 - Rs / aRadius);
      float b_param = aRadius / sqrt(oneMinusRsOverR);

      float b_sec = r_shadow + (b_param - r_shadow) * 0.12;
      float x_obs = b_sec * cos(theta);
      float y_obs = - b_sec * abs(sin(theta)) * sinI;

      vec3 viewPos = vec3(x_obs, y_obs, -295.0 - 5.0);
      vec4 mvPosition = vec4(viewPos, 1.0);
      gl_PointSize = clamp((sizeFactor * 210.0) / -mvPosition.z, 0.6, 4.0);
      gl_Position = projectionMatrix * mvPosition;

      vColor = aColor;
      vAlpha = 0.70 * sinI; // Smoothly fades out when viewing face-on
      vGlow = 0.3;
      return;
    }

    // ═══════════════════════════════════════════════════════════════
    // ACCRETION DISK (Types 0, 2, 3) — Continuous Luminet Lensing
    // ═══════════════════════════════════════════════════════════════

    // ─── 1. Keplerian Orbital Phase ─────────────────────────────
    float trailLag = aTrailIdx * 0.0015;
    float theta = aBaseAngle + aSpeed * uTime - trailLag + uAzimuth;

    // ─── 2. Relativistic Impact Parameter b(r) ──────────────────
    // b(r) = r / sqrt(1 - Rs/r)
    float oneMinusRsOverR = max(0.01, 1.0 - Rs / aRadius);
    float b_param = aRadius / sqrt(oneMinusRsOverR);

    // ─── 3. Continuous Gravitational Lensing Mapping ─────────────
    // At uInclination = 0.0 (face-on):
    //   x_obs = b(r)*cos(theta), y_obs = b(r)*sin(theta) -> EXACT CONCENTRIC CIRCLES!
    // At uInclination > 0.0 (tilted):
    //   Back of disk (sin(theta) >= 0): lifts over the hole into the upper arch!
    //   Front of disk (sin(theta) < 0): sweeps in front of the black hole!
    //   Nodes (sin(theta) = 0): meet at (+-b(r), 0) with ZERO DISCONTINUITY!
    float cosI = cos(uInclination);
    float sinI = sin(uInclination);
    float sinTheta = sin(theta);
    float cosTheta = cos(theta);

    float x_obs = b_param * cosTheta;
    float y_obs;
    float z_depth;

    if (sinTheta >= 0.0) {
      // BACK OF DISK — Lensed over the black hole into upper arch
      // When cosI=1 (face-on): archLift = 1.0 -> y_obs = b_param * sinTheta
      // When cosI<1 (tilted): upper arch reaches apex b_param at sinTheta=1
      float archProfile = pow(sinTheta, 0.55);
      float archFactor = cosI + (1.0 - cosI) * archProfile;
      y_obs = b_param * sinTheta * archFactor + aVertical * cosI;
      z_depth = -4.0 - 32.0 * sinTheta * sinI; // Strictly behind shadow plane
    } else {
      // FRONT OF DISK — Passes in front of the black hole
      // When cosI=1 (face-on): y_obs = b_param * sinTheta -> MATCHES UPPER HALF EXACTLY!
      // When cosI<1 (tilted): flattened ellipse of minor axis b_param * cosI
      y_obs = b_param * sinTheta * cosI + aVertical * cosI;
      z_depth = 4.0 + 32.0 * abs(sinTheta) * sinI; // Strictly in front of shadow plane
    }

    // ─── 4. Relativistic Doppler Beaming (I ∝ g³) ───────────────
    // Approaching side (left, cosTheta < 0) is blue-shifted & beamed
    // Receding side (right, cosTheta > 0) is red-shifted & dimmed
    float v_orb = sqrt(Rs / (2.0 * aRadius));
    float v_los = - v_orb * cosTheta * sinI;
    float gamma = 1.0 / sqrt(max(0.01, 1.0 - v_orb * v_orb));
    float g_doppler = 1.0 / (gamma * (1.0 + v_los));
    float intensityBoost = clamp(g_doppler * g_doppler * g_doppler, 0.25, 4.0);

    // ─── 5. Gravitational Redshift (g⁴) ─────────────────────────
    float g_grav = sqrt(max(0.1, oneMinusRsOverR));
    float gravDim = g_grav * g_grav * g_grav * g_grav;

    finalColor = aColor * intensityBoost * gravDim;

    // ─── 6. Particle-Type-Specific Styling ───────────────────────
    if (aParticleType < 0.5) {
      // Main accretion disk
      glowFactor = 0.35;
      alpha_out = 0.88;
    }
    else if (aParticleType > 1.5 && aParticleType < 2.5) {
      // TYPE 2: Inner ISCO Glow Rim — Blazing white-hot matter near ISCO
      glowFactor = 0.70;
      float pulse = 1.15 + 0.2 * sin(uTime * 2.8 + aBaseAngle * 2.0);
      finalColor = vec3(pulse * 1.3, pulse * 1.15, pulse * 1.0) * intensityBoost * gravDim;
      alpha_out = 0.75;
    }
    else if (aParticleType > 2.5 && aParticleType < 3.5) {
      // TYPE 3: Relativistic Light Streaks
      if (aTrailIdx > 0.5) {
        float trailFade = max(0.0, 1.0 - aTrailIdx / 100.0);
        alpha_out = trailFade * 0.75;
        sizeFactor *= max(0.5, trailFade);
        if (aTrailIdx < 2.0) {
          finalColor = vec3(2.0, 2.0, 2.1);
          alpha_out = 1.0;
          sizeFactor = 3.6;
        }
      }
      glowFactor = 0.25;
    }

    vColor = finalColor;
    vAlpha = alpha_out;
    vGlow = glowFactor;

    // ─── 7. View & Screen Projection ────────────────────────────
    vec3 viewPos = vec3(x_obs, y_obs, -295.0 + z_depth);
    vec4 mvPosition = vec4(viewPos, 1.0);
    gl_PointSize = clamp((sizeFactor * 230.0) / -mvPosition.z, 0.6, 6.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const blackHoleFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Core point vs soft volumetric glow halo
    float innerEdge = mix(0.04, 0.0, vGlow);
    float core = smoothstep(0.5, innerEdge, dist);
    float halo = smoothstep(0.5, 0.0, dist) * vGlow * 0.45;

    gl_FragColor = vec4(vColor, vAlpha * (core + halo));
  }
`;

const TECH_ORBIT_NODES = [
  { id: 'mern', label: 'MERN STACK', desc: 'MongoDB, Express.js, React 19, Node.js Full-Stack Architecture', angle: 0 },
  { id: 'react', label: 'REACT 19', desc: 'Modern State, Concurrent Rendering & Reactive UIs', angle: 60 },
  { id: 'node', label: 'NODE.JS', desc: 'High-Throughput REST APIs, Microservices & Middleware', angle: 120 },
  { id: 'dsa', label: 'C++ / DSA', desc: '500+ Algorithmic Problems Solved (Data Structures & Logic)', angle: 180 },
  { id: 'sih', label: 'SIH WINNER', desc: 'Smart India Hackathon Govt of India National Laureate', angle: 240 },
  { id: 'cloud', label: 'AWS CLOUD', desc: 'Cloud Computing, Docker Containerization & Distributed Systems', angle: 300 },
];

function playCyberBeep(freq = 740, type = 'sine', duration = 0.05, vol = 0.03) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

export default function DeformedOrbDossier() {
  const mountRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [isCoreOpen, setIsCoreOpen] = useState(false);

  const rendererRef = useRef(null);
  const inclinationRef = useRef(1.15); // Start at pleasant tilted angle
  const azimuthRef = useRef(0.0);
  const incTargetRef = useRef(1.15);
  const azTargetRef = useRef(0.0);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const isPointerDownRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 900;
    let height = container.clientHeight || 650;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1800);
    camera.position.set(0, 0, 295);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // ─── Shadow Disk ─────────────────────────────────────────────
    // Critical apparent shadow radius b_crit = 3*sqrt(3)/2 * Rs ≈ 25.98
    // In Schwarzschild spacetime, the apparent shadow on the observer's sky
    // is a 2D optical disc in the black hole plane (Z = 0).
    // Using a flat disc ensures front disk particles (Z > 0) sweep cleanly
    // IN FRONT of the shadow, while back particles (Z < 0) are occluded.
    const shadowRadius = 25.9808;
    const bhGroup = new THREE.Group();
    scene.add(bhGroup);

    const shadowGeom = new THREE.CircleGeometry(shadowRadius, 64);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, depthWrite: true });
    bhGroup.add(new THREE.Mesh(shadowGeom, shadowMat));

    // ─── 500,000 Particles ───────────────────────────────────────
    const TOTAL = 500000;
    const N_DISK     = 240000; // Main accretion disk
    const N_ATMO     = 20000;  // Volumetric bloom atmosphere
    const N_ISCO     = 60000;  // Inner ISCO white-hot glow rim
    const N_PHOTON   = 50000;  // Photon ring (always a perfect circle!)
    const N_SEC      = 30000;  // Secondary lower arch (Luminet underside image)
    const N_STREAKS  = 400 * 100; // Light streaks (40,000)
    const N_STARS    = 60000;  // Background stars

    const Rs = 10.0;
    const r_isco = 30.0;

    const aRadius       = new Float32Array(TOTAL);
    const aBaseAngle    = new Float32Array(TOTAL);
    const aSpeed        = new Float32Array(TOTAL);
    const aVertical     = new Float32Array(TOTAL);
    const aTrailIdx     = new Float32Array(TOTAL);
    const aParticleType = new Float32Array(TOTAL);
    const aSize         = new Float32Array(TOTAL);
    const aColor        = new Float32Array(TOTAL * 3);

    // Novikov-Thorne Temperature Profile -> Blackbody color
    const getThermalColor = (r) => {
      const f_r = Math.max(0, 1 - Math.sqrt(r_isco / r));
      const T = Math.pow(r / Rs, -0.75) * Math.pow(f_r + 0.001, 0.25);
      const t = Math.min(1.0, T / 0.22);

      // White-hot core -> radiant gold -> vibrant amber-orange -> deep red -> infrared
      if (t > 0.86) return [1.2, 1.15, 1.05];                     // White-hot
      if (t > 0.68) {
        const s = (t - 0.68) / 0.18;
        return [1.15, 0.84 + s * 0.28, 0.42 + s * 0.55];         // Bright gold
      }
      if (t > 0.42) {
        const s = (t - 0.42) / 0.26;
        return [1.08, 0.46 + s * 0.36, 0.10 + s * 0.30];         // Vivid amber orange
      }
      if (t > 0.18) {
        const s = (t - 0.18) / 0.24;
        return [0.92 + s * 0.16, 0.20 + s * 0.26, 0.03 + s * 0.07]; // Deep orange-red
      }
      const s = t / 0.18;
      return [0.55 + s * 0.37, 0.05 + s * 0.15, 0.01 + s * 0.02]; // Dark crimson
    };

    let idx = 0;

    // ────────────────────────────────────────────────────────────
    // [A] Main Accretion Disk — 240,000 particles
    // Power-law density concentrated toward ISCO
    // ────────────────────────────────────────────────────────────
    for (let i = 0; i < N_DISK; i++, idx++) {
      const u = Math.random();
      const r = r_isco + Math.pow(u, 1.45) * 105.0; // 30 to 135
      aRadius[idx] = r;
      aBaseAngle[idx] = Math.random() * Math.PI * 2;
      aSpeed[idx] = 120.0 / Math.pow(r, 1.5);
      aVertical[idx] = (Math.random() - 0.5) * r * 0.035;
      aTrailIdx[idx] = 0;
      aParticleType[idx] = 0;
      aSize[idx] = 0.95 + Math.random() * 0.35;
      const rgb = getThermalColor(r);
      aColor[idx * 3] = rgb[0]; aColor[idx * 3 + 1] = rgb[1]; aColor[idx * 3 + 2] = rgb[2];
    }

    // ────────────────────────────────────────────────────────────
    // [B] Disk Atmosphere — 20,000 large soft volumetric particles
    // ────────────────────────────────────────────────────────────
    for (let i = 0; i < N_ATMO; i++, idx++) {
      const u = Math.random();
      const r = r_isco + Math.pow(u, 1.25) * 85.0;
      aRadius[idx] = r;
      aBaseAngle[idx] = Math.random() * Math.PI * 2;
      aSpeed[idx] = 120.0 / Math.pow(r, 1.5);
      aVertical[idx] = (Math.random() - 0.5) * r * 0.07;
      aTrailIdx[idx] = 0;
      aParticleType[idx] = 0;
      aSize[idx] = 2.6 + Math.random() * 2.2;
      const rgb = getThermalColor(r);
      aColor[idx * 3] = rgb[0] * 0.32; aColor[idx * 3 + 1] = rgb[1] * 0.32; aColor[idx * 3 + 2] = rgb[2] * 0.32;
    }

    // ────────────────────────────────────────────────────────────
    // [C] Inner ISCO Glow Rim — 60,000 particles
    // Dense white-hot matter near the innermost stable orbit
    // At face-on angle, this forms a 100% PERFECT, UNBROKEN circle!
    // ────────────────────────────────────────────────────────────
    for (let i = 0; i < N_ISCO; i++, idx++) {
      const r = r_isco + Math.pow(Math.random(), 1.6) * 10.0; // 30 to 40
      aRadius[idx] = r;
      aBaseAngle[idx] = Math.random() * Math.PI * 2;
      aSpeed[idx] = 120.0 / Math.pow(r, 1.5);
      aVertical[idx] = (Math.random() - 0.5) * 1.8;
      aTrailIdx[idx] = 0;
      aParticleType[idx] = 2; // ISCO glow
      aSize[idx] = 1.4 + Math.random() * 2.0;
      aColor[idx * 3] = 1.2 + Math.random() * 0.25;
      aColor[idx * 3 + 1] = 1.1 + Math.random() * 0.2;
      aColor[idx * 3 + 2] = 0.95 + Math.random() * 0.15;
    }

    // ────────────────────────────────────────────────────────────
    // [D] Photon Ring — 50,000 particles
    // In General Relativity, the photon sphere is SPHERICALLY SYMMETRIC.
    // To ANY observer from ANY viewing angle or rotation, it projects
    // as a 100% PERFECT CIRCLE at the shadow edge (b_crit ≈ 25.98)!
    // ────────────────────────────────────────────────────────────
    for (let i = 0; i < N_PHOTON; i++, idx++) {
      // Extremely tight Gaussian-like band hugging 25.98
      const delta = (Math.random() + Math.random() + Math.random()) / 3.0;
      const b = 25.9808 + delta * 0.65;
      aRadius[idx] = b;
      aBaseAngle[idx] = Math.random() * Math.PI * 2;
      aSpeed[idx] = 1.6 + Math.random() * 0.5;
      aVertical[idx] = 0;
      aTrailIdx[idx] = 0;
      aParticleType[idx] = 1; // Photon Ring
      aSize[idx] = 0.85 + Math.random() * 0.5;
      // Pure, blazing white
      aColor[idx * 3] = 1.8; aColor[idx * 3 + 1] = 1.8; aColor[idx * 3 + 2] = 2.0;
    }

    // ────────────────────────────────────────────────────────────
    // [E] Secondary Lensed Arch — 30,000 particles
    // Light from back of disk bent UNDER the black hole towards observer
    // Forms the thin secondary arc below the shadow
    // ────────────────────────────────────────────────────────────
    for (let i = 0; i < N_SEC; i++, idx++) {
      const u = Math.random();
      const r = r_isco + Math.pow(u, 1.7) * 75.0;
      aRadius[idx] = r;
      aBaseAngle[idx] = Math.random() * Math.PI; // back half theta in [0, PI]
      aSpeed[idx] = 120.0 / Math.pow(r, 1.5);
      aVertical[idx] = 0;
      aTrailIdx[idx] = 0;
      aParticleType[idx] = 5; // Secondary arch
      aSize[idx] = 0.8 + Math.random() * 0.5;
      const rgb = getThermalColor(r);
      aColor[idx * 3] = rgb[0] * 0.5;
      aColor[idx * 3 + 1] = rgb[1] * 0.5;
      aColor[idx * 3 + 2] = rgb[2] * 0.5;
    }

    // ────────────────────────────────────────────────────────────
    // [F] Relativistic Light Streaks — 400 × 100 = 40,000 particles
    // Hot-spots and photon packets orbiting with Keplerian trails
    // ────────────────────────────────────────────────────────────
    for (let s = 0; s < 400; s++) {
      const r = 31.0 + Math.random() * 95.0;
      const baseAngle = Math.random() * Math.PI * 2;
      const speed = 120.0 / Math.pow(r, 1.5);
      const vert = (Math.random() - 0.5) * r * 0.025;
      for (let p = 0; p < 100; p++, idx++) {
        aRadius[idx] = r;
        aBaseAngle[idx] = baseAngle;
        aSpeed[idx] = speed;
        aVertical[idx] = vert;
        aTrailIdx[idx] = p;
        aParticleType[idx] = 3;
        if (p === 0) {
          aSize[idx] = 3.6;
          aColor[idx * 3] = 1.9; aColor[idx * 3 + 1] = 1.9; aColor[idx * 3 + 2] = 2.0;
        } else {
          const fade = 1.0 - p / 100;
          aSize[idx] = 0.6 + fade * 1.5;
          const rgb = getThermalColor(r);
          aColor[idx * 3] = rgb[0] * (0.35 + 0.65 * fade);
          aColor[idx * 3 + 1] = rgb[1] * (0.35 + 0.65 * fade);
          aColor[idx * 3 + 2] = rgb[2] * (0.35 + 0.65 * fade);
        }
      }
    }

    // ────────────────────────────────────────────────────────────
    // [G] Background Stars — 60,000 particles
    // Celestial spherical shell around the scene
    // ────────────────────────────────────────────────────────────
    for (let i = 0; i < N_STARS; i++, idx++) {
      const phi = Math.random() * Math.PI * 2;
      const cosTheta = 2 * Math.random() - 1;
      const dist = 220 + Math.random() * 600;

      aRadius[idx] = dist;
      aBaseAngle[idx] = phi;
      aSpeed[idx] = 0.4 + Math.random() * 2.2;
      aVertical[idx] = cosTheta * dist;
      aTrailIdx[idx] = 0;
      aParticleType[idx] = 4;
      aSize[idx] = 0.35 + Math.random() * 1.1;

      const warmth = Math.random();
      aColor[idx * 3] = 0.82 + warmth * 0.38;
      aColor[idx * 3 + 1] = 0.82 + warmth * 0.28;
      aColor[idx * 3 + 2] = 0.88 + (1 - warmth) * 0.32;
    }

    // ─── Build Buffer Geometry ───────────────────────────────────
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TOTAL * 3), 3));
    geom.setAttribute('aRadius', new THREE.BufferAttribute(aRadius, 1));
    geom.setAttribute('aBaseAngle', new THREE.BufferAttribute(aBaseAngle, 1));
    geom.setAttribute('aSpeed', new THREE.BufferAttribute(aSpeed, 1));
    geom.setAttribute('aVertical', new THREE.BufferAttribute(aVertical, 1));
    geom.setAttribute('aTrailIdx', new THREE.BufferAttribute(aTrailIdx, 1));
    geom.setAttribute('aParticleType', new THREE.BufferAttribute(aParticleType, 1));
    geom.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
    geom.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3));

    const shaderMat = new THREE.ShaderMaterial({
      vertexShader: blackHoleVertexShader,
      fragmentShader: blackHoleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uInclination: { value: 1.15 },
        uAzimuth: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    });

    scene.add(new THREE.Points(geom, shaderMat));

    // ─── Render Loop ─────────────────────────────────────────────
    let isVisible = true;
    let animId;
    const clock = new THREE.Clock();

    const render = () => {
      if (!isVisible) return;
      animId = requestAnimationFrame(render);
      const t = clock.getElapsedTime();

      // Gentle auto-rotation when idle
      if (!isPointerDownRef.current) {
        azTargetRef.current += 0.0016;
      }

      inclinationRef.current += (incTargetRef.current - inclinationRef.current) * 0.06;
      azimuthRef.current += (azTargetRef.current - azimuthRef.current) * 0.06;

      // Allow smooth viewing from pure face-on (0.0) to steep tilt (1.48 rad ≈ 85°)
      inclinationRef.current = Math.max(0.0, Math.min(1.48, inclinationRef.current));

      shaderMat.uniforms.uTime.value = t;
      shaderMat.uniforms.uInclination.value = inclinationRef.current;
      shaderMat.uniforms.uAzimuth.value = azimuthRef.current;

      renderer.render(scene, camera);
    };

    // Pause heavy 500k particle loop when offscreen to avoid scroll lag
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animId);
          render();
        } else {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.02 }
    );
    visibilityObserver.observe(container);

    // ─── Resize Handler ──────────────────────────────────────────
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 900;
      height = container.clientHeight || 650;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const obs = new ResizeObserver(onResize);
    obs.observe(container);

    return () => {
      visibilityObserver.disconnect();
      cancelAnimationFrame(animId);
      obs.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // ─── Unified Pointer / Touch Handlers ──────────────────────────
  const onDown = (e) => {
    isPointerDownRef.current = true;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const onMove = (e) => {
    if (!isPointerDownRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    azTargetRef.current += dx * 0.005;
    incTargetRef.current -= dy * 0.004; // Dragging down tilts towards face-on, up tilts edge-on
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const onUp = () => {
    isPointerDownRef.current = false;
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] md:h-[700px] bg-[#030304] border border-neutral-800/80 rounded-xs overflow-hidden flex flex-col justify-between select-none shadow-2xl">
      {/* Top Telemetry HUD */}
      <div className="border-b border-neutral-900 bg-[#050507]/90 px-4 sm:px-6 py-2.5 flex items-center justify-between font-mono text-[10px] z-30 pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] tracking-[0.22em] text-white uppercase font-bold">
            SINGULARITY // CORE DEVELOPER MATRIX
          </span>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <span className="text-neutral-400 text-[9px] hidden sm:inline tracking-wider">
            ARCHITECT CORE: ACTIVE • MERN + CLOUD
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-neutral-500 text-[9px] hidden md:inline font-mono">
            HORIZON: 1.00<span className="text-neutral-600">Rs</span>
          </span>
          <span className="text-neutral-500 text-[9px] hidden md:inline font-mono">
            PHOTON SPHERE: 1.50<span className="text-neutral-600">Rs</span>
          </span>
          <span className="text-red-400 text-[9px] font-bold tracking-wider">
            CORE: STABLE
          </span>
          <span className="text-cyan-400 text-[9px] font-bold">
            500K PARTICLES
          </span>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        className={`relative w-full flex-1 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {/* Subtle grid and target reticle overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.035]">
          <div className="w-[420px] h-[420px] border border-neutral-700 rounded-full border-dashed animate-[spin_120s_linear_infinite]" />
          <div className="w-[540px] h-[540px] border border-accent/30 rounded-full absolute" />
          <div className="w-full h-px bg-neutral-800 absolute" />
          <div className="h-full w-px bg-neutral-800 absolute" />
        </div>

        {/* ─── HOLOGRAPHIC DEVELOPER CORE (EVENT HORIZON OVERLAY) ─────── */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Outer Orbital Tech Badges Ring */}
          <div className="relative w-[340px] h-[340px] sm:w-[410px] sm:h-[410px] rounded-full border border-neutral-800/40 flex items-center justify-center animate-[spin_60s_linear_infinite]">
            {TECH_ORBIT_NODES.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const r = 165;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              return (
                <div
                  key={node.id}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className="absolute pointer-events-auto"
                >
                  {/* Counter-rotate so badge stays upright while orbiting! */}
                  <div className="animate-[spin_60s_linear_infinite_reverse]">
                    <button
                      onClick={() => {
                        setSelectedTech(selectedTech?.id === node.id ? null : node);
                        playCyberBeep(960);
                      }}
                      onMouseEnter={() => playCyberBeep(740)}
                      className={`group px-2.5 sm:px-3 py-1 rounded-full border backdrop-blur-md text-[8.5px] sm:text-[9.5px] font-mono font-medium tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-xl shadow-black/90 hover:scale-105 ${
                        selectedTech?.id === node.id
                          ? 'border-white/40 bg-white/15 text-white shadow-white/5'
                          : 'border-white/15 bg-black/85 text-neutral-200 hover:border-white/35 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:animate-ping" />
                      <span>{node.label}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Singularity Hologram Emblem (Inside the Event Horizon Void) */}
          <div className="absolute pointer-events-auto flex flex-col items-center justify-center">
            {/* Glowing Core Rings */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-white/20 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border border-dashed border-white/25 animate-[spin_24s_linear_infinite]" />
              <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-600/10 blur-xl animate-pulse" />

              {/* Center Interactive Core Button */}
              <button
                onClick={() => {
                  setIsCoreOpen(!isCoreOpen);
                  playCyberBeep(520);
                }}
                onMouseEnter={() => playCyberBeep(640)}
                className="group relative z-10 flex flex-col items-center justify-center text-center p-3 rounded-full hover:scale-105 transition-all cursor-pointer"
                title="Click to view Core Intelligence Intel"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500 animate-ping mb-1" />
                <span className="font-heading font-black text-[10px] sm:text-[11px] tracking-wider uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] group-hover:text-red-400 transition-colors">
                  SHESHANK DEV
                </span>
                <span className="font-mono text-[7px] sm:text-[8px] text-red-500/90 font-bold tracking-widest uppercase">
                  // CORE ARCHITECT
                </span>
                <span className="font-mono text-[7px] text-neutral-400 mt-0.5 tracking-tighter opacity-70 group-hover:opacity-100">
                  [ CLICK INTEL ]
                </span>
              </button>
            </div>
          </div>

          {/* Active Skill Info Toast */}
          {selectedTech && (
            <div className="absolute bottom-5 pointer-events-auto z-40 bg-[#070709]/95 border border-white/20 backdrop-blur-md px-4 py-2 rounded-xs shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <div>
                <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider block">
                  {selectedTech.label}
                </span>
                <span className="font-mono text-[9px] text-neutral-400 block">
                  {selectedTech.desc}
                </span>
              </div>
              <button
                onClick={() => setSelectedTech(null)}
                className="text-neutral-500 hover:text-white font-mono text-xs ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Core Singularity Intel Modal Drawer */}
          {isCoreOpen && (
            <div className="absolute inset-x-4 sm:inset-x-auto sm:w-[420px] z-50 bg-[#070709]/95 border border-white/20 backdrop-blur-xl p-5 rounded-xs shadow-2xl pointer-events-auto animate-in fade-in zoom-in-95 duration-200 font-mono">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[11px] font-bold text-white tracking-widest uppercase">
                    SINGULARITY // CORE INTEL
                  </span>
                </div>
                <button
                  onClick={() => setIsCoreOpen(false)}
                  className="text-neutral-500 hover:text-white cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 text-[10px]">
                <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">ENGINEERING ROLE:</span>
                  <span className="text-white font-bold">FULL STACK MERN & ARCHITECTURE</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">SIH 2024 HONORS:</span>
                  <span className="text-emerald-400 font-bold">SMART INDIA HACKATHON LAUREATE</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">ALGORITHMIC MASTERY:</span>
                  <span className="text-white font-bold">500+ PROBLEMS SOLVED (C++/DSA)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">FLAGSHIP SYSTEMS:</span>
                  <span className="text-red-400 font-bold">LIFE CARD • FITFLOW • AR HERITAGE</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <a
                  href="#contact"
                  onClick={() => setIsCoreOpen(false)}
                  className="px-3 py-1 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider hover:bg-red-500 transition-colors cursor-pointer"
                >
                  CONNECT WITH SHESHANK →
                </a>
                <span className="text-[8px] text-neutral-500 tracking-tighter">
                  STATUS: OPEN TO WORK
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Physics Telemetry */}
      <div className="border-t border-neutral-900 bg-[#050507]/90 px-3 sm:px-6 py-2 flex items-center justify-center gap-4 z-30 font-mono text-[9px] pointer-events-none">
        <span className="text-neutral-400 tracking-wider uppercase">
          EVENT HORIZON: 1.00Rs
        </span>
        <span className="text-neutral-600">|</span>
        <span className="text-neutral-400 tracking-wider uppercase">
          DEVELOPER NEXUS: SHESHANK.DEV
        </span>
        <span className="text-neutral-600">|</span>
        <span className="text-red-400 tracking-wider uppercase font-bold">
          DRAG TO ROTATE 3D ACCRETION DISK
        </span>
      </div>
    </div>
  );
}
