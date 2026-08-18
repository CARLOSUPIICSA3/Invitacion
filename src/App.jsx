import { useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import MusicPlayer from './components/MusicPlayer';
import Hero from './components/Hero';
import VerseSection from './components/VerseSection';
import DetailsSection from './components/DetailsSection';
import Countdown from './components/Countdown';
import MapSection from './components/MapSection';
import Footer from './components/Footer';

/* Intersection Observer for scroll-triggered animations */
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const targets = document.querySelectorAll('.animate-on-scroll');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  useScrollAnimations();

  return (
    <div className="app">
      {!hasEntered && (
        <Preloader onEnter={() => setHasEntered(true)} />
      )}
      <MusicPlayer />
      <Hero started={hasEntered} />
      <VerseSection />
      <DetailsSection />
      <Countdown />
      <MapSection />
      <Footer />
    </div>
  );
}

