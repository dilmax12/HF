import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';
import type { ISourceOptions } from '@tsparticles/engine';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/gallery');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const particlesOptions: ISourceOptions = {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: '#ffd700' },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 2, direction: 'none', random: true, out_mode: 'out' },
    },
    interactivity: { events: { onhover: { enable: false }, onclick: { enable: false } } },
    background: { color: { value: 'transparent' } },
    autoPlay: true,
  };

  return (
    <div className="relative min-h-screen bg-medieval-dark flex items-center justify-center overflow-hidden">
      <Particles id="tsparticles" options={particlesOptions} init={particlesInit} className="absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <h1 className="text-5xl font-cinzel text-medieval-gold mb-8">Forjador de Heróis</h1>
        <motion.img
          src="/images/shield.png"
          alt="Escudo"
          className="w-32 h-32 mx-auto"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        <motion.img
          src="/images/sword.png"
          alt="Espada"
          className="w-32 h-32 mx-auto mt-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />
        <p className="text-parchment mt-4">Prepare-se para forjar lendas!</p>
      </motion.div>
    </div>
  );
}