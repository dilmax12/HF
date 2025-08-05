import { useParams, Link } from 'react-router-dom';
import { useHero } from '../context/HeroContext';
import jsPDF from 'jspdf';

export default function HeroDetails() {
  const { id } = useParams();
  const { heroes } = useHero();

  const hero = heroes.find((h) => h.id === id);

const exportToPDF = () => {
  if (!hero) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Adicionar borda
  doc.setDrawColor('#d4a017');
  doc.rect(10, 10, pageWidth - 20, doc.internal.pageSize.getHeight() - 20);

  // Título
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor('#d4a017');
  doc.text(`${hero.name}, o ${hero.class}`, margin, y, { align: 'center' });
  y += 15;

  // Atributos
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor('#000000');
  doc.text(`Força: ${hero.attributes.strength}`, margin, y);
  y += 10;
  doc.text(`Destreza: ${hero.attributes.dexterity}`, margin, y);
  y += 10;
  doc.text(`Inteligência: ${hero.attributes.intelligence}`, margin, y);
  y += 10;
  doc.text(`Constituição: ${hero.attributes.constitution}`, margin, y);
  y += 15;

  // História
  doc.setFontSize(10);
  const storyLines = doc.splitTextToSize(hero.story, pageWidth - 2 * margin);
  doc.text('História:', margin, y);
  y += 10;
  doc.text(storyLines, margin, y);
  y += storyLines.length * 7 + 10;

  // Imagem
  if (hero.image) {
    try {
      doc.addImage(hero.image, 'PNG', margin, y, 50, 50);
      y += 60;
    } catch (e) {
      console.error('Erro ao adicionar imagem ao PDF:', e);
    }
  }

  doc.save(`${hero.name}_ficha.pdf`);
};

  if (!hero) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-medieval-gold mb-4 font-cinzel">
          Herói não encontrado
        </h1>
        <Link
          to="/gallery"
          className="px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600"
        >
          Voltar para Galeria
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-medieval-gold mb-4 font-cinzel">
        {hero.name}, o {hero.class}
      </h1>
      <div className="bg-medieval-dark border border-medieval-gold rounded p-4">
        {hero.image && (
          <img src={hero.image} alt={hero.name} className="w-48 h-48 object-cover mb-4" />
        )}
        <p className="text-[var(--parchment)]">Força: {hero.attributes.strength}</p>
        <p className="text-[var(--parchment)]">Destreza: {hero.attributes.dexterity}</p>
        <p className="text-[var(--parchment)]">Inteligência: {hero.attributes.intelligence}</p>
        <p className="text-[var(--parchment)]">Constituição: {hero.attributes.constitution}</p>
        <p className="text-[var(--parchment)] mt-4">História:</p>
        <p className="text-[var(--parchment)] whitespace-pre-wrap">{hero.story}</p>
        <div className="mt-4 space-x-2">
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600 font-cinzel"
          >
            Exportar para PDF
          </button>
          <Link
            to="/gallery"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-cinzel"
          >
            Voltar para Galeria
          </Link>
        </div>
      </div>
    </div>
  );
}