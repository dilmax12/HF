import { useState, useEffect } from 'react';
import { useHeroContext } from '../context/HeroContext';
import { useAudio } from '../context/AudioContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Gallery() {
  const { heroes, deleteHero } = useHeroContext();
  const { registerAudio, unregisterAudio, isMuted, volume } = useAudio();
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!isMuted && !audioStarted && isMounted) {
      const ambientAudio = registerAudio('ambient');
      ambientAudio.loop = true;
      ambientAudio.volume = isMuted ? 0 : volume;
      ambientAudio.play().catch((e) => console.error('Erro ao tocar som ambiente:', e));
      setAudioStarted(true);
    }
    return () => {
      isMounted = false;
      if (audioStarted) {
        unregisterAudio('ambient');
      }
    };
  }, [isMuted, volume, audioStarted, registerAudio, unregisterAudio]);

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este herói?')) {
      deleteHero(id);
    }
  };

  return (
    <div className="container mx-auto p-4 text-parchment">
      <h1 className="text-3xl font-cinzel text-medieval-gold text-center mb-6">Galeria de Heróis</h1>
      {heroes.length === 0 ? (
        <p className="text-center text-medieval-gold">Nenhum herói criado ainda. <Link to="/create-hero" className="underline hover:text-yellow-300">Crie um agora!</Link></p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {heroes.map((hero) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-medieval-dark p-4 rounded-lg border border-medieval-gold shadow-lg"
            >
              <img src={hero.image || '/images/default-hero.png'} alt={hero.name} className="w-full h-48 object-cover rounded mb-2" />
              <h2 className="text-xl text-medieval-gold font-cinzel">{hero.name}</h2>
              <p className="text-parchment">Classe: {hero.class}</p>
              <p className="text-parchment">Nível: {hero.level || 1}</p>
              <div className="mt-2 space-x-2">
                <Link to={`/hero/${hero.id}`} className="px-3 py-1 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600">Detalhes</Link>
                <Link to={`/edit-hero/${hero.id}`} className="px-3 py-1 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600">Editar</Link>
                <button
                  onClick={() => handleDelete(hero.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}