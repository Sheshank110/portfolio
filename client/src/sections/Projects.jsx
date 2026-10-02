import { motion } from 'framer-motion';
import Button from '../components/Button';
import portfolio from '../data/portfolio';

export default function Projects() {
  const otherProjects = portfolio.projects.filter((p) => !p.featured);
  if (otherProjects.length === 0) return null;

  return (
    <section id="projects" className="section-padding border-t border-border bg-bg scroll-mt-20">
      <div className="section-container">
        {/* Growkool 03b SELECTED WORK */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-accent font-bold">03b</span>
            <span className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-text-primary">
              SELECTED BUILDS
            </span>
          </div>
          <span className="font-mono text-xs text-text-muted hidden sm:inline-block">
            02 / 03
          </span>
        </div>

        <div className="relative w-full h-[1px] bg-border my-6">
          <div className="absolute top-[-1px] left-0 w-24 h-[3px] bg-accent" />
        </div>

        <div className="mb-14">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.95] uppercase">
            <span className="text-text-primary">ADDITIONAL </span>
            <span className="text-accent">BUILDS.</span>
          </h2>
        </div>

        <div className="space-y-20 md:space-y-28">
          {otherProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            const projectNumber = String(project.id).padStart(2, '0');

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
              >
                {/* Image Frame with Clean Metadata Header */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {project.team && (
                        <span className="px-2.5 py-1 bg-accent text-white font-mono text-[11px] font-bold uppercase">
                          {project.team}
                        </span>
                      )}
                      {project.duration && (
                        <span className="px-2.5 py-1 bg-[#141414] text-neutral-300 font-mono text-[11px] border border-[#2e2e2e]">
                          {project.duration}
                        </span>
                      )}
                    </div>
                    <span className="text-text-muted text-[11px] uppercase tracking-wider">
                      PRODUCTION BUILD
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] bg-dark border border-border overflow-hidden group shadow-xl">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`lg:col-span-5 space-y-5 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-2xl font-black text-accent">
                      {projectNumber} //
                    </span>
                    <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
                      {project.technologies[0]}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-text-primary">
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="font-mono text-xs text-text-muted uppercase mt-1">
                        {project.subtitle}
                      </p>
                    )}
                  </div>

                  <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                    {project.description}
                  </p>

                  {/* Problem & Solution summary */}
                  {project.problem && (
                    <div className="p-5 bg-bg-surface border border-border text-xs space-y-2">
                      <p className="text-text-secondary leading-relaxed">
                        <strong className="text-text-primary font-heading uppercase block mb-1">Focus &amp; Architecture:</strong>
                        {project.solution || project.problem}
                      </p>
                    </div>
                  )}

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 pt-2 pb-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-mono bg-bg-elevated border border-border text-text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-4">
                    {project.github && (
                      <Button href={project.github} external>
                        GITHUB REPO
                      </Button>
                    )}
                    {project.live && (
                      <Button href={project.live} variant="secondary" external>
                        LIVE DEMO
                      </Button>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
