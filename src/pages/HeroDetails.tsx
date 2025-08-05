import { useHero } from '../context/HeroContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function HeroDetails() {
  const { heroes, updateHero } = useHero();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hero = heroes.find((h) => h.id === id);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(hero || {
    id: '',
    name: '',
    class: 'Guerreiro',
    attributes: { strength: 5, dexterity: 5, intelligence: 4, constitution: 4 },
    story: '',
    image: '',
  });

  if (!hero) return <div className="container mx-auto p-4 text-medieval-gold">Herói não encontrado</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(hero.id, formData);
    setEditMode(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    } else {
      alert('A imagem deve ter no máximo 2MB.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-medieval-gold mb-4">
        {editMode ? 'Editar Herói' : hero.name}
      </h1>
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-medieval-gold">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
              required
            />
          </div>
          <div>
            <label className="block text-medieval-gold">Classe</label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
            >
              {['Guerreiro', 'Mago', 'Arqueiro', 'Ladino'].map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-medieval-gold">História</label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              className="w-full p-2 bg-medieval-dark border border-medieval-gold rounded"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-medieval-gold">Imagem</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="p-2" />
            {formData.image && (
              <img src={formData.image} alt="Prévia" className="w-32 h-32 object-cover mt-2" />
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {hero.image && (
            <img src={hero.image} alt={hero.name} className="w-48 h-48 object-cover" />
          )}
          <p className="text-medieval-gold">Nome: {hero.name}</p>
          <p>Classe: {hero.class}</p>
          <p>Força: {hero.attributes?.strength ?? 'N/A'}</p>
          <p>Destreza: {hero.attributes?.dexterity ?? 'N/A'}</p>
          <p>Inteligência: {hero.attributes?.intelligence ?? 'N/A'}</p>
          <p>Constituição: {hero.attributes?.constitution ?? 'N/A'}</p>
          <p>História: {hero.story || 'Nenhuma história fornecida.'}</p>
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-medieval-gold text-medieval-dark rounded hover:bg-yellow-600"
          >
            Editar
          </button>
          <button
            onClick={() => navigate('/gallery')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}