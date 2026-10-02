import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarqueeBanner from '../components/MarqueeBanner';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import FeaturedProject from '../sections/FeaturedProject';
import Projects from '../sections/Projects';
import Journey from '../sections/Journey';
import Achievements from '../sections/Achievements';
import GitHub from '../sections/GitHub';
import Contact from '../sections/Contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Growkool-style running editorial ticker between Hero and About */}
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

        <About />
        <Skills />
        <FeaturedProject />
        <Projects />

        {/* Second opposing running ribbon between Projects and Journey */}
        <MarqueeBanner
          items={[
            'REACT.JS & NODE.JS',
            'RESTFUL APIS',
            'MONGODB & MYSQL',
            'OBJECT-ORIENTED DESIGN',
            'GENAI FOUNDATIONS',
            'HIGH PERFORMANCE WEB',
          ]}
          direction="right"
          speed="slow"
        />

        <Journey />
        <Achievements />
        <GitHub />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
