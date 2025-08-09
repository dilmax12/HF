import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

interface AudioState {
  isMuted: boolean;
  volume: number;
  startAudio: (type: string) => void;
  stopAudio: (type: string) => void;
  registerAudio: (type: string) => HTMLAudioElement;
  unregisterAudio: (type: string) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioState | undefined>(undefined);

const audioFiles: { [key: string]: HTMLAudioElement } = {};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>(audioFiles);

  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.muted = isMuted;
      audio.volume = isMuted ? 0 : volume;
    });
  }, [isMuted, volume]);

  const startAudio = (type: string) => {
    if (audioRefs.current[type]) {
      audioRefs.current[type].play().catch((e) => console.error(`Erro ao tocar ${type}:`, e));
    } else {
      const audio = new Audio(`/audio/${type}.mp3`);
      audio.loop = type === 'ambient';
      audio.volume = isMuted ? 0 : volume;
      audioRefs.current[type] = audio;
      audio.play().catch((e) => console.error(`Erro ao tocar ${type}:`, e));
    }
  };

  const stopAudio = (type: string) => {
    if (audioRefs.current[type]) {
      audioRefs.current[type].pause();
      audioRefs.current[type].currentTime = 0;
    }
  };

  const registerAudio = (type: string): HTMLAudioElement => {
    if (!audioRefs.current[type]) {
      const audio = new Audio(`/audio/${type}.mp3`);
      audio.loop = type === 'ambient';
      audio.volume = isMuted ? 0 : volume;
      audioRefs.current[type] = audio;
    }
    return audioRefs.current[type];
  };

  const unregisterAudio = (type: string) => {
    if (audioRefs.current[type]) {
      stopAudio(type);
      delete audioRefs.current[type];
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const setVolumeHandler = (volume: number) => {
    const newVolume = Math.min(1, Math.max(0, volume));
    setVolume(newVolume);
    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = isMuted ? 0 : newVolume;
    });
  };

  return (
    <AudioContext.Provider value={{ isMuted, volume, startAudio, stopAudio, registerAudio, unregisterAudio, toggleMute, setVolume: setVolumeHandler }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioState => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio deve ser usado dentro de um AudioProvider');
  }
  return context;
};