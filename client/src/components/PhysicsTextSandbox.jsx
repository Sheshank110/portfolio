import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter;

const INITIAL_WORDS = [
  { text: 'MERN STACK', bg: '#e11d27', color: '#ffffff', border: '#e11d27' },
  { text: 'React 19', bg: '#ffffff', color: '#0c0c0c', border: '#0c0c0c' },
  { text: 'Node.js', bg: '#ffffff', color: '#0c0c0c', border: '#0c0c0c' },
  { text: 'C++ / DSA', bg: '#0c0c0c', color: '#ffffff', border: '#e11d27' },
  { text: 'MongoDB', bg: '#ffffff', color: '#0c0c0c', border: '#0c0c0c' },
  { text: 'AWS Cloud', bg: '#ffffff', color: '#0c0c0c', border: '#0c0c0c' },
  { text: 'LOW LATENCY', bg: '#e11d27', color: '#ffffff', border: '#e11d27' },
  { text: 'CLEAN ARCHITECTURE', bg: '#ffffff', color: '#0c0c0c', border: '#0c0c0c' },
  { text: 'SIH 2024 WINNER', bg: '#0c0c0c', color: '#ffffff', border: '#e11d27' },
  { text: 'SYSTEM ARCHITECT', bg: '#e11d27', color: '#ffffff', border: '#e11d27' },
  { text: 'REST APIs', bg: '#ffffff', color: '#0c0c0c', border: '#0c0c0c' },
  { text: 'DOCKER', bg: '#ffffff', color: '#0c0c0c', border: '#0c0c0c' },
];

