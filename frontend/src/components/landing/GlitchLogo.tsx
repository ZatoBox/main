import { useState, useEffect } from 'react';

interface GlitchLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function GlitchLogo({
  className = '',
  width = 120,
  height = 40,
}: GlitchLogoProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [showGlitchImage, setShowGlitchImage] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      // 70% de probabilidad de activar el glitch
      if (Math.random() < 0.7) {
        setIsGlitching(true);
        setShowGlitchImage(true);

        // Mostrar el glitch por 5 segundos
        setTimeout(() => {
          setIsGlitching(false);
          setShowGlitchImage(false);
        }, 5000);
      }
    }, 10000); // Cada 10 segundos

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: width, height: height }}
    >
      {/* Logo normal */}
      <img
        src='/logo.png'
        alt='ZatoBox Logo'
        width={width}
        height={height}
        className={`transition-opacity duration-100 ${
          showGlitchImage ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />

      {/* Logo glitch */}
      <img
        src='/Frame%2048095649%20glich.png'
        alt='ZatoBox Logo Glitch'
        width={width}
        height={height}
        className={`absolute top-0 left-0 transition-opacity duration-100 ${
          showGlitchImage ? 'opacity-100' : 'opacity-0'
        } ${isGlitching ? 'animate-glitch' : ''}`}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}
