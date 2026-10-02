import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import portfolio from '../data/portfolio';

const PHILOSOPHY_PILLARS = [
  {
    num: '01',
    title: 'PROBLEM FIRST',
    desc: 'Every strong system starts by diagnosing the core constraint before writing a single line of code.',
  },
  {
    num: '02',
    title: 'ARCHITECT WITH PURPOSE',
    desc: 'Clean modularity, robust state management, and reliable RESTful API communication across the stack.',
  },
  {
    num: '03',
    title: 'DEPLOY FOR SCALE',
    desc: 'Low latency, asynchronous data fetching, and cloud-ready architectures that perform under production pressure.',
  },
];

const TECH_SPOTLIGHTS = [
  { name: 'React.js', role: 'UI Architecture', note: 'Component systems, declarative UX & virtual DOM reconciliation.' },
  { name: 'Node.js', role: 'Runtime & APIs', note: 'Event-driven, asynchronous high-throughput backend services.' },
  { name: 'MongoDB', role: 'Data Layer', note: 'Flexible schema modeling & aggregation pipelines.' },
  { name: 'C++ / DSA', role: 'Core Logic', note: 'Algorithmic efficiency, time complexity & memory constraints.' },
  { name: 'AWS Cloud', role: 'Infrastructure', note: 'Cloud compute foundations, S3 storage & modern deployments.' },
];

const VIBES = [
  { name: 'Lo-Fi Study Flow', bpm: '76 BPM', tempo: [0.7, 1.1, 0.6, 0.9, 0.8, 0.65] },
  { name: 'Synthwave Velocity', bpm: '118 BPM', tempo: [0.4, 0.7, 0.35, 0.6, 0.5, 0.45] },
  { name: 'Deep Focus Ambient', bpm: '60 BPM', tempo: [0.9, 1.3, 0.8, 1.1, 1.0, 0.85] },
];

