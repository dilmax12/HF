import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeroContext } from '../context/HeroContext';
import { useAudio } from '../context/AudioContext';
import { useMissionContext } from '../context/MissionContext';
import { motion } from 'framer-motion';
import { generateStory } from '../utils/storyGenerator';
import { fantasyNames } from '../utils/names';

interface HeroForm {
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

interface FantasyNames {
  [key: string]: { Masculinos: string[]; Femininos: string[] };
}

export default function CreateHero() {
  const navigate = useNavigate();
  const { addHero } = useHeroContext();
  const { isMuted, volume, registerAudio, unregisterAudio } = useAudio();
  const { completeMission, missions } = useMissionContext();
  const [audioStarted, setAudioStarted] = useState(false);
  const [formData, setFormData] = useState<HeroForm>({
    name: '',
    race: 'Humano',
    class: 'Guerreiro',
    attributes: { strength: 5, dexterity: 5, intelligence: 4, constitution: 4 },
    story: '',
    image: '/images/default-hero.png',
    alignment: 'Ordeiro e Bom',
    objective: 'Justiça',
    battleCry: '',
  });
  const [totalPoints, setTotalPoints] = useState(18);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const generateRandomName = () => {
    const raceNames = (fantasyNames as FantasyNames)[formData.race];
    const gender = Math.random() > 0.5 ? 'Masculinos' : 'Femininos';
    const randomName = raceNames[gender][Math.floor(Math.random() * raceNames[gender].length)];
    setFormData((prev) => ({ ...prev, name: randomName }));
  };

  const generateHeroStory = () => {
    const story = generateStory(formData.name, formData.class, formData.attributes);
    setFormData((prev) => ({ ...prev, story }));
  };

  const generateRandomBattleCry = (className: string): string => {
    const cries: { [key: string]: string[] } = {
      Guerreiro: ['"Pelo honor, caio ou venço!"', '"Meu escudo é minha alma!"'],
      Arqueiro: ['"A flecha encontra seu alvo!"', '"Silêncio antes do disparo!"'],
      Mago: ['"O fogo da mente queima!"', '"Arcanos, obedeçam-me!"'],
      Clérigo: ['"Pela luz, sou redimido!"', '"A fé guia meu golpe!"'],
      Ladino: ['"Das sombras, a lâmina!"', '"Surpresa é minha arma!"'],
      Bárbaro: ['"Rugido da fúria!"', '"Sangue e glória!"'],
      Druida: ['"A natureza me defende!"', '"Florestas, erguei-vos!"'],
      Cavaleiro: ['"Pela ordem, avanço!"', '"Meu juramento é minha força!"'],
      Feiticeiro: ['"O sangue queima em poder!"', '"Caos, meu aliado!"'],
    };
    const classCries = cries[className] || cries['Guerreiro'];
    return classCries[Math.floor(Math.random() * classCries.length)];
  };

  useEffect(() => {
    let isMounted = true;
    return () => {
      isMounted = false;
      if (audioStarted) {
        unregisterAudio('ambient');
      }
    };
  }, [audioStarted, unregisterAudio]);

  const startAmbientAudio = () => {
    if (!audioStarted && !isMuted) {
      const ambientAudio = registerAudio('ambient');
      ambientAudio.loop = true;
      ambientAudio.volume = volume;
      ambientAudio.play().catch((e) => console.error('Erro ao tocar som ambiente após interação:', e));
      setAudioStarted(true);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttributeChange = (attr: keyof HeroForm['attributes'], value: number) => {
    const newAttrs = { ...formData.attributes, [attr]: Math.max(1, Math.min(10, value)) };
    const newTotal = Object.values(newAttrs).reduce((sum, val) => sum + val, 0);
    if (newTotal <= 18) {
      setFormData((prev) => ({ ...prev, attributes: newAttrs }));
      setTotalPoints(newTotal);
    }
  };

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

    addHero({
      ...formData,
      id: Date.now().toString(),
      level: 1,
      xp: 0,
      mana: 10,
      skills: [{ name: 'Golpe Básico', cost: 0 }],
      image: formData.image || '/images/default-hero.png',
    });
    completeMission(missions.find((m) => m.description === 'Crie seu primeiro herói')?.id || '');
    navigate('/gallery');
  };

  return (
    <div className="container mx-auto p-4 text-parchment">
      <h1 className="text-3xl font-cinzel text-medieval-gold text-center mb-6">Criar Herói</h1>
      {!audioStarted && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={startAmbientAudio}
          className="block mx-auto mb-4 px-6 py-3 bg-medieval-gold text-medieval-dark rounded-lg hover:bg-yellow-600 font-cinzel"
        >
          Iniciar Experiência com Som
        </motion.button>
      )}
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
          <label className="block text-medieval-gold mb-2">Raça (Origem)</label>
          <select
            value={formData.race}
            onChange={(e) => setFormData((prev) => ({ ...prev, race: e.target.value }))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          >
            {Object.keys(fantasyNames).map((race) => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Classe (Profissão)</label>
          <select
            value={formData.class}
            onChange={(e) => setFormData((prev) => ({ ...prev, class: e.target.value }))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          >
            {['Guerreiro', 'Arqueiro', 'Mago', 'Clérigo', 'Ladino', 'Bárbaro', 'Druida', 'Cavaleiro', 'Feiticeiro'].map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Alinhamento</label>
          <select
            value={formData.alignment}
            onChange={(e) => setFormData((prev) => ({ ...prev, alignment: e.target.value }))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
            title="Escolha um alinhamento que reflita a moral e as ações do herói."
          >
            {[
              'Ordeiro e Bom', 'Neutro e Bom', 'Caótico e Bom',
              'Ordeiro e Neutro', 'Neutro Verdadeiro', 'Caótico e Neutro',
              'Ordeiro e Mau', 'Neutro e Mau', 'Caótico e Mau',
            ].map((align) => (
              <option key={align} value={align}>
                {align}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Objetivo</label>
          <select
            value={formData.objective}
            onChange={(e) => setFormData((prev) => ({ ...prev, objective: e.target.value }))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
            title="Defina o que move o herói em sua jornada."
          >
            {[
              'Riqueza', 'Justiça', 'Vingança', 'Redenção',
              'Glória', 'Conhecimento', 'Liberdade', 'Caos', 'Equilíbrio',
            ].map((obj) => (
              <option key={obj} value={obj}>
                {obj}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Frase de Batalha</label>
          <input
            type="text"
            value={formData.battleCry}
            onChange={(e) => setFormData((prev) => ({ ...prev, battleCry: e.target.value }))}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
            placeholder="Digite ou gere uma frase"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, battleCry: generateRandomBattleCry(prev.class) }))}
            className="mt-2 px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600"
          >
            Gerar Aleatória
          </motion.button>
        </div>
        <div className="mb-4">
          <label className="block text-medieval-gold mb-2">Atributos (18 pontos totais, mínimo 1 por atributo)</label>
          {['strength', 'dexterity', 'intelligence', 'constitution'].map((attr) => (
            <div key={attr} className="flex items-center mb-2">
              <span className="w-32 text-parchment capitalize">{attr}:</span>
              <input
                type="number"
                value={formData.attributes[attr as keyof HeroForm['attributes']]}
                onChange={(e) => handleAttributeChange(attr as keyof HeroForm['attributes'], Number(e.target.value))}
                className="w-20 p-2 bg-gray-800 border border-medieval-gold rounded"
                min="1"
                max="10"
              />
            </div>
          ))}
          <p className="text-sm text-parchment">
            Total de pontos: {totalPoints}/18
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
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 bg-gray-800 border border-medieval-gold rounded"
          />
          {imagePreview && <img src={imagePreview} alt="Prévia" className="mt-2 w-32 h-32 object-cover rounded" />}
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={totalPoints !== 18}
          className="w-full px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel disabled:opacity-50"
        >
          Criar Herói
        </motion.button>
      </motion.form>
    </div>
  );
}