import { useState, useEffect, useRef } from 'react';
import { useHeroContext } from '../context/HeroContext';
import { useAudio } from '../context/AudioContext';
import { useMissionContext } from '../context/MissionContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export default function Battle() {
  const { heroes, updateHero } = useHeroContext();
  const { isMuted, startAudio } = useAudio();
  const { missions, generateMission, completeMission } = useMissionContext();
  const [hero1, setHero1] = useState<string | null>(null);
  const [hero2, setHero2] = useState<string | null>(null);
  const [result, setResult] = useState<{ winner: string; log: string[] } | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [h1Health, setH1Health] = useState<number>(0);
  const [h2Health, setH2Health] = useState<number>(0);
  const [h1Mana, setH1Mana] = useState<number>(10);
  const [h2Mana, setH2Mana] = useState<number>(10);
  const isBattleRunning = useRef(false);

  // Inicializar partículas
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  const particlesOptions = {
    particles: {
      number: { value: 20, density: { enable: true, value_area: 800 } },
      color: { value: '#ffd700' },
      shape: { type: 'star', stroke: { width: 0, color: '#000000' } },
      opacity: { value: 0.8, random: true },
      size: { value: 5, random: true },
      move: { enable: true, speed: 6, direction: 'none', random: true, out_mode: 'out' },
    },
    interactivity: { events: { onhover: { enable: false }, onclick: { enable: false } } },
  };

  // Gerenciar sons apenas com interação
  const startBattleSound = () => {
    if (!isMuted && !audioStarted) {
      startAudio('battle');
      setAudioStarted(true);
    }
  };

  const startAmbientSound = () => {
    if (!isMuted && !audioStarted) {
      startAudio('ambient');
      setAudioStarted(true);
    }
  };

  // Gerar missão inicial ao carregar
  useEffect(() => {
    if (hero1 && hero2 && generateMission && heroes.length > 0) {
      const h1 = heroes.find((h) => h.id === hero1);
      if (h1) generateMission(h1);
    }
  }, [hero1, hero2, heroes.length, generateMission]);

  // Lógica de uso de habilidades
  const useSkill = (heroId: string, skillIndex: number) => {
    const hero = heroes.find((h) => h.id === heroId);
    if (!hero || !hero.skills || skillIndex < 0 || skillIndex >= hero.skills.length) return 0;

    const skill = hero.skills[skillIndex];
    const currentMana = heroId === hero1 ? h1Mana : h2Mana;
    if (currentMana < skill.cost) return 0;

    // Definir função effect dinamicamente com base no nome da habilidade
    const getEffect = (skillName: string, h: Hero): number => {
      switch (skillName) {
        case 'Golpe Feroz':
          return h.attributes.strength * 2;
        case 'Rajada Arcana':
          return h.attributes.intelligence * 3;
        case 'Tiro Preciso':
          return h.attributes.dexterity * 1.5;
        default:
          return h.attributes.strength; // Fallback para ataque básico
      }
    };

    const damage = getEffect(skill.name, hero);
    if (heroId === hero1) {
      setH1Mana((prev) => Math.max(0, prev - skill.cost));
    } else {
      setH2Mana((prev) => Math.max(0, prev - skill.cost));
    }
    return damage;
  };

  // Lógica de batalha
  const calculateBattle = () => {
    if (!hero1 || !hero2 || isBattleRunning.current) return;

    const h1 = heroes.find((h) => h.id === hero1)!;
    const h2 = heroes.find((h) => h.id === hero2)!;

    isBattleRunning.current = true;
    setBattleLog([]);
    setResult(null);
    setCurrentTurn(0);
    setH1Health(h1.attributes.constitution * 10);
    setH2Health(h2.attributes.constitution * 10);
    setH1Mana(h1.mana || 10);
    setH2Mana(h2.mana || 10);
    startBattleSound();

    const log: string[] = [];
    let tempH1Health = h1.attributes.constitution * 10;
    let tempH2Health = h2.attributes.constitution * 10;

    const simulateTurn = (turn: number) => {
      if (tempH1Health <= 0 || tempH2Health <= 0 || turn > 50) {
        const winner = tempH1Health > tempH2Health ? h1 : h2;
        log.push(`${winner.name} vence a batalha!`);
        setBattleLog([...log]);
        setResult({ winner: winner.name, log });

        const updatedHeroes = heroes.map((hero) =>
          hero.id === winner.id
            ? {
                ...hero,
                xp: (hero.xp || 0) + 50,
                level: Math.floor(((hero.xp || 0) + 50) / 100) + 1,
                mana: Math.min(20, (hero.mana || 10) + 5),
                attributes: Math.floor(((hero.xp || 0) + 50) / 100) > hero.level
                  ? {
                      ...hero.attributes,
                      strength: Math.min(10, hero.attributes.strength + 1),
                      dexterity: Math.min(10, hero.attributes.dexterity + 1),
                      intelligence: Math.min(10, hero.attributes.intelligence + 1),
                      constitution: Math.min(10, hero.attributes.constitution + 1),
                    }
                  : hero.attributes,
              }
            : hero
        );
        updateHero(updatedHeroes.find((h) => h.id === winner.id)!);

        const activeMission = missions.find((m) => !m.completed);
        if (activeMission) {
          const winnerAttr = winner.attributes;
          const meetsRequirement = activeMission.description.includes('força')
            ? winnerAttr.strength > parseInt(activeMission.description.split('>')[1])
            : activeMission.description.includes('constituição')
            ? winnerAttr.constitution > parseInt(activeMission.description.split('>')[1])
            : activeMission.description.includes('destreza')
            ? winnerAttr.dexterity > parseInt(activeMission.description.split('>')[1])
            : activeMission.description.includes('inteligência')
            ? winnerAttr.intelligence > parseInt(activeMission.description.split('>')[1])
            : false;
          if (meetsRequirement) {
            completeMission(activeMission.id);
            log.push(`Missão "${activeMission.description}" completada! +${activeMission.reward} XP`);
            setBattleLog([...log]);
            updateHero({ ...winner, xp: (winner.xp || 0) + activeMission.reward });
          }
        }

        isBattleRunning.current = false;
        return;
      }

      const h1HitChance = Math.max(0.2, h1.attributes.dexterity / 20);
      const h2HitChance = Math.max(0.2, h2.attributes.dexterity / 20);
      const h1Crit = Math.random() < h1.attributes.dexterity / 100 ? 2 : 1;
      const h2Crit = Math.random() < h2.attributes.dexterity / 100 ? 2 : 1;

      const useH1Skill = Math.random() < 0.3 && h1Mana >= (h1.skills?.[0]?.cost || 0);
      const useH2Skill = Math.random() < 0.3 && h2Mana >= (h2.skills?.[0]?.cost || 0);

      if (!isMuted) {
        startAudio(useH1Skill || useH2Skill ? 'critical' : h1Crit > 1 || h2Crit > 1 ? 'critical' : 'attack');
      }

      if (useH1Skill) {
        const skillDamage = useSkill(hero1, 0);
        if (skillDamage > 0) {
          tempH2Health -= skillDamage;
          setH2Health(tempH2Health);
          log.push(`${h1.name} usa ${h1.skills![0].name} causando ${skillDamage} de dano a ${h2.name} (Mana: ${h1Mana - (h1.skills![0].cost || 0)})`);
        }
      } else if (Math.random() < h1HitChance) {
        const h1Damage = Math.max(1, Math.floor(h1.attributes.strength * (Math.random() * 0.5 + 0.5) * h1Crit * (1 + h1.attributes.intelligence / 20)));
        if (h1Damage > 0) {
          tempH2Health -= h1Damage;
          setH2Health(tempH2Health);
          log.push(`${h1.name} ${h1Crit > 1 ? 'acerta um golpe crítico' : 'ataca'} causando ${h1Damage} de dano a ${h2.name} (Vida restante: ${Math.max(0, tempH2Health)})`);
        }
      } else {
        log.push(`${h1.name} erra o ataque contra ${h2.name}`);
      }

      if (tempH2Health > 0 && useH2Skill) {
        const skillDamage = useSkill(hero2, 0);
        if (skillDamage > 0) {
          tempH1Health -= skillDamage;
          setH1Health(tempH1Health);
          log.push(`${h2.name} usa ${h2.skills![0].name} causando ${skillDamage} de dano a ${h1.name} (Mana: ${h2Mana - (h2.skills![0].cost || 0)})`);
        }
      } else if (tempH2Health > 0 && Math.random() < h2HitChance) {
        const h2Damage = Math.max(1, Math.floor(h2.attributes.strength * (Math.random() * 0.5 + 0.5) * h2Crit * (1 + h2.attributes.intelligence / 20)));
        if (h2Damage > 0) {
          tempH1Health -= h2Damage;
          setH1Health(tempH1Health);
          log.push(`${h2.name} ${h2Crit > 1 ? 'acerta um golpe crítico' : 'ataca'} causando ${h2Damage} de dano a ${h1.name} (Vida restante: ${Math.max(0, tempH1Health)})`);
        }
      } else if (tempH2Health > 0) {
        log.push(`${h2.name} erra o ataque contra ${h1.name}`);
      }

      setBattleLog([...log]);
      setCurrentTurn(turn + 1);
      setTimeout(() => simulateTurn(turn + 1), 1500);
    };

    simulateTurn(0);
  };

  const renderHealthBar = (health: number, maxHealth: number, name: string) => (
    <div className="w-full bg-gray-700 h-4 rounded mt-2 relative">
      <motion.div
        className="bg-red-600 h-full rounded"
        initial={{ width: '100%' }}
        animate={{ width: `${(health / maxHealth) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
      <span className="absolute top-0 left-2 text-xs text-white">{`${name}: ${Math.max(0, health)}/${maxHealth}`}</span>
    </div>
  );

  const renderManaBar = (mana: number, maxMana: number, name: string) => (
    <div className="w-full bg-gray-700 h-2 rounded mt-1 relative">
      <motion.div
        className="bg-blue-500 h-full rounded"
        initial={{ width: '100%' }}
        animate={{ width: `${(mana / maxMana) * 100}%` }}
        transition={{ duration: 0.3 }}
      />
      <span className="absolute top-0 left-2 text-xs text-white">{`${name} Mana: ${Math.max(0, mana)}/${maxMana}`}</span>
    </div>
  );

  return (
    <div className="container mx-auto p-4 text-parchment min-h-screen relative">
      <h1 className="text-3xl font-cinzel text-medieval-gold text-center mb-6">Arena de Batalha</h1>
      {!audioStarted && !isMuted && (
        <div className="text-center mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startBattleSound}
            className="mr-2 px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel"
          >
            Ativar Som de Batalha
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startAmbientSound}
            className="px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel"
          >
            Ativar Som Ambiente
          </motion.button>
        </div>
      )}
      {heroes.length < 2 ? (
        <div className="text-center">
          <p className="text-medieval-gold mb-4">Você precisa de pelo menos 2 heróis para batalhar!</p>
          <Link
            to="/create-hero"
            className="px-6 py-3 bg-medieval-gold text-medieval-dark rounded-lg hover:bg-yellow-600 font-cinzel"
          >
            Criar Herói
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-medieval-gold mb-2">Herói 1</label>
              <select
                value={hero1 || ''}
                onChange={(e) => setHero1(e.target.value)}
                className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
              >
                <option value="" disabled>
                  Escolha um herói
                </option>
                {heroes.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {hero.name} ({hero.class}) - Nível {hero.level}
                  </option>
                ))}
              </select>
              {hero1 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-2 relative"
                >
                  <img
                    src={heroes.find((h) => h.id === hero1)?.image || '/images/default-hero.png'}
                    alt={heroes.find((h) => h.id === hero1)?.name}
                    className="w-24 h-24 object-cover rounded-lg border border-medieval-gold mx-auto"
                  />
                  {battleLog.length > 0 && battleLog[battleLog.length - 1]?.includes(heroes.find((h) => h.id === hero1)?.name || '') && battleLog[battleLog.length - 1]?.includes('crítico') && (
                    <Particles id="tsparticles-h1" options={particlesOptions} init={particlesInit} className="absolute inset-0" />
                  )}
                  {renderHealthBar(h1Health, heroes.find((h) => h.id === hero1)?.attributes.constitution * 10 || 40, heroes.find((h) => h.id === hero1)?.name || '')}
                  {renderManaBar(h1Mana, 20, heroes.find((h) => h.id === hero1)?.name || '')}
                </motion.div>
              )}
            </div>
            <div>
              <label className="block text-medieval-gold mb-2">Herói 2</label>
              <select
                value={hero2 || ''}
                onChange={(e) => setHero2(e.target.value)}
                className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
              >
                <option value="" disabled>
                  Escolha um herói
                </option>
                {heroes.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {hero.name} ({hero.class}) - Nível {hero.level}
                  </option>
                ))}
              </select>
              {hero2 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-2 relative"
                >
                  <img
                    src={heroes.find((h) => h.id === hero2)?.image || '/images/default-hero.png'}
                    alt={heroes.find((h) => h.id === hero2)?.name}
                    className="w-24 h-24 object-cover rounded-lg border border-medieval-gold mx-auto"
                  />
                  {battleLog.length > 0 && battleLog[battleLog.length - 1]?.includes(heroes.find((h) => h.id === hero2)?.name || '') && battleLog[battleLog.length - 1]?.includes('crítico') && (
                    <Particles id="tsparticles-h2" options={particlesOptions} init={particlesInit} className="absolute inset-0" />
                  )}
                  {renderHealthBar(h2Health, heroes.find((h) => h.id === hero2)?.attributes.constitution * 10 || 40, heroes.find((h) => h.id === hero2)?.name || '')}
                  {renderManaBar(h2Mana, 20, heroes.find((h) => h.id === hero2)?.name || '')}
                </motion.div>
              )}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={calculateBattle}
            disabled={!hero1 || !hero2 || isBattleRunning.current}
            className="px-6 py-3 bg-medieval-gold text-medieval-dark rounded-lg hover:bg-yellow-600 font-cinzel disabled:opacity-50"
          >
            Iniciar Batalha
          </motion.button>
          {battleLog.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-4 bg-medieval-dark border border-medieval-gold rounded"
            >
              <h2 className="text-xl text-medieval-gold mb-2 font-cinzel">Log da Batalha</h2>
              {result && <p className="text-medieval-gold font-bold">Vencedor: {result.winner}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {hero1 && (
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-medieval-gold">{heroes.find((h) => h.id === hero1)?.name} (Nível {heroes.find((h) => h.id === hero1)?.level})</p>
                    {renderHealthBar(h1Health, heroes.find((h) => h.id === hero1)?.attributes.constitution * 10 || 40, heroes.find((h) => h.id === hero1)?.name || '')}
                    {renderManaBar(h1Mana, 20, heroes.find((h) => h.id === hero1)?.name || '')}
                  </motion.div>
                )}
                {hero2 && (
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-medieval-gold">{heroes.find((h) => h.id === hero2)?.name} (Nível {heroes.find((h) => h.id === hero2)?.level})</p>
                    {renderHealthBar(h2Health, heroes.find((h) => h.id === hero2)?.attributes.constitution * 10 || 40, heroes.find((h) => h.id === hero2)?.name || '')}
                    {renderManaBar(h2Mana, 20, heroes.find((h) => h.id === hero2)?.name || '')}
                  </motion.div>
                )}
              </div>
              <div className="mt-4 max-h-40 overflow-y-auto bg-gray-800 p-2 rounded">
                {battleLog.map((entry, index) => (
                  <motion.p
                    key={index}
                    className="text-sm text-parchment"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {entry}
                  </motion.p>
                ))}
              </div>
              {result && (
                <p className="mt-4 text-medieval-gold">
                  Compartilhe a vitória de {result.winner} com seus amigos na{' '}
                  <Link to={`/hero/${heroes.find((h) => h.name === result.winner)?.id}`} className="underline hover:text-yellow-300">
                    página do herói
                  </Link>
                  !
                </p>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}