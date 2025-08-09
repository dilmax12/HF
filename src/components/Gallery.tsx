import React, { useEffect } from 'react';
import { useHeroContext } from '../context/HeroContext';
import { useAudio } from '../context/AudioContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Hero {
  id: string;
  name: string;
  race: string;
  class: string;
  attributes: { strength: number; dexterity: number; intelligence: number; constitution: number };
  story: string;
  image: string;
  level: number;
  xp: number;
  mana: number;
  skills: { name: string; cost: number }[];
  alignment: string;
  objective: string;
  battleCry: string;
}

export default function Gallery() {
  const { heroes } = useHeroContext();
  const { startAudio, isMuted } = useAudio();

  useEffect(() => {
    if (!isMuted) {
      startAudio('ambient');
    }
    return () => {
      // Limpa o áudio ao desmontar para evitar memory leaks
    };
  }, [startAudio, isMuted]); // Dependências corretas

  return (
    <div className="container mx-auto p-4 text-parchment min-h-screen">
      <h1 className="text-3xl font-cinzel text-medieval-gold text-center mb-6">Galeria de Heróis</h1>
      {heroes.length === 0 ? (
        <div className="text-center">
          <p className="text-medieval-gold mb-4">Nenhum herói criado ainda!</p>
          <Link to="/create-hero" className="px-6 py-3 bg-medieval-gold text-medieval-dark rounded-lg hover:bg-yellow-600 font-cinzel">
            Criar Herói
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {heroes.map((hero) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-medieval-dark p-4 rounded-lg border border-medieval-gold text-center"
            >
              <img src={hero.image} alt={hero.name} className="w-24 h-24 object-cover rounded-lg mx-auto mb-2" />
              <h2 className="text-xl text-medieval-gold">{hero.name}</h2>
              <p className="text-parchment">Classe: {hero.class}</p>
              <p className="text-parchment">Nível: {hero.level}</p>
              <Link to={`/hero/${hero.id}`} className="mt-2 inline-block px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600">
                Ver História
              </Link>
              <Link to={`/edit/${hero.id}`} className="mt-2 ml-2 inline-block px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600">
                Editar
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}