export default function PhysicsTextSandbox() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const wordBodiesRef = useRef([]);
  const mousePosRef = useRef({ x: -1000, y: -1000, isHovering: false });
  const lastUserInteractionRef = useRef(0);

  const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
  const [customWord, setCustomWord] = useState('');

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animId = null;
    let isVisible = true;
    let ground, leftWall, rightWall, ceiling;
    let ctx = null;

    // Create Matter Engine with soft low-gravity so words float and juggle nicely
    const engine = Engine.create({
      gravity: { x: 0, y: 0.15, scale: 0.0008 },
    });
    engineRef.current = engine;

    const wallThickness = 300;
    const wallOptions = { isStatic: true, restitution: 0.9, friction: 0.05 };

    const updateCanvasDimensions = () => {
      const width = container.clientWidth || 320;
      const height = container.clientHeight || 200;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (ground) {
        Body.setPosition(ground, { x: width / 2, y: height + wallThickness / 2 });
        Body.setPosition(rightWall, { x: width + wallThickness / 2, y: height / 2 });
        Body.setPosition(leftWall, { x: -wallThickness / 2, y: height / 2 });
        Body.setPosition(ceiling, { x: width / 2, y: -wallThickness / 2 });
      }
    };

    const setupScene = () => {
      const width = container.clientWidth || 320;
      const height = container.clientHeight || 200;
      const dpr = window.devicePixelRatio || 1;

      updateCanvasDimensions();

      if (!ground) {
        ground = Bodies.rectangle(width / 2, height + wallThickness / 2, width * 3, wallThickness, wallOptions);
        leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 3, wallOptions);
        rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 3, wallOptions);
        ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width * 3, wallThickness, wallOptions);

        Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

        // Create Word Rigid Bodies SPAWNED DIRECTLY INSIDE THE VIEWPORT
        ctx.font = 'bold 10px "Space Grotesk", sans-serif';
        const bodies = [];

        INITIAL_WORDS.forEach((item, idx) => {
          const textMetrics = ctx.measureText(item.text);
          const w = textMetrics.width + 18;
          const h = 23;

          // Distribute strictly inside canvas boundaries
          const cols = Math.max(2, Math.floor(width / 80));
          const col = idx % cols;
          const row = Math.floor(idx / cols);

          const startX = 30 + col * ((width - 60) / cols) + (Math.random() - 0.5) * 15;
          const startY = 30 + row * 28 + (Math.random() - 0.5) * 10;

          const body = Bodies.rectangle(startX, startY, w, h, {
            restitution: 0.85,
            friction: 0.05,
            frictionAir: 0.015,
            density: 0.0015,
            angle: (Math.random() - 0.5) * 0.3,
          });

          body.customLabel = item.text;
          body.customBg = item.bg;
          body.customColor = item.color;
          body.customBorder = item.border;
          body.boxW = w;
          body.boxH = h;
          body.seed = idx;

          Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 1.5,
            y: (Math.random() - 0.5) * 1.2,
          });

          bodies.push(body);
        });

        wordBodiesRef.current = bodies;
        Composite.add(engine.world, bodies);

        // Mouse Drag & Toss Constraint
        const mouse = Mouse.create(canvas);
        mouse.pixelRatio = dpr;

        const mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.25,
            render: { visible: false },
          },
        });

        Composite.add(engine.world, mouseConstraint);

        // Start Physics Runner
        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);
      }
    };

    // Main Render & Autonomous Kinetic Frame
    let lastPulseTime = Date.now();

    const renderFrame = () => {
      if (!ctx) return;
      const curW = container.clientWidth || 320;
      const curH = container.clientHeight || 200;
      const now = Date.now();

      ctx.clearRect(0, 0, curW, curH);

      // Cybercore Blueprint Grid
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.038)';
      ctx.lineWidth = 1;
      for (let x = 20; x < curW; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, curH);
        ctx.stroke();
      }
      for (let y = 20; y < curH; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(curW, y);
        ctx.stroke();
      }

      const isUserActive = now - lastUserInteractionRef.current < 2000;
      const mPos = mousePosRef.current;
      const timeSec = now * 0.0015;

      // Periodic gentle upward toss every 3.2 seconds if idle
      if (!isUserActive && now - lastPulseTime > 3200) {
        lastPulseTime = now;
        wordBodiesRef.current.forEach((b) => {
          Body.applyForce(b, b.position, {
            x: (Math.random() - 0.5) * 0.008,
            y: -0.012 - Math.random() * 0.008,
          });
        });
      }

      // Apply forces & strict boundary clamping to every word
      wordBodiesRef.current.forEach((b, i) => {
        const bw = b.boxW || 50;
        const bh = b.boxH || 24;

        // 1. Autonomous fluid wave if user is idle
        if (!isUserActive) {
          const waveX = Math.sin(timeSec + i * 0.8) * 0.00035;
          const waveY = Math.cos(timeSec * 0.7 + i * 0.5) * 0.0003;
          Body.applyForce(b, b.position, { x: waveX, y: waveY });
        }

        // 2. Cursor magnetic repulsion
        if (mPos.isHovering) {
          const dx = b.position.x - mPos.x;
          const dy = b.position.y - mPos.y;
          const dist = Math.hypot(dx, dy);
          const repelRadius = 40;

          if (dist < repelRadius && dist > 1) {
            const force = (1 - dist / repelRadius) * 0.0035;
            Body.applyForce(b, b.position, {
              x: (dx / dist) * force,
              y: (dy / dist) * force,
            });
          }
        }

        // 3. Strict Boundary Clamping: keep all words inside container
        const padX = bw / 2 + 2;
        const padY = bh / 2 + 2;

        if (b.position.x < padX) {
          Body.setPosition(b, { x: padX, y: b.position.y });
          Body.setVelocity(b, { x: Math.abs(b.velocity.x) * 0.85, y: b.velocity.y });
        } else if (b.position.x > curW - padX) {
          Body.setPosition(b, { x: curW - padX, y: b.position.y });
          Body.setVelocity(b, { x: -Math.abs(b.velocity.x) * 0.85, y: b.velocity.y });
        }

        if (b.position.y < padY) {
          Body.setPosition(b, { x: b.position.x, y: padY });
          Body.setVelocity(b, { x: b.velocity.x, y: Math.abs(b.velocity.y) * 0.85 });
        } else if (b.position.y > curH - padY) {
          Body.setPosition(b, { x: b.position.x, y: curH - padY });
          Body.setVelocity(b, { x: b.velocity.x, y: -Math.abs(b.velocity.y) * 0.85 });
        }

        // 4. Render word pill
        ctx.save();
        ctx.translate(b.position.x, b.position.y);
        ctx.rotate(b.angle);

        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = b.customBg || '#ffffff';
        ctx.strokeStyle = b.customBorder || '#0c0c0c';
        ctx.lineWidth = b.customBg === '#e11d27' ? 1.5 : 1;
        ctx.beginPath();
        ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 4);
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        ctx.fillStyle = b.customColor || '#0c0c0c';
        ctx.font = 'bold 9.5px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.customLabel, 0, 1);

        ctx.restore();
      });

      // Draw cursor interaction ripple if hovering
      if (mPos.isHovering) {
        ctx.save();
        ctx.strokeStyle = 'rgba(225, 29, 39, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(mPos.x, mPos.y, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    const startLoop = () => {
      if (animId) cancelAnimationFrame(animId);
      const loop = () => {
        if (!isVisible) return;
        renderFrame();
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (runnerRef.current && engineRef.current) {
            Runner.run(runnerRef.current, engineRef.current);
          }
          startLoop();
        } else {
          stopLoop();
          if (runnerRef.current) {
            Runner.stop(runnerRef.current);
          }
        }
      },
      { threshold: 0.02 }
    );
    visibilityObserver.observe(container);

    setupScene();
    startLoop();

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasDimensions();
      if (isVisible) renderFrame();
    });
    resizeObserver.observe(container);

    return () => {
      visibilityObserver.disconnect();
      stopLoop();
      resizeObserver.disconnect();
      if (runnerRef.current) Runner.stop(runnerRef.current);
      if (engineRef.current) Engine.clear(engineRef.current);
    };
  }, []);

  // Track Mouse Movement (zero-effort continuous interaction)
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovering: true,
    };
    lastUserInteractionRef.current = Date.now();
  };

  const handleMouseEnter = () => {
    mousePosRef.current.isHovering = true;
    lastUserInteractionRef.current = Date.now();
  };

  const handleMouseLeave = () => {
    mousePosRef.current.isHovering = false;
    mousePosRef.current.x = -1000;
    mousePosRef.current.y = -1000;
  };

  // Burst / Toss Handler
  const triggerBurst = () => {
    if (!engineRef.current) return;
    lastUserInteractionRef.current = Date.now();
    wordBodiesRef.current.forEach((b) => {
      Body.applyForce(b, b.position, {
        x: (Math.random() - 0.5) * 0.04,
        y: -0.035 - Math.random() * 0.025,
      });
    });
  };

  // Toss Custom Word Handler
  const handleAddWord = (e) => {
    e.preventDefault();
    if (!customWord.trim() || !engineRef.current || !canvasRef.current) return;

    lastUserInteractionRef.current = Date.now();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 10px "Space Grotesk", sans-serif';
    const textMetrics = ctx.measureText(customWord.trim());
    const w = textMetrics.width + 18;
    const h = 23;

    const width = containerRef.current?.clientWidth || 300;
    const startX = width / 2 + (Math.random() - 0.5) * 40;

    const newBody = Bodies.rectangle(startX, 35, w, h, {
      restitution: 0.85,
      friction: 0.05,
      frictionAir: 0.015,
      density: 0.0015,
    });

    newBody.customLabel = customWord.trim().toUpperCase();
    newBody.customBg = '#e11d27';
    newBody.customColor = '#ffffff';
    newBody.customBorder = '#e11d27';
    newBody.boxW = w;
    newBody.boxH = h;

    Body.setVelocity(newBody, {
      x: (Math.random() - 0.5) * 2,
      y: 1.5,
    });

    wordBodiesRef.current.push(newBody);
    Composite.add(engineRef.current.world, newBody);
    setCustomWord('');
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex-1 h-full min-h-[170px] border border-border bg-bg overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Top Controls Bar */}
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-widest text-text-muted uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>KINETIC TEXT CHAMBER</span>
        </div>
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={triggerBurst}
            className="font-mono text-[8px] font-bold px-2 py-0.5 border border-border bg-bg-surface text-text-primary hover:bg-accent hover:text-white hover:border-accent transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span>BURST 💥</span>
          </button>
        </div>
      </div>

      {/* Physics Canvas Area (Continuous Kinetic Loop + Magnetic Hover Repulsion) */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Bottom Spawn / Manipulate Bar */}
      <div className="absolute bottom-1.5 left-2 right-2 z-20 flex items-center justify-between pointer-events-auto">
        <form onSubmit={handleAddWord} className="flex items-center gap-1">
          <input
            type="text"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            placeholder="Drop custom word..."
            maxLength={16}
            className="bg-bg-surface border border-border px-2 py-0.5 font-mono text-[9px] text-text-primary focus:outline-none focus:border-text-primary w-28 sm:w-32"
          />
          <button
            type="submit"
            className="bg-text-primary text-white font-mono text-[8px] font-bold px-2 py-1 uppercase hover:bg-accent transition-colors cursor-pointer"
          >
            + DROP
          </button>
        </form>
        <span className="font-mono text-[8px] text-text-muted hidden sm:inline">
          [HOVER TO DISPERSE • DRAG TO FLING]
        </span>
      </div>
    </div>
  );
}
