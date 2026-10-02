import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Zero-latency Web Audio API Synth ──────────────────────────────────
function playArcadeSfx(type = 'jump') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'jump') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'collect') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'trophy') {
      // Fanfare chord
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
        g.gain.setValueAtTime(0.035, ctx.currentTime + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.25);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + i * 0.06);
        o.stop(ctx.currentTime + i * 0.06 + 0.25);
      });
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    }
  } catch (err) {
    // Ignore audio context autoplay limitations
  }
}

// ─── Real Portfolio Items & Obstacles ─────────────────────────────────
const SKILL_ITEMS = [
  { text: 'REACT 19', type: 'skill', icon: '⚛️', color: '#61dafb', xp: 120, note: 'Virtual DOM & Hooks' },
  { text: 'NODE.JS', type: 'skill', icon: '🟢', color: '#68a063', xp: 120, note: 'Async REST APIs' },
  { text: 'C++ / DSA', type: 'skill', icon: '⚡', color: '#e11d27', xp: 150, note: 'O(log N) Efficiency' },
  { text: 'MONGODB', type: 'skill', icon: '🍃', color: '#47a248', xp: 100, note: 'Indexed Document Store' },
  { text: 'AWS CLOUD', type: 'cert', icon: '☁️', color: '#ff9900', xp: 200, note: 'Certified Practitioner' },
  { text: 'SIH 2024', type: 'trophy', icon: '🏆', color: '#ffd700', xp: 500, note: 'National Finalist' },
  { text: 'ICCS 2025', type: 'trophy', icon: '🥈', color: '#c0c0c0', xp: 300, note: '2nd Prize National Poster' },
  { text: 'GEN AI', type: 'cert', icon: '🧠', color: '#e11d27', xp: 200, note: 'AWS GenAI Certified' },
];

const OBSTACLES = [
  { text: 'BUG 404', icon: '🐛', width: 26, height: 26 },
  { text: 'MERGE CONFLICT', icon: '⚠️', width: 28, height: 24 },
  { text: 'HIGH LATENCY', icon: '⏳', width: 24, height: 28 },
  { text: 'NULL POINTER', icon: '💥', width: 26, height: 24 },
];

