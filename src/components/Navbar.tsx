import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-medieval-dark border-b border-medieval-gold py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-medieval-gold font-cinzel">
          Forjador de Heróis
        </h1>
        <div className="space-x-4">
          <NavLink
            to="/create-hero"
            className={({ isActive }) =>
              `text-medieval-gold hover:text-yellow-600 font-cinzel ${
                isActive ? 'underline' : ''
              }`
            }
          >
            Criar Herói
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `text-medieval-gold hover:text-yellow-600 font-cinzel ${
                isActive ? 'underline' : ''
              }`
            }
          >
            Galeria
          </NavLink>
        </div>
      </div>
    </nav>
  );
}