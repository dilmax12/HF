import { useParams, Link } from 'react-router-dom';
import { useHeroContext } from '../context/HeroContext';

export default function HeroDetails() {
  // Obter o ID do herói da URL
  const { id } = useParams<{ id: string }>();
  const { heroes } = useHeroContext();
  const hero = heroes.find((h) => h.id === id);

  // Caso o herói não seja encontrado
  if (!hero) {
    return (
      <div className="container mx-auto p-4 text-parchment flex flex-col items-center min-h-screen">
        <h1 className="text-4xl font-cinzel text-medieval-gold mb-6 animate-pulse">Herói Não Encontrado</h1>
        <p className="text-lg text-medieval-gold mb-4">O herói com ID {id} não existe.</p>
        <Link
          to="/create-hero"
          className="px-6 py-3 bg-medieval-gold text-medieval-dark rounded-lg hover:bg-yellow-600 transition duration-300 font-cinzel"
        >
          Criar Novo Herói
        </Link>
        <Link
          to="/gallery"
          className="mt-4 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 font-cinzel"
        >
          Voltar à Galeria
        </Link>
      </div>
    );
  }

  // Renderizar detalhes do herói
  return (
    <div className="container mx-auto p-4 text-parchment min-h-screen">
      <h1 className="text-4xl font-cinzel text-center mb-8 text-medieval-gold">Detalhes do Herói</h1>
      <div className="bg-medieval-dark p-6 rounded-lg shadow-lg border border-medieval-gold max-w-2xl mx-auto">
        <h2 className="text-3xl font-cinzel text-medieval-gold mb-4">{hero.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-medieval-gold"><strong>Classe:</strong> {hero.class}</p>
            <p className="text-medieval-gold"><strong>Nível:</strong> {hero.level || '1'}</p>
            <p className="text-medieval-gold"><strong>Força:</strong> {hero.strength || 'N/A'}</p>
            <p className="text-medieval-gold"><strong>Agilidade:</strong> {hero.agility || 'N/A'}</p>
            <p className="text-medieval-gold"><strong>Inteligência:</strong> {hero.intelligence || 'N/A'}</p>
          </div>
          {hero.image && (
            <div className="flex justify-center">
              <img
                src={hero.image}
                alt={`${hero.name}'s image`}
                className="w-48 h-48 object-cover rounded-lg shadow-md border border-medieval-gold"
              />
            </div>
          )}
        </div>
        {hero.story && (
          <div className="mt-6">
            <h3 className="text-xl font-cinzel text-medieval-gold mb-2">História</h3>
            <p className="text-[var(--parchment)] italic border-l-4 border-medieval-gold pl-4">{hero.story}</p>
          </div>
        )}
        <Link
          to="/gallery"
          className="mt-6 inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 font-cinzel"
        >
          Voltar à Galeria
        </Link>
      </div>
    </div>
  );
}