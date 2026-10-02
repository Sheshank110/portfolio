import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarqueeBanner from '../components/MarqueeBanner';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Dossier from '../sections/Dossier';
import Contact from '../sections/Contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Section 01: Hero */}
        <Hero />

        {/* Editorial ticker between Hero and About */}
        <MarqueeBanner
          items={[
            'FULL-STACK ARCHITECTURE',
            'MERN STACK SYSTEMS',
            'DATA STRUCTURES & ALGORITHMS',
            'AWS CLOUD COMPUTING',
            'SMART INDIA HACKATHON',
            'PROBLEM SOLVER',
          ]}
          speed="normal"
        />

        {/* Section 02: Cybercore Specification & Interactive Project Graph */}
        <About />

        {/* Section 03: Technical Arsenal & Verified Credentials Vault */}
        <Dossier />

        {/* Section 04: Let's Build Something (Contact) */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