export default function StickmanDevArcade() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Game State Refs
  const scoreRef = useRef(0);
  const commitsRef = useRef(14);
  const [hudScore, setHudScore] = useState(0);
  const [hudCommits, setHudCommits] = useState(14);
  const [autoPilot, setAutoPilot] = useState(true);
  const [latestUnlock, setLatestUnlock] = useState('CAREER SPRINT INITIALIZED');
  const [isJumping, setIsJumping] = useState(false);

  // Game Loop Variables
  const gameStateRef = useRef({
    stickman: {
      x: 75,
      y: 0,
      vy: 0,
      isGrounded: true,
      jumpCount: 0,
      runCycle: 0,
      flipAngle: 0,
      isFlipping: false,
    },
    items: [],
    obstacles: [],
    particles: [],
    nextItemSpawn: 60,
    nextObstacleSpawn: 140,
    speed: 3.6,
    autoPilot: true,
    gameOver: false,
    invincibleTimer: 0,
    flashRed: 0,
  });

  // Sync state ref
  useEffect(() => {
    gameStateRef.current.autoPilot = autoPilot;
  }, [autoPilot]);

  // Jump Action
  const triggerJump = useCallback(() => {
    const s = gameStateRef.current.stickman;
    if (s.jumpCount < 2) {
      s.vy = -9.2;
      s.isGrounded = false;
      s.jumpCount++;
      if (s.jumpCount === 2) {
        s.isFlipping = true;
      }
      playArcadeSfx('jump');
      setIsJumping(true);
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        setAutoPilot(false);
        triggerJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerJump]);

  // Main Canvas & Game Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animId;
    const dpr = window.devicePixelRatio || 1;

    const setupCanvas = () => {
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 220;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    const resizeObs = new ResizeObserver(() => {
      setupCanvas();
    });
    resizeObs.observe(container);

    const ctx = canvas.getContext('2d');
    const gs = gameStateRef.current;

    // Ground position (relative to canvas height)
    let groundY = (container.clientHeight || 220) - 34;

    // Game loop
    let tick = 0;
    const loop = () => {
      tick++;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 220;
      groundY = h - 34;

      ctx.clearRect(0, 0, w, h);

      // ─── 1. Background Grid & Cityline ──────────────────────────────
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridOffset = (tick * gs.speed) % 24;
      for (let x = -gridOffset; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, groundY);
        ctx.stroke();
      }

      // Distant cyber nodes / pillars
      ctx.fillStyle = 'rgba(225, 29, 39, 0.05)';
      for (let i = 0; i < 4; i++) {
        const pillarX = ((i * 200 - tick * (gs.speed * 0.4)) % (w + 200)) - 50;
        ctx.fillRect(pillarX, groundY - 60 - (i % 2) * 30, 20, 60 + (i % 2) * 30);
      }

      // ─── 2. Ground Circuit Line ──────────────────────────────────────
      ctx.strokeStyle = '#e11d27';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.stroke();

      // Cyber hash marks along the track
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      const hashOffset = (tick * gs.speed) % 18;
      for (let x = -hashOffset; x < w; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x - 6, groundY + 8);
        ctx.stroke();
      }

      // Track label
      ctx.font = 'bold 8px "Space Grotesk", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillText('SPEED // 60 FPS • SECTOR: CLOUD & FULL-STACK • SHE-SHANK RUNNER', 14, groundY + 22);

      // ─── 3. Physics & Stickman Update ────────────────────────────────
      const sm = gs.stickman;

      // Gravity
      sm.vy += 0.52;
      sm.y += sm.vy;

      if (sm.y >= groundY) {
        sm.y = groundY;
        sm.vy = 0;
        sm.isGrounded = true;
        sm.jumpCount = 0;
        sm.isFlipping = false;
        sm.flipAngle = 0;
        setIsJumping(false);
      }

      if (sm.isGrounded) {
        sm.runCycle += 0.25;
      } else if (sm.isFlipping) {
        sm.flipAngle += 0.22;
        if (sm.flipAngle >= Math.PI * 2) {
          sm.flipAngle = Math.PI * 2;
        }
      }

      // ─── 4. Auto-Pilot AI Logic ──────────────────────────────────────
      if (gs.autoPilot) {
        // Find nearest approaching obstacle
        const nearestObstacle = gs.obstacles.find((obs) => obs.x > sm.x && obs.x - sm.x < 115);
        if (nearestObstacle && sm.isGrounded) {
          sm.vy = -9.2;
          sm.isGrounded = false;
          sm.jumpCount = 1;
          playArcadeSfx('jump');
          setIsJumping(true);
        }

        // Double jump if obstacle is wide or high
        const nearestHighItem = gs.items.find((item) => item.x > sm.x && item.x - sm.x < 90 && item.y < groundY - 55);
        if (nearestHighItem && sm.jumpCount === 1 && sm.vy > -1) {
          sm.vy = -8.5;
          sm.jumpCount = 2;
          sm.isFlipping = true;
          playArcadeSfx('jump');
        }
      }

      // ─── 5. Spawn & Move Items (Skills & Trophies) ───────────────────
      gs.nextItemSpawn--;
      if (gs.nextItemSpawn <= 0) {
        const itemTemplate = SKILL_ITEMS[Math.floor(Math.random() * SKILL_ITEMS.length)];
        const spawnY = groundY - 32 - Math.random() * 45;
        gs.items.push({
          ...itemTemplate,
          x: w + 20,
          y: spawnY,
          pulse: 0,
        });
        gs.nextItemSpawn = 80 + Math.floor(Math.random() * 60);
      }

      // Move items & check collisions
      for (let i = gs.items.length - 1; i >= 0; i--) {
        const item = gs.items[i];
        item.x -= gs.speed;
        item.pulse += 0.08;

        // Collision with stickman
        const dx = item.x - sm.x;
        const dy = item.y - (sm.y - 25);
        const dist = Math.hypot(dx, dy);

        if (dist < 26) {
          // Collected!
          scoreRef.current += item.xp;
          commitsRef.current += 1;
          setHudScore(scoreRef.current);
          setHudCommits(commitsRef.current);
          setLatestUnlock(`+${item.xp} XP: ${item.text} (${item.note})`);

          playArcadeSfx(item.type === 'trophy' ? 'trophy' : 'collect');

          // Spawn sparkle particles
          for (let p = 0; p < 8; p++) {
            gs.particles.push({
              x: item.x,
              y: item.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              color: item.color,
              alpha: 1,
              size: 2.5 + Math.random() * 2,
            });
          }

          gs.items.splice(i, 1);
          continue;
        }

        // Remove offscreen
        if (item.x < -60) {
          gs.items.splice(i, 1);
          continue;
        }

        // Draw item badge
        ctx.save();
        ctx.translate(item.x, item.y + Math.sin(item.pulse) * 3);

        // Glow ring
        ctx.fillStyle = item.type === 'trophy' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        // Border pill
        ctx.fillStyle = '#0c0c0c';
        ctx.strokeStyle = item.color;
        ctx.lineWidth = item.type === 'trophy' ? 1.5 : 1;
        ctx.beginPath();
        ctx.roundRect(-24, -10, 48, 20, 3);
        ctx.fill();
        ctx.stroke();

        // Text & Icon
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8.5px "Space Grotesk", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${item.icon} ${item.text}`, 0, 1);

        ctx.restore();
      }

      // ─── 6. Spawn & Move Obstacles (Bugs) ────────────────────────────
      gs.nextObstacleSpawn--;
      if (gs.nextObstacleSpawn <= 0) {
        const obsTemplate = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
        gs.obstacles.push({
          ...obsTemplate,
          x: w + 20,
          y: groundY - obsTemplate.height,
        });
        gs.nextObstacleSpawn = 120 + Math.floor(Math.random() * 90);
      }

      for (let i = gs.obstacles.length - 1; i >= 0; i--) {
        const obs = gs.obstacles[i];
        obs.x -= gs.speed;

        // Collision box
        const hitX = sm.x > obs.x - 12 && sm.x < obs.x + obs.width + 12;
        const hitY = sm.y > obs.y - 10;

        if (hitX && hitY && gs.invincibleTimer <= 0) {
          // Hit obstacle!
          gs.flashRed = 8;
          gs.invincibleTimer = 40;
          scoreRef.current = Math.max(0, scoreRef.current - 50);
          setHudScore(scoreRef.current);
          setLatestUnlock(`⚠️ DEBUGGED: ${obs.text} (-50 XP)`);
          playArcadeSfx('hit');

          // Jump stickman back
          sm.vy = -4.5;
        }

        if (obs.x < -60) {
          gs.obstacles.splice(i, 1);
          continue;
        }

        // Draw obstacle
        ctx.save();
        ctx.fillStyle = '#18181b';
        ctx.strokeStyle = '#e11d27';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 3);
        ctx.fill();
        ctx.stroke();

        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obs.icon, obs.x + obs.width / 2, obs.y + obs.height / 2);

        ctx.font = 'bold 7px "Space Grotesk", monospace';
        ctx.fillStyle = '#e11d27';
        ctx.fillText(obs.text, obs.x + obs.width / 2, obs.y - 5);

        ctx.restore();
      }

      if (gs.invincibleTimer > 0) gs.invincibleTimer--;
      if (gs.flashRed > 0) gs.flashRed--;

      // ─── 7. Particle System ──────────────────────────────────────────
      for (let p = gs.particles.length - 1; p >= 0; p--) {
        const pt = gs.particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.025;

        if (pt.alpha <= 0) {
          gs.particles.splice(p, 1);
          continue;
        }

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ─── 8. Draw Procedural Stickman Developer ───────────────────────
      ctx.save();
      ctx.translate(sm.x, sm.y);
      if (sm.isFlipping) {
        ctx.rotate(sm.flipAngle);
      }

      // Flashing if hit
      if (gs.invincibleTimer > 0 && Math.floor(tick / 4) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const legPhase = Math.sin(sm.runCycle);
      const armPhase = Math.cos(sm.runCycle);

      // Torso coordinates
      const headY = -34;
      const neckY = -26;
      const hipY = -12;

      // Head
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, headY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Red Cyber Headband fluttering
      ctx.strokeStyle = '#e11d27';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-4, headY - 1);
      ctx.lineTo(4, headY - 1);
      // Fluttering tail
      ctx.lineTo(8 + Math.sin(tick * 0.3) * 2, headY - 3);
      ctx.stroke();

      // Spine / Torso
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, neckY);
      ctx.lineTo(0, hipY);
      ctx.stroke();

      // Arms (with running pump or jump lift)
      let leftHandX, leftHandY, rightHandX, rightHandY;
      if (!sm.isGrounded) {
        // Jumping arms up
        leftHandX = -7;
        leftHandY = neckY - 8;
        rightHandX = 8;
        rightHandY = neckY - 8;
      } else {
        // Running arms pump
        leftHandX = -8 + armPhase * 6;
        leftHandY = neckY + 7 - armPhase * 4;
        rightHandX = 8 - armPhase * 6;
        rightHandY = neckY + 7 + armPhase * 4;
      }

      // Draw Left Arm
      ctx.beginPath();
      ctx.moveTo(0, neckY + 2);
      ctx.lineTo(leftHandX / 2, neckY + 5);
      ctx.lineTo(leftHandX, leftHandY);
      ctx.stroke();

      // Draw Right Arm (holding a tiny glowing stylus / laptop)
      ctx.beginPath();
      ctx.moveTo(0, neckY + 2);
      ctx.lineTo(rightHandX / 2, neckY + 5);
      ctx.lineTo(rightHandX, rightHandY);
      ctx.stroke();

      // Tiny laptop under arm when running
      ctx.fillStyle = '#e11d27';
      ctx.fillRect(rightHandX - 2, rightHandY - 2, 5, 4);

      // Legs
      let leftFootX, leftFootY, rightFootX, rightFootY;
      if (!sm.isGrounded) {
        // Tucked jump legs
        leftFootX = -6;
        leftFootY = -2;
        rightFootX = 4;
        rightFootY = 0;
      } else {
        // Running stride
        leftFootX = legPhase * 11;
        leftFootY = 0;
        rightFootX = -legPhase * 11;
        rightFootY = 0;
      }

      // Draw Left Leg (hip -> knee -> foot)
      const leftKneeY = hipY + 6 - Math.max(0, -legPhase) * 3;
      ctx.beginPath();
      ctx.moveTo(0, hipY);
      ctx.lineTo(leftFootX * 0.5, leftKneeY);
      ctx.lineTo(leftFootX, leftFootY);
      ctx.stroke();

      // Draw Right Leg (hip -> knee -> foot)
      const rightKneeY = hipY + 6 - Math.max(0, legPhase) * 3;
      ctx.beginPath();
      ctx.moveTo(0, hipY);
      ctx.lineTo(rightFootX * 0.5, rightKneeY);
      ctx.lineTo(rightFootX, rightFootY);
      ctx.stroke();

      // Red sneakers
      ctx.fillStyle = '#e11d27';
      ctx.fillRect(leftFootX - 1, leftFootY - 1, 3.5, 2.5);
      ctx.fillRect(rightFootX - 1, rightFootY - 1, 3.5, 2.5);

      ctx.restore();

      // Screen flash red if hit
      if (gs.flashRed > 0) {
        ctx.fillStyle = 'rgba(225, 29, 39, 0.12)';
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      resizeObs.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[220px] sm:h-[240px] bg-[#0c0c0c] border-2 border-text-primary overflow-hidden flex flex-col justify-between select-none shadow-xl"
    >
      {/* ─── ARCADE TOP HUD BAR ────────────────────────────────────── */}
      <div className="border-b border-neutral-800 bg-[#0c0c0c]/90 px-3 sm:px-4 py-1.5 flex items-center justify-between font-mono text-[10px] z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-heading font-black text-white tracking-wider uppercase text-xs">
            STICKMAN // CAREER SPRINT
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 border border-neutral-700 bg-neutral-900 text-neutral-300 text-[9px]">
            MINI-GAME
          </span>
        </div>

        {/* Live Score & Commits */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-neutral-300 font-bold">
            <span className="text-neutral-500">XP:</span>
            <span className="text-white text-xs">{hudScore}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-neutral-300 font-bold">
            <span className="text-neutral-500">COMMITS:</span>
            <span className="text-accent text-xs">+{hudCommits}</span>
          </div>

          {/* AutoPilot Mode Toggle */}
          <button
            onClick={() => setAutoPilot((prev) => !prev)}
            className={`px-2 py-0.5 font-mono text-[9px] font-bold border transition-colors cursor-pointer uppercase ${
              autoPilot
                ? 'bg-accent text-white border-accent'
                : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
            }`}
          >
            {autoPilot ? '● AUTO-RUN: ON' : '○ MANUAL PLAY'}
          </button>
        </div>
      </div>

      {/* ─── MAIN GAME CANVAS (Interactive Click to Jump) ──────────── */}
      <canvas
        ref={canvasRef}
        onClick={() => {
          setAutoPilot(false);
          triggerJump();
        }}
        className="w-full flex-1 block cursor-pointer"
      />

      {/* ─── ARCADE BOTTOM TICKER & CONTROLS ───────────────────────── */}
      <div className="border-t border-neutral-800 bg-[#0c0c0c] px-3 sm:px-4 py-1.5 flex items-center justify-between font-mono text-[9px] text-neutral-400 z-20">
        <div className="flex items-center gap-1.5 text-accent font-bold truncate max-w-[70%]">
          <span className="animate-pulse">▶</span>
          <span className="truncate">{latestUnlock}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAutoPilot(false);
              triggerJump();
            }}
            className="px-2.5 py-0.5 bg-neutral-900 hover:bg-accent hover:text-white text-white font-bold border border-neutral-700 transition-colors uppercase text-[9px] cursor-pointer"
          >
            JUMP [SPACE]
          </button>
        </div>
      </div>
    </div>
  );
}
