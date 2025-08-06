import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Hero {
  id: string;
  name: string;
  class: string;
  level?: number;
  strength?: number;
  agility?: number;
  intelligence?: number;
  attributes?: { strength: number; dexterity: number; intelligence: number; constitution: number };
  story?: string;
  image?: string;
}

interface HeroContextType {
  heroes: Hero[];
  addHero: (hero: Hero) => void;
  updateHero: (hero: Hero) => void;
  deleteHero: (id: string) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export function HeroProvider({ children }: { children: React.ReactNode }) {
  const [heroes, setHeroes] = useState<Hero[]>(() => {
    const savedHeroes = localStorage.getItem('heroes');
    return savedHeroes ? JSON.parse(savedHeroes) : [];
  });

  useEffect(() => {
    localStorage.setItem('heroes', JSON.stringify(heroes));
  }, [heroes]);

  const addHero = (hero: Hero) => {
    setHeroes((prev) => [...prev, { ...hero, id: uuidv4() }]);
  };

  const updateHero = (hero: Hero) => {
    setHeroes((prev) => prev.map((h) => (h.id === hero.id ? hero : h)));
  };

  const deleteHero = (id: string) => {
    setHeroes((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <HeroContext.Provider value={{ heroes, addHero, updateHero, deleteHero }}>
      {children}
    </HeroContext.Provider>
  );
}

export function useHeroContext() {
  const context = useContext(HeroContext);
  if (!context) throw new Error('useHeroContext must be used within a HeroProvider');
  return context;
}