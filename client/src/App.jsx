import { Component, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Runtime Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-[#ededed] flex flex-col items-center justify-center p-6 font-mono text-center">
          <div className="w-12 h-12 rounded-full border border-accent/40 flex items-center justify-center text-accent mb-4 text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider mb-2 text-accent">
            Rendering Interruption
          </h2>
          <p className="text-sm text-text-secondary max-w-md mb-6">
            {this.state.error?.message || 'A unexpected interface error was encountered.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-accent text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-accent/80 transition-colors cursor-pointer"
          >
            Reload Interface
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    let lenis = null;
    let animationFrameId = null;

    try {
      // Initialize buttery-smooth momentum scroll with Lenis
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5,
        infinite: false,
      });

      function raf(time) {
        if (lenis) {
          lenis.raf(time);
          animationFrameId = requestAnimationFrame(raf);
        }
      }
      animationFrameId = requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis smooth scroll failed to initialize:', e);
    }

    // Support in-page anchor links with Lenis smooth interpolation
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#') {
          try {
            const targetEl = document.querySelector(targetId);
            if (targetEl && lenis) {
              e.preventDefault();
              lenis.scrollTo(targetEl, { offset: -70, duration: 1.1 });
            }
          } catch (err) {
            console.warn('Anchor navigation error:', err);
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      document.removeEventListener('click', handleAnchorClick);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
