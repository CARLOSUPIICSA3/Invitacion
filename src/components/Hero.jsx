import { useEffect, useRef, useState } from 'react';
import bgImage from '../assets/background.png';
import lastFrame from '../assets/salida.png';
import videoMain from '../assets/completo.mp4';
import videoIntro from '../assets/entrada.mp4';
import videoFiesta from '../assets/celebracion.mp4';

/* ── Partículas flotantes ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 3,
  left: Math.random() * 100,
  bottom: Math.random() * 30,
  dur: (Math.random() * 4 + 4).toFixed(1) + 's',
  delay: (Math.random() * 6).toFixed(1) + 's',
}));

/* ── Confeti que cae sobre el frame ── */
const CONFETTI = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  left: (Math.random() * 100).toFixed(1),
  size: (Math.random() * 9 + 4).toFixed(1),
  dur: (Math.random() * 3 + 2.5).toFixed(1) + 's',
  delay: (Math.random() * 4).toFixed(2) + 's',
  shape: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'circle' : 'diamond',
  opacity: (Math.random() * 0.5 + 0.4).toFixed(2),
  drift: ((Math.random() - 0.5) * 60).toFixed(0) + 'px',
}));

/*
  FASES del componente:
  'main'        → reproduciendo completo.mov  (scroll bloqueado)
  'historia'    → reproduciendo entrada.mov   (scroll bloqueado)
  'unlocked'    → completo terminó, botones visibles, scroll libre
  'celebration' → reproduciendo celebracion.mov (scroll bloqueado)
  'flash'       → destello post-celebración   (scroll libre → auto-scroll)
*/

