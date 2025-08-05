import { useAudio } from '../context/AudioContext';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <nav className="bg-medieval-dark border-b border-medieval-gold py-4 relative z-20">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-medieval-gold font-cinzel">
          Forjador de Heróis
        </h1>
        <div className="flex items-center space-x-4">
          <NavLink
            to="/create-hero"
            className={({ isActive }) =>
              `text-medieval-gold hover:text-yellow-600 font-cinzel transition-colors duration-200 ${
                isActive ? 'underline' : ''
              }`
            }
          >
            Criar Herói
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `text-medieval-gold hover:text-yellow-600 font-cinzel transition-colors duration-200 ${
                isActive ? 'underline' : ''
              }`
            }
          >
            Galeria
          </NavLink>
          <NavLink
            to="/battle"
            className={({ isActive }) =>
              `text-medieval-gold hover:text-yellow-600 font-cinzel transition-colors duration-200 ${
                isActive ? 'underline' : ''
              }`
            }
          >
            Arena de Batalha
          </NavLink>
          <button
            onClick={toggleMute}
            className="text-medieval-gold hover:text-yellow-600 font-cinzel"
            title={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
    </nav>
  );
}