import { Link } from 'react-router-dom';
import { useHeroContext } from '../context/HeroContext';

export default function Gallery() {
  const { heroes, deleteHero } = useHeroContext();

  return (
    <div className="container mx-auto p-4 text-parchment">
      <h1 className="text-3xl font-cinzel text-center mb-6 text-medieval-gold">Galeria de Heróis</h1>
      {heroes.length === 0 ? (
        <p className="text-center text-medieval-gold">
          Nenhum herói criado ainda. Crie um em{' '}
          <Link to="/create-hero" className="underline hover:text-yellow-300">
            Criar Herói
          </Link>
          !
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroes.map((hero) => (
            <div key={hero.id} className="bg-medieval-dark p-4 rounded-lg shadow-lg border border-medieval-gold">
              <h2 className="text-xl font-cinzel text-medieval-gold">{hero.name}</h2>
              <p className="text-medieval-gold">Classe: {hero.class}</p>
              <p className="text-medieval-gold">Nível: {hero.level || 1}</p>
              <Link
                to={`/hero/${hero.id}`}
                className="text-yellow-300 hover:text-yellow-500 font-cinzel underline"
              >
                Ver Detalhes
              </Link>
              <button
                onClick={() => deleteHero(hero.id)}
                className="ml-4 text-red-400 hover:text-red-600 font-cinzel"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}