export default function Hero({ started = true }) {
  const videoRef = useRef(null);

  const [phase, setPhase] = useState('main');
  const [currentSrc, setCurrentSrc] = useState(videoMain);
  const [videoKey, setVideoKey] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [hideCelebra, setHideCelebra] = useState(false); // se oculta al hacer click
  const [isMuted, setIsMuted] = useState(false); // Audio activado por defecto

  /* ── Bloquear / liberar scroll ── */
  const scrollLocked = phase === 'main' || phase === 'historia' || phase === 'celebration' || phase === 'flash';

  useEffect(() => {
    document.documentElement.style.overflow = scrollLocked ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [scrollLocked]);

  /* ── Autoplay del video con audio ── */
  useEffect(() => {
    if (!started) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    v.volume = 1.0;
    v.play().catch(() => {
      v.muted = true;
      setIsMuted(true);
      v.play().catch(() => {});
    });
  }, [videoKey, isMuted, started]);

  /* ── Toggle de sonido manual ── */
  const toggleAudio = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !isMuted;
    v.muted = nextMuted;
    v.volume = 1.0;
    setIsMuted(nextMuted);
  };

  /* ── Handler: video terminó ── */
  const handleEnded = () => {
    if (phase === 'main') {
      // completo.mp4 terminó → liberar scroll, mostrar UI
      setPhase('unlocked');
    } else if (phase === 'historia') {
      // entrada.mp4 terminó → misma UI que completo (salida.png + botones) y reanudar música
      window.dispatchEvent(new CustomEvent('bgmusic-resume'));
      setPhase('unlocked');
    } else if (phase === 'celebration') {
      // celebracion.mp4 terminó → flash de página completa → scroll
      setPhase('flash');
      setShowFlash(true);
      setTimeout(() => {
        document.documentElement.style.overflow = '';
        document.getElementById('bienvenida')?.scrollIntoView({ behavior: 'instant' });
        setTimeout(() => {
          setShowFlash(false);
          setShowRestart(true);
        }, 700);
      }, 500);
    }
  };

  /* ── Reiniciar todo desde el principio ── */
  const restartAll = () => {
    setShowRestart(false);
    setHideCelebra(false);
    setIsMuted(false);
    window.dispatchEvent(new CustomEvent('bgmusic-resume'));
    setCurrentSrc(videoMain);
    setPhase('main');
    setVideoKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Reiniciar el video actual ── */
  const restartVideo = () => {
    setHideCelebra(false);
    setIsMuted(false);
    window.dispatchEvent(new CustomEvent('bgmusic-resume'));
    setCurrentSrc(videoMain);
    setPhase('main');
    setVideoKey((k) => k + 1);
  };

  /* ── Reproducir "Nuestra historia" (pausa la música de fondo) ── */
  const playHistoria = () => {
    window.dispatchEvent(new CustomEvent('bgmusic-pause'));
    setIsMuted(false);
    setCurrentSrc(videoIntro);
    setPhase('historia');
    setVideoKey((k) => k + 1);
  };

  const playCelebracion = () => {
    setShowRestart(false);
    setHideCelebra(true);   // oculta el botón al hacer click
    setIsMuted(false);
    setCurrentSrc(videoFiesta);
    setPhase('celebration');
    setVideoKey((k) => k + 1);
  };

  const showLastFrame = phase === 'unlocked';
  const showConfetti = phase === 'unlocked';
  const showButtons = phase === 'unlocked';
  const showCelebraButton = !hideCelebra && phase !== 'historia' && phase !== 'celebration';

  return (
    <>
      {/* ══ Flash blanco de página completa (fixed) ══ */}
      <div className={`video-flash ${showFlash ? 'video-flash--active' : ''}`} aria-hidden="true" />

      {/* ══ Botón de reinicio flotante (aparece tras celebración) ══ */}
      {showRestart && (
        <button className="btn-restart-all" onClick={restartAll} id="btn-restart-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-4" />
          </svg>
          Volver al inicio
        </button>
      )}
      {/* ══════════════════════════════════════════
          SECCIÓN 1 — Video enmarcado (clip)
      ══════════════════════════════════════════ */}
      <section className="hero-video" id="inicio">

        {/* Fondo difuminado */}
        <div className="hero-video__section-bg" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="hero-video__section-overlay" />

        {/* Partículas de fondo */}
        <div className="hero__particles hero__particles--bg">
          {PARTICLES.map((p) => (
            <div key={p.id} className="particle" style={{
              width: p.size, height: p.size,
              left: `${p.left}%`, bottom: `${p.bottom}%`,
              '--dur': p.dur, '--delay': p.delay,
            }} />
          ))}
        </div>

        {/* ── Escena colgante ── */}
        <div className="clip-scene">
          <div className="clip-string" aria-hidden="true" />
          <div className="clip-hook" aria-hidden="true">
            <div className="clip-hook__body" />
            <div className="clip-hook__arm clip-hook__arm--left" />
            <div className="clip-hook__arm clip-hook__arm--right" />
          </div>

          {/* Marco polaroid */}
          <div className="video-frame">
            <div className="video-frame__inner">

              {/* Poster */}
              <div className="hero__bg-image" style={{ backgroundImage: `url(${bgImage})` }} />

              {/* Video */}
              <video
                key={videoKey}
                ref={videoRef}
                className="hero__video"
                src={window.__ASSET_BLOBS__?.[currentSrc] || currentSrc}
                poster={window.__ASSET_BLOBS__?.[bgImage] || bgImage}
                muted={isMuted}
                playsInline autoPlay preload="auto"
                onEnded={handleEnded}
              />

              {/* Botón de sonido flotante */}
              <button
                className={`btn-sound-toggle ${isMuted ? 'btn-sound-toggle--muted' : ''}`}
                onClick={toggleAudio}
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>

              {/* Último frame de completo.mov (congelado) */}
              <div
                className={`hero__last-frame ${showLastFrame ? 'hero__last-frame--visible' : ''}`}
                style={{ backgroundImage: `url(${lastFrame})` }}
                aria-hidden="true"
              />

              {/* Capa oscura sobre el video (efecto fondo de pantalla) */}
              <div className={`video-overlay ${phase === 'main' ? 'video-overlay--active' : ''}`} aria-hidden="true" />

              {/* Confeti */}
              {showConfetti && (
                <div className="confetti-layer" aria-hidden="true">
                  {CONFETTI.map((c) => (
                    <span key={c.id}
                      className={`confetti-piece confetti-piece--${c.shape}`}
                      style={{
                        left: `${c.left}%`, width: `${c.size}px`, height: `${c.size}px`,
                        opacity: c.opacity,
                        animationDuration: c.dur, animationDelay: c.delay,
                        '--drift': c.drift,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Celebra con nosotros — visible siempre excepto en historia / celebracion */}
              {showCelebraButton && (
                <button
                  id="btn-celebra"
                  className={`btn-celebrate ${showButtons ? 'btn-celebrate--active' : 'btn-celebrate--dim'}`}
                  onClick={playCelebracion}
                >
                  <span className="btn-celebrate__glow" />
                  Celebra con nosotros
                </button>
              )}

              {/* Historia + restart — solo al terminar completo.mp4 */}
              <div className={`video-ui ${showButtons ? 'video-ui--visible' : ''}`}>
                <div className="btn-control-group">
                  <button
                    id="btn-historia"
                    className="btn-historia"
                    onClick={playHistoria}
                    title="Conoce nuestra historia"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Conoce nuestra historia
                  </button>

                  <button
                    id="btn-restart"
                    className="btn-restart"
                    onClick={restartVideo}
                    title="Reproducir de nuevo"
                    aria-label="Reproducir de nuevo"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-4" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>

            {/* Franja inferior polaroid */}
            <div className="video-frame__caption">
              <span className="video-frame__caption-text">Gibran Maximiliano · Bautizo & Primer Año 2026</span>
            </div>
          </div>
        </div>

        {/* Flecha scroll — solo visible cuando scroll está libre */}
        <div className={`hero-video__scroll-hint ${scrollLocked ? 'hidden' : ''}`}>
          <svg viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

      </section>

      {/* ══════════════════════════════════════════
          SECCIÓN 2 — Texto + partículas
      ══════════════════════════════════════════ */}
      <section className="hero-text" id="bienvenida">
        <div className="hero-text__bg" />

        <div className="hero__particles">
          {PARTICLES.map((p) => (
            <div key={p.id} className="particle" style={{
              width: p.size, height: p.size,
              left: `${p.left}%`, bottom: `${p.bottom}%`,
              '--dur': p.dur, '--delay': p.delay,
            }} />
          ))}
        </div>

        <div className="hero__content">
          <p className="hero__eyebrow">Con la bendición de Dios</p>
          <h1 className="hero__title">Gibran Maximiliano<br />García Aguilar</h1>
          <p className="hero__subtitle">Recibe el bautismo y celebra su primer año</p>
          <div className="hero__divider">
            <span className="hero__divider-line" />
            <span className="hero__divider-icon">🕊️</span>
            <span className="hero__divider-line right" />
          </div>
          <div className="hero__date-badge">
            Sábado · 19 de Septiembre, 2026
          </div>

          {/* En compañía de */}
          <div className="hero__family">
            <p className="hero__family-label">En compañía de:</p>
            <div className="hero__family-godmother">
              <span className="hero__family-role">Mi madrina</span>
              <span className="hero__family-name">Josseline Hernandez Angeles</span>
            </div>
            <div className="hero__family-parents">
              <div className="hero__family-member">
                <span className="hero__family-role">Mi papá</span>
                <span className="hero__family-name">Carlos Antonio García Ponce</span>
              </div>
              <div className="hero__family-divider" aria-hidden="true" />
              <div className="hero__family-member">
                <span className="hero__family-role">Mi mamá</span>
                <span className="hero__family-name">Rocio Aguilar Angeles</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__scroll-indicator">
          <span>Ver más</span>
          <svg viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>
    </>
  );
}
