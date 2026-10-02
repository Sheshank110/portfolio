import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import portfolio from '../data/portfolio';

const TYPE_STYLES = {
  education: { bg: 'bg-accent', text: 'text-white' },
  milestone:  { bg: 'bg-dark',  text: 'text-white' },
  project:    { bg: 'bg-bg-elevated', text: 'text-text-primary' },
};

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;
  const style = TYPE_STYLES[item.type] || TYPE_STYLES.milestone;

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_40px_1fr] items-start gap-0">
      {/* Left Content */}
      <div className={`${isLeft ? 'pr-8 text-right' : ''}`}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 bg-bg-surface border border-border hover:border-text-primary hover:shadow-lg transition-all group inline-block w-full"
          >
            <span className={`font-mono text-xs font-bold px-2 py-0.5 ${style.bg} ${style.text} inline-block mb-3`}>
              {item.type.toUpperCase()}
            </span>
            <h3 className="font-heading font-black text-base sm:text-lg uppercase tracking-tight text-text-primary mb-1">
              {item.title}
            </h3>
            <p className="text-xs font-heading font-bold text-accent uppercase tracking-wider mb-2">
              {item.organization}
            </p>
            {item.description && (
              <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
            )}
          </motion.div>
        )}
      </div>

      {/* Center — dot + vertical line */}
      <div className="flex flex-col items-center">
        {/* Date label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="font-mono text-[10px] text-accent font-bold tracking-wider mb-2 whitespace-nowrap"
        >
          {item.date}
        </motion.span>

        {/* Dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
          className="relative z-10 w-4 h-4 rounded-full border-2 border-accent bg-bg flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-accent"
          />
        </motion.div>
      </div>

      {/* Right Content */}
      <div className={`${!isLeft ? 'pl-8' : ''}`}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 bg-bg-surface border border-border hover:border-text-primary hover:shadow-lg transition-all group inline-block w-full"
          >
            <span className={`font-mono text-xs font-bold px-2 py-0.5 ${style.bg} ${style.text} inline-block mb-3`}>
              {item.type.toUpperCase()}
            </span>
            <h3 className="font-heading font-black text-base sm:text-lg uppercase tracking-tight text-text-primary mb-1">
              {item.title}
            </h3>
            <p className="text-xs font-heading font-bold text-accent uppercase tracking-wider mb-2">
              {item.organization}
            </p>
            {item.description && (
              <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Journey() {
  const { experience } = portfolio;
  if (!experience || experience.length === 0) return null;

  return (
    <section id="journey" className="section-padding border-t border-border bg-bg scroll-mt-20">
      <div className="section-container">
        {/* Growkool 04 TRAJECTORY Header */}
        <SectionHeading
          number="04"
          label="TRAJECTORY"
          title="ENGINEERING PATH &amp; MILESTONES"
          description="Academic trajectory, competitive presentation accolades, and production software training."
        />

        {/* Desktop: Alternating left-right timeline */}
        <div className="hidden md:block mt-14 md:mt-18 relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-10">
            {experience.map((item, index) => (
              <TimelineItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Mobile: Simple vertical stack */}
        <div className="md:hidden mt-12 relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {experience.map((item, index) => {
              const style = TYPE_STYLES[item.type] || TYPE_STYLES.milestone;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative"
                >
                  {/* Dot */}
                  <div className="absolute -left-[29px] top-5 w-4 h-4 rounded-full border-2 border-accent bg-bg flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>

                  <div className="p-5 bg-bg-surface border border-border hover:border-text-primary transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 ${style.bg} ${style.text}`}>
                        {item.type.toUpperCase()}
                      </span>
                      <span className="font-mono text-[10px] text-accent font-bold">{item.date}</span>
                    </div>
                    <h3 className="font-heading font-black text-base uppercase tracking-tight text-text-primary mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-heading font-bold text-accent uppercase tracking-wider mb-2">
                      {item.organization}
                    </p>
                    {item.description && (
                      <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
