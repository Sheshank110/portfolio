import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

// Real chronological milestones data from portfolio
export const CHRONO_MILESTONES = [
  {
    year: '2021 — 2022',
    shortYear: '2021',
    gateIndex: '01',
    z: 420,
    title: 'Matriculation // STEM Genesis',
    org: 'RPS School, Hansi, Haryana',
    score: '80% Aggregate',
    type: 'FOUNDATION',
    badge: 'STEM Core',
    color: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.3)',
    summary: 'Graduated with 80% aggregate in CBSE Secondary education, developing a rigorous foundation in Mathematics, Analytical Logic, and Natural Sciences.',
    tags: ['CBSE Class X', 'Mathematics', 'Science Stream', 'Analytical Logic'],
    coords: 'SPACE TRANSIT // SECTOR 01',
  },
  {
    year: '2023 — 2024',
    shortYear: '2023',
    gateIndex: '02',
    z: 1000,
    title: 'Senior Secondary Intermediate // Science Stream',
    org: 'Sunrise Modern School, Hisar',
    score: '70% Science Aggregate',
    type: 'ACADEMIC',
    badge: 'Physical Sciences',
    color: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.3)',
    summary: 'Completed Senior Secondary Class XII CBSE education with 70% in the Science stream. Deepened passion for Calculus, Classical Physics, and Computational Fundamentals.',
    tags: ['CBSE Class XII', 'Physics & Calculus', 'Algorithmic Thinking', 'Computer Foundations'],
    coords: 'STELLAR DRIFT // SECTOR 02',
  },
  {
    year: '2024',
    shortYear: '2024',
    gateIndex: '03',
    z: 1600,
    title: 'Full Stack MERN Mastery & Life Card Emergency System',
    org: 'Engineering Intensive & Autonomous Builds',
    score: 'Production Architecture',
    type: 'SYSTEMS BUILD',
    badge: 'Production Full-Stack',
    color: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.3)',
    summary: 'Completed intensive 3-week Full Stack MERN engineering. Architected "Life Card" (instant QR emergency medical profile response system) and "FitFlow" fitness tracking suite.',
    tags: ['React.js', 'Node.js', 'Express', 'MongoDB', 'QR Medical Engine', 'TailwindCSS'],
    coords: 'ORBITAL INGRESS // SECTOR 03',
  },
  {
    year: '2024',
    shortYear: '2024',
    gateIndex: '04',
    z: 2200,
    title: 'Smart India Hackathon & Innovation Canvas Laureate',
    org: 'Smart India Hackathon (Govt of India) & Innovation Canvas 2k24',
    score: '3rd Prize Winner & SIH Contender',
    type: 'INNOVATION',
    badge: '3rd Prize Award',
    color: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.3)',
    summary: 'Selected for prestigious Smart India Hackathon (SIH) proposing an Augmented Reality cultural heritage preservation engine. Awarded 3rd Prize in Innovation Canvas Exhibit 2k24.',
    tags: ['Smart India Hackathon', 'AR Cultural Preservation', 'Innovation Canvas 2k24', 'Rapid Prototyping'],
    coords: 'NEBULA CROSSING // SECTOR 04',
  },
  {
    year: '2025',
    shortYear: '2025',
    gateIndex: '05',
    z: 2800,
    title: 'Dual National Research Laurels // ICCS & ICCMST',
    org: 'International Conferences on Computing & Science',
    score: '🥈 2nd Prize ICCS • 🥉 3rd Prize ICCMST',
    type: 'RESEARCH',
    badge: 'Double Conference Laureate',
    color: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.3)',
    summary: 'Secured 2nd Prize in the ICCS 2025 Poster Presentation and 3rd Prize in the ICCMST 2025 Conference for technical research exhibits on computational paradigms.',
    tags: ['ICCS 2025 (2nd Prize)', 'ICCMST 2025 (3rd Prize)', 'Research Poster Exhibition', 'Peer Reviews'],
    coords: 'DEEP VOID // SECTOR 05',
  },
  {
    year: '2024 — 2028',
    shortYear: '2028',
    gateIndex: '06',
    z: 3400,
    title: 'B.Tech in Computer Science & Engineering',
    org: 'Chandigarh Group of Colleges, Landran',
    score: 'Active Undergraduate (CSE Core)',
    type: 'UNDERGRADUATE',
    badge: 'CSE Systems Degree',
    color: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.3)',
    summary: 'Pursuing undergraduate degree in Computer Science. Concentrating on Data Structures & Algorithms, Object-Oriented Architecture, System Design, and Modern Cloud Infrastructure.',
    tags: ['Data Structures & Algorithms', 'Full Stack Architecture', 'AWS Cloud', 'OOP & OS Design'],
    coords: 'COSMIC CORRIDOR // SECTOR 06',
  },
  {
    year: '2028+',
    shortYear: 'BEYOND',
    gateIndex: '07',
    z: 3950,
    title: 'Distributed Core Architecture & Quantum Web Frontier',
    org: 'Global Engineering & Cloud Horizons',
    score: 'Future Trajectory',
    type: 'HORIZON',
    badge: 'Next Horizon',
    color: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.3)',
    summary: 'Forging hyper-scalable distributed backends, fault-tolerant microservices, and immersive spatial compute experiences across modern web ecosystems.',
    tags: ['Distributed Systems', 'Real-Time WebGL', 'Cloud Native', 'Autonomous Workflows'],
    coords: 'INFINITY HORIZON // SECTOR 07',
  },
];

