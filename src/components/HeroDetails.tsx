import { useParams, Link } from 'react-router-dom';
import { useHeroContext } from '../context/HeroContext';
import { useMissionContext } from '../context/MissionContext';
import { Helmet } from 'react-helmet';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';

export default function HeroDetails() {
  const { id } = useParams<{ id: string }>();
  const { heroes } = useHeroContext();
  const { missions, completeMission } = useMissionContext();
  const hero = heroes.find((h) => h.id === id);

  const handleShare = async () => {
    try {
      const heroCard = document.querySelector('.hero-card') as HTMLElement;
      const canvas = await html2canvas(heroCard, { scale: 0.5 }); // Otimizado para performance
      const image = canvas.toDataURL('image/png');

      if (navigator.share) {
        await navigator.share({
          title: `Conheça ${hero?.name}, o ${hero?.class}!`,
          text: hero?.story || 'Um herói épico do Forjador de Heróis!',
          url: `${window.location.origin}/hero/${hero?.id}`,
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/hero/${hero?.id}`);
        alert('Link copiado para a área de transferência!');
      }
      completeMission(missions.find((m) => m.description === 'Compartilhe um herói com amigos')?.id || '');
    } catch (e) {
      console.error('Erro ao compartilhar:', e);
      alert('Erro ao compartilhar o herói.');
    }
  };

  if (!hero) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 text-parchment flex flex-col items-center min-h-screen"
      >
        <h1 className="text-4xl font-cinzel text-medieval-gold mb-6 animate-pulse">Herói Não Encontrado</h1>
        <p className="text-lg text-medieval-gold mb-4">O herói com ID {id} não existe.</p>
        <div className="flex space-x-4">
          <Link
            to="/create-hero"
            className="px-6 py-3 bg-medieval-gold text-medieval-dark rounded-lg hover:bg-yellow-600 font-cinzel"
          >
            Criar Novo Herói
          </Link>
          <Link
            to="/gallery"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-cinzel"
          >
            Voltar à Galeria
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 text-parchment min-h-screen"
    >
      <Helmet>
        <meta property="og:title" content={`${hero.name}, o ${hero.class}`} />
        <meta property="og:description" content={hero.story || 'Um herói épico do Forjador de Heróis!'} />
        <meta property="og:image" content={hero.image || '/images/default-hero.png'} />
        <meta property="og:url" content={`${window.location.origin}/hero/${hero.id}`} />
      </Helmet>
      <h1 className="text-4xl font-cinzel text-center mb-8 text-medieval-gold">Detalhes do Herói</h1>
      <motion.div
        className="hero-card bg-medieval-dark p-6 rounded-lg shadow-lg border border-medieval-gold max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-cinzel text-medieval-gold mb-4">{hero.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-medieval-gold"><strong>Classe:</strong> {hero.class}</p>
            <p className="text-medieval-gold"><strong>Nível:</strong> {hero.level || 1}</p>
            <p className="text-medieval-gold"><strong>Força:</strong> {hero.attributes.strength}</p>
            <p className="text-medieval-gold"><strong>Destreza:</strong> {hero.attributes.dexterity}</p>
            <p className="text-medieval-gold"><strong>Inteligência:</strong> {hero.attributes.intelligence}</p>
            <p className="text-medieval-gold"><strong>Constituição:</strong> {hero.attributes.constitution}</p>
          </div>
          {hero.image && (
            <div className="flex justify-center">
              <motion.img
                src={hero.image}
                alt={`${hero.name}'s image`}
                className="w-48 h-48 object-cover rounded-lg shadow-md border border-medieval-gold"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>
        {hero.story && (
          <div className="mt-6">
            <h3 className="text-xl font-cinzel text-medieval-gold mb-2">História</h3>
            <p className="text-parchment italic border-l-4 border-medieval-gold pl-4">{hero.story}</p>
          </div>
        )}
        <div className="mt-6 flex space-x-4">
          <Link
            to="/gallery"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-cinzel"
          >
            Voltar à Galeria
          </Link>
          <Link
            to={`/edit-hero/${hero.id}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-cinzel"
          >
            Editar Herói
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="px-6 py-3 bg-medieval-gold text-medieval-dark rounded-lg font-cinzel"
          >
            Compartilhar
          </motion.button>
        </div>
        <p className="mt-4 text-medieval-gold">
          Desafie {hero.name} na{' '}
          <Link to="/battle" className="underline hover:text-yellow-300">
            Arena de Batalha
          </Link>
          !
        </p>
      </motion.div>
    </motion.div>
  );
}