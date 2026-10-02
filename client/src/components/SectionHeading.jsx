import { motion } from 'framer-motion';

/**
 * Growkool Studios style section heading:
 * Red numeric index + uppercase category title + red indicator divider rule + bold display heading.
 */
export default function SectionHeading({
  number,
  label,
  title,
  description,
  align = 'left',
  theme = 'light', // 'light' | 'dark'
}) {
  const isCenter = align === 'center';
  const isDark = theme === 'dark';

  return (
    <div className={`mb-14 md:mb-20 ${isCenter ? 'text-center' : 'text-left'}`}>
      {/* Top Section Index & Category Label */}
      {(number || label) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className={`flex items-center gap-4 mb-4 ${isCenter ? 'justify-center' : 'justify-start'}`}
        >
          {number && (
            <span className="font-mono text-sm tracking-wider text-accent font-bold">
              {number}
            </span>
          )}
          {label && (
            <span
              className={`font-heading font-bold text-xs tracking-[0.2em] uppercase ${
                isDark ? 'text-[#888888]' : 'text-text-secondary'
              }`}
            >
              {label}
            </span>
          )}
        </motion.div>
      )}

      {/* Growkool Signature Red Accent Divider Line */}
      <div className="relative w-full h-[1px] bg-border my-6">
        <div className="absolute top-[-1px] left-0 w-24 h-[3px] bg-accent" />
      </div>

      {/* Main Display Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className={`font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] uppercase ${
          isDark ? 'text-white' : 'text-text-primary'
        }`}
      >
        {title}
      </motion.h2>

      {/* Subtitle / Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className={`mt-5 text-base md:text-lg max-w-2xl leading-relaxed ${
            isDark ? 'text-[#a0a0a0]' : 'text-text-secondary'
          }`}
          style={isCenter ? { margin: '1.25rem auto 0' } : {}}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
