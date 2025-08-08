import { useEffect, useState } from 'react';
import { useHeroContext } from '../context/HeroContext';
import { useParams } from 'react-router-dom';
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

export default function HeroStory() {
  const { heroes } = useHeroContext();
  const { id } = useParams<{ id: string }>();
  const [hero, setHero] = useState<Hero | null>(null);

  useEffect(() => {
    const selectedHero = heroes.find((h) => h.id === id);
    if (selectedHero) {
      setHero(selectedHero);
    }
  }, [id, heroes]);

  if (!hero) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-4 text-parchment">
      <h1 className="text-3xl font-cinzel text-medieval-gold text-center mb-6">História de {hero.name}</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-medieval-dark p-6 rounded-lg border border-medieval-gold"
      >
        <img
          src={hero.image}
          alt={hero.name}
          className="w-32 h-32 object-cover rounded-lg border border-medieval-gold mx-auto mb-4"
        />
        <p className="text-medieval-gold mb-2"><strong>Nome:</strong> {hero.name}</p>
        <p className="text-medieval-gold mb-2"><strong>Raça:</strong> {hero.race}</p>
        <p className="text-medieval-gold mb-2"><strong>Classe:</strong> {hero.class}</p>
        <p className="text-medieval-gold mb-2"><strong>Nível:</strong> {hero.level}</p>
        <p className="text-medieval-gold mb-2"><strong>XP:</strong> {hero.xp}</p>
        <p className="text-medieval-gold mb-2"><strong>Alinhamento:</strong> {hero.alignment}</p>
        <p className="text-medieval-gold mb-2"><strong>Objetivo:</strong> {hero.objective}</p>
        <p className="text-medieval-gold mb-2"><strong>Frase de Batalha:</strong> {hero.battleCry}</p>
        <p className="text-medieval-gold mb-2"><strong>Atributos:</strong></p>
        <ul className="list-disc pl-5 mb-4">
          <li>Força: {hero.attributes.strength}</li>
          <li>Destreza: {hero.attributes.dexterity}</li>
          <li>Inteligência: {hero.attributes.intelligence}</li>
          <li>Constituição: {hero.attributes.constitution}</li>
        </ul>
        <p className="text-medieval-gold"><strong>História:</strong></p>
        <p className="mt-2">{hero.story}</p>
      </motion.div>
    </div>
  );
}