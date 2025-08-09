import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Mission {
  id: string;
  description: string;
  completed: boolean;
  reward?: string;
  timestamp?: number;
}

interface MissionContextType {
  missions: Mission[];
  completeMission: (id: string) => void;
  addMission: (description: string, reward?: string) => void;
  resetMissions: () => void;
  generateMission: () => void;
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

  useEffect(() => {
    localStorage.setItem('missions', JSON.stringify(missions));
  }, [missions]);

  const completeMission = (id: string) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id ? { ...mission, completed: true, timestamp: Date.now() } : mission
      )
    );
  };

  const addMission = (description: string, reward?: string) => {
    setMissions((prev) => [
      ...prev,
      { id: uuidv4(), description, completed: false, reward, timestamp: undefined },
    ]);
  };

  const resetMissions = () => {
    setMissions([
      { id: uuidv4(), description: 'Crie seu primeiro herói', completed: false, reward: 'Emblema de Forjador' },
      { id: uuidv4(), description: 'Vença uma batalha na Arena', completed: false, reward: '100 XP' },
      { id: uuidv4(), description: 'Compartilhe um herói com amigos', completed: false, reward: 'Moeda de Glória' },
      { id: uuidv4(), description: 'Edite um herói na galeria', completed: false, reward: '50 XP' },
    ]);
  };

  const generateMission = () => {
    const attributes = ['força', 'destreza', 'inteligência', 'constituição'];
    const randomAttr = attributes[Math.floor(Math.random() * attributes.length)];
    const randomValue = Math.floor(Math.random() * 10) + 1;
    const newMission = {
      id: uuidv4(),
      description: `Derrote um inimigo com ${randomAttr} > ${randomValue}`,
      completed: false,
      reward: `${50 + Math.floor(Math.random() * 50)} XP`,
    };
    setMissions((prev) => [...prev, newMission]);
  };

  return (
    <MissionContext.Provider value={{ missions, completeMission, addMission, resetMissions, generateMission }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMissionContext() {
  const context = useContext(MissionContext);
  if (!context) throw new Error('useMissionContext must be used within a MissionProvider');
  return context;
}