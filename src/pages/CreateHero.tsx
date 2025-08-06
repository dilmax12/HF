import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeroContext } from '../context/HeroContext';
import { useAudio } from '../context/AudioContext';
import { generateStory } from '../utils/storyGenerator';

export default function CreateHero() {
  const { addHero } = useHeroContext();
  const { isMuted } = useAudio();
  const navigate = useNavigate();
  const [hero, setHero] = useState({
    name: '',
    class: 'Guerreiro',
    attributes: { strength: 5, dexterity: 5, intelligence: 4, constitution: 4 },
    story: '',
    image: '',
  });
  const [pointsLeft, setPointsLeft] = useState(18);
  const [audioStarted, setAudioStarted] = useState(false);
  const [windSound, setWindSound] = useState<HTMLAudioElement | null>(null);

  // Cleanup do áudio
  useEffect(() => {
    return () => {
      if (windSound) {
        windSound.pause();
        windSound.currentTime = 0;
      }
    };
  }, [windSound]);

  const startAudio = () => {
    if (!audioStarted && !isMuted && !windSound) {
      const sound = new Audio('/audio/wind-ambient.mp3');
      sound.loop = true;
      sound.volume = 0.3;
      sound.muted = isMuted;
      sound
        .play()
        .then(() => {
          setWindSound(sound);
          setAudioStarted(true);
        })
        .catch((e) => console.error('Erro ao tocar som de fundo:', e));
    }
  };

  const classes = ['Guerreiro', 'Mago', 'Arqueiro', 'Ladino'];

  const handleAttributeChange = (attr: keyof typeof hero.attributes, value: number) => {
    const newAttributes = { ...hero.attributes, [attr]: value };
    const totalPoints = Object.values(newAttributes).reduce((sum, val) => sum + val, 0);
    if (totalPoints <= 18 && value >= 0 && value <= 10) {
      setHero({ ...hero, attributes: newAttributes });
      setPointsLeft(18 - totalPoints);
    }
  };

  const handleGenerateStory = () => {
    const generatedStory = generateStory(hero);
    setHero({ ...hero, story: generatedStory });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHero(hero);
    navigate('/gallery');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => setHero({ ...hero, image: reader.result as string });
      reader.readAsDataURL(file);
    } else {
      alert('A imagem deve ter no máximo 2MB.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-medieval-gold mb-4 font-cinzel">Criar Herói</h1>
      {!audioStarted && !isMuted && (
        <button
          onClick={startAudio}
          className="mb-4 px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel"
        >
          Ativar Som Ambiente
        </button>
      )}
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
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-medieval-gold">Atributos (Pontos restantes: {pointsLeft})</label>
          {Object.keys(hero.attributes).map((attr) => (
            <div key={attr} className="flex items-center space-x-2">
              <label className="w-32 capitalize">{attr}</label>
              <input
                type="range"
                min="0"
                max="10"
                value={hero.attributes[attr as keyof typeof hero.attributes]}
                onChange={(e) => handleAttributeChange(attr as keyof typeof hero.attributes, +e.target.value)}
                className="w-full"
              />
              <span>{hero.attributes[attr as keyof typeof hero.attributes]}</span>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-medieval-gold">História</label>
          <textarea
            value={hero.story}
            onChange={(e) => setHero({ ...hero, story: e.target.value })}
            className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
            rows={4}
          />
          <button
            type="button"
            onClick={handleGenerateStory}
            className="mt-2 px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel"
          >
            Gerar História
          </button>
        </div>
        <div>
          <label className="block text-medieval-gold">Imagem</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="p-2" />
          {hero.image && (
            <img src={hero.image} alt="Prévia" className="w-32 h-32 object-cover mt-2" />
          )}
        </div>
        <button
          type="submit"
          disabled={pointsLeft < 0}
          className="px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel"
        >
          Criar Herói
        </button>
      </form>
    </div>
  );
}