export const TOTAL_TUNNEL_LENGTH = 4300;

export default function ChronoTunnelCanvas({
  scrollProgress = 0,
  onMilestoneChange,
  onWarpSpeedChange,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Keep a mutable ref to scrollProgress so Three.js render loop reads it smoothly
  // WITHOUT triggering full scene recreation / re-render
  const scrollProgressRef = useRef(scrollProgress);
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Keep callback refs stable
  const onMilestoneChangeRef = useRef(onMilestoneChange);
  const onWarpSpeedChangeRef = useRef(onWarpSpeedChange);
  useEffect(() => {
    onMilestoneChangeRef.current = onMilestoneChange;
    onWarpSpeedChangeRef.current = onWarpSpeedChange;
  });

  // Helper to create a crisp, tiny pinpoint star texture (pure white, soft antialiased edge)
  const createPinpointStarTexture = useCallback(() => {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)');
    gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }, []);

  // ─── Initialize Three.js Scene ONCE on mount ─────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // ─── 1. Scene, Camera, Renderer (Pure Space Black) ──────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Pure space black
    scene.fog = new THREE.FogExp2(0x000000, 0.00075); // Infinite pitch-black space fog

    const camera = new THREE.PerspectiveCamera(52, width / height, 1, 3200);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // ─── 2. Starfield: 14,000 Pure White, Very Very Small Particles ─────────
    const particleCount = 14000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const starTexture = createPinpointStarTexture();

    for (let i = 0; i < particleCount; i++) {
      // Wide cylindrical corridor + deep field stars
      const z = -Math.random() * (TOTAL_TUNNEL_LENGTH + 1200) + 300;
      const angle = Math.random() * Math.PI * 2;
      // Distance from center: tunnel corridor (radius 22 to 180)
      const radius = 22 + Math.pow(Math.random(), 1.7) * 160;

      particlePositions[i * 3 + 0] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
      particlePositions[i * 3 + 2] = -z; // Forward trajectory along Z

      // Pure white with subtle natural starlight intensity variations
      const luminance = 0.5 + Math.random() * 0.5; // All pure white [0.5..1.0]
      particleColors[i * 3 + 0] = luminance;
      particleColors[i * 3 + 1] = luminance;
      particleColors[i * 3 + 2] = luminance;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Very very small star particles (size: 1.8 with sizeAttenuation)
    const particleMat = new THREE.PointsMaterial({
      size: 1.8,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: true,
      sizeAttenuation: true,
    });

    const starField = new THREE.Points(particleGeo, particleMat);
    scene.add(starField);

    // ─── 3. Relativistic Warp Lines (Subtle Fine White Hairlines) ─────────────
    const lineCount = 350;
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(lineCount * 2 * 3);
    const lineColors = new Float32Array(lineCount * 2 * 3);

    for (let i = 0; i < lineCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 25 + Math.random() * 110;
      const zStart = Math.random() * (TOTAL_TUNNEL_LENGTH + 200);
      const streakLength = 30 + Math.random() * 120;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Start vertex (pure white, dimmer)
      linePositions[i * 6 + 0] = x;
      linePositions[i * 6 + 1] = y;
      linePositions[i * 6 + 2] = zStart;
      lineColors[i * 6 + 0] = 0.25;
      lineColors[i * 6 + 1] = 0.25;
      lineColors[i * 6 + 2] = 0.25;

      // End vertex (pure white, brighter)
      linePositions[i * 6 + 3] = x;
      linePositions[i * 6 + 4] = y;
      linePositions[i * 6 + 5] = zStart + streakLength;
      lineColors[i * 6 + 3] = 0.85;
      lineColors[i * 6 + 4] = 0.85;
      lineColors[i * 6 + 5] = 0.85;
    }

    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const warpLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(warpLines);

    // ─── 4. Singularity Gate Rings (Subtle White Wireframe Rings) ────────────
    const ringsGroup = new THREE.Group();
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      wireframe: true,
      depthWrite: false,
    });

    const ringGeometry = new THREE.TorusGeometry(52, 0.35, 6, 40);

    for (let z = 200; z <= TOTAL_TUNNEL_LENGTH + 200; z += 240) {
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(0, 0, z);
      ringsGroup.add(ring);
    }
    scene.add(ringsGroup);

    // ─── 5. Floating 3D Milestone Waypoint Beacons (Subtle Rings & Cores) ──────
    const milestoneGates = [];

    CHRONO_MILESTONES.forEach((ms, idx) => {
      const gateGroup = new THREE.Group();
      gateGroup.position.set(0, 0, ms.z);

      const isLeft = idx % 2 === 0;
      const xOffset = isLeft ? -28 : 28;
      const yOffset = ((idx % 3) - 1) * 8;

      // Outer subtle white portal ring (compact)
      const portalRingGeo = new THREE.RingGeometry(13, 14, 32);
      const portalRingMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      });
      const portalRing = new THREE.Mesh(portalRingGeo, portalRingMat);
      portalRing.position.set(xOffset, yOffset, 0);
      gateGroup.add(portalRing);

      // Central white star core
      const coreGeo = new THREE.SphereGeometry(1.0, 10, 10);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.set(xOffset, yOffset, 0);
      gateGroup.add(coreMesh);

      scene.add(gateGroup);
      milestoneGates.push({
        group: gateGroup,
        portalRing,
        coreMesh,
        z: ms.z,
        index: idx,
      });
    });

    // ─── 6. Ultra-Smooth Physics & Mouse Steering ───────────────────────────
    let cameraZ = 0;
    let targetCameraZ = 0;
    let lastZ = 0;
    let warpFactor = 1.0;
    let activeMilestoneIndex = -1;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / rect.width) * 2 - 1;
      mouse.targetY = -(clientY / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener('resize', handleResize);

    // ─── 7. Continuous Ultra-Smooth Animation Loop ──────────────────────────
    let animationFrameId;
    const clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      // Ultra-fluid cockpit steering parallax (damping factor: 0.04)
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Read current scroll progress smoothly from mutable ref
      targetCameraZ = scrollProgressRef.current * TOTAL_TUNNEL_LENGTH;

      // Ultra-smooth physical lerp damping (Hitparade-style fluid flight)
      const zDelta = targetCameraZ - cameraZ;
      cameraZ += zDelta * 0.048; // Silky fluid inertia

      // Instantaneous speed calculation
      const speed = Math.abs(cameraZ - lastZ);
      lastZ = cameraZ;
      warpFactor += (speed * 0.35 + 1.0 - warpFactor) * 0.08;

      if (onWarpSpeedChangeRef.current) {
        onWarpSpeedChangeRef.current(Math.min(warpFactor, 9.9));
      }

      // Camera position
      camera.position.z = cameraZ;
      camera.position.x = mouse.x * 10;
      camera.position.y = mouse.y * 8;

      // Subtle cockpit pitch & yaw
      camera.rotation.y = -mouse.x * 0.12;
      camera.rotation.x = mouse.y * 0.1;
      camera.rotation.z = -mouse.x * 0.05 + Math.sin(elapsedTime * 0.4) * 0.01;

      // Slow, majestic vortex rotation
      starField.rotation.z = elapsedTime * 0.03;

      // Warp line opacity surge smoothly during faster scrolling
      lineMat.opacity = Math.min(0.12 + (warpFactor - 1.0) * 0.25, 0.7);
      lineMat.needsUpdate = true;

      // Subtle rotation of gate rings
      ringsGroup.children.forEach((ring, i) => {
        ring.rotation.z = elapsedTime * 0.08 * (i % 2 === 0 ? 1 : -1);
      });

      // ─── Proximity & Beacon Fading ────────────────────────────────────────
      let closestDistance = Infinity;
      let closestIndex = -1;

      milestoneGates.forEach((gate) => {
        const dist = gate.z - camera.position.z;
        const absDist = Math.abs(dist);

        // Turn portal rings to face the camera smoothly
        gate.portalRing.quaternion.copy(camera.quaternion);
        gate.portalRing.rotation.z = elapsedTime * 0.4;

        // Proximity visibility & scale (emerges gracefully from deep space fog)
        if (absDist < 650) {
          gate.group.visible = true;
          const normalizedDist = Math.max(0, 1 - absDist / 600);
          gate.portalRing.material.opacity = Math.min(0.45, normalizedDist * 0.7);

          const scale = 1.0 + Math.sin(elapsedTime * 2 + gate.index) * 0.04;
          gate.coreMesh.scale.set(scale, scale, scale);
        } else {
          gate.group.visible = false;
        }

        // Detect closest milestone within active reading zone (-100 to +380)
        if (dist > -100 && dist < 400 && absDist < closestDistance) {
          closestDistance = absDist;
          closestIndex = gate.index;
        }
      });

      // Notify parent when active milestone changes
      if (closestIndex !== activeMilestoneIndex) {
        activeMilestoneIndex = closestIndex;
        if (onMilestoneChangeRef.current) {
          onMilestoneChangeRef.current(
            closestIndex >= 0 ? CHRONO_MILESTONES[closestIndex] : null
          );
        }
      }

      renderer.render(scene, camera);
    };

    render();

    // ─── Cleanup on Unmount Only ────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      particleGeo.dispose();
      particleMat.dispose();
      starTexture.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();

      milestoneGates.forEach((g) => {
        g.portalRing.geometry.dispose();
        g.portalRing.material.dispose();
        g.coreMesh.geometry.dispose();
        g.coreMesh.material.dispose();
      });

      renderer.dispose();
    };
  }, [createPinpointStarTexture]); // Empty dependencies: runs once!

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black">
      <canvas ref={canvasRef} className="w-full h-full block bg-black" />
    </div>
  );
}
