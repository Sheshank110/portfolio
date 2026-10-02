import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import portfolio from '../data/portfolio';

// ─── 3D Flip Card for Awards ─────────────────────────────────────
function AwardFlipCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="flip-card h-[260px]"
    >
      <div className="flip-card-inner">
        {/* FRONT */}
        <div className="flip-card-front p-6 md:p-8 bg-bg-surface border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="font-mono text-sm font-bold px-2.5 py-1 bg-accent text-white">
                {item.badge}
              </span>
              <span className="font-mono text-xs text-text-muted">{item.date}</span>
            </div>
            <h3 className="font-heading font-black text-lg uppercase tracking-tight text-text-primary mb-1">
              {item.title}
            </h3>
            <p className="text-xs font-heading font-bold text-text-secondary uppercase">
              {item.organization}
            </p>
          </div>
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-muted">HOVER TO READ →</span>
            <span className="font-mono text-sm font-bold text-accent">↗</span>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-card-back p-6 md:p-8 bg-dark border border-border flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs text-accent font-bold tracking-wider block mb-3">
              {item.type.toUpperCase()} // {item.date}
            </span>
            <h3 className="font-heading font-black text-base uppercase tracking-tight text-white mb-3">
              {item.title}
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="pt-4 border-t border-[#2a2a2a]">
            <span className="font-mono text-[11px] text-neutral-400">{item.organization}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shimmer Cert Card ───────────────────────────────────────────
function CertCard({ cert, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="shimmer-hover p-6 md:p-8 bg-bg-surface border border-border flex flex-col justify-between hover:border-text-primary transition-all group relative overflow-hidden"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-3xl">{cert.icon}</span>
          <div className="flex items-center gap-1.5">
            {/* Verified pulse badge */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="font-mono text-[10px] uppercase text-success font-bold">Verified</span>
          </div>
        </div>

        <h3 className="font-heading font-black text-lg uppercase tracking-tight text-text-primary mb-1">
          {cert.title}
        </h3>
        <p className="text-xs font-mono text-accent font-bold mt-1">{cert.issuer}</p>
      </div>

      <div className="pt-5 mt-4 border-t border-border flex items-center justify-between text-xs font-mono">
        <span className="px-2.5 py-1 bg-bg-elevated border border-border text-text-secondary font-bold uppercase text-[10px]">
          {cert.type}
        </span>
        <span className="text-text-muted group-hover:text-accent transition-colors">Active ✓</span>
      </div>
    </motion.div>
  );
}

export default function Achievements() {
  const { achievements, certifications } = portfolio;
  const [activeTab, setActiveTab] = useState('awards');

  return (
    <section id="achievements" className="section-padding border-t border-border bg-bg scroll-mt-20">
      <div className="section-container">
        {/* Growkool 05 RECOGNITION Header */}
        <SectionHeading
          number="05"
          label="HONORS &amp; CREDENTIALS"
          title="RESEARCH EXHIBITS &amp; VERIFIED BADGES"
          description="National conference presentation prizes, innovation symposium honors, and certified industry competencies."
        />

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-4 my-10 md:my-14">
          <button
            onClick={() => setActiveTab('awards')}
            className={`tab-btn ${activeTab === 'awards' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
          >
            RESEARCH AWARDS ({achievements?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`tab-btn ${activeTab === 'certifications' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
          >
            CERTIFICATIONS ({certifications?.length || 0})
          </button>
        </div>

        {/* Awards Tab — 3D Flip Cards */}
        <AnimatePresence mode="wait">
          {activeTab === 'awards' && (
            <motion.div
              key="awards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {achievements.map((item, index) => (
                <AwardFlipCard key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          )}

          {/* Certifications Tab — Shimmer Cards */}
          {activeTab === 'certifications' && (
            <motion.div
              key="certifications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {certifications?.map((cert, index) => (
                <CertCard key={cert.id} cert={cert} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
