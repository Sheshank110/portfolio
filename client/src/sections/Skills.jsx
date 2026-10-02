import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import portfolio from '../data/portfolio';

// Skill tooltips/context map
const SKILL_CONTEXT = {
  'JavaScript (ES6+)': 'Primary language — async/await, closures, modules',
  'C': 'Low-level systems & OS coursework',
  'C++': 'DSA problem-solving & competitive programming',
  'HTML5': 'Semantic markup & accessibility',
  'CSS3': 'Layouts, animations & responsive design',
  'SQL': 'Relational queries, joins & aggregations',
  'React.js': 'Component-based UI, hooks & state management',
  'Tailwind CSS': 'Utility-first rapid styling',
  'Responsive UI': 'Mobile-first, flexbox/grid layouts',
  'Framer Motion': 'Physics-based animations & gestures',
  'REST API Integration': 'Async fetching, error handling & caching',
  'Node.js': 'Event-loop, streams & non-blocking I/O',
  'Express.js': 'REST APIs, middleware & routing',
  'RESTful APIs': 'HTTP methods, status codes & payloads',
  'JSON Processing': 'Parsing, transformation & serialization',
  'Middleware': 'Auth, validation & error pipelines',
  'MongoDB': 'Document DB, Aggregation & Atlas',
  'MySQL': 'Relational DB, transactions & indexing',
  'Mongoose ODM': 'Schema design & query building',
  'Data Structures & Algorithms': 'Arrays, trees, graphs & complexity',
  'OOP': 'Encapsulation, polymorphism & design patterns',
  'DBMS': 'Normalization, ER diagrams & ACID',
  'Operating Systems': 'Processes, memory & scheduling',
  'AWS Cloud Computing': 'EC2, S3, IAM & cloud fundamentals',
  'AWS GenAI Foundations': 'Foundation models & prompt engineering',
  'Git & GitHub': 'Branching, PR workflow & CI/CD',
  'Android Studio': 'Android IDE & Gradle builds',
  'VS Code': 'Primary editor, extensions & debugging',
};

function SkillTag({ skill, delay }) {
  const [hovered, setHovered] = useState(false);
  const tooltip = SKILL_CONTEXT[skill];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <motion.span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.08, y: -3 }}
        className="block px-3.5 py-1.5 bg-[#1a1a1a] border border-[#2e2e2e] text-xs font-mono text-[#d4d4d4] cursor-default hover:border-accent hover:text-white transition-colors"
      >
        {skill}
      </motion.span>

      <AnimatePresence>
        {hovered && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 z-30 w-52 px-3 py-2 bg-[#0c0c0c] border border-accent/40 text-[10px] font-mono text-neutral-300 leading-relaxed pointer-events-none shadow-xl"
          >
            <span className="text-accent font-bold block mb-0.5">{skill}</span>
            {tooltip}
            {/* Arrow */}
            <span className="absolute -bottom-1.5 left-4 w-3 h-3 bg-[#0c0c0c] border-r border-b border-accent/40 rotate-45 block" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Skills() {
  const { skills } = portfolio;
  const categories = Object.keys(skills);
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="skills" className="section-padding border-t border-border bg-bg scroll-mt-20">
      <div className="section-container">
        {/* Growkool 02 TECHNICAL COMPETENCIES */}
        <SectionHeading
          number="02"
          label="TECHNICAL STACK"
          title="ENGINEERING TOOLKIT &amp; DOMAINS"
          description="Languages, frameworks, cloud services, and computer science foundations leveraged to construct robust digital products."
        />

        {/* Growkool Iconic Split Contrast Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px] border border-border shadow-2xl overflow-hidden mt-12 md:mt-16">
          {/* Left: Bold Crimson Red Block */}
          <div className="lg:col-span-5 bg-accent text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs tracking-widest uppercase font-bold text-white/80 block mb-6">
                TECHNICAL CAPABILITIES
              </span>
              <h3 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.92] uppercase">
                BUILD<br />
                FOR<br />
                SCALE.
              </h3>
            </div>

            <div className="pt-8 mt-10 border-t border-white/20 space-y-2 text-xs md:text-sm font-heading font-medium text-white/90">
              <p className="leading-relaxed">
                From clean data modeling and low-latency API contracts to reactive interfaces and cloud deployments.
              </p>
              <p className="font-mono text-[11px] text-white/70 pt-2">
                MERN STACK &bull; AWS CERTIFIED &bull; DATA STRUCTURES
              </p>
              {/* Category count badges */}
              <div className="flex flex-wrap gap-2 pt-3">
                {categories.map((cat, i) => (
                  <button
                    key={cat}
                    onClick={() => setOpenIndex(i)}
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 border transition-all cursor-pointer ${
                      openIndex === i
                        ? 'bg-white text-accent border-white'
                        : 'border-white/30 text-white/70 hover:border-white hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Deep Obsidian Black Interactive Domain Cards */}
          <div className="lg:col-span-7 bg-dark text-white p-8 md:p-12 lg:p-14 flex flex-col justify-center divide-y divide-[#222222]">
            {categories.map((cat, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={cat}
                  className="py-6 cursor-pointer group"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-accent font-bold">
                        0{idx + 1}
                      </span>
                      <h4
                        className={`font-heading font-black text-xl sm:text-2xl uppercase tracking-tight transition-colors ${
                          isOpen ? 'text-accent' : 'text-white group-hover:text-accent'
                        }`}
                      >
                        {cat}
                      </h4>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-mono text-sm text-[#888888] group-hover:text-white inline-block"
                    >
                      +
                    </motion.span>
                  </div>

                  {/* Skills Tag Pills — stagger on expand */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="skills-panel"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-5 pl-8 overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2.5">
                          {skills[cat].map((skill, si) => (
                            <SkillTag
                              key={skill}
                              skill={skill}
                              delay={si * 0.04}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
