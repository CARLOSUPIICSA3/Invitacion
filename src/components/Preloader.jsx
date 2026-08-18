import { useState, useEffect } from 'react';
import videoMain from '../assets/completo.mp4';
import videoIntro from '../assets/entrada.mp4';
import videoFiesta from '../assets/celebracion.mp4';
import bgImage from '../assets/background.png';
import lastFrame from '../assets/salida.png';
import parroquiaImg from '../assets/parroquia.png';
import bgMusic from '../assets/musica.mp3';

export default function Preloader({ onEnter }) {
  const [progress, setProgress] = useState(12);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const assetsToLoad = [
      { type: 'image', src: bgImage },
      { type: 'image', src: lastFrame },
      { type: 'image', src: parroquiaImg },
      { type: 'audio', src: bgMusic },
      { type: 'video', src: videoMain },
      { type: 'video', src: videoIntro },
      { type: 'video', src: videoFiesta },
    ];

    const totalAssets = assetsToLoad.length;

    const updateProgress = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / totalAssets) * 90) + 10);
      setProgress(pct);
      if (loadedCount >= totalAssets) {
        setTimeout(() => {
          setProgress(100);
          setIsReady(true);
        }, 400);
      }
    };

    // Preload images
    assetsToLoad.forEach((asset) => {
      if (asset.type === 'image') {
        const img = new Image();
        img.src = asset.src;
        img.onload = updateProgress;
        img.onerror = updateProgress;
      } else if (asset.type === 'audio') {
        const aud = new Audio();
        aud.src = asset.src;
        aud.preload = 'auto';
        aud.oncanplaythrough = () => {
          updateProgress();
          aud.oncanplaythrough = null;
        };
        aud.onerror = updateProgress;
        aud.load();
      } else if (asset.type === 'video') {
        const vid = document.createElement('video');
        vid.src = asset.src;
        vid.preload = 'auto';
        vid.oncanplaythrough = () => {
          updateProgress();
          vid.oncanplaythrough = null;
        };
        vid.onerror = updateProgress;
        vid.load();
      }
    });

    // Fallback timer: ensure ready within 3.5s even if connection is slow
    const fallbackTimer = setTimeout(() => {
      setProgress(100);
      setIsReady(true);
    }, 3800);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const handleOpen = () => {
    setIsExiting(true);
    if (onEnter) onEnter();
    setTimeout(() => {
      // Allow unmounting or opacity transition
    }, 800);
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
        <h1 className="preloader-title">Bautizo y primer año </h1>
        <p className="preloader-subtitle">Gibran Maximiliano García Aguilar</p>

        <div className="preloader-divider">
          <span className="preloader-divider__line" />
          <span className="preloader-divider__cross">✝</span>
          <span className="preloader-divider__line" />
        </div>

        {!isReady ? (
          <div className="preloader-loading-wrap">
            <p className="preloader-loading-text">
              Preparando bendiciones y recuerdos...
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
