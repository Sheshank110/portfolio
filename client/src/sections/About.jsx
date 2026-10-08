import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhysicsTextSandbox from '../components/PhysicsTextSandbox';

// ─── Zero-latency Web Audio API Feedback ──────────────────────────────
function playCyberSfx(freq = 640, type = 'sine', duration = 0.05, vol = 0.025) {
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
  } catch (err) {
    // Ignore audio restrictions
  }
}

// ─── Flagship Projects (Red Dots) ─────────────────────────────────────
const PROJECTS = [
  {
    id: 'lifecard',
    name: 'Life Card',
    tag: 'EMERGENCY TRIAGE',
    desc: 'QR-enabled emergency medical response system for golden-hour triage.',
    github: 'https://github.com/Sheshank110',
    stars: '4★',
    initX: 0.25,
    initY: 0.35,
    radius: 14,
    mass: 4.5,
  },
  {
    id: 'timeless',
    name: 'Timeless Trends',
    tag: 'FASHION E-COMMERCE',
    desc: 'Production e-commerce platform with AI stylist & Razorpay payments.',
    github: 'https://github.com/Sheshank110/Timeless-trends',
    stars: '3★',
    initX: 0.72,
    initY: 0.28,
    radius: 13.5,
    mass: 4.0,
  },
  {
    id: 'sih',
    name: 'AR Heritage',
    tag: 'SIH 2024 NATIONAL',
    desc: 'Smart India Hackathon project: Interactive 3D & Augmented Reality monument platform.',
    github: 'https://github.com/Sheshank110',
    stars: '5★',
    initX: 0.74,
    initY: 0.75,
    radius: 13.5,
    mass: 4.0,
  },
  {
    id: 'fitflow',
    name: 'FitFlow',
    tag: 'NEWS API ENGINE',
    desc: 'Dynamic news discovery and article reader with asynchronous JSON streams.',
    github: 'https://github.com/Sheshank110',
    stars: '3★',
    initX: 0.28,
    initY: 0.76,
    radius: 13,
    mass: 3.8,
  },
];

// ─── Project Tech Stack Nodes (Black Dots) ───────────────────────────
const TECH_NODES_DATA = [
  // Life Card stack
  { name: 'React.js', parentId: 'lifecard', initX: 0.16, initY: 0.24 },
  { name: 'Node.js', parentId: 'lifecard', initX: 0.36, initY: 0.22 },
  { name: 'Express.js', parentId: 'lifecard', initX: 0.14, initY: 0.44 },
  { name: 'MongoDB', parentId: 'lifecard', initX: 0.35, initY: 0.48 },
  { name: 'QR Engine', parentId: 'lifecard', initX: 0.20, initY: 0.52 },
  { name: 'Tailwind CSS', parentId: 'lifecard', initX: 0.40, initY: 0.36 },

  // Timeless Trends stack
  { name: 'React 19', parentId: 'timeless', initX: 0.60, initY: 0.18 },
  { name: 'Redux Toolkit', parentId: 'timeless', initX: 0.82, initY: 0.20 },
  { name: 'Razorpay API', parentId: 'timeless', initX: 0.86, initY: 0.36 },
  { name: 'Cloudinary', parentId: 'timeless', initX: 0.62, initY: 0.40 },
  { name: 'Mongoose', parentId: 'timeless', initX: 0.76, initY: 0.44 },
  { name: 'JWT Auth', parentId: 'timeless', initX: 0.56, initY: 0.30 },

  // AR Heritage stack
  { name: 'Three.js', parentId: 'sih', initX: 0.62, initY: 0.65 },
  { name: 'WebXR / AR', parentId: 'sih', initX: 0.88, initY: 0.68 },
  { name: '3D Viewport', parentId: 'sih', initX: 0.86, initY: 0.85 },
  { name: 'JavaScript ES6', parentId: 'sih', initX: 0.66, initY: 0.86 },
  { name: 'Spatial Math', parentId: 'sih', initX: 0.58, initY: 0.78 },

  // FitFlow stack
  { name: 'REST API', parentId: 'fitflow', initX: 0.15, initY: 0.68 },
  { name: 'JSON Stream', parentId: 'fitflow', initX: 0.38, initY: 0.68 },
  { name: 'Async Fetch', parentId: 'fitflow', initX: 0.18, initY: 0.86 },
  { name: 'CSS3 Grid', parentId: 'fitflow', initX: 0.38, initY: 0.86 },
];

