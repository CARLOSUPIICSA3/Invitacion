import { useState, useEffect, useRef } from 'react';
import bgMusic from '../assets/musica.aac';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.85;

    // 1. Intento de reproducción inmediata desde el segundo cero
    const tryPlay = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Si el navegador bloquea la reproducción automática sin gesto previo
            setIsPlaying(false);
          });
      }
    };

    tryPlay();

    // 2. Si el navegador requiere una primera interacción, reproducir al primer roce/toque/clic
    const unlockAudio = () => {
      if (audio) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            removeListeners();
          })
          .catch(() => {});
      }
    };

    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown'];
    const addListeners = () => {
      events.forEach((evt) => window.addEventListener(evt, unlockAudio, { passive: true }));
    };
    const removeListeners = () => {
      events.forEach((evt) => window.removeEventListener(evt, unlockAudio));
    };

    addListeners();

    // Reintentar cuando el audio cargue sus primeros bytes
    audio.addEventListener('canplaythrough', tryPlay, { once: true });

    // Escuchar eventos globales de pausa/reanudación (ej. al ver video 'entrada')
    const onPauseEvent = () => {
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    const onResumeEvent = () => {
      if (audio) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    window.addEventListener('bgmusic-pause', onPauseEvent);
    window.addEventListener('bgmusic-resume', onResumeEvent);

    return () => {
      removeListeners();
      window.removeEventListener('bgmusic-pause', onPauseEvent);
      window.removeEventListener('bgmusic-resume', onResumeEvent);
    };
  }, []);

  const toggleMusic = (e) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const musicSrc = window.__ASSET_BLOBS__?.[bgMusic] || bgMusic;

  return (
    <>
      <audio
        ref={audioRef}
        src={musicSrc}
        loop
        autoPlay
        playsInline
        preload="auto"
      />

      <button
        className={`music-floating-btn ${isPlaying ? 'music-floating-btn--playing' : ''}`}
        onClick={toggleMusic}
        title={isPlaying ? 'Pausar música de fondo' : 'Reproducir música de fondo'}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      >
        <div className="music-floating-btn__waves" aria-hidden="true">
          <span className="music-wave music-wave--1" />
          <span className="music-wave music-wave--2" />
          <span className="music-wave music-wave--3" />
        </div>
        <span className="music-floating-btn__icon">
          {isPlaying ? '🎵' : '🔇'}
        </span>
        <span className="music-floating-btn__label">
          {isPlaying ? 'Música' : 'Silencio'}
        </span>
      </button>
    </>
  );
}
