import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChronoTunnelCanvas, {
  CHRONO_MILESTONES,
  TOTAL_TUNNEL_LENGTH,
} from '../components/ChronoTunnelCanvas';

export default function WormholeTransit() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState(CHRONO_MILESTONES[0]);
  const [warpFactor, setWarpFactor] = useState(1.0);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const audioContextRef = useRef(null);
  const droneGainRef = useRef(null);

  // ─── Silky Smooth Scroll Progress Computation ────────────────────────────
  useEffect(() => {
    let lastProgress = -1;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const rect = sectionRef.current.getBoundingClientRect();
          const totalDistance = rect.height - window.innerHeight;
          if (totalDistance <= 0) return;

          const scrolledPast = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolledPast / totalDistance));

          // Only update state if progress actually changed meaningfully
          if (
            Math.abs(progress - lastProgress) > 0.0015 ||
            (progress === 0 && lastProgress !== 0) ||
            (progress === 1 && lastProgress !== 1)
          ) {
            lastProgress = progress;
            setScrollProgress(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // ─── Subtle Relativistic Audio Drone (Web Audio API) ──────────────────────
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.03, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      droneGainRef.current = gainNode;
    } catch {
      // AudioContext unavailable
    }
  }, []);

  const toggleAudio = () => {
    if (isAudioMuted) {
      initAudio();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      if (droneGainRef.current && audioContextRef.current) {
        droneGainRef.current.gain.linearRampToValueAtTime(0.04, audioContextRef.current.currentTime + 0.5);
      }
      setIsAudioMuted(false);
    } else {
      if (droneGainRef.current && audioContextRef.current) {
        droneGainRef.current.gain.linearRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.3);
      }
      setIsAudioMuted(true);
    }
  };

  useEffect(() => {
    if (!isAudioMuted && droneGainRef.current && audioContextRef.current) {
      const targetGain = 0.025 + Math.min(warpFactor * 0.01, 0.06);
      droneGainRef.current.gain.setTargetAtTime(targetGain, audioContextRef.current.currentTime, 0.2);
    }
  }, [warpFactor, isAudioMuted]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // ─── Jump To Milestone Gate ──────────────────────────────────────────────
  const jumpToMilestone = (milestone) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const totalDistance = rect.height - window.innerHeight;

    const targetProgress = Math.max(0, Math.min(1, milestone.z / TOTAL_TUNNEL_LENGTH));
    const targetScrollY = sectionTop + targetProgress * totalDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  const handleNextMilestone = () => {
    if (!activeMilestone) return;
    const currentIdx = CHRONO_MILESTONES.findIndex((m) => m.gateIndex === activeMilestone.gateIndex);
    const nextMilestone = CHRONO_MILESTONES[currentIdx + 1] || CHRONO_MILESTONES[0];
    jumpToMilestone(nextMilestone);
  };

  return (
    <section
      id="transit"
      ref={sectionRef}
      className="relative w-full h-[480vh] bg-black text-white select-none"
    >
      {/* ─── STICKY FULLSCREEN VIEWPORT CONTAINER ─────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between bg-black">
        
        {/* Top Space Telemetry HUD */}
        <header className="relative z-30 w-full px-4 sm:px-8 pt-4 pb-3 flex items-center justify-between border-b border-white/10 bg-black/85 backdrop-blur-md font-mono text-[10px] tracking-wider">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-white font-bold tracking-[0.25em] uppercase text-[11px]">
                SPACE JOURNEY // CAREER TIMELINE
              </span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <span className="text-white/60 font-medium hidden sm:inline">
                CHRONOLOGICAL PATH
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Warp Velocity */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xs">
              <span className="text-white/40 text-[9px] uppercase hidden md:inline">SPEED:</span>
              <span className="text-white font-bold">
                WARP {warpFactor.toFixed(1)}
              </span>
            </div>

            {/* Depth % Indicator */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xs">
              <span className="text-white/40 text-[9px] uppercase hidden md:inline">PROGRESS:</span>
              <span className="text-white font-bold font-mono">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-white/15 bg-white/5 hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
              title="Toggle Audio Drone"
            >
              <span>{isAudioMuted ? '🔇' : '🔊'}</span>
              <span className="text-[9px] uppercase hidden sm:inline">
                {isAudioMuted ? 'AUDIO OFF' : 'AUDIO ACTIVE'}
              </span>
            </button>
          </div>
        </header>

        {/* ─── 3D THREE.JS WEBGL CANVASES (PURE BLACK SPACE & WHITE STARS) ─ */}
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto bg-black">
          <ChronoTunnelCanvas
            scrollProgress={scrollProgress}
            onMilestoneChange={setActiveMilestone}
            onWarpSpeedChange={setWarpFactor}
          />
        </div>

        {/* ─── COCKPIT FLIGHT RETICLE & HUD ELEMENTS ──────────────────────── */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          {/* Subtle star flight reticle */}
          <div className="w-14 h-14 border border-white/10 rounded-full flex items-center justify-center opacity-40">
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            <div className="w-8 h-px bg-white/20 absolute" />
            <div className="h-8 w-px bg-white/20 absolute" />
          </div>

          {/* Initial Scroll Prompt */}
          {scrollProgress < 0.03 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-28 flex flex-col items-center gap-2 pointer-events-none text-center"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/90 font-bold bg-black/90 px-4 py-1.5 border border-white/20 rounded-full shadow-2xl backdrop-blur-md">
                SCROLL TO TRAVEL THROUGH SPACE ✦
              </span>
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-white text-base"
              >
                ▼
              </motion.span>
            </motion.div>
          )}
        </div>

        {/* ─── ACTIVE MILESTONE HOLOGRAPHIC DOSSIER CARD ───────────────────── */}
        <div className="relative z-30 px-4 sm:px-8 pb-4 pointer-events-none flex flex-col sm:flex-row items-end justify-between gap-4">
          <AnimatePresence mode="wait">
            {activeMilestone ? (
              <motion.div
                key={activeMilestone.gateIndex}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-auto max-w-[420px] w-full bg-black/90 border border-white/20 p-3.5 sm:p-4 rounded-xs shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-xl relative overflow-hidden"
              >
                {/* Clean top white accent line */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/70" />

                {/* Card Header: Gate pill + Category */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-xs bg-white text-black">
                      GATE {activeMilestone.gateIndex} // {activeMilestone.type}
                    </span>
                    <span className="font-mono text-[9px] text-white/50 tracking-wider">
                      {activeMilestone.badge}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] font-bold tracking-widest text-white/80">
                    {activeMilestone.year}
                  </span>
                </div>

                {/* Milestone Title (compact) */}
                <h3 className="font-heading font-black text-xs sm:text-sm uppercase tracking-tight text-white mb-1 leading-snug">
                  {activeMilestone.title}
                </h3>

                {/* Organization & Score */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-white/70 font-medium mb-2">
                  <span>▶ {activeMilestone.org}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white font-bold">{activeMilestone.score}</span>
                </div>

                {/* Description (compact) */}
                <p className="text-[11px] text-neutral-300 leading-relaxed font-body mb-2.5 line-clamp-2 sm:line-clamp-3">
                  {activeMilestone.summary}
                </p>

                {/* Tags & Action Button */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap gap-1">
                    {activeMilestone.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[8px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-xs text-white/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleNextMilestone}
                    className="font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white text-black hover:bg-white/80 transition-all flex items-center gap-1 rounded-xs cursor-pointer ml-auto"
                  >
                    <span>NEXT</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Temporal Stations Quick Scrubber (Hitparade Year Selector) */}
          <div className="pointer-events-auto flex flex-col items-end gap-2 w-full sm:w-auto">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
              TEMPORAL STATIONS // SELECT TO WARP
            </span>

            {/* Quick-jump milestone buttons */}
            <div className="flex flex-wrap items-center justify-end gap-1.5 bg-black/85 border border-white/15 p-1.5 rounded-xs backdrop-blur-md">
              {CHRONO_MILESTONES.map((m) => {
                const isActive = activeMilestone?.gateIndex === m.gateIndex;
                return (
                  <button
                    key={m.gateIndex}
                    onClick={() => jumpToMilestone(m)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider uppercase transition-all rounded-xs cursor-pointer ${
                      isActive
                        ? 'bg-white text-black shadow-lg font-black'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {m.shortYear}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Depth Progress Bar (Crisp White Starlight Gradient) */}
        <div className="relative z-30 w-full h-[2px] bg-white/10 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
