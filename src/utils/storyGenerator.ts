import { Hero } from '../context/HeroContext';

export function generateStory(hero: Hero): string {
  const { name, class: heroClass, attributes } = hero;
  const { strength, dexterity, intelligence, constitution } = attributes;

  // Determina o atributo dominante
  const maxAttribute = Math.max(strength, dexterity, intelligence, constitution);
  let primaryTrait: string;
  if (maxAttribute === strength) {
    primaryTrait = 'força';
  } else if (maxAttribute === dexterity) {
    primaryTrait = 'destreza';
  } else if (maxAttribute === intelligence) {
    primaryTrait = 'inteligência';
  } else {
    primaryTrait = 'constituição';
  }

  // Define variações de história por classe
  const classStories: { [key: string]: { intro: string; challenge: string; resolution: string } } = {
    Guerreiro: {
      intro: name + ', um guerreiro de coração valente, nasceu nas terras ásperas de Eldoria, onde o clangor das espadas ecoa como trovões.',
      challenge:
        primaryTrait === 'força'
          ? 'Com sua força descomunal, ' + name + ' enfrentou o lendário Dragão de Obsidiana, cuja escamas eram impenetráveis.'
          : primaryTrait === 'destreza'
          ? name + ' usou sua agilidade para desviar dos golpes mortais de um exército de orcs em uma emboscada nas Montanhas Sombrias.'
          : primaryTrait === 'inteligência'
          ? name + ' desvendou o enigma ancestral de uma fortaleza amaldiçoada, enganando seus guardiões espectrais.'
          : name + ' resistiu às provações de uma tempestade mágica, protegendo sua vila com sua resistência inabalável.',
      resolution: 'Após uma batalha épica, ' + name + ' emergiu vitorioso, trazendo paz às terras e gravando seu nome nas lendas de Eldoria.',
    },
    Mago: {
      intro: name + ', um mago de sabedoria arcana, foi treinado nas torres místicas de Arcanum, onde o véu entre mundos é tênue.',
      challenge:
        primaryTrait === 'inteligência'
          ? 'Com sua mente brilhante, ' + name + ' decifrou um grimório proibido, liberando um feitiço capaz de selar um portal demoníaco.'
          : primaryTrait === 'destreza'
          ? name + ' manipulou correntes de mana com precisão, desviando um meteoro mágico que ameaçava sua cidade.'
          : primaryTrait === 'força'
          ? name + ' canalizou sua força bruta em um ritual físico, quebrando as correntes de um titã adormecido.'
          : name + ' suportou o peso de um feitiço de exaustão, mantendo o equilíbrio entre luz e trevas.',
      resolution: 'Com sua magia, ' + name + ' restaurou o equilíbrio do reino, sendo reverenciado como um arquimago lendário.',
    },
    Arqueiro: {
      intro: name + ', um arqueiro de olhos aguçados, cresceu nas florestas de Sylvandor, onde cada flecha conta uma história.',
      challenge:
        primaryTrait === 'destreza'
          ? 'Com sua destreza inigualável, ' + name + ' acertou o coração de um wyrm voador com uma única flecha em meio a uma tempestade.'
          : primaryTrait === 'inteligência'
          ? name + ' planejou uma emboscada perfeita, guiando aliados contra um exército invasor com táticas brilhantes.'
          : primaryTrait === 'força'
          ? name + ' tensionou um arco colossal, disparando uma flecha que atravessou as muralhas de uma fortaleza inimiga.'
          : name + ' atravessou pântanos traiçoeiros, resistindo a venenos mortais para salvar seu povo.',
      resolution: 'Com sua precisão, ' + name + ' tornou-se uma lenda entre os arqueiros, sua flecha eternizada em canções.',
    },
    Ladino: {
      intro: name + ', um ladino astuto, nasceu nas ruelas escuras de Nocturna, onde segredos são mais valiosos que ouro.',
      challenge:
        primaryTrait === 'destreza'
          ? 'Com sua agilidade felina, ' + name + ' infiltrou-se no castelo do Rei Corvo, roubando a joia que mantinha sua tirania.'
          : primaryTrait === 'inteligência'
          ? name + ' desvendou os segredos de uma guilda de assassinos, virando suas próprias armadilhas contra eles.'
          : primaryTrait === 'força'
          ? name + ' enfrentou guardas reais em um combate corpo a corpo, abrindo caminho para sua fuga.'
          : name + ' sobreviveu a uma perseguição implacável, resistindo às armadilhas de seus inimigos.',
      resolution: 'Com sua astúcia, ' + name + ' tornou-se uma sombra lendária, temida e respeitada em todo o reino.',
    },
  };

  // Gera a história combinando as partes
  const storyParts = classStories[heroClass] || classStories['Guerreiro'];
  return storyParts.intro + ' ' + storyParts.challenge + ' ' + storyParts.resolution;
}