import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AudioContextType {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (value: number) => void;
  registerAudio: (audioId: string) => HTMLAudioElement;
  unregisterAudio: (audioId: string) => void;
  startAudio: (audioId: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const audioInstances = {
  ambient: new Audio('/audio/wind-ambient.mp3'),
  battle: new Audio('/audio/battle-theme.mp3'),
  attack: new Audio('/audio/attack.mp3'),
  critical: new Audio('/audio/critical-hit.mp3'),
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [activeAudios, setActiveAudios] = useState<Set<string>>(new Set());

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const setVolumeHandler = (value: number) => {
    if (typeof value === 'number' && isFinite(value) && value >= 0 && value <= 1) {
      setVolume(value);
    } else {
      console.warn('Volume inválido, usando valor padrão 0.5');
      setVolume(0.5);
    }
  };

  const registerAudio = (audioId: string): HTMLAudioElement => {
    if (!activeAudios.has(audioId)) {
      setActiveAudios((prev) => new Set(prev).add(audioId));
    }
    const audio = audioInstances[audioId as keyof typeof audioInstances];
    audio.volume = isMuted ? 0 : volume;
    return audio;
  };

  const unregisterAudio = (audioId: string) => {
    setActiveAudios((prev) => {
      const newSet = new Set(prev);
      newSet.delete(audioId);
      return newSet;
    });
    const audio = audioInstances[audioId as keyof typeof audioInstances];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const startAudio = (audioId: string) => {
    const audio = registerAudio(audioId);
    if (!isMuted && audio.paused) {
      audio.play().catch((e) => console.error(`Erro ao tocar som ${audioId}:`, e));
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      Object.values(audioInstances).forEach((audio) => {
        audio.volume = isMuted ? 0 : volume;
        if (isMuted && !audio.paused) audio.pause();
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isMuted, volume]);

  return (
    <AudioContext.Provider value={{ isMuted, volume, toggleMute, setVolume: setVolumeHandler, registerAudio, unregisterAudio, startAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
}