// ─── Real Newtonian Physics Graph Canvas ──────────────────────────────
function ProjectGraphCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -2000, y: -2000, isHover: false });
  const draggedNodeRef = useRef(null);
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 });
  const dragVelocityRef = useRef({ vx: 0, vy: 0 });
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 });
  const shockwavesRef = useRef([]);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isDraggingActive, setIsDraggingActive] = useState(false);

  // Persistent physics particle pool
  const particlesRef = useRef(null);

  if (!particlesRef.current) {
    const list = [];

    // Red Project Nodes
    PROJECTS.forEach((p) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.25;
      list.push({
        id: p.id,
        name: p.name,
        type: 'project',
        data: p,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: p.radius,
        mass: p.mass,
        initX: p.initX,
        initY: p.initY,
      });
    });

    // Black Tech Nodes
    TECH_NODES_DATA.forEach((t, idx) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.35;
      list.push({
        id: `tech-${idx}`,
        name: t.name,
        type: 'tech',
        parentId: t.parentId,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 7.2,
        mass: 1.0,
        initX: t.initX,
        initY: t.initY,
      });
    });

    particlesRef.current = list;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Initialize positions on first load
      const particles = particlesRef.current;
      particles.forEach((p) => {
        if (p.x === 0 && p.y === 0) {
          p.x = p.initX * rect.width;
          p.y = p.initY * rect.height;
        }
      });
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (!w || !h) {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Cyber Blueprint Grid
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = gridSize; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = gridSize; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.r += 4.5;
        sw.alpha *= 0.93;
        ctx.strokeStyle = `rgba(225, 29, 39, ${sw.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.stroke();
        if (sw.alpha < 0.02) shockwavesRef.current.splice(i, 1);
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const particles = particlesRef.current;
      const draggedNode = draggedNodeRef.current;

      // Active Project is either the one being dragged or hovered
      let activeProj = null;
      if (draggedNode && draggedNode.type === 'project') {
        activeProj = draggedNode;
      } else if (mouseRef.current.isHover) {
        activeProj = particles.find(
          (p) => p.type === 'project' && Math.hypot(p.x - mx, p.y - my) < p.radius + 20
        );
      }

      // ─── 1. INTEGRATION & FREE ROAMING (NEVER STOP) ───────────────────
      particles.forEach((p) => {
        if (p === draggedNode) return;

        p.x += p.vx;
        p.y += p.vy;

        // Aerodynamic drag
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Ambient speed floor
        const currentSpeed = Math.hypot(p.vx, p.vy);
        const minAmbientSpeed = p.type === 'project' ? 0.22 : 0.32;
        if (currentSpeed < minAmbientSpeed) {
          const angle = Math.atan2(p.vy, p.vx) || Math.random() * Math.PI * 2;
          p.vx = Math.cos(angle) * minAmbientSpeed;
          p.vy = Math.sin(angle) * minAmbientSpeed;
        }

        // Boundary reflection
        const pad = p.radius + 16;
        if (p.x < pad) {
          p.x = pad;
          p.vx = Math.abs(p.vx) * 0.85;
        } else if (p.x > w - pad) {
          p.x = w - pad;
          p.vx = -Math.abs(p.vx) * 0.85;
        }
        if (p.y < pad) {
          p.y = pad;
          p.vy = Math.abs(p.vy) * 0.85;
        } else if (p.y > h - pad) {
          p.y = h - pad;
          p.vy = -Math.abs(p.vy) * 0.85;
        }
      });

      // ─── 2. RADIAL ORBIT DISTRIBUTION & ACCELERATION TRANSMISSION ─────
      if (activeProj) {
        const attachedTech = particles.filter(
          (p) => p.type === 'tech' && p.parentId === activeProj.id
        );
        const count = attachedTech.length;
        const orbitRadius = 92;

        attachedTech.forEach((techDot, idx) => {
          // Equidistant radial angle
          const targetAngle = (idx / count) * Math.PI * 2;
          const targetX = activeProj.x + Math.cos(targetAngle) * orbitRadius;
          const targetY = activeProj.y + Math.sin(targetAngle) * orbitRadius;

          const dx = targetX - techDot.x;
          const dy = targetY - techDot.y;

          // Gentle spring force
          const k = 0.008;
          techDot.vx += dx * k;
          techDot.vy += dy * k;

          // Transmit drag acceleration
          const relVx = activeProj.vx - techDot.vx;
          const relVy = activeProj.vy - techDot.vy;
          techDot.vx += relVx * 0.045;
          techDot.vy += relVy * 0.045;

          // Velocity damping while in orbit
          techDot.vx *= 0.94;
          techDot.vy *= 0.94;
        });

        // Unrelated dots: pushed away
        particles.forEach((p) => {
          if (p === activeProj || (p.type === 'tech' && p.parentId === activeProj.id)) return;
          const dx = p.x - activeProj.x;
          const dy = p.y - activeProj.y;
          const dist = Math.hypot(dx, dy);
          const clearRadius = 160;

          if (dist < clearRadius && dist > 1) {
            const push = ((clearRadius - dist) / clearRadius) * 0.22;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push;
          }
        });
      }

      // ─── 3. ELASTIC CIRCLE-CIRCLE COLLISION & IMPULSE REFLECTION ─────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = p1.radius + p2.radius + 6;

          if (dist < minDist && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            // Position separation
            if (p1 === draggedNode) {
              p2.x += nx * overlap;
              p2.y += ny * overlap;
            } else if (p2 === draggedNode) {
              p1.x -= nx * overlap;
              p1.y -= ny * overlap;
            } else {
              const m1Ratio = p2.mass / (p1.mass + p2.mass);
              const m2Ratio = p1.mass / (p1.mass + p2.mass);
              p1.x -= nx * overlap * m1Ratio;
              p1.y -= ny * overlap * m1Ratio;
              p2.x += nx * overlap * m2Ratio;
              p2.y += ny * overlap * m2Ratio;
            }

            // Elastic impulse
            const kx = p1.vx - p2.vx;
            const ky = p1.vy - p2.vy;
            const impulse = (2 * (nx * kx + ny * ky)) / (p1.mass + p2.mass);
            const restitution = 0.88;

            if (p1 !== draggedNode) {
              p1.vx -= impulse * p2.mass * nx * restitution;
              p1.vy -= impulse * p2.mass * ny * restitution;
            }
            if (p2 !== draggedNode) {
              p2.vx += impulse * p1.mass * nx * restitution;
              p2.vy += impulse * p1.mass * ny * restitution;
            }
          }
        }
      }

      // Clamp velocities
      particles.forEach((p) => {
        if (p === draggedNode) return;
        const speed = Math.hypot(p.vx, p.vy);
        const maxSpeed = p.type === 'project' ? 3.0 : 4.5;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
      });

      // ─── 4. CONNECTING LINES (LAYER 1: DRAWN FIRST BENEATH TEXT) ──────
      const proximityRange = 150;

      particles.forEach((p) => {
        if (p.type === 'tech') {
          const parentProject = particles.find(
            (proj) => proj.type === 'project' && proj.id === p.parentId
          );
          if (!parentProject) return;

          const distToMouseP = Math.hypot(mx - p.x, my - p.y);
          const distToMouseParent = Math.hypot(mx - parentProject.x, my - parentProject.y);
          const isParentActive = activeProj && activeProj.id === parentProject.id;
          const isNearTech = distToMouseP < proximityRange;
          const isNearParent = distToMouseParent < proximityRange;

          if (isParentActive) {
            ctx.strokeStyle = 'rgba(225, 29, 39, 0.75)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(parentProject.x, parentProject.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          } else if (isNearTech || isNearParent) {
            const minCursorDist = Math.min(distToMouseP, distToMouseParent);
            const alpha = (1 - minCursorDist / proximityRange) * 0.55;
            ctx.strokeStyle = `rgba(225, 29, 39, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(parentProject.x, parentProject.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      });

      // ─── 5. PURE SOLID DOTS (NO OUTER CIRCLES / RINGS) ────────────────
      particles.forEach((p) => {
        if (p.type === 'project') {
          ctx.fillStyle = '#e11d27';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#111111';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ─── 6. CLEAN TEXT PILL BADGES (LAYER 2: DRAWN ON TOP OF LINES) ───
      // A. Red Project Node Labels (with background pill)
      particles.forEach((p) => {
        if (p.type === 'project') {
          const isHovered = activeProj && activeProj.id === p.id;
          ctx.font = 'bold 12px "Space Grotesk", sans-serif';
          const text = p.name;
          const textMetrics = ctx.measureText(text);
          const pillW = textMetrics.width + 12;
          const pillH = 20;
          const pillX = p.x + p.radius + 8;
          const pillY = p.y - pillH / 2;

          ctx.fillStyle = isHovered ? '#0c0c0c' : 'rgba(247, 246, 242, 0.94)';
          ctx.strokeStyle = isHovered ? '#e11d27' : 'rgba(12, 12, 12, 0.18)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, 3);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isHovered ? '#ffffff' : '#0c0c0c';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, pillX + 6, p.y);
        }
      });

      // B. Black Tech Node Labels (ONLY for the active project)
      if (activeProj) {
        const attachedTech = particles.filter(
          (p) => p.type === 'tech' && p.parentId === activeProj.id
        );

        attachedTech.forEach((techDot) => {
          const angle = Math.atan2(techDot.y - activeProj.y, techDot.x - activeProj.x);
          const dirX = Math.cos(angle);
          const dirY = Math.sin(angle);

          ctx.font = 'bold 9.5px "SF Mono", monospace';
          const text = techDot.name;
          const textMetrics = ctx.measureText(text);
          const pillW = textMetrics.width + 10;
          const pillH = 17;

          const distFromDot = techDot.radius + 8;
          let pillX = techDot.x + dirX * distFromDot;
          let pillY = techDot.y + dirY * distFromDot;

          if (dirX < -0.2) {
            pillX -= pillW;
          } else if (Math.abs(dirX) <= 0.2) {
            pillX -= pillW / 2;
          }
          pillY -= pillH / 2;

          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = 'rgba(12, 12, 12, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, 2.5);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0c0c0c';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, pillX + 5, pillY + pillH / 2);
        });
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ─── MOUSE DRAG & ACCELERATION TRACKING ──────────────────────────────
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedProj = particlesRef.current.find(
      (p) => p.type === 'project' && Math.hypot(p.x - x, p.y - y) < p.radius + 20
    );

    if (clickedProj) {
      draggedNodeRef.current = clickedProj;
      dragStartRef.current = { x, y, time: Date.now() };
      lastMousePosRef.current = { x, y, time: performance.now() };
      dragVelocityRef.current = { vx: 0, vy: 0 };
      setIsDraggingActive(true);
      playCyberSfx(520, 'triangle', 0.06, 0.04);
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y, isHover: true };

    if (draggedNodeRef.current) {
      const now = performance.now();
      const dt = Math.max(now - lastMousePosRef.current.time, 1) / 1000;

      const instVx = (x - lastMousePosRef.current.x) / (dt * 60);
      const instVy = (y - lastMousePosRef.current.y) / (dt * 60);

      dragVelocityRef.current = {
        vx: instVx * 0.45 + dragVelocityRef.current.vx * 0.55,
        vy: instVy * 0.45 + dragVelocityRef.current.vy * 0.55,
      };

      const dragged = draggedNodeRef.current;
      dragged.vx = dragVelocityRef.current.vx;
      dragged.vy = dragVelocityRef.current.vy;
      dragged.x = x;
      dragged.y = y;

      lastMousePosRef.current = { x, y, time: now };
    } else {
      const foundProj = particlesRef.current.find(
        (p) => p.type === 'project' && Math.hypot(p.x - x, p.y - y) < p.radius + 20
      );

      if (foundProj && (!hoveredProject || hoveredProject.id !== foundProj.id)) {
        setHoveredProject(foundProj.data);
        playCyberSfx(920, 'sine', 0.04, 0.03);
      } else if (!foundProj && hoveredProject) {
        setHoveredProject(null);
      }
    }
  };

  const handleMouseUp = (e) => {
    if (draggedNodeRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const elapsed = Date.now() - dragStartRef.current.time;
      const dist = Math.hypot(x - dragStartRef.current.x, y - dragStartRef.current.y);

      if (elapsed < 250 && dist < 6) {
        const hit = draggedNodeRef.current;
        if (hit.data && hit.data.github) {
          window.open(hit.data.github, '_blank', 'noopener,noreferrer');
        }
      } else {
        const dragged = draggedNodeRef.current;
        dragged.vx = dragVelocityRef.current.vx;
        dragged.vy = dragVelocityRef.current.vy;
      }

      draggedNodeRef.current = null;
      setIsDraggingActive(false);
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -2000, y: -2000, isHover: false };
    if (draggedNodeRef.current) {
      draggedNodeRef.current.vx = dragVelocityRef.current.vx;
      draggedNodeRef.current.vy = dragVelocityRef.current.vy;
      draggedNodeRef.current = null;
    }
    setIsDraggingActive(false);
    setHoveredProject(null);
  };

  return (
    <div
      className={`relative w-full h-full min-h-[300px] overflow-hidden group select-none bg-bg ${
        isDraggingActive ? 'cursor-grabbing' : 'cursor-crosshair'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Header telemetry badge */}
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span className="font-mono text-[10px] font-bold tracking-widest text-text-primary uppercase">
          PROJECT REPO GRAPH // NEWTONIAN COLLISION ENGINE
        </span>
      </div>

      <div className="absolute bottom-3 left-4 font-mono text-[9px] text-text-muted pointer-events-none">
        [CLICK &amp; DRAG RED NODES • TECH STACK ACCELERATES &amp; ORBITS • COLLISION RESILIENT]
      </div>

      {/* Ultra-compact Tooltip Card */}
      <AnimatePresence>
        {hoveredProject && !isDraggingActive && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 bottom-10 left-4 max-w-[250px] p-2.5 bg-bg-surface border-2 border-text-primary shadow-xl pointer-events-none"
          >
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="font-mono text-[8px] font-bold text-accent px-1 py-0.2 border border-accent/30 bg-accent/10">
                {hoveredProject.tag}
              </span>
              <span className="font-mono text-[8px] text-text-muted">
                {hoveredProject.stars}
              </span>
            </div>
            <h4 className="font-heading font-black text-xs text-text-primary uppercase tracking-tight">
              {hoveredProject.name}
            </h4>
            <p className="font-mono text-[9px] text-text-secondary mt-0.5 leading-snug">
              {hoveredProject.desc}
            </p>
            <div className="mt-1.5 pt-1 border-t border-border flex items-center justify-between text-[8px] font-mono text-accent font-bold">
              <span>DRAG TO ACCELERATE • CLICK OPEN</span>
              <span>↗</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Cyber Scramble Decoding Typography ────────────────────────────────
const GLYPHS = '0123456789_#*/<>§ΨΩΣλ∇{}[]+-=';

function CyberDecoderTitle({ text, className }) {
  const [displayText, setDisplayText] = useState(text);
  const isHovered = useRef(false);

  const triggerDecode = useCallback(() => {
    playCyberSfx(920, 'sine', 0.04, 0.02);
    let iter = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '/') return char;
            if (index < iter) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iter >= text.length) {
        clearInterval(interval);
      }
      iter += 1 / 2;
    }, 28);
  }, [text]);

  return (
    <span
      className={`cursor-pointer transition-colors duration-200 select-none inline-block ${className}`}
      onMouseEnter={() => {
        if (!isHovered.current) {
          isHovered.current = true;
          triggerDecode();
        }
      }}
      onMouseLeave={() => {
        isHovered.current = false;
      }}
      onClick={triggerDecode}
    >
      {displayText}
    </span>
  );
}

// ─── Main Cybercore Section 02 ────────────────────────────────────────
export default function About() {
  const [istTime, setIstTime] = useState('');

  // Live IST Clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setIstTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Kolkata',
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="about"
      className="relative w-full h-screen min-h-[620px] max-h-[900px] bg-bg flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden select-none border-t border-border "
    >
      {/* ─── CYBERCORE CHASSIS CONSOLE ─────────────────────────────── */}
      <div className="relative w-full h-full max-w-[1360px] max-h-[850px] bg-bg-surface border-2 border-text-primary flex flex-col justify-between overflow-hidden shadow-2xl rounded-xs">
        
        {/* ─── CHASSIS TOP BAR ─────────────────────────────────────── */}
        <div className="border-b border-text-primary px-3 sm:px-6 py-2.5 flex items-center justify-between bg-bg-surface z-20">
          <div className="flex items-center gap-3">
            <span className="font-heading font-black text-xs sm:text-sm tracking-wider uppercase text-text-primary flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-text-primary text-white text-[10px] font-mono font-bold">
                02
              </span>
              ABOUT & ARCHITECTURE
            </span>
            <span className="hidden sm:inline font-mono text-[9px] text-text-muted">
              // SPECIFICATION
            </span>
          </div>

          {/* Status & Live Telemetry Clock */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-2 py-0.5 border border-emerald-600/30 bg-emerald-500/10 text-emerald-700 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </div>
            <span className="font-mono text-[11px] font-bold text-text-primary">
              {istTime || '23:45:00 IST'}
            </span>
          </div>
        </div>

        {/* ─── MAIN INTERIOR: 2 CARDS ONLY (GRAPH GETS THE MAJOR SPACE) ─── */}
        <div className="flex-1 grid grid-cols-12 min-h-0 bg-bg-surface overflow-hidden">
          
          {/* CARD 1: IDENTITY & PERSPECTIVE CARD (~32% Width) */}
          <div className="col-span-12 lg:col-span-4 border-r border-text-primary p-3 sm:p-5 flex flex-col justify-between min-h-0 bg-bg-surface overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase">
                  ARCHITECT // PERSPECTIVE
                </span>
                <span className="h-px bg-border flex-1" />
              </div>

              {/* Display Headline */}
              <h2 className="font-heading font-black text-xl sm:text-2xl md:text-[1.85rem] tracking-tight uppercase leading-[0.98] text-text-primary">
                <CyberDecoderTitle text="SYSTEM ARCHITECT" className="hover:text-accent transition-colors" />
                <br />
                <span className="text-text-muted font-light tracking-tighter text-base sm:text-lg">
                  // <CyberDecoderTitle text="SHESHANK GAHLAWAT" className="hover:text-text-primary" />
                </span>
              </h2>

              <p className="mt-2 text-xs text-text-secondary leading-relaxed line-clamp-2">
                Engineering scalable full-stack MERN systems, algorithmic architectures, and cloud solutions under real-world pressure.
              </p>

              {/* Interactive Physics Text Sandbox */}
              <div className="mt-2.5 flex-1 min-h-[160px] flex flex-col">
                <PhysicsTextSandbox />
              </div>
            </div>

            {/* Bottom Link to Dossier & Contact */}
            <div className="pt-2.5 border-t border-border flex items-center justify-between mt-2">
              <a
                href="#dossier"
                className="font-mono text-[10px] font-bold text-accent hover:text-text-primary transition-colors flex items-center gap-1.5 uppercase"
              >
                <span>EXPLORE PROJECTS</span>
                <span>↓</span>
              </a>
              <a
                href="#contact"
                className="font-mono text-[10px] text-text-muted hover:text-text-primary transition-colors uppercase"
              >
                CONNECT →
              </a>
            </div>
          </div>

          {/* CARD 2: EXPANDED INTERACTIVE PHYSICS GRAPH (~68% Width - MAJOR SPACE!) */}
          <div className="col-span-12 lg:col-span-8 relative overflow-hidden bg-bg min-h-0">
            <ProjectGraphCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}
