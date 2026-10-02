import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import portfolio from '../data/portfolio';

// ─── Terminal Logic ───────────────────────────────────────────────
const COMMANDS = {
  help: () => [
    { t: 'sys', v: 'Available commands:' },
    { t: 'cmd', v: '  about      → Who is Sheshank?' },
    { t: 'cmd', v: '  skills     → Tech stack listing' },
    { t: 'cmd', v: '  projects   → Flagship builds' },
    { t: 'cmd', v: '  contact    → Reach out details' },
    { t: 'cmd', v: '  clear      → Clear terminal' },
  ],
  about: () => [
    { t: 'sys', v: 'Loading profile...' },
    { t: 'ok',  v: 'Name   : Sheshank Gahlawat' },
    { t: 'ok',  v: 'Degree : B.Tech CSE @ CGC Landran' },
    { t: 'ok',  v: 'CGPA   : 6.56 (Class of 2028)' },
    { t: 'ok',  v: 'Role   : Full-Stack Developer' },
    { t: 'ok',  v: 'Status : ✓ Open for internships' },
  ],
  skills: () => [
    { t: 'sys', v: 'Tech stack:' },
    { t: 'ok',  v: '  React.js · Node.js · Express' },
    { t: 'ok',  v: '  MongoDB · MySQL · Mongoose' },
    { t: 'ok',  v: '  JavaScript · C++ · C · SQL' },
    { t: 'ok',  v: '  AWS · Git · Tailwind CSS' },
    { t: 'ok',  v: '  DSA · OOP · DBMS · OS' },
  ],
  projects: () => [
    { t: 'sys', v: 'Flagship builds:' },
    { t: 'ok',  v: '  [1] Life Card — QR Emergency Medical App' },
    { t: 'ok',  v: '  [2] FitFlow  — News Aggregation Engine' },
    { t: 'ok',  v: '  [3] AR Heritage — SIH 2024 Platform' },
    { t: 'cmd', v: '  → Scroll to #projects for demos' },
  ],
  contact: () => [
    { t: 'sys', v: 'Contact details:' },
    { t: 'ok',  v: `  Email : ${portfolio.personal.email}` },
    { t: 'ok',  v: `  Phone : ${portfolio.personal.phone}` },
    { t: 'ok',  v: `  GitHub: github.com/Sheshank110` },
    { t: 'cmd', v: '  → Scroll to #contact to send a message' },
  ],
};

