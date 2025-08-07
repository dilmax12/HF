import { NavLink } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { isMuted, toggleMute, setVolume } = useAudio();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleMenu = () => {
    console.log('Toggle menu, isMenuOpen:', !isMenuOpen); // Depuração
    setIsMenuOpen((prev) => !prev);
  };

  const navItems = [
    { to: '/', label: 'Início' },
    { to: '/create-hero', label: 'Criar Herói' },
    { to: '/gallery', label: 'Galeria' },
    { to: '/battle', label: 'Arena de Batalha' },
    { to: '/missions', label: 'Missões' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isMenuOpen) {
        console.log('Click fora do menu, fechando'); // Depuração
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-medieval-dark border-b border-medieval-gold py-4 fixed w-full top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <motion.h1
          className="text-2xl font-cinzel text-medieval-gold"
          whileHover={{ scale: 1.05 }}
        >
          Forjador de Heróis
        </motion.h1>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-medieval-gold hover:text-yellow-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
        <div
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-medieval-dark md:bg-transparent p-4 md:p-0 border-b md:border-none border-medieval-gold`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-medieval-gold hover:text-yellow-600 font-cinzel transition-colors duration-200 py-2 md:py-0 ${
                  isActive ? 'underline' : ''
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                {item.label}
              </motion.span>
            </NavLink>
          ))}
          <div className="flex items-center space-x-2 py-2 md:py-0">
            <motion.button
              onClick={toggleMute}
              className="text-medieval-gold hover:text-yellow-600 font-cinzel"
              title={isMuted ? 'Ativar som' : 'Desativar som'}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMuted ? '🔇' : '🔊'}
            </motion.button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : useAudio().volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20"
              disabled={isMuted}
            />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}