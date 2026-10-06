import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import heroImg from '../assets/sheshank-hero.png';

// ── Floating Ember Sparks Canvas ──────────────────────────────────────────
function EmberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(255, 42, 75, ',
      'rgba(255, 77, 109, ',
      'rgba(225, 29, 39, ',
      'rgba(255, 120, 140, ',
      'rgba(255, 200, 200, ',
    ];

    const count = Math.min(48, Math.floor((width * height) / 28000));
    const embers = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.45 + 0.25),
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.65 + 0.25,
      maxAlpha: Math.random() * 0.7 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      embers.forEach((p) => {
        p.y += p.speedY;
        p.angle += 0.02;
        p.x += Math.sin(p.angle) * 0.35 + p.speedX;
        p.alpha += Math.sin(p.angle * 2) * p.pulse;

        // Reset if drifted past top or sides
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = Math.max(0.1, Math.min(p.maxAlpha, p.alpha));

        // Glow halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color + currentAlpha * 0.35 + ')';
        ctx.fill();

        // Core spark
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + currentAlpha + ')';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      aria-hidden="true"
    />
  );
}

export default function Hero() {
  const containerRef = useRef(null);

  // Parallax spring values for fluid mouse interaction
  const mouseX = useSpring(0, { stiffness: 100, damping: 24 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 24 });

  // 3D Tilt transforms
  const rotateY = useTransform(mouseX, [-1, 1], [-3.5, 3.5]);
  const rotateX = useTransform(mouseY, [-1, 1], [3, -3]);
  const translateX = useTransform(mouseX, [-1, 1], [-8, 8]);
  const translateY = useTransform(mouseY, [-1, 1], [-5, 5]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Anti-theft event blocker
  const preventCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={preventCopy}
      onDragStart={preventCopy}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      className="relative w-full bg-black overflow-hidden flex items-center justify-center min-h-[580px] h-[92vh] md:h-screen select-none [perspective:1400px]"
    >
      {/* Accessible semantic heading for Search Engines & Screen Readers */}
      <h1 className="sr-only">
        Sheshank Gahlawat — Full-Stack Developer & Builder Portfolio
      </h1>

      {/* ── 3D Interactive Motion Canvas Container ───────────────────── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
      >
        {/* Exact Original Landing Page Image (Unchanged) */}
        <img
          src={heroImg}
          alt="Sheshank Gahlawat — Student, Developer, Builder"
          draggable={false}
          onContextMenu={preventCopy}
          onDragStart={preventCopy}
          className="w-full h-full object-contain md:object-cover object-center block pointer-events-none select-none"
        />

        {/* Dynamic Horizontal Laser Flare Glow (Synced with image beam) */}
        <div
          className="absolute inset-0 pointer-events-none hero-laser-beam flex items-center justify-center opacity-80 z-10"
          aria-hidden="true"
        >
          <div className="w-full h-[2.5px] bg-gradient-to-r from-transparent via-[#ff2a4b]/80 to-transparent shadow-[0_0_25px_#ff2a4b,0_0_60px_#e11d27]" />
        </div>

        {/* Ambient Red Breathing Pulse */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] bg-[#e11d27]/20 blur-[120px] rounded-full hero-ambient-glow pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Floating Ember Particle System */}
        <EmberCanvas />

        {/* Cinematic Vignette Overlay */}
        <div
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.85)_100%)] z-22"
          aria-hidden="true"
        />

        {/* Top & Bottom seamless gradient blending */}
        <div
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-25"
          aria-hidden="true"
        />
      </motion.div>

      {/* ── Transparent Interactive Anti-Theft Shield ─────────────────── */}
      {/* Sits over the entire hero, intercepts right-clicks, drag-and-drops, and touch-saves */}
      <div
        onContextMenu={preventCopy}
        onDragStart={preventCopy}
        className="absolute inset-0 z-30 pointer-events-auto cursor-default"
        aria-hidden="true"
      />
    </section>
  );
}