export default function About() {
  const { about, personal } = portfolio;

  // Live Digital Clock (IST UTC+5:30)
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Tech Spotlight State
  const [activeTechIdx, setActiveTechIdx] = useState(0);

  // Vibe Audio Player State
  const [vibeIdx, setVibeIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextVibe = () => {
    setVibeIdx((prev) => (prev + 1) % VIBES.length);
  };

  return (
    <section id="about" className="section-padding border-t border-border bg-bg scroll-mt-20">
      <div className="section-container">
        {/* Growkool 01 THE POINT OF VIEW */}
        <SectionHeading
          number="01"
          label="THE POINT OF VIEW"
          title="WE DON'T JUST WRITE CODE. WE TURN IDEAS INTO RELIABLE SYSTEMS."
          description="A Computer Science undergraduate with a disciplined focus on Data Structures & Algorithms, Object-Oriented Programming, and full-stack software development."
        />

        {/* Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 md:mb-24 items-start">
          {/* Reduced, High-Impact Left Side */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xl md:text-2xl font-heading font-medium text-text-primary leading-snug">
              Bridging algorithmic logic and modern web architecture to engineer systems that simply perform.
            </p>

            <p className="text-text-secondary text-base leading-relaxed">
              Computer Science undergraduate at CGC Landran focused on building high-reliability web applications using React, Node.js, and cloud platforms. From emergency response systems like <span className="text-text-primary font-semibold">Life Card</span> to hackathon-winning architectures, I prioritize clean modularity, low latency, and intuitive design.
            </p>

            {/* Quick Status Tags */}
            <div className="pt-2 flex flex-wrap gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 bg-bg-surface border border-border text-text-secondary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open to Internships &amp; Roles
              </span>
              <span className="px-3 py-1.5 bg-bg-surface border border-border text-text-secondary">
                📍 Chandigarh / Hisar, IN
              </span>
              <span className="px-3 py-1.5 bg-bg-surface border border-border text-text-secondary">
                ⚡ MERN + Cloud Architecture
              </span>
            </div>

            <div className="pt-1">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase text-text-primary hover:text-accent transition-colors group"
              >
                <span>Initiate connection</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* Creative 4-Card Bento Matrix */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* 01: Live Telemetry Card */}
            <div className="p-6 bg-bg-surface border border-border flex flex-col justify-between hover:border-text-primary transition-colors min-h-[220px]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs text-accent font-bold">01 // TELEMETRY</span>
                  <span className="px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                </div>
                <p className="font-mono font-black text-2xl md:text-3xl text-text-primary tracking-tight">
                  {currentTime || '12:00:00 IST'}
                </p>
                <p className="text-xs font-mono text-text-muted mt-1.5">
                  29.15° N, 75.72° E • IST (UTC+5:30)
                </p>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">SYSTEM STATUS</span>
                <span className="font-bold text-text-primary">ACTIVE // DEPLOYED</span>
              </div>
            </div>

            {/* 02: Interactive Tech Matrix */}
            <div className="p-6 bg-bg-surface border border-border flex flex-col justify-between hover:border-text-primary transition-colors min-h-[220px]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs text-accent font-bold">02 // ARSENAL</span>
                  <span className="font-mono text-[10px] text-text-muted uppercase">CLICK TO PROBE</span>
                </div>
                <div className="flex flex-wrap gap-1.5 my-2.5">
                  {TECH_SPOTLIGHTS.map((tech, idx) => (
                    <button
                      key={tech.name}
                      onClick={() => setActiveTechIdx(idx)}
                      className={`px-2 py-0.5 text-xs font-mono transition-all cursor-pointer ${
                        activeTechIdx === idx
                          ? 'bg-text-primary text-white font-bold shadow-xs'
                          : 'bg-bg border border-border text-text-secondary hover:border-text-primary'
                      }`}
                    >
                      {tech.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-text-secondary leading-snug">
                  <span className="font-bold text-text-primary font-mono">{TECH_SPOTLIGHTS[activeTechIdx].role}: </span>
                  {TECH_SPOTLIGHTS[activeTechIdx].note}
                </p>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">STACK FOCUS</span>
                <span className="font-bold text-accent">FULL-STACK MERN</span>
              </div>
            </div>

            {/* 03: Core Protocol (High-Contrast Editorial Dark Card) */}
            <div className="p-6 bg-dark border border-border-dark flex flex-col justify-between hover:border-accent transition-colors min-h-[220px] relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs text-accent font-bold">03 // THE PROTOCOL</span>
                  <span className="font-mono text-[10px] text-neutral-400">ENGINEERING</span>
                </div>
                <p className="font-heading font-black text-lg md:text-xl text-white uppercase tracking-tight leading-snug">
                  &ldquo;Make it work. Make it right. Make it scale.&rdquo;
                </p>
                <p className="text-xs text-neutral-400 mt-2 font-mono">
                  Clean modularity over clever shortcuts.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-300">
                <span>ZERO BLOAT</span>
                <span>•</span>
                <span>LOW LATENCY</span>
                <span>•</span>
                <span>RESILIENT</span>
              </div>
            </div>

            {/* 04: Flow State & Audio Equalizer */}
            <div className="p-6 bg-bg-surface border border-border flex flex-col justify-between hover:border-text-primary transition-colors min-h-[220px]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs text-accent font-bold">04 // FLOW STATE</span>
                  <button
                    onClick={nextVibe}
                    title="Click to switch soundtrack vibe"
                    className="font-mono text-[10px] font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    SWITCH ⟳
                  </button>
                </div>
                <div className="flex items-center gap-3.5 my-2">
                  <div className="flex items-end gap-1 h-8 px-2 py-1 bg-bg border border-border">
                    {[45, 90, 60, 100, 55, 75].map((h, i) => (
                      <motion.span
                        key={i}
                        animate={isPlaying ? { height: ['25%', `${h}%`, '30%'] } : { height: '25%' }}
                        transition={{
                          repeat: Infinity,
                          repeatType: 'reverse',
                          duration: VIBES[vibeIdx].tempo[i % VIBES[vibeIdx].tempo.length],
                          ease: 'easeInOut',
                        }}
                        className="w-1 bg-accent rounded-xs"
                      />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-black text-sm text-text-primary uppercase tracking-tight truncate">
                      {VIBES[vibeIdx].name}
                    </p>
                    <p className="font-mono text-[11px] text-text-muted mt-0.5">
                      {VIBES[vibeIdx].bpm} • Dev Rhythm
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">FOCUS FREQUENCY</span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="font-bold text-text-primary hover:text-accent transition-colors cursor-pointer"
                >
                  {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Growkool 3-Column Philosophy Cards */}
        <div className="mb-20 md:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-accent font-bold tracking-wider">ENGINEERING METHODOLOGY</span>
            <div className="h-px bg-border grow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {PHILOSOPHY_PILLARS.map((pillar) => (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4 }}
                className="p-7 md:p-8 bg-bg-surface border border-border relative flex flex-col justify-between group hover:border-text-primary transition-colors min-h-[240px]"
              >
                <div>
                  <span className="font-mono text-sm text-accent font-bold block mb-4">
                    {pillar.num}
                  </span>
                  <h3 className="font-heading font-black text-xl tracking-tight uppercase text-text-primary mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-6 flex justify-end">
                  <span className="text-base font-mono font-bold text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    ↗
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Academic Milestones */}
        <div className="pt-10 border-t border-border">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-accent font-bold tracking-wider">ACADEMIC MILESTONES</span>
            <div className="h-px bg-border grow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {about.education?.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-7 bg-bg-surface border border-border space-y-2 hover:border-text-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-accent font-bold bg-accent/10 px-2 py-0.5 border border-accent/20">
                    {item.score}
                  </span>
                  <span className="font-mono text-xs text-text-muted">
                    {item.period}
                  </span>
                </div>
                <h4 className="font-heading font-black text-base uppercase text-text-primary pt-1">
                  {item.degree}
                </h4>
                <p className="text-xs text-text-secondary">
                  {item.institution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
