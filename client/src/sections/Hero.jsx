import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import heroBg from '../assets/hero-crimson-bg.jpg';
import portraitCutout from '../assets/sheshank-portrait-cutout.png';

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
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
      aria-hidden="true"
    />
  );
}

export default function Hero() {
  const containerRef = useRef(null);

  // Parallax spring values for fluid mouse depth
  const mouseX = useSpring(0, { stiffness: 100, damping: 22 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 22 });

  // Transform layers for stereoscopic depth
  const bgTranslateX = useTransform(mouseX, [-1, 1], [-8, 8]);
  const bgTranslateY = useTransform(mouseY, [-1, 1], [-5, 5]);

  const textTranslateX = useTransform(mouseX, [-1, 1], [-12, 12]);
  const textTranslateY = useTransform(mouseY, [-1, 1], [-7, 7]);

  const personTranslateX = useTransform(mouseX, [-1, 1], [14, -14]);
  const personTranslateY = useTransform(mouseY, [-1, 1], [8, -8]);

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

  // Shared typography class string for pixel-perfect alignment
  const nameTypographyClasses =
    'font-black uppercase text-[18vw] sm:text-[16vw] md:text-[13.8vw] lg:text-[12.4vw] xl:text-[11.2rem] tracking-tight text-center leading-[0.84] select-none block';

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full min-h-[640px] h-[92vh] md:h-screen bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* Accessible semantic heading for Search Engines & Screen Readers */}
      <h1 className="sr-only">
        Sheshank Gahlawat — Full-Stack Developer & Builder Portfolio
      </h1>

      {/* ── Layer 1: Cinematic Crimson Background & Laser Flare ────────── */}
      <motion.div
        style={{ x: bgTranslateX, y: bgTranslateY }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none"
        />

        {/* Central Anamorphic Red Laser Beam Overlay */}
        <div
          className="absolute inset-0 pointer-events-none hero-laser-beam flex items-center justify-center opacity-85"
          aria-hidden="true"
        >
          <div className="w-full h-[2.5px] bg-gradient-to-r from-transparent via-[#ff2a4b] to-transparent shadow-[0_0_25px_#ff2a4b,0_0_55px_#e11d27]" />
        </div>

        {/* Ambient Red Glow Pulse */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[45vh] bg-[#e11d27]/25 blur-[120px] rounded-full hero-ambient-glow pointer-events-none"
          aria-hidden="true"
        />

        {/* Cinematic Vignette */}
        <div
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.5)_65%,rgba(0,0,0,0.95)_100%)]"
          aria-hidden="true"
        />

        {/* Top & Bottom gradient blending into site */}
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </motion.div>

      {/* ── Layer 2: Particle Ember Canvas ────────────────────────────── */}
      <EmberCanvas />

      {/* ── Layer 3: Left Accent Typography (Desktop) ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-6 md:left-10 lg:left-16 top-1/2 -translate-y-1/2 z-30 hidden md:block pointer-events-none"
      >
        <div className="font-mono text-[11px] lg:text-xs tracking-[0.26em] text-white/55 uppercase font-medium">
          <span>IDEAS</span>
          <span className="text-accent font-bold mx-2">/</span>
          <span>BUILD</span>
          <span className="text-accent font-bold mx-2">/</span>
          <span>LEARN</span>
          <span className="text-accent font-bold mx-2">/</span>
          <span>REPEAT</span>
        </div>
      </motion.div>

      {/* ── Layer 4: Right Accent Typography (Desktop) ────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-6 md:right-10 lg:right-16 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-start gap-1 pointer-events-none"
      >
        <div className="flex flex-col items-start gap-1 font-mono text-[11px] lg:text-xs tracking-[0.24em] text-white/75 uppercase font-semibold">
          <span>STUDENT</span>
          <span>DEVELOPER</span>
          <span>BUILDER</span>
          <div className="w-6 h-[2px] bg-accent mt-1.5" />
        </div>
      </motion.div>

      {/* ── Layer 5A: Behind Subject — Solid White "SHESHANK" ─────────── */}
      <motion.div
        style={{ x: textTranslateX, y: textTranslateY }}
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4"
      >
        <span className={`hero-name-solid ${nameTypographyClasses}`} aria-hidden="true">
          SHESHANK
        </span>
        {/* Invisible spacer keeping identical height and line spacing as GAHLAWAT */}
        <span className={`invisible select-none pointer-events-none ${nameTypographyClasses}`} aria-hidden="true">
          GAHLAWAT
        </span>
      </motion.div>

      {/* ── Layer 5B: Foreground Subject — Sheshank Cutout ───────────── */}
      <motion.div
        style={{ x: personTranslateX, y: personTranslateY }}
        initial={{ opacity: 0, scale: 0.96, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.05, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 inset-x-0 flex justify-center items-end pointer-events-none z-20 h-[74vh] sm:h-[80vh] md:h-[85vh] lg:h-[88vh]"
      >
        <img
          src={portraitCutout}
          alt="Sheshank Gahlawat Portrait"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className="h-full w-auto max-w-[90vw] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[650px] xl:max-w-[700px] object-contain object-bottom block select-none pointer-events-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] [mask-image:linear-gradient(to_bottom,black_68%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,black_68%,transparent_98%)]"
        />
      </motion.div>

      {/* ── Layer 5C: Across Subject's Chest — Outlined Red "GAHLAWAT" ── */}
      <motion.div
        style={{ x: textTranslateX, y: textTranslateY }}
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-25 px-4"
      >
        {/* Invisible spacer keeping identical height and line spacing as SHESHANK */}
        <span className={`invisible select-none pointer-events-none ${nameTypographyClasses}`} aria-hidden="true">
          SHESHANK
        </span>
        <span className={`hero-name-stroke ${nameTypographyClasses}`} aria-hidden="true">
          GAHLAWAT
        </span>
      </motion.div>

      {/* ── Layer 6: Mobile Editorial Accents (Bottom Bar) ───────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="md:hidden absolute bottom-5 inset-x-6 z-30 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/60 uppercase pointer-events-none"
      >
        <div className="flex items-center gap-1.5">
          <span>IDEAS</span>
          <span className="text-accent">/</span>
          <span>BUILD</span>
          <span className="text-accent">/</span>
          <span>LEARN</span>
        </div>
        <div className="flex items-center gap-2 text-right text-white/80 font-bold">
          <span>BUILDER</span>
          <div className="w-3.5 h-[2px] bg-accent" />
        </div>
      </motion.div>
    </section>
  );
}