function TerminalTab() {
  const [history, setHistory] = useState([
    { t: 'sys', v: 'SHESHANK.DEV terminal v1.0.0' },
    { t: 'sys', v: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const runCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const entry = [{ t: 'prompt', v: `> ${raw}` }];

    if (cmd === 'clear') {
      setHistory([{ t: 'sys', v: 'Terminal cleared. Type "help" to start.' }]);
      setInput('');
      return;
    }

    const handler = COMMANDS[cmd];
    const result = handler
      ? handler()
      : [{ t: 'err', v: `Command not found: "${cmd}". Type "help".` }];

    setHistory((h) => [...h, ...entry, ...result]);
    setCmdHistory((h) => [raw, ...h]);
    setCmdIdx(-1);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      runCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(cmdIdx + 1, cmdHistory.length - 1);
      setCmdIdx(next);
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(cmdIdx - 1, -1);
      setCmdIdx(next);
      setInput(next === -1 ? '' : cmdHistory[next]);
    }
  };

  const lineColor = {
    sys: 'text-neutral-400',
    ok:  'text-emerald-400',
    err: 'text-red-400',
    cmd: 'text-sky-300',
    prompt: 'text-accent font-bold',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#1f1f1f]">
        <span className="font-heading font-black text-xs uppercase text-white tracking-wider">
          INTERACTIVE TERMINAL
        </span>
        <span className="font-mono text-[10px] text-emerald-400 font-bold">READY</span>
      </div>

      {/* Output Area */}
      <div
        className="bg-[#080808] border border-[#1a1a1a] p-3 h-[200px] overflow-y-auto font-mono text-[11px] leading-[1.7] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, i) => (
          <div key={i} className={lineColor[line.t] ?? 'text-neutral-300'}>
            {line.v}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#1f1f1f] px-3 py-2">
        <span className="font-mono text-[11px] text-accent font-bold select-none">{'>'}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          placeholder="type a command..."
          className="flex-1 bg-transparent font-mono text-[11px] text-white placeholder:text-neutral-600 outline-none"
        />
        <span className="terminal-cursor" />
      </div>
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────
export default function HeroCreativeWidget() {
  const [activeTab, setActiveTab] = useState('code');
  const [time, setTime] = useState('');
  const [copied, setCopied] = useState(false);
  const [pingStatus, setPingStatus] = useState(null);
  const [isPinging, setIsPinging] = useState(false);

  // Live Digital Clock (IST UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
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

  // Ping Server Simulation
  const handlePing = () => {
    if (isPinging) return;
    setIsPinging(true);
    setPingStatus('CONNECTING TO CLUSTER...');
    setTimeout(() => {
      setPingStatus('STATUS: 200 OK • LATENCY: 18ms • LOAD: 0.12');
      setIsPinging(false);
    }, 600);
  };

  // Copy Profile JSON
  const handleCopy = () => {
    const profileData = {
      engineer: portfolio.personal.name,
      role: 'Full-Stack Developer & Systems Builder',
      education: 'B.Tech CSE @ CGC Landran (2024-2028)',
      cgpa: portfolio.personal.cgpa,
      stack: ['JavaScript', 'React.js', 'Node.js', 'Express', 'MongoDB', 'C++'],
      flagshipProject: 'Life Card (MERN + QR Engine)',
      achievements: ['SIH 2024 Finalist', 'AWS Certified', 'ICCS Best Poster'],
      email: portfolio.personal.email,
      phone: portfolio.personal.phone,
    };
    navigator.clipboard?.writeText(JSON.stringify(profileData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS = [
    { id: 'code',     label: 'CONSOLE',  num: '01' },
    { id: 'qr',       label: 'QR',       num: '02' },
    { id: 'metrics',  label: 'METRICS',  num: '03' },
    { id: 'terminal', label: 'TERMINAL', num: '04' },
  ];

  return (
    <div className="relative w-full max-w-[460px] bg-[#0c0c0c] border-2 border-[#1f1f1f] text-white shadow-2xl overflow-hidden font-sans select-none">
      {/* Blueprint Corner Crosshairs */}
      <span className="absolute top-1 left-1.5 font-mono text-[10px] text-neutral-600 z-20 pointer-events-none">+</span>
      <span className="absolute top-1 right-1.5 font-mono text-[10px] text-neutral-600 z-20 pointer-events-none">+</span>
      <span className="absolute bottom-1 left-1.5 font-mono text-[10px] text-neutral-600 z-20 pointer-events-none">+</span>
      <span className="absolute bottom-1 right-1.5 font-mono text-[10px] text-neutral-600 z-20 pointer-events-none">+</span>

      {/* Top HUD Status Bar */}
      <div className="px-4 py-3 bg-[#141414] border-b border-[#222] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] font-bold tracking-widest text-neutral-200 uppercase">
            SYS.CORE // SHESHANK.DEV
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent font-semibold tracking-wider">
            {time || '18:30:00 IST'}
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] bg-[#222] text-neutral-400 px-1.5 py-0.5 border border-[#333]">
            LIVE
          </span>
        </div>
      </div>

      {/* Navigation Tabs — now 4 columns */}
      <div className="grid grid-cols-4 border-b border-[#222] bg-[#0f0f0f]">
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 px-1 text-center font-heading font-black text-[10px] tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              i < TABS.length - 1 ? 'border-r border-[#222]' : ''
            } ${
              activeTab === tab.id
                ? 'bg-accent text-white'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <span className="hidden sm:inline">{tab.num}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Screen Content */}
      <div className="p-5 min-h-[320px] flex flex-col justify-between bg-[#0c0c0c]">
        <AnimatePresence mode="wait">
          {/* TAB 01: Code Matrix / Live Interactive Console */}
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#1f1f1f]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
                  <span className="w-2 h-2 rounded-full bg-yellow-500/80"></span>
                  <span className="w-2 h-2 rounded-full bg-green-500/80"></span>
                  <span className="font-mono text-[11px] text-neutral-400 ml-1">
                    sheshank.config.ts
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="font-mono text-[10px] text-neutral-300 hover:text-white bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] px-2 py-0.5 transition-colors cursor-pointer"
                >
                  {copied ? '✓ COPIED' : 'COPY JSON'}
                </button>
              </div>

              {/* Code Snippet with Line Numbers */}
              <div className="font-mono text-[11px] sm:text-[12px] leading-relaxed text-neutral-300 overflow-x-auto py-1 flex gap-3">
                <div className="text-neutral-600 select-none text-right flex flex-col pr-1 border-r border-[#222]">
                  <span>01</span><span>02</span><span>03</span><span>04</span>
                  <span>05</span><span>06</span><span>07</span><span>08</span>
                </div>
                <div className="flex-1">
                  <div>
                    <span className="text-accent font-bold">const</span>{' '}
                    <span className="text-yellow-300">engineer</span> = &#123;
                  </div>
                  <div className="pl-3">
                    <span className="text-neutral-400">name:</span>{' '}
                    <span className="text-emerald-400">"Sheshank Gahlawat"</span>,
                  </div>
                  <div className="pl-3">
                    <span className="text-neutral-400">education:</span>{' '}
                    <span className="text-emerald-400">"B.Tech CSE @ CGC"</span>,
                  </div>
                  <div className="pl-3">
                    <span className="text-neutral-400">cgpa:</span>{' '}
                    <span className="text-amber-400">6.56</span>,
                  </div>
                  <div className="pl-3">
                    <span className="text-neutral-400">stack:</span> [
                    <span className="text-sky-300">"React"</span>,{' '}
                    <span className="text-sky-300">"Node"</span>,{' '}
                    <span className="text-sky-300">"Express"</span>,{' '}
                    <span className="text-sky-300">"MongoDB"</span>],
                  </div>
                  <div className="pl-3">
                    <span className="text-neutral-400">flagship:</span>{' '}
                    <span className="text-emerald-400">"Life Card (QR Engine)"</span>,
                  </div>
                  <div className="pl-3">
                    <span className="text-neutral-400">status:</span>{' '}
                    <span className="text-emerald-300 font-bold">"Open For Work ↗"</span>
                  </div>
                  <div>&#125;;</div>
                </div>
              </div>

              {/* Terminal Execution Feedback */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500">TERMINAL OUTPUT:</span>
                  <button
                    onClick={handlePing}
                    disabled={isPinging}
                    className="text-accent hover:underline font-bold cursor-pointer"
                  >
                    {isPinging ? 'TESTING...' : '[ RUN PING ]'}
                  </button>
                </div>
                <div className="mt-1.5 p-2 bg-[#141414] border border-[#222] font-mono text-[11px] text-emerald-400 truncate">
                  {pingStatus || '> cluster ready. 0 errors. ready for deployment.'}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 02: Interactive Life Card QR Engine */}
          {activeTab === 'qr' && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#1f1f1f]">
                <div>
                  <span className="font-heading font-black text-xs uppercase text-white tracking-wider block">
                    LIFE CARD &bull; QR ENGINE
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400">
                    Flagship Architecture Demonstration
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-accent/20 text-accent border border-accent/40 px-2 py-0.5">
                  AES-256
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
                {/* QR Scanner Display with Animated Laser Beam */}
                <div className="relative shrink-0 w-32 h-32 bg-white p-2 border-2 border-white shadow-[0_0_25px_rgba(225,29,39,0.3)]">
                  <svg viewBox="0 0 100 100" className="w-full h-full" shapeRendering="crispEdges">
                    <rect x="0" y="0" width="30" height="30" fill="#0c0c0c" />
                    <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                    <rect x="10" y="10" width="10" height="10" fill="#e11d27" />
                    <rect x="70" y="0" width="30" height="30" fill="#0c0c0c" />
                    <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                    <rect x="80" y="10" width="10" height="10" fill="#e11d27" />
                    <rect x="0" y="70" width="30" height="30" fill="#0c0c0c" />
                    <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                    <rect x="10" y="80" width="10" height="10" fill="#e11d27" />
                    <rect x="35" y="5" width="8" height="8" fill="#0c0c0c" />
                    <rect x="48" y="5" width="8" height="8" fill="#0c0c0c" />
                    <rect x="35" y="18" width="15" height="6" fill="#0c0c0c" />
                    <rect x="55" y="18" width="8" height="12" fill="#0c0c0c" />
                    <rect x="5" y="35" width="12" height="8" fill="#0c0c0c" />
                    <rect x="22" y="35" width="18" height="8" fill="#0c0c0c" />
                    <rect x="45" y="35" width="10" height="15" fill="#0c0c0c" />
                    <rect x="60" y="35" width="15" height="8" fill="#0c0c0c" />
                    <rect x="80" y="35" width="15" height="10" fill="#0c0c0c" />
                    <rect x="10" y="48" width="15" height="15" fill="#0c0c0c" />
                    <rect x="30" y="48" width="10" height="10" fill="#0c0c0c" />
                    <rect x="65" y="48" width="25" height="8" fill="#0c0c0c" />
                    <rect x="35" y="65" width="15" height="15" fill="#0c0c0c" />
                    <rect x="55" y="65" width="10" height="20" fill="#0c0c0c" />
                    <rect x="70" y="60" width="12" height="12" fill="#0c0c0c" />
                    <rect x="85" y="75" width="10" height="15" fill="#0c0c0c" />
                    <rect x="35" y="85" width="15" height="10" fill="#0c0c0c" />
                  </svg>
                  {/* Animated Laser Beam */}
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_#e11d27]"
                    animate={{ top: ['5%', '92%', '5%'] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>

                <div className="space-y-2 flex-1 text-left">
                  <div>
                    <span className="font-heading font-black text-xs uppercase tracking-wider text-white block">
                      DYNAMIC QR PROFILE
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400 block mt-1">
                      Direct scan bridge connecting real-world credentials to online MERN services.
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-neutral-400">
                    <span className="px-1.5 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a] text-accent font-bold">
                      &bull; REAL-TIME SYNC
                    </span>
                    <span className="px-1.5 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a]">
                      JWT AUTH
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="#contact"
                  className="py-2 px-3 bg-accent text-white font-heading font-black text-[11px] uppercase tracking-wider text-center hover:bg-white hover:text-black transition-colors"
                >
                  GET IN TOUCH ↗
                </a>
                <a
                  href="#featured-project"
                  className="py-2 px-3 bg-[#1a1a1a] text-neutral-200 border border-[#333] font-heading font-black text-[11px] uppercase tracking-wider text-center hover:border-accent hover:text-white transition-colors"
                >
                  VIEW SPECS ↗
                </a>
              </div>
            </motion.div>
          )}

          {/* TAB 03: Telemetry & Engineering Metrics */}
          {activeTab === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#1f1f1f]">
                <span className="font-heading font-black text-xs uppercase tracking-wider text-white">
                  ENGINEERING RADAR
                </span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">
                  OPTIMAL (99.8%)
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: 'REACT.JS & FRONTEND', val: 92 },
                  { label: 'NODE.JS & RESTful APIS', val: 90 },
                  { label: 'DATA STRUCTURES (C++)', val: 86 },
                  { label: 'MONGODB & DB DESIGN', val: 84 },
                ].map((item, i) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-neutral-300">{item.label}</span>
                      <span className="text-accent font-bold">{item.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#222]">
                      <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1f1f1f] text-[10px] font-mono text-center">
                {[
                  { label: 'HACKATHON', val: "SIH '24" },
                  { label: 'CERTIFIED', val: 'AWS CLOUD' },
                  { label: 'ACADEMICS', val: '6.56 CGPA', accent: true },
                ].map((s) => (
                  <div key={s.label} className="p-1.5 bg-[#141414] border border-[#222]">
                    <span className="text-neutral-500 block">{s.label}</span>
                    <span className={`font-bold ${s.accent ? 'text-accent' : 'text-neutral-200'}`}>
                      {s.val}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 04: Interactive Terminal */}
          {activeTab === 'terminal' && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TerminalTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Identity & Hardware Barcode Strip */}
      <div className="px-4 py-2.5 bg-[#141414] border-t border-[#222] flex items-center justify-between text-[10px] font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-accent inline-block"></span>
          <span className="tracking-wider uppercase text-neutral-300">
            CGC // CSE-2028 // IN
          </span>
        </div>
        <span className="tracking-widest text-neutral-500">
          ID: #81681-70778
        </span>
      </div>
    </div>
  );
}
