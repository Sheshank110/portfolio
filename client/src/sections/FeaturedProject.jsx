import { motion } from 'framer-motion';
import Button from '../components/Button';
import portfolio from '../data/portfolio';

export default function FeaturedProject() {
  const featured = portfolio.projects.find((p) => p.featured);
  if (!featured) return null;

  return (
    <section id="featured-project" className="section-padding border-t border-border bg-bg scroll-mt-20">
      <div className="section-container">
        {/* Growkool 03 SELECTED WORK */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-accent font-bold">03</span>
            <span className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-text-primary">
              FEATURED ARCHITECTURE
            </span>
          </div>
          <span className="font-mono text-xs text-text-muted hidden sm:inline-block">
            01 / 03
          </span>
        </div>

        <div className="relative w-full h-[1px] bg-border my-6">
          <div className="absolute top-[-1px] left-0 w-24 h-[3px] bg-accent" />
        </div>

        <div className="mb-12">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.95] uppercase">
            <span className="text-text-primary">SELECTED </span>
            <span className="text-accent">FLAGSHIP.</span>
          </h2>
        </div>

        {/* Featured Project Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image Frame with Clean Metadata Header */}
          <div className="lg:col-span-7">
            {/* Dedicated Top Metadata Strip - No image occlusion */}
            <div className="flex items-center justify-between mb-3.5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-accent text-white font-mono text-[11px] font-bold uppercase">
                  {featured.team}
                </span>
                <span className="px-2.5 py-1 bg-[#141414] text-neutral-300 font-mono text-[11px] border border-[#2e2e2e]">
                  {featured.duration}
                </span>
              </div>
              <span className="text-text-muted text-[11px] hidden sm:inline-block uppercase tracking-wider">
                MERN + QR ENGINE
              </span>
            </div>

            <div className="relative aspect-[16/10] bg-dark border border-border overflow-hidden group shadow-2xl">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1.5">
              <span className="font-mono text-xs text-accent font-bold uppercase">
                01 // MERN STACK &amp; QR ENGINE
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-text-primary">
                {featured.title}
              </h3>
              {featured.subtitle && (
                <p className="font-mono text-xs text-text-muted uppercase">
                  {featured.subtitle}
                </p>
              )}
            </div>

            <p className="text-text-secondary text-base leading-relaxed">
              {featured.description}
            </p>

            {/* Growkool Problem/Solution Box */}
            <div className="p-6 bg-bg-surface border border-border space-y-4 text-xs">
              <div>
                <span className="font-heading font-bold text-accent uppercase tracking-wider block mb-1.5">
                  THE CHALLENGE:
                </span>
                <p className="text-text-secondary leading-relaxed">{featured.problem}</p>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="font-heading font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                  ENGINEERING SOLUTION:
                </span>
                <p className="text-text-secondary leading-relaxed">{featured.solution}</p>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 pt-2 pb-2">
              {featured.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-mono bg-bg-elevated border border-border text-text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              {featured.github && (
                <Button href={featured.github} external>
                  VIEW REPOSITORY
                </Button>
              )}
              {featured.live && (
                <Button href={featured.live} variant="secondary" external>
                  LIVE DEMO
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
