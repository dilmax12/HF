import { useState, useEffect } from 'react';
import { useHeroContext } from '../context/HeroContext';
import { useNavigate, useParams } from 'react-router-dom';
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
  skills: string[];
  alignment: string;
  objective: string;
  battleCry: string;
}

interface HeroForm {
  id: string;
  name: string;
  race: string;
  class: string;
  attributes: { strength: number; dexterity: number; intelligence: number; constitution: number };
  story: string;
  image: string;
  alignment: string;
  objective: string;
  battleCry: string;
}

export default function EditHero() {
  const { heroes, updateHero } = useHeroContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [heroForm, setHeroForm] = useState<HeroForm | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const hero = heroes.find((h) => h.id === id);
    if (hero) {
      setHeroForm({
        id: hero.id,
        name: hero.name,
        race: hero.race,
        class: hero.class,
        attributes: { ...hero.attributes },
        story: hero.story,
        image: hero.image,
        alignment: hero.alignment,
        objective: hero.objective,
        battleCry: hero.battleCry,
      });
    }
  }, [id, heroes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm) return;

    const totalPoints = heroForm.attributes.strength + heroForm.attributes.dexterity + heroForm.attributes.intelligence + heroForm.attributes.constitution;
    if (totalPoints !== 18) {
      setError('Os atributos devem somar exatamente 18 pontos!');
      return;
    }
    if (Object.values(heroForm.attributes).some((attr) => attr < 1 || attr > 10)) {
      setError('Cada atributo deve ter entre 1 e 10 pontos!');
      return;
    }

    const updatedHero: Hero = {
      ...heroForm,
      level: heroes.find((h) => h.id === heroForm.id)?.level || 1,
      xp: heroes.find((h) => h.id === heroForm.id)?.xp || 0,
      mana: heroes.find((h) => h.id === heroForm.id)?.mana || 10,
      skills: heroes.find((h) => h.id === heroForm.id)?.skills || [],
    };
    updateHero(updatedHero);
    navigate('/gallery');
  };

  const handleAttributeChange = (attr: keyof HeroForm['attributes'], value: number) => {
    if (heroForm) {
      const newAttrs = { ...heroForm.attributes, [attr]: Math.max(1, Math.min(10, value)) };
      const newTotal = Object.values(newAttrs).reduce((sum, val) => sum + val, 0);
      if (newTotal <= 18) {
        setHeroForm((prev) => (prev ? { ...prev, attributes: newAttrs } : null));
      }
    }
  };

  if (!heroForm) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-4 text-parchment">
      <h1 className="text-3xl font-cinzel text-medieval-gold text-center mb-6">Editar Herói</h1>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-medieval-dark p-6 rounded-lg border border-medieval-gold"
      >
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Nome</label>
          <input
            type="text"
            value={heroForm.name}
            onChange={(e) => setHeroForm((prev) => (prev ? { ...prev, name: e.target.value } : null))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Raça</label>
          <input
            type="text"
            value={heroForm.race}
            onChange={(e) => setHeroForm((prev) => (prev ? { ...prev, race: e.target.value } : null))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Classe</label>
          <input
            type="text"
            value={heroForm.class}
            onChange={(e) => setHeroForm((prev) => (prev ? { ...prev, class: e.target.value } : null))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Atributos (18 pontos totais)</label>
          {['strength', 'dexterity', 'intelligence', 'constitution'].map((attr) => (
            <div key={attr} className="flex items-center mb-2">
              <span className="w-32 text-parchment capitalize">{attr}:</span>
              <input
                type="number"
                value={heroForm.attributes[attr as keyof HeroForm['attributes']]}
                onChange={(e) => handleAttributeChange(attr as keyof HeroForm['attributes'], Number(e.target.value))}
                className="w-20 p-2 bg-gray-800 border border-medieval-gold rounded"
                min="1"
                max="10"
              />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">História</label>
          <textarea
            value={heroForm.story}
            onChange={(e) => setHeroForm((prev) => (prev ? { ...prev, story: e.target.value } : null))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Imagem</label>
          <input
            type="text"
            value={heroForm.image}
            onChange={(e) => setHeroForm((prev) => (prev ? { ...prev, image: e.target.value } : null))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Alinhamento</label>
          <input
            type="text"
            value={heroForm.alignment}
            onChange={(e) => setHeroForm((prev) => (prev ? { ...prev, alignment: e.target.value } : null))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Objetivo</label>
          <input
            type="text"
            value={heroForm.objective}
            onChange={(e) => setHeroForm((prev) => (prev ? { ...prev, objective: e.target.value } : null))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Frase de Batalha</label>
          <input
            type="text"
            value={heroForm.battleCry}
            onChange={(e) => setHeroForm((prev) => (prev ? { ...prev, battleCry: e.target.value } : null))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="w-full px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel"
        >
          Salvar Alterações
        </motion.button>
      </motion.form>
    </div>
  );
}