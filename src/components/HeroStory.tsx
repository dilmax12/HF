import React, { useState, useEffect } from 'react';
import { useHeroContext } from '../context/HeroContext';

interface Hero {
  id: string;
  name: string;
  class: string;
  attributes: { strength: number; dexterity: number; intelligence: number; constitution: number };
  story?: string;
  image: string;
  alignment: string;
  objective: string;
  battleCry: string;
}

interface HeroStoryProps {
  hero: Hero;
}

const HeroStory: React.FC<HeroStoryProps> = ({ hero }) => {
  const { updateHero } = useHeroContext();
  const [story, setStory] = useState<string | null>(hero.story || null);
  const [isLoading, setIsLoading] = useState<boolean>(!hero.story);

  useEffect(() => {
    const generateStory = async () => {
      if (hero.story || !hero.name) return; // Evita geração se já houver história ou nome inválido
      setIsLoading(true);
      try {
        const prompt = `Crie uma história épica de fantasia medieval para um herói chamado ${hero.name}, da classe ${hero.class}. 
        Ele tem os seguintes atributos: força ${hero.attributes.strength}, inteligência ${hero.attributes.intelligence} e agilidade ${hero.attributes.dexterity}. 
        Descreva um momento importante da vida desse herói, com linguagem envolvente e tom mítico.`;
        const response = await (window as any).puter.ai.chat(prompt, {
          model: 'x-ai/grok-4',
          stream: true,
        });
        let fullStory = '';
        for await (const part of response) {
          fullStory += part.text;
        }
        setStory(fullStory);
        updateHero({ ...hero, story: fullStory });
      } catch (error) {
        console.error('Erro ao gerar história:', error);
        setStory('Falha ao gerar a história. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    generateStory();
  }, [hero, updateHero]);

  return (
    <div className="p-4 bg-medieval-dark rounded-lg border border-medieval-gold">
      <h2 className="text-2xl font-cinzel text-medieval-gold mb-4">Crônica de {hero.name}</h2>
      {isLoading ? (
        <p className="text-parchment animate-pulse">Tecendo a lenda...</p>
      ) : story ? (
        <p className="text-parchment whitespace-pre-wrap">{story}</p>
      ) : (
        <p className="text-parchment">Nenhuma história gerada ainda.</p>
      )}
    </div>
  );
};

export default HeroStory;