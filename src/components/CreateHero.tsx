import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeroContext } from '../context/HeroContext';
import { useAudio } from '../context/AudioContext';
import { useMissionContext } from '../context/MissionContext';
import { motion } from 'framer-motion';
import { generateStory } from '../utils/storyGenerator';

interface HeroForm {
  name: string;
  class: string;
  attributes: { strength: number; dexterity: number; intelligence: number; constitution: number };
  story: string;
  image: string;
}

export default function CreateHero() {
  const navigate = useNavigate();
  const { addHero } = useHeroContext();
  const { isMuted, volume, registerAudio, unregisterAudio } = useAudio();
  const { completeMission, missions } = useMissionContext();
  const [audioStarted, setAudioStarted] = useState(false);
  const [formData, setFormData] = useState<HeroForm>({
    name: '',
    class: 'Guerreiro',
    attributes: { strength: 5, dexterity: 5, intelligence: 4, constitution: 4 },
    story: '',
    image: '/images/default-hero.png',
  });
  const [error, setError] = useState('');

  const generateRandomName = () => {
    const names = ['Aragorn', 'Eldrin', 'Lyria', 'Thorin', 'Seraphina', 'Grok'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    setFormData((prev) => ({ ...prev, name: randomName }));
  };

  const generateHeroStory = () => {
    const story = generateStory(formData.name, formData.class, formData.attributes);
    setFormData((prev) => ({ ...prev, story }));
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, attributes } = formData;
    const totalPoints = attributes.strength + attributes.dexterity + attributes.intelligence + attributes.constitution;

    if (!name) {
      setError('O nome é obrigatório!');
      return;
    }
    if (totalPoints !== 18) {
      setError('Os atributos devem somar exatamente 18 pontos!');
      return;
    }
    if (Object.values(attributes).some((attr) => attr < 1 || attr > 10)) {
      setError('Cada atributo deve ter entre 1 e 10 pontos!');
      return;
    }

    addHero({ ...formData, level: 1, xp: 0 });
    completeMission(missions.find((m) => m.description === 'Crie seu primeiro herói')?.id || '');
    navigate('/gallery');
  };

  const updateAttribute = (attr: keyof HeroForm['attributes'], value: number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [attr]: Math.max(1, Math.min(10, value)) },
    }));
    setError('');
  };

  return (
    <div className="container mx-auto p-4 text-parchment">
      <h1 className="text-3xl font-cinzel text-medieval-gold text-center mb-6">Criar Herói</h1>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-medieval-dark p-6 rounded-lg border border-medieval-gold"
      >
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Nome</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
              placeholder="Digite o nome do herói"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={generateRandomName}
              className="px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600"
            >
              Aleatório
            </motion.button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Classe</label>
          <select
            value={formData.class}
            onChange={(e) => setFormData((prev) => ({ ...prev, class: e.target.value }))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          >
            <option value="Guerreiro">Guerreiro</option>
            <option value="Mago">Mago</option>
            <option value="Arqueiro">Arqueiro</option>
            <option value="Clérigo">Clérigo</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Atributos (18 pontos totais, mínimo 1 por atributo)</label>
          {['strength', 'dexterity', 'intelligence', 'constitution'].map((attr) => (
            <div key={attr} className="flex items-center mb-2">
              <span className="w-32 text-parchment capitalize">{attr}:</span>
              <input
                type="number"
                value={formData.attributes[attr as keyof HeroForm['attributes']]}
                onChange={(e) => updateAttribute(attr as keyof HeroForm['attributes'], Number(e.target.value))}
                className="w-20 p-2 bg-gray-800 border border-medieval-gold rounded"
                min="1"
                max="10"
              />
            </div>
          ))}
          <p className="text-sm text-parchment">
            Total de pontos: {Object.values(formData.attributes).reduce((sum, val) => sum + val, 0)}/18
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">História</label>
          <textarea
            value={formData.story}
            onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
            rows={4}
            placeholder="Escreva a história do herói"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={generateHeroStory}
            className="mt-2 px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600"
          >
            Gerar História
          </motion.button>
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Imagem</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
            placeholder="URL da imagem ou use padrão"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="w-full px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel"
        >
          Criar Herói
        </motion.button>
      </motion.form>import React, { useState } from 'react';
import { useHeroContext } from '../context/HeroContext';
import { useNavigate } from 'react-router-dom';

const CreateHero: React.FC = () => {
  const { addHero } = useHeroContext();
  const navigate = useNavigate();
  const [hero, setHero] = useState({
    name: '',
    class: 'Guerreiro',
    attributes: { strength: 0, dexterity: 0, intelligence: 0, constitution: 0 },
    story: '',
    image: '',
    alignment: 'Leal e Bom',
    objective: 'Justiça',
    battleCry: '',
  });
  const [totalPoints, setTotalPoints] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setHero({ ...hero, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttributeChange = (attr: string, value: number) => {
    const newAttrs = { ...hero.attributes, [attr]: value };
    const newTotal = Object.values(newAttrs).reduce((sum, val) => sum + val, 0);
    if (newTotal <= 18) {
      setHero({ ...hero, attributes: newAttrs });
      setTotalPoints(newTotal);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addHero({ ...hero, image: hero.image || '/images/default-hero.png' });
      navigate('/gallery');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-cinzel text-medieval-gold mb-4">Forjar um Herói</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-medieval-gold">Nome</label>
          <input
            type="text"
            value={hero.name}
            onChange={(e) => setHero({ ...hero, name: e.target.value })}
            className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
            required
          />
        </div>
        <div>
          <label className="block text-medieval-gold">Classe</label>
          <select
            value={hero.class}
            onChange={(e) => setHero({ ...hero, class: e.target.value })}
            className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
          >
            {['Guerreiro', 'Arqueiro', 'Mago', 'Clérigo', 'Ladino', 'Bárbaro', 'Druida', 'Cavaleiro', 'Feiticeiro'].map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-medieval-gold">Alinhamento</label>
          <select
            value={hero.alignment}
            onChange={(e) => setHero({ ...hero, alignment: e.target.value })}
            className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
          >
            {['Leal e Bom', 'Caótico'].map((align) => (
              <option key={align} value={align}>
                {align}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-medieval-gold">Objetivo</label>
          <select
            value={hero.objective}
            onChange={(e) => setHero({ ...hero, objective: e.target.value })}
            className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
          >
            {['Busca por Poder', 'Riqueza', 'Justiça'].map((obj) => (
              <option key={obj} value={obj}>
                {obj}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-medieval-gold">Frase de Batalha</label>
          <input
            type="text"
            value={hero.battleCry}
            onChange={(e) => setHero({ ...hero, battleCry: e.target.value })}
            className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
            placeholder="Digite ou gere uma frase"
          />
          <button
            type="button"
            onClick={() => setHero({ ...hero, battleCry: generateRandomBattleCry(hero.class) })}
            className="mt-2 px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600"
          >
            Gerar Aleatória
          </button>
        </div>
        <div>
          <label className="block text-medieval-gold">Atributos (Total: {totalPoints}/18)</label>
          {['strength', 'dexterity', 'intelligence', 'constitution'].map((attr) => (
            <div key={attr} className="flex items-center mb-2">
              <label className="mr-2 capitalize">{attr}: </label>
              <input
                type="number"
                min="0"
                max={18 - (totalPoints - hero.attributes[attr as keyof typeof hero.attributes])}
                value={hero.attributes[attr as keyof typeof hero.attributes]}
                onChange={(e) => handleAttributeChange(attr, parseInt(e.target.value) || 0)}
                className="w-16 p-1 bg-medieval-dark border border-medieval-gold rounded"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-medieval-gold">Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
          />
          {imagePreview && <img src={imagePreview} alt="Prévia" className="mt-2 w-32 h-32 object-cover rounded" />}
        </div>
        <button
          type="submit"
          disabled={totalPoints !== 18}
          className="px-6 py-3 bg-medieval-gold text-medieval-dark rounded-lg hover:bg-yellow-600 disabled:opacity-50 font-cinzel"
        >
          Criar Herói
        </button>
      </form>
    </div>
  );
};

export default CreateHero;
    </div>
  );
}