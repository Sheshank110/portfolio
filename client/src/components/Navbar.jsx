import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrollProgress } from '../hooks/useScrollProgress';
import portfolio from '../data/portfolio';

const NAV_LINKS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'WORK' },
  { id: 'journey', label: 'TRAJECTORY' },
  { id: 'achievements', label: 'HONORS' },
  { id: 'contact', label: 'CONTACT' },
];

const SECTION_IDS = ['home', ...NAV_LINKS.map((l) => l.id)];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('home');
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
      const scrollY = window.scrollY;

      setIsOverHero(scrollY < heroBottom - 80);
      setScrolled(scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('load', handleScroll, { passive: true });
    const timer = setTimeout(handleScroll, 150);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('load', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeMobile(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeMobile]);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isOverHero
            ? 'bg-black/50 backdrop-blur-md border-b border-white/10 text-white'
            : scrolled
            ? 'bg-bg/95 backdrop-blur-md border-b border-border shadow-xs text-text-primary'
            : 'bg-bg/80 backdrop-blur-xs border-b border-border/40 text-text-primary'
        }`}
      >
        <div className="section-container flex items-center justify-between h-18 md:h-20">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 group"
          >
            <span
              className={`font-heading font-black text-lg md:text-xl tracking-tighter uppercase transition-colors ${
                isOverHero ? 'nav-logo-hero' : 'text-text-primary'
              }`}
            >
              {portfolio.personal.firstName}
            </span>
            <span
              className={`font-mono text-[10px] tracking-widest uppercase px-1.5 py-0.5 font-bold transition-colors ${
                isOverHero ? 'bg-white text-black' : 'bg-text-primary text-bg'
              }`}
            >
              DEV
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`text-xs font-heading font-bold tracking-[0.12em] uppercase transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-accent'
                      : isOverHero
                      ? 'nav-link-hero'
                      : 'text-text-primary hover:text-accent'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="growkool-nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Action — Button */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#contact"
              className="btn-growkool-red"
            >
              <span>LET'S TALK</span>
              <span className="text-sm font-mono font-bold">↗</span>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden w-10 h-10 flex items-center justify-center transition-colors ${
              isOverHero
                ? 'nav-link-hero'
                : 'text-text-primary hover:text-accent'
            }`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between relative">
              <span
                className={`block h-[2px] bg-current transition-all duration-300 origin-center ${
                  mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block h-[2px] bg-current transition-all duration-200 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-[2px] bg-current transition-all duration-300 origin-center ${
                  mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-0 z-40 md:hidden flex flex-col justify-between p-8 pt-28 ${
              isOverHero ? 'bg-dark/95 backdrop-blur-xl text-white' : 'bg-bg text-text-primary'
            }`}
          >
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={closeMobile}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className={`text-3xl font-heading font-black tracking-tight uppercase transition-colors ${
                    activeSection === link.id
                      ? 'text-accent'
                      : isOverHero
                      ? 'nav-link-hero hover:text-accent'
                      : 'text-text-primary hover:text-accent'
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className={`space-y-4 pt-6 border-t ${isOverHero ? 'border-white/10' : 'border-border'}`}>
              <a
                href="#contact"
                onClick={closeMobile}
                className="btn-growkool-red w-full justify-center py-4"
              >
                <span>LET'S TALK</span>
                <span className="font-mono text-sm font-bold">↗</span>
              </a>
              <div
                className={`flex items-center justify-between text-xs font-mono pt-2 ${
                  isOverHero ? 'text-white/60' : 'text-text-secondary'
                }`}
              >
                <span>{portfolio.personal.email}</span>
                <span>{portfolio.personal.phone}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
