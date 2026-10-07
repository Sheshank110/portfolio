import { motion } from 'framer-motion';
import DeformedOrbDossier from '../components/DeformedOrbDossier';

export default function Dossier() {
  return (
    <section id="dossier" className="section-padding border-t border-border bg-[#050507] text-white scroll-mt-16 overflow-hidden">
      <div className="section-container">


        {/* ─── 3D DEFORMED PARTICLE ORB CENTERPIECE ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-6 sm:mt-8 w-full"
        >
          <DeformedOrbDossier />
        </motion.div>

        {/* Descent prompt into Event Horizon */}
        <div className="mt-10 flex flex-col items-center text-center gap-2 font-mono text-[10px] text-white/50 tracking-[0.25em] uppercase">
          <div className="flex items-center gap-3">
            <span className="w-12 h-px bg-cyan-400/40" />
            <span className="text-cyan-400 font-bold">CROSSING EVENT HORIZON // 1.00 Rs</span>
            <span className="w-12 h-px bg-cyan-400/40" />
          </div>
          <span className="text-white/40 text-[9px] tracking-widest">
            SCROLL DOWN TO DIVE INTO EINSTEIN-ROSEN CHRONO-TRANSIT
          </span>
          <span className="text-cyan-400 animate-bounce mt-1 text-xs">▼</span>
        </div>
      </div>
    </section>
  );
}
