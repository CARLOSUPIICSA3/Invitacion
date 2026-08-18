import { useState, useEffect } from 'react';
import videoMain from '../assets/completo.mp4';
import videoIntro from '../assets/entrada.mp4';
import videoFiesta from '../assets/celebracion.mp4';
import bgImage from '../assets/background.png';
import lastFrame from '../assets/salida.png';
import parroquiaImg from '../assets/parroquia.png';
import bgMusic from '../assets/musica.aac';
import posada1 from '../assets/posada 1.png';
import posada2 from '../assets/posada 2.png';
import posada3 from '../assets/posada 3.png';
import posada4 from '../assets/posada 4.png';
import posada5 from '../assets/posada 5.png';
import posada6 from '../assets/posada 6.png';
import posada7 from '../assets/posada 7.png';

const ALL_ASSETS = [
  videoMain,
  videoIntro,
  videoFiesta,
  bgMusic,
  bgImage,
  lastFrame,
  parroquiaImg,
  posada1,
  posada2,
  posada3,
  posada4,
  posada5,
  posada6,
  posada7,
];

export default function Preloader({ onEnter }) {
  const [progress, setProgress] = useState(5);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let completed = 0;
    const total = ALL_ASSETS.length;

    const trackProgress = () => {
      completed++;
      const pct = Math.min(100, Math.round((completed / total) * 100));
      setProgress(pct);

      if (completed >= total) {
        setTimeout(() => {
          setIsReady(true);
        }, 300);
      }
    };

    // Precargar todos los archivos binarios (videos, audio, imágenes) en memoria RAM vía Blob URLs
    window.__ASSET_BLOBS__ = window.__ASSET_BLOBS__ || {};

    ALL_ASSETS.forEach((url) => {
      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error('Network error');
          return response.blob();
        })
        .then((blob) => {
          try {
            const objectUrl = URL.createObjectURL(blob);
            window.__ASSET_BLOBS__[url] = objectUrl;
          } catch (e) {}
          trackProgress();
        })
        .catch(() => {
          // Fallback con elementos nativos si fetch tiene alguna restricción
          const img = new Image();
          img.src = url;
          img.onload = trackProgress;
          img.onerror = trackProgress;
        });
    });

    // Temporizador de seguridad por si alguna conexión es lenta
    const fallbackTimer = setTimeout(() => {
      setProgress(100);
      setIsReady(true);
    }, 6000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const handleOpen = () => {
    setIsExiting(true);
    if (onEnter) onEnter();
  };

  return (
    <div className={`preloader-overlay ${isExiting ? 'preloader-overlay--exit' : ''}`}>
      {/* Fondo con papel picado tenue y destellos */}
      <div className="preloader-bg-pattern" aria-hidden="true" />

      {/* Partículas de luz */}
      <div className="preloader-particles" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="preloader-sparkle"
            style={{
              left: `${(i * 8.5) % 100}%`,
              top: `${(i * 13) % 90}%`,
              animationDelay: `${(i * 0.4) % 2.5}s`,
              animationDuration: `${2.5 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="preloader-card">
        {/* Emblema sacro / paloma con halo */}
        <div className="preloader-emblem">
          <span className="preloader-emblem__halo" />
          <span className="preloader-emblem__icon">🕊️</span>
        </div>

        <p className="preloader-eyebrow">Con la bendición de Dios</p>
        <h1 className="preloader-title">Bautizo y primer año</h1>
        <p className="preloader-subtitle">Gibran Maximiliano García Aguilar</p>

        <div className="preloader-divider">
          <span className="preloader-divider__line" />
          <span className="preloader-divider__cross">✝</span>
          <span className="preloader-divider__line" />
        </div>

        {!isReady ? (
          <div className="preloader-loading-wrap">
            <p className="preloader-loading-text">
              Guardando videos y recuerdos en memoria ({progress}%)...
            </p>
            {/* Barra de progreso dorada */}
            <div className="preloader-progress-bar">
              <div
                className="preloader-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="preloader-pct">{progress}%</span>
          </div>
        ) : (
          <div className="preloader-ready-wrap">
            <button
              id="btn-open-invitation"
              className="btn-open-invitation"
              onClick={handleOpen}
            >
              <span className="btn-open-invitation__glow" />
              <span className="btn-open-invitation__icon">✉️</span>
              Abrir Invitación
            </button>
            <p className="preloader-ready-hint">Toca para abrir la invitación con música</p>
          </div>
        )}
      </div>
    </div>
  );
}
