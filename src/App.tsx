import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { HeroProvider } from './context/HeroContext';
import { AudioProvider } from './context/AudioContext';
import { MissionProvider } from './context/MissionContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import SplashScreen from './components/SplashScreen';
import CreateHero from './components/CreateHero';
import EditHero from './components/EditHero';
import Gallery from './components/Gallery';
import HeroDetails from './components/HeroDetails';
import Missions from './components/Missions';
const Battle = lazy(() => import('./components/Battle'));

function App() {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.querySelector('nav');
      setNavHeight(nav ? nav.offsetHeight : 64); // Padrão 64px se não encontrado
    };
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  return (
    <MissionProvider>
      <HeroProvider>
        <AudioProvider>
          <ErrorBoundary>
            <div className="relative min-h-screen bg-medieval-dark" style={{ paddingTop: `${navHeight}px` }}>
              <Navbar />
              <Suspense fallback={<div className="text-medieval-gold text-center">Carregando...</div>}>
                <Routes>
                  <Route path="/" element={<SplashScreen />} />
                  <Route path="/create-hero" element={<CreateHero />} />
                  <Route path="/edit-hero/:id" element={<EditHero />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/hero/:id" element={<HeroDetails />} />
                  <Route path="/battle" element={<Battle />} />
                  <Route path="/missions" element={<Missions />} />
                </Routes>
              </Suspense>
            </div>
          </ErrorBoundary>
        </AudioProvider>
      </HeroProvider>
    </MissionProvider>
  );
}

export default App;