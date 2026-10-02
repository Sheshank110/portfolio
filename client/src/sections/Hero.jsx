import { motion } from 'framer-motion';
import heroImg from '../assets/sheshank-hero.png';

export default function Hero() {
  return (
    <section id="home" className="relative w-full bg-black overflow-hidden flex items-center justify-center md:h-screen">
      <motion.img
        src={heroImg}
        alt="Sheshank Gahlawat"
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-auto md:h-full md:object-cover block select-none"
      />
    </section>
  );
}
