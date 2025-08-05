import { Routes, Route } from 'react-router-dom';
import { HeroProvider } from './context/HeroContext';
import CreateHero from './pages/CreateHero';
import Gallery from './pages/Gallery';
import HeroDetails from './pages/HeroDetails';
import ParticlesBackground from './components/ParticlesBackground';
import Navbar from './components/Navbar';

function App() {
  return (
    <HeroProvider>
      <div className="relative min-h-screen bg-medieval-dark">
        <ParticlesBackground />
        <Navbar />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<CreateHero />} />
            <Route path="/create-hero" element={<CreateHero />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/hero/:id" element={<HeroDetails />} />
          </Routes>
        </div>
      </div>
    </HeroProvider>
  );
}

export default App;