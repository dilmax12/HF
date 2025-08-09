import { createContext, useContext, useState, ReactNode } from 'react';
import db from '../utils/dbSetup';

export interface Hero {
  id: string;
  name: string;
  race: string;
  class: string;
  attributes: { strength: number; dexterity: number; intelligence: number; constitution: number };
  story?: string;
  image: string;
  xp: number;
  level: number;
  mana: number;
  skills: { name: string; cost: number }[];
  alignment: string;
  objective: string;
  battleCry: string;
}

interface HeroContextType {
  heroes: Hero[];
  addHero: (hero: Omit<Hero, 'id' | 'xp' | 'level' | 'mana' | 'skills' | 'alignment' | 'objective' | 'battleCry' | 'race'> & { race: string }) => void;
  updateHero: (hero: Hero) => void;
  deleteHero: (id: string) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export function HeroProvider({ children }: { children: ReactNode }) {
  const [heroes, setHeroes] = useState<Hero[]>(db.get('heroes').value());

  const addHero = (hero: Omit<Hero, 'id' | 'xp' | 'level' | 'mana' | 'skills' | 'alignment' | 'objective' | 'battleCry' | 'race'> & { race: string }) => {
    const totalPoints = hero.attributes.strength + hero.attributes.dexterity + hero.attributes.intelligence + hero.attributes.constitution;
    if (totalPoints > 18) {
      throw new Error('O total de pontos de atributos não pode exceder 18!');
    }
    const newHero: Hero = {
      ...hero,
      id: crypto.randomUUID(),
      xp: 0,
      level: 1,
      mana: 10,
      skills: getClassSkills(hero.class),
      alignment: 'Leal e Bom',
      objective: 'Justiça',
      battleCry: generateRandomBattleCry(hero.class),
      race: hero.race,
    };
    const updatedHeroes = [...heroes, newHero];
    setHeroes(updatedHeroes);
    db.set('heroes', updatedHeroes).write();
  };

  const updateHero = (hero: Hero) => {
    const totalPoints = hero.attributes.strength + hero.attributes.dexterity + hero.attributes.intelligence + hero.attributes.constitution;
    if (totalPoints > 18) {
      throw new Error('O total de pontos de atributos não pode exceder 18!');
    }
    const updatedHeroes = heroes.map((h) =>
      h.id === hero.id ? { ...h, ...hero, mana: h.mana || 10, skills: h.skills || getClassSkills(hero.class) } : h
    );
    setHeroes(updatedHeroes);
    db.set('heroes', updatedHeroes).write();
  };

  const deleteHero = (id: string) => {
    const updatedHeroes = heroes.filter((h) => h.id !== id);
    setHeroes(updatedHeroes);
    db.set('heroes', updatedHeroes).write();
  };

  const getClassSkills = (className: string): { name: string; cost: number }[] => {
    const skillsMap: { [key: string]: { name: string; cost: number }[] } = {
      Guerreiro: [{ name: 'Golpe Feroz', cost: 3 }],
      Arqueiro: [{ name: 'Tiro Preciso', cost: 2 }],
      Mago: [{ name: 'Rajada Arcana', cost: 4 }],
      Clérigo: [{ name: 'Bênção Divina', cost: 3 }],
      Ladino: [{ name: 'Golpe Furtivo', cost: 2 }],
      Bárbaro: [{ name: 'Fúria Selvagem', cost: 4 }],
      Druida: [{ name: 'Invocação da Natureza', cost: 3 }],
      Cavaleiro: [{ name: 'Ataque Cavalgado', cost: 3 }],
      Feiticeiro: [{ name: 'Explosão Arcana', cost: 4 }],
    };
    return skillsMap[className] || [{ name: 'Ataque Básico', cost: 0 }];
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

  return <HeroContext.Provider value={{ heroes, addHero, updateHero, deleteHero }}>{children}</HeroContext.Provider>;
}

export function useHeroContext() {
  const context = useContext(HeroContext);
  if (!context) throw new Error('useHeroContext must be used within a HeroProvider');
  return context;
}