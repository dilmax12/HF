import { useHero } from '../context/HeroContext';
import { Link } from 'react-router-dom';

export default function Gallery() {
  const { heroes, deleteHero } = useHero();

  console.log('Heróis na galeria:', heroes); // Log para depuração

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-medieval-gold mb-4">Galeria de Heróis</h1>
      {heroes.length === 0 ? (
        <p className="text-medieval-gold">Nenhum herói criado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroes.map((hero) => (
            <div key={hero.id} className="p-4 bg-medieval-dark border border-medieval-gold rounded">
              {hero.image && (
                <img src={hero.image} alt={hero.name} className="w-full h-48 object-cover mb-2" />
              )}
              <h2 className="text-xl text-medieval-gold">{hero.name || 'Sem nome'}</h2>
              <p>Classe: {hero.class || 'Desconhecida'}</p>
              <p>Força: {hero.attributes?.strength ?? 'N/A'}</p>
              <p>Destreza: {hero.attributes?.dexterity ?? 'N/A'}</p>
              <p>Inteligência: {hero.attributes?.intelligence ?? 'N/A'}</p>
              <p>Constituição: {hero.attributes?.constitution ?? 'N/A'}</p>
              <div className="mt-2 space-x-2">
                <Link
                  to={`/hero/${hero.id}`}
                  className="px-2 py-1 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600"
                >
                  Detalhes
                </Link>
                <button
                  onClick={() => confirm('Excluir herói?') && deleteHero(hero.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}