import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import DeformedOrbDossier from '../components/DeformedOrbDossier';

export default function Dossier() {
  return (
    <section id="dossier" className="section-padding border-t border-border bg-[#050507] text-white  overflow-hidden">
      <div className="section-container">
        {/* Section Heading 03 — Developer Matrix & Core Architecture */}
        <SectionHeading
          number="03"
          label="PRODUCTION ARCHITECTURE // TECHNICAL MATRIX"
          title="FLAGSHIP SYSTEMS & ENGINEERING CORE"
          description="Scalable full-stack MERN architectures, distributed backend APIs, and interactive 3D digital products engineered with production rigor. Explore the singularity nexus below to inspect active technical systems."
          theme="dark"
        />

        {/* Technical Capabilities & Verified Accreditations Strip */}
        <div className="-mt-8 sm:-mt-12 mb-8 sm:mb-10 flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-[9.5px] text-neutral-300">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold">4 PRODUCTION BUILDS</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-white font-bold">SMART INDIA HACKATHON LAUREATE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-white font-bold">500+ ALGORITHMIC PROBLEMS (C++/DSA)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-white font-bold">AWS CLOUD CERTIFIED</span>
          </div>
        </div>

        {/* ─── 3D DEFORMED PARTICLE ORB CENTERPIECE ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <DeformedOrbDossier />
        </motion.div>

        {/* Descent prompt into Career Journey */}
        <div className="mt-10 flex flex-col items-center text-center gap-2 font-mono text-[10px] text-white/50 tracking-[0.25em] uppercase">
          <div className="flex items-center gap-3">
            <span className="w-12 h-px bg-white/20" />
            <span className="text-white/80 font-bold">PROCEED TO CAREER JOURNEY</span>
            <span className="w-12 h-px bg-white/20" />
          </div>
          <span className="text-white/40 text-[9px] tracking-widest">
            SCROLL DOWN TO EXPLORE CHRONOLOGICAL TIMELINE & MILESTONES
          </span>
          <span className="text-accent animate-bounce mt-1 text-xs">▼</span>
        </div>
      </div>
    </section>
  );
}
