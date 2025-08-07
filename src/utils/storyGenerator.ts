import { Hero } from '../context/HeroContext';

export function generateStory(hero: Hero): string {
  const { name, class: heroClass, attributes } = hero || { name: 'Herói Desconhecido', class: 'Guerreiro', attributes: { strength: 5, dexterity: 5, intelligence: 4, constitution: 4 } };
  const { strength = 5, dexterity = 5, intelligence = 4, constitution = 4 } = attributes || {};

  const attributesList = [
    { name: 'força', value: strength },
    { name: 'destreza', value: dexterity },
    { name: 'inteligência', value: intelligence },
    { name: 'constituição', value: constitution },
  ];

  const primaryTrait = attributesList.reduce(
    (max, attr) => (attr.value > max.value ? attr : max),
    attributesList[0]
  ).name;

  const classStories: {
    [key: string]: {
      intros: string[];
      challenges: { [trait: string]: string[] };
      resolutions: string[];
    };
  } = {
    Guerreiro: {
      intros: [
        `${name}, um guerreiro de coração valente, nasceu nas terras ásperas de Eldoria, onde o clangor das espadas ecoa como trovões.`,
        `${name}, forjado nas chamas da guerra, é uma lenda nas planícies de Valthor.`,
      ],
      challenges: {
        força: [
          `Com sua força descomunal, ${name} enfrentou o lendário Dragão de Obsidiana, cujas escamas eram impenetráveis.`,
          `${name} derrubou uma muralha de pedra com um único golpe para salvar seus aliados.`,
        ],
        destreza: [
          `${name} usou sua agilidade para desviar dos golpes mortais de um exército de orcs em uma emboscada nas Montanhas Sombrias.`,
          `${name} escalou uma torre em chamas para resgatar um artefato sagrado.`,
        ],
        inteligência: [
          `${name} desvendou o enigma ancestral de uma fortaleza amaldiçoada, enganando seus guardiões espectrais.`,
          `${name} liderou uma estratégia que derrotou um exército invasor.`,
        ],
        constituição: [
          `${name} resistiu às provações de uma tempestade mágica, protegendo sua vila com sua resistência inabalável.`,
          `${name} enfrentou venenos mortais para atravessar o Pântano do Desespero.`,
        ],
      },
      resolutions: [
        `Após uma batalha épica, ${name} emergiu vitorioso, trazendo paz às terras e gravando seu nome nas lendas de Eldoria.`,
        `${name} foi coroado herói do povo, sua bravura cantada por gerações.`,
      ],
    },

    Mago: {
      intros: [
        `${name}, um mago de olhos brilhantes e mente afiada, treinou nos antigos salões da Torre de Althar.`,
        `Diz-se que ${name} nasceu durante uma chuva de estrelas — um presságio do poder mágico que viria a dominar.`,
      ],
      challenges: {
        força: [
          `${name} canalizou a fúria arcana em uma rajada física, destruindo a barreira de um colosso elemental.`,
          `Com sua força interior amplificada por feitiços, ${name} empurrou um obelisco místico de volta ao plano sombrio.`,
        ],
        destreza: [
          `${name} conjurou feitiços rápidos enquanto desviava dos ataques de criaturas etéreas no Labirinto dos Ecos.`,
          `${name} manipulou portais com precisão para escapar de um vórtice de magia caótica.`,
        ],
        inteligência: [
          `${name} decifrou o grimório perdido de Veruun, liberando uma magia esquecida pelos tempos.`,
          `Com astúcia e conhecimento, ${name} selou um demônio antigo usando apenas palavras rúnicas.`,
        ],
        constituição: [
          `${name} manteve um campo mágico ativo por sete dias durante o Cerco de Aelthas.`,
          `${name} resistiu à drenagem de energia do Tomo de Kha'al, protegendo os aprendizes.`,
        ],
      },
      resolutions: [
        `${name} foi elevado ao título de Arquimago, guardião dos segredos do mundo.`,
        `As estrelas brilham mais forte desde que ${name} restaurou o equilíbrio mágico da terra.`,
      ],
    },

    Arqueiro: {
      intros: [
        `${name}, criado nas florestas de Lirael, aprendeu a ouvir o sussurro das folhas e o chamado do vento.`,
        `Dizem que nenhum alvo escapa aos olhos de ${name}, o Arqueiro das Sombras.`,
      ],
      challenges: {
        força: [
          `${name} puxou um arco encantado com tanta força que a flecha atravessou três cavaleiros inimigos.`,
          `${name} segurou sozinho a ponte de Tyran, usando um arco pesado e precisão letal.`,
        ],
        destreza: [
          `${name} disparou flechas enquanto saltava entre galhos, acertando alvos invisíveis aos olhos comuns.`,
          `Com uma pirueta, ${name} desviou de lâminas e lançou uma flecha certeira no coração de um espectro.`,
        ],
        inteligência: [
          `${name} traçou uma emboscada perfeita usando as correntes do vento e o reflexo da lua.`,
          `${name} confundiu seus inimigos com ilusões de som e flechas enfeitiçadas.`,
        ],
        constituição: [
          `${name} aguentou noites frias nas Montanhas da Névoa sem dormir, protegendo sua tropa com vigilância inabalável.`,
          `${name} foi atingido por uma flecha negra, mas continuou lutando até garantir a vitória.`,
        ],
      },
      resolutions: [
        `As florestas voltaram a cantar após a vitória de ${name}, e os animais o seguem como guardião eterno.`,
        `O nome de ${name} ecoa nas árvores, como lenda viva dos elfos e homens.`,
      ],
    },

    Ladino: {
      intros: [
        `${name}, mestre das sombras, surgiu de um passado misterioso nas ruas de Thalnara.`,
        `Poucos viram o rosto de ${name}, mas todos conhecem seus feitos entre os becos escuros e castelos trancados.`,
      ],
      challenges: {
        força: [
          `${name} surpreendeu os inimigos com ataques ágeis e uma força inesperada que quebrou correntes mágicas.`,
          `${name} escalou um penhasco amaldiçoado carregando dois aliados desacordados.`,
        ],
        destreza: [
          `${name} atravessou um salão repleto de armadilhas sem disparar um único mecanismo.`,
          `Com movimentos graciosos, ${name} roubou uma joia encantada do pescoço de um rei demônio.`,
        ],
        inteligência: [
          `${name} desvendou um código secreto que levava ao Tesouro do Imperador Caído.`,
          `${name} manipulou nobres e criminosos com jogos mentais para alcançar seus objetivos.`,
        ],
        constituição: [
          `${name} suportou torturas psíquicas em uma prisão arcana e escapou sem perder a sanidade.`,
          `Mesmo envenenado, ${name} completou sua missão e desapareceu nas sombras.`,
        ],
      },
      resolutions: [
        `Desde então, ${name} é um mito contado pelos ladrões e admirado pelos inocentes salvos em silêncio.`,
        `Seu nome não está nos livros — mas nas lendas sussurradas entre fogueiras.`,
      ],
    },
  };

  const storyParts = classStories[heroClass] || classStories['Guerreiro'];
  const intro = storyParts.intros[Math.floor(Math.random() * storyParts.intros.length)];
  const challenge = storyParts.challenges[primaryTrait][Math.floor(Math.random() * storyParts.challenges[primaryTrait].length)];
  const resolution = storyParts.resolutions[Math.floor(Math.random() * storyParts.resolutions.length)];

  return `${intro} ${challenge} ${resolution}`;
}