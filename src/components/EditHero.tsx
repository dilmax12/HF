import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  level: number;
  xp: number;
}

export default function EditHero() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { heroes, updateHero } = useHeroContext();
  const { isMuted, volume, registerAudio, unregisterAudio } = useAudio();
  const { completeMission, missions } = useMissionContext();
  const [audioStarted, setAudioStarted] = useState(false);
  const [formData, setFormData] = useState<HeroForm | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const hero = heroes.find((h) => h.id === id);
    if (hero) {
      setFormData({
        ...hero,
        attributes: hero.attributes || { strength: 5, dexterity: 5, intelligence: 4, constitution: 4 }, // Garante atributos padrão
        level: hero.level || 1,
        xp: hero.xp || 0,
      });
    } else {
      navigate('/gallery');
    }
  }, [id, heroes, navigate]);

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

  const generateHeroStory = () => {
    if (formData) {
      const story = generateStory(formData.name, formData.class, formData.attributes);
      setFormData((prev) => prev ? { ...prev, story } : prev);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
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

    updateHero({ ...formData, id: id! });
    completeMission(missions.find((m) => m.description === 'Edite um herói na galeria')?.id || '');
    navigate('/gallery');
  };

  const updateAttribute = (attr: keyof HeroForm['attributes'], value: number) => {
    setFormData((prev) =>
      prev ? { ...prev, attributes: { ...prev.attributes, [attr]: Math.max(1, Math.min(10, value)) } } : prev
    );
    setError('');
  };

  if (!formData) return null;

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
            value={formData.name}
            onChange={(e) => setFormData((prev) => prev ? { ...prev, name: e.target.value } : prev)}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
            placeholder="Digite o nome do herói"
          />
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Classe</label>
          <select
            value={formData.class}
            onChange={(e) => setFormData((prev) => prev ? { ...prev, class: e.target.value } : prev)}
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
            onChange={(e) => setFormData((prev) => prev ? { ...prev, story: e.target.value } : prev)}
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
            onChange={(e) => setFormData((prev) => prev ? { ...prev, image: e.target.value } : prev)}
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
          Salvar Alterações
        </motion.button>
      </motion.form>
    </div>
  );
}