import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateHero from './pages/CreateHero';
import Gallery from './pages/Gallery';
import HeroDetails from './pages/HeroDetails';
import Battle from './pages/Battle';
import { HeroProvider } from './context/HeroContext';
import { AudioProvider } from './context/AudioContext';
import ParticlesBackground from './components/ParticlesBackground';

function App() {
  return (
    <HeroProvider>
      <AudioProvider>
        <div className="relative min-h-screen" style={{ zIndex: 0 }}>
          <ParticlesBackground />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <Navbar />
            <Routes>
              <Route path="/create-hero" element={<CreateHero />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/hero/:id" element={<HeroDetails />} />
              <Route path="/battle" element={<Battle />} />
              <Route path="/" element={<Gallery />} />
            </Routes>
          </div>
        </div>
      </AudioProvider>
    </HeroProvider>
  );
}

export default App;