import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import DeformedOrbDossier from '../components/DeformedOrbDossier';

export default function Dossier() {
  return (
    <section id="dossier" className="section-padding border-t border-border bg-[#050507] text-white scroll-mt-16 overflow-hidden">
      <div className="section-container">
        {/* Section Heading 03 */}
        <SectionHeading
          number="03"
          label="ASTROPHYSICAL SIMULATION // GENERAL RELATIVITY"
          title="RELATIVISTIC BLACK HOLE ACCRETION MATRIX"
          description="A 500,000-particle Schwarzschild black hole simulation with per-particle gravitational lensing (Luminet 1979), Novikov-Thorne thermal spectrum, Doppler beaming, and orbiting relativistic light streaks. Drag to rotate in 3D."
        />

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
      </div>
    </section>
  );
}
