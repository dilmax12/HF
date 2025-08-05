import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Hero {
  id: string;
  name: string;
  class: string;
  attributes: {
    strength: number;
    dexterity: number;
    intelligence: number;
    constitution: number;
  };
  story: string;
  image?: string;
}

interface HeroContextType {
  heroes: Hero[];
  addHero: (hero: Omit<Hero, 'id'>) => void;
  updateHero: (id: string, hero: Omit<Hero, 'id'>) => void;
  deleteHero: (id: string) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export function HeroProvider({ children }: { children: ReactNode }) {
  const [heroes, setHeroes] = useState<Hero[]>(() => {
    const saved = localStorage.getItem('heroes');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      console.log('Heróis carregados do localStorage:', parsed); // Log para depuração
      return Array.isArray(parsed)
        ? parsed.filter((hero: any) =>
            hero.id &&
            hero.name &&
            hero.class &&
            hero.attributes &&
            typeof hero.attributes.strength === 'number' &&
            typeof hero.attributes.dexterity === 'number' &&
            typeof hero.attributes.intelligence === 'number' &&
            typeof hero.attributes.constitution === 'number' &&
            typeof hero.story === 'string'
          )
        : [];
    } catch (e) {
      console.error('Erro ao carregar heróis do localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    console.log('Salvando heróis no localStorage:', heroes); // Log para depuração
    localStorage.setItem('heroes', JSON.stringify(heroes));
  }, [heroes]);

  const addHero = (hero: Omit<Hero, 'id'>) => {
    const newHero = { ...hero, id: uuidv4() };
    console.log('Adicionando herói:', newHero); // Log para depuração
    setHeroes([...heroes, newHero]);
  };

  const updateHero = (id: string, updatedHero: Omit<Hero, 'id'>) => {
    setHeroes(heroes.map((hero) => (hero.id === id ? { ...updatedHero, id } : hero)));
  };

  const deleteHero = (id: string) => {
    setHeroes(heroes.filter((hero) => hero.id !== id));
  };

  return (
    <HeroContext.Provider value={{ heroes, addHero, updateHero, deleteHero }}>
      {children}
    </HeroContext.Provider>
  );
}

export function useHero() {
  const context = useContext(HeroContext);
  if (!context) throw new Error('useHero must be used within a HeroProvider');
  return context;
}