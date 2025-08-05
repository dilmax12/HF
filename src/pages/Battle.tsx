import { useState, useEffect } from 'react';
import { useHero } from '../context/HeroContext';
import { useAudio } from '../context/AudioContext';
import { Link } from 'react-router-dom';

interface BattleResult {
  winner: string | null;
  log: string[];
}

export default function Battle() {
  const { heroes } = useHero();
  const { isMuted } = useAudio();
  const [hero1, setHero1] = useState<string | null>(null);
  const [hero2, setHero2] = useState<string | null>(null);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [isBattling, setIsBattling] = useState(false);

  // Inicializar áudio
  const battleSound = new Audio('/audio/sword-clash.mp3');
  battleSound.volume = 0.5;

  useEffect(() => {
    battleSound.muted = isMuted;
  }, [isMuted]);

  const calculateBattle = () => {
    if (!hero1 || !hero2 || hero1 === hero2) {
      alert('Selecione dois heróis diferentes para a batalha!');
      return;
    }

    setIsBattling(true);
    setResult(null);

    // Tocar som da batalha
    if (!isMuted) {
      battleSound.play().catch((e) => console.error('Erro ao tocar som da batalha:', e));
    }

    const h1 = heroes.find((h) => h.id === hero1);
    const h2 = heroes.find((h) => h.id === hero2);

    if (!h1 || !h2) {
      alert('Herói não encontrado!');
      setIsBattling(false);
      return;
    }

    // Modificadores por classe
    const classModifiers: { [key: string]: { strength: number; dexterity: number; intelligence: number; constitution: number } } = {
      Guerreiro: { strength: 1.5, dexterity: 1, intelligence: 0.8, constitution: 1.2 },
      Mago: { strength: 0.8, dexterity: 1, intelligence: 1.5, constitution: 0.9 },
      Arqueiro: { strength: 1, dexterity: 1.5, intelligence: 1, constitution: 1 },
      Ladino: { strength: 0.9, dexterity: 1.4, intelligence: 1.1, constitution: 0.9 },
    };

    // Calcular pontuação por turno (3 turnos)
    const log: string[] = [];
    let h1Health = h1.attributes.constitution * 10;
    let h2Health = h2.attributes.constitution * 10;

    for (let turn = 1; turn <= 3; turn++) {
      const h1Modifiers = classModifiers[h1.class] || { strength: 1, dexterity: 1, intelligence: 1, constitution: 1 };
      const h2Modifiers = classModifiers[h2.class] || { strength: 1, dexterity: 1, intelligence: 1, constitution: 1 };

      const h1Attack =
        (h1.attributes.strength * 2 * h1Modifiers.strength +
          h1.attributes.dexterity * 1.5 * h1Modifiers.dexterity +
          h1.attributes.intelligence * h1Modifiers.intelligence) *
        (0.8 + Math.random() * 0.4);
      const h2Attack =
        (h2.attributes.strength * 2 * h2Modifiers.strength +
          h2.attributes.dexterity * 1.5 * h2Modifiers.dexterity +
          h2.attributes.intelligence * h2Modifiers.intelligence) *
        (0.8 + Math.random() * 0.4);

      const h1Critical = Math.random() < 0.15 ? 1.5 : 1;
      const h2Critical = Math.random() < 0.15 ? 1.5 : 1;

      const h1Damage = h1Attack * h1Critical;
      const h2Damage = h2Attack * h2Critical;

      h2Health -= h1Damage;
      h1Health -= h2Damage;

      const getClassAction = (heroClass: string) => {
        switch (heroClass) {
          case 'Guerreiro': return 'desfere um golpe poderoso com sua espada!';
          case 'Mago': return 'lança um feitiço arcano brilhante!';
          case 'Arqueiro': return 'dispara uma flecha precisa!';
          case 'Ladino': return 'ataca furtivamente das sombras!';
          default: return 'ataca com determinação!';
        }
      };

      log.push(`Turno ${turn}:`);
      log.push(`${h1.name}, o ${h1.class}, ${getClassAction(h1.class)}${h1Critical > 1 ? ' (Golpe Crítico!)' : ''}`);
      log.push(`${h2.name}, o ${h2.class}, ${getClassAction(h2.class)}${h2Critical > 1 ? ' (Golpe Crítico!)' : ''}`);
      log.push(`Vida restante: ${h1.name} (${Math.max(0, h1Health).toFixed(1)}), ${h2.name} (${Math.max(0, h2Health).toFixed(1)})`);
      if (h1Health <= 0 || h2Health <= 0) break;
    }

    // Determinar vencedor
    const winner = h1Health > h2Health ? h1.name : h2Health > h1Health ? h2.name : null;
    log.push(
      winner
        ? `${winner} triunfa gloriosamente na arena!`
        : `A batalha termina em um empate épico entre ${h1.name} e ${h2.name}!`
    );

    // Simular delay para animação e som
    setTimeout(() => {
      setResult({ winner, log });
      setIsBattling(false);
      battleSound.pause();
      battleSound.currentTime = 0;
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-medieval-gold mb-4 font-cinzel">Arena de Batalha</h1>
      {heroes.length < 2 ? (
        <div className="text-medieval-gold">
          <p>Você precisa de pelo menos dois heróis para batalhar!</p>
          <Link
            to="/create-hero"
            className="inline-block mt-2 px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel"
          >
            Criar Herói
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className={`flex-1 ${isBattling ? 'animate-shake' : ''}`}>
              <label className="block text-medieval-gold mb-2">Herói 1</label>
              <select
                value={hero1 || ''}
                onChange={(e) => setHero1(e.target.value)}
                className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
                disabled={isBattling}
              >
                <option value="" disabled>
                  Selecione um herói
                </option>
                {heroes.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {hero.name} ({hero.class})
                  </option>
                ))}
              </select>
            </div>
            <div className={`flex-1 ${isBattling ? 'animate-shake' : ''}`}>
              <label className="block text-medieval-gold mb-2">Herói 2</label>
              <select
                value={hero2 || ''}
                onChange={(e) => setHero2(e.target.value)}
                className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
                disabled={isBattling}
              >
                <option value="" disabled>
                  Selecione um herói
                </option>
                {heroes.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {hero.name} ({hero.class})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={calculateBattle}
            disabled={isBattling}
            className={`px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel ${
              isBattling ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isBattling ? 'Batalhando...' : 'Iniciar Batalha'}
          </button>
          {result && (
            <div className="mt-4 p-4 bg-medieval-dark border border-medieval-gold rounded">
              <h2 className="text-xl text-medieval-gold mb-2 font-cinzel">Resultado da Batalha</h2>
              {result.winner ? (
                <p className="text-medieval-gold">Vencedor: {result.winner}</p>
              ) : (
                <p className="text-medieval-gold">Empate!</p>
              )}
              <div className="mt-2">
                {result.log.map((entry, index) => (
                  <p key={index} className="text-[var(--parchment)]">{entry}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <Link
        to="/gallery"
        className="inline-block mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-cinzel"
      >
        Voltar para Galeria
      </Link>
    </div>
  );
}