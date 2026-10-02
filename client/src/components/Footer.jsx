import portfolio from '../data/portfolio';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0c0c0c] text-white border-t-2 border-[#1f1f1f] pt-14 pb-12">
      <div className="section-container">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pb-12 border-b border-[#222]">
          {/* Brand & Subtitle */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 bg-accent inline-block"></span>
              <span className="font-heading font-black tracking-tighter text-xl uppercase text-white">
                {portfolio.personal.name}
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-mono">
              Full-Stack Developer &amp; Systems Builder &bull; CGC Landran
            </p>
          </div>

          {/* Social Links Growkool style */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {portfolio.social.github && (
              <a
                href={portfolio.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-neutral-300 hover:text-accent font-bold transition-colors flex items-center gap-1.5 group"
              >
                <span>GITHUB</span>
                <span className="text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            )}
            {portfolio.social.linkedin && (
              <a
                href={portfolio.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-neutral-300 hover:text-accent font-bold transition-colors flex items-center gap-1.5 group"
              >
                <span>LINKEDIN</span>
                <span className="text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            )}
            {portfolio.personal.email && (
              <a
                href={`mailto:${portfolio.personal.email}`}
                className="text-xs uppercase tracking-widest text-neutral-300 hover:text-accent font-bold transition-colors flex items-center gap-1.5 group"
              >
                <span>EMAIL</span>
                <span className="text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            )}
            {portfolio.personal.phone && (
              <a
                href={`tel:${portfolio.personal.phone.replace(/[^0-9+]/g, '')}`}
                className="text-xs uppercase tracking-widest text-neutral-300 hover:text-accent font-bold transition-colors flex items-center gap-1.5 group"
              >
                <span>CALL</span>
                <span className="text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            )}
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-heading font-black text-xs uppercase tracking-widest border border-accent hover:bg-white hover:text-black transition-all cursor-pointer group shadow-sm"
            aria-label="Back to top"
          >
            <span>BACK TO TOP</span>
            <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
          </button>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <p>
            &copy; {currentYear} {portfolio.personal.name}. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-neutral-400">OPEN TO ENGINEERING INTERNSHIPS &amp; PROJECTS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

