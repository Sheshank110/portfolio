import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import portfolio from '../data/portfolio';

export default function GitHub() {
  const { github } = portfolio;
  if (!github.featuredRepos || github.featuredRepos.length === 0) return null;

  return (
    <section id="github" className="section-padding border-t border-border bg-bg scroll-mt-20">
      <div className="section-container">
        {/* Growkool 05b OPEN SOURCE Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm tracking-wider text-accent font-bold">
              05b
            </span>
            <span className="font-heading font-bold text-xs tracking-[0.2em] uppercase text-text-secondary">
              OPEN SOURCE &amp; CODEBASES
            </span>
          </div>
          <a
            href={github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-heading font-bold tracking-wider uppercase text-accent hover:underline flex items-center gap-1"
          >
            <span>FOLLOW @{github.username}</span>
            <span className="text-xs font-mono font-bold">↗</span>
          </a>
        </div>

        <div className="relative w-full h-[1px] bg-border my-6">
          <div className="absolute top-[-1px] left-0 w-24 h-[3px] bg-accent" />
        </div>

        <div className="mb-14">
          <h2 className="font-heading text-4xl sm:text-5xl font-black tracking-tight leading-[0.95] uppercase">
            <span className="text-text-primary">PUBLIC </span>
            <span className="text-accent">REPOSITORIES.</span>
          </h2>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-8 md:gap-14 mb-12 p-7 bg-bg-surface border border-border"
        >
          {Object.entries(github.stats).map(([label, value]) => (
            <div key={label} className="min-w-[100px]">
              <p className="font-heading text-2xl md:text-3xl font-black text-text-primary">
                {value}
              </p>
              <p className="text-text-muted text-xs uppercase mt-1 font-mono tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Featured Repos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {github.featuredRepos.map((repo, index) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="block p-6 md:p-8 bg-bg-surface border border-border hover:border-text-primary transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-heading font-black text-lg text-text-primary group-hover:text-accent transition-colors">
                  {repo.name}
                </h4>
                <span className="font-mono text-sm font-bold text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  ↗
                </span>
              </div>
              <p className="text-text-secondary text-xs md:text-sm mb-4 leading-relaxed line-clamp-2">
                {repo.description}
              </p>
              <div className="flex items-center gap-4 text-text-muted text-xs font-mono">
                {repo.language && (
                  <span className="flex items-center gap-1.5 font-bold text-text-primary">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {repo.language}
                  </span>
                )}
                {repo.stars > 0 && (
                  <span>★ {repo.stars}</span>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
