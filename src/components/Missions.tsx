import { useMissionContext } from '../context/MissionContext';
import { motion } from 'framer-motion';

export default function Missions() {
  const { missions, resetMissions } = useMissionContext();

  return (
    <div className="container mx-auto p-4 text-parchment min-h-screen">
      <h1 className="text-3xl font-cinzel text-medieval-gold mb-4 text-center">Missões Épicas</h1>
      <div className="space-y-4 max-w-2xl mx-auto">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            className={`p-4 rounded border ${
              mission.completed ? 'border-green-500 bg-green-900/20' : 'border-medieval-gold'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <p className="text-medieval-gold">
              {mission.description} {mission.completed && '✅'}
              {mission.completed && mission.timestamp && (
                <span className="text-sm text-gray-400">
                  {' '}
                  (Concluída em {new Date(mission.timestamp).toLocaleDateString()})
                </span>
              )}
            </p>
            {mission.reward && (
              <p className="text-sm text-parchment">Recompensa: {mission.reward}</p>
            )}
          </motion.div>
        ))}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetMissions}
          className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-cinzel"
        >
          Reiniciar Missões
        </motion.button>
      </div>
    </div>
  );
}