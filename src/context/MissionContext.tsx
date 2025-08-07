import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Mission {
  id: string;
  description: string;
  completed: boolean;
  reward?: string; // Recompensa opcional (ex.: "100 XP", "Emblema de Valente")
  timestamp?: number; // Para rastrear quando a missão foi completada
}

interface MissionContextType {
  missions: Mission[];
  completeMission: (id: string) => void;
  addMission: (description: string, reward?: string) => void;
  resetMissions: () => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children }: { children: ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const savedMissions = localStorage.getItem('missions');
    return savedMissions
      ? JSON.parse(savedMissions)
      : [
          { id: uuidv4(), description: 'Crie seu primeiro herói', completed: false, reward: 'Emblema de Forjador' },
          { id: uuidv4(), description: 'Vença uma batalha na Arena', completed: false, reward: '100 XP' },
          { id: uuidv4(), description: 'Compartilhe um herói com amigos', completed: false, reward: 'Moeda de Glória' },
          { id: uuidv4(), description: 'Edite um herói na galeria', completed: false, reward: '50 XP' },
        ];
  });

  // Persistir missões no localStorage
  useEffect(() => {
    localStorage.setItem('missions', JSON.stringify(missions));
  }, [missions]);

  // Completar uma missão
  const completeMission = (id: string) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id ? { ...mission, completed: true, timestamp: Date.now() } : mission
      )
    );
  };

  // Adicionar uma nova missão
  const addMission = (description: string, reward?: string) => {
    setMissions((prev) => [
      ...prev,
      { id: uuidv4(), description, completed: false, reward, timestamp: undefined },
    ]);
  };

  // Resetar todas as missões (para testes ou reinício)
  const resetMissions = () => {
    setMissions([
      { id: uuidv4(), description: 'Crie seu primeiro herói', completed: false, reward: 'Emblema de Forjador' },
      { id: uuidv4(), description: 'Vença uma batalha na Arena', completed: false, reward: '100 XP' },
      { id: uuidv4(), description: 'Compartilhe um herói com amigos', completed: false, reward: 'Moeda de Glória' },
      { id: uuidv4(), description: 'Edite um herói na galeria', completed: false, reward: '50 XP' },
    ]);
  };

  return (
    <MissionContext.Provider value={{ missions, completeMission, addMission, resetMissions }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMissionContext() {
  const context = useContext(MissionContext);
  if (!context) throw new Error('useMissionContext must be used within a MissionProvider');
  return context;
}