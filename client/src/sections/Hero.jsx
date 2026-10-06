import { motion } from 'framer-motion';
import heroImg from '../assets/sheshank-hero.png';

export default function Hero() {
  // Anti-theft event blocker (prevents right-click save and drag-save)
  const preventCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <section
      id="home"
      onContextMenu={preventCopy}
      onDragStart={preventCopy}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      className="relative w-full bg-black overflow-hidden flex items-center justify-center md:h-screen select-none"
    >
      {/* Accessible semantic heading for Search Engines & Screen Readers */}
      <h1 className="sr-only">
        Sheshank Gahlawat — Full-Stack Developer & Builder Portfolio
      </h1>

      {/* Static Landing Image (Exact Original, Untouched) */}
      <motion.img
        src={heroImg}
        alt="Sheshank Gahlawat"
        draggable={false}
        onContextMenu={preventCopy}
        onDragStart={preventCopy}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-auto md:h-full md:object-cover block select-none pointer-events-none relative z-10"
      />

      {/* ── Transparent Interactive Anti-Theft Shield ─────────────────── */}
      {/* Sits on top of the image to intercept right-clicks, drag-and-drops, and save commands */}
      <div
        onContextMenu={preventCopy}
        onDragStart={preventCopy}
        className="absolute inset-0 z-20 pointer-events-auto cursor-default"
        aria-hidden="true"
      />
    </section>
  );
}
