import { useState, useEffect } from 'react';
import parroquiaImg from '../assets/parroquia.png';
import posada1 from '../assets/posada 1.png';
import posada2 from '../assets/posada 2.png';
import posada3 from '../assets/posada 3.png';
import posada4 from '../assets/posada 4.png';
import posada5 from '../assets/posada 5.png';
import posada6 from '../assets/posada 6.png';
import posada7 from '../assets/posada 7.png';

const SALON_PHOTOS = [posada1, posada2, posada3, posada4, posada5, posada6, posada7];
const SALON_MAPS = 'https://maps.app.goo.gl/9GiaQxtXNKVWhkhUA';
const MAPS_PARROQUIA = 'https://maps.google.com/?q=Parroquia+de+la+Asunción,+Chilcuautla,+Hidalgo';

const CHURCH_DESC = `Ubicada en el corazón de Chilcuautla, la Parroquia de la Asunción se erige como un pilar histórico y espiritual para su comunidad. Con una historia que se remonta a finales del siglo XVIII, este templo es un testimonio arquitectónico del paso del tiempo y un lugar de profunda devoción.`;

const DETAILS = [
  { icon: '📅', label: 'Fecha', value: '19 de Septiembre', sub: '2026 · Sábado' },
  {
    id: 'church', icon: '⛪', label: 'Ceremonia', value: 'Parroquia de la Asunción', sub: '11:00 AM',
    hover: 'Chilcuautla, Hidalgo · Click para más info', modal: 'church'
  },
  {
    id: 'salon', icon: '🎉', label: 'Recepción', value: 'Salón Posada Martínez', sub: '1:00 PM',
    hover: 'Click para ver el salón', modal: 'salon'
  },
  { icon: '👗', label: 'Vestimenta', value: 'Como te sientas comodo', sub: 'Tematica: noche mexicana' },
];

/* ── Modal: Parroquia ── */
function ChurchModal({ onClose }) {
  return (
    <div className="church-modal-backdrop" onClick={onClose}>
      <div className="church-modal" onClick={(e) => e.stopPropagation()}>
        <button className="church-modal__close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="church-modal__image-wrap">
          <img src={parroquiaImg} alt="Parroquia de la Asunción" className="church-modal__image" />
          <div className="church-modal__image-overlay">
            <h3 className="church-modal__title">Parroquia de la Asunción</h3>
            <p className="church-modal__location">📍 Chilcuautla, Hidalgo</p>
          </div>
        </div>
        <div className="church-modal__body">
          <p className="church-modal__desc">{CHURCH_DESC}</p>
          <a href={MAPS_PARROQUIA} target="_blank" rel="noopener noreferrer"
            className="church-modal__maps-btn" id="church-maps-btn">
            🗺️ Cómo llegar a la Parroquia
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Modal: Salón (collage dinámico) ── */
function SalonModal({ onClose }) {
  const [active, setActive] = useState(0);

  // Auto-ciclo cada 3.5s
  useEffect(() => {
    const t = setInterval(() =>
      setActive((i) => (i + 1) % SALON_PHOTOS.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="church-modal-backdrop" onClick={onClose}>
      <div className="church-modal salon-modal" onClick={(e) => e.stopPropagation()}>
        <button className="church-modal__close" onClick={onClose} aria-label="Cerrar">✕</button>

        {/* Imagen grande con crossfade */}
        <div className="salon-collage">
          {SALON_PHOTOS.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Salón Posada Martínez ${i + 1}`}
              className={`salon-collage__img ${i === active ? 'salon-collage__img--active' : ''}`}
            />
          ))}
          <div className="salon-collage__overlay">
            <h3 className="church-modal__title">Salón Posada Martínez</h3>
            <p className="church-modal__location">📍 Recepción · 1:00 PM</p>
          </div>
          {/* Indicadores */}
          <div className="salon-dots">
            {SALON_PHOTOS.map((_, i) => (
              <button
                key={i}
                className={`salon-dot ${i === active ? 'salon-dot--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Miniaturas */}
        <div className="salon-thumbs">
          {SALON_PHOTOS.map((src, i) => (
            <button
              key={i}
              className={`salon-thumb ${i === active ? 'salon-thumb--active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setActive(i); }}
              aria-label={`Ver foto ${i + 1}`}
            >
              <img src={src} alt={`Miniatura ${i + 1}`} />
            </button>
          ))}
        </div>

        <div className="church-modal__body">
          <a href={SALON_MAPS} target="_blank" rel="noopener noreferrer"
            className="church-modal__maps-btn" id="salon-maps-btn">
            🗺️ Cómo llegar al Salón
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Componente principal ── */
export default function DetailsSection() {
  const [openModal, setOpenModal] = useState(null); // 'church' | 'salon' | null
  const [hovering, setHovering] = useState(null); // id de la card con hover

  return (
    <>
      {openModal === 'church' && <ChurchModal onClose={() => setOpenModal(null)} />}
      {openModal === 'salon' && <SalonModal onClose={() => setOpenModal(null)} />}

      <section className="section details-section" id="detalles">
        <div className="details-pp-bg" aria-hidden="true" />
        <div className="section__inner">
          <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
            <span className="section-tag">El gran día</span>
            <h2 className="section-title">Detalles del Evento</h2>
            <p className="section-text">
              Nos llena de alegría que puedas acompañarnos en este momento tan especial.
            </p>
          </div>

          <div className="details-grid">
            {DETAILS.map((d, i) => {
              const isInteractive = !!d.modal;
              return (
                <article
                  key={i}
                  className={`detail-card animate-on-scroll ${isInteractive ? 'detail-card--church' : ''}`}
                  style={{ transitionDelay: `${i * 0.12}s` }}
                  onClick={isInteractive ? () => setOpenModal(d.modal) : undefined}
                  onMouseEnter={isInteractive ? () => setHovering(d.id) : undefined}
                  onMouseLeave={isInteractive ? () => setHovering(null) : undefined}
                  role={isInteractive ? 'button' : undefined}
                  tabIndex={isInteractive ? 0 : undefined}
                  onKeyDown={isInteractive ? (e) => e.key === 'Enter' && setOpenModal(d.modal) : undefined}
                >
                  <span className="detail-card__icon">{d.icon}</span>
                  <p className="detail-card__label">{d.label}</p>
                  <p className="detail-card__value">{d.value}</p>
                  <p className="detail-card__sub">{d.sub}</p>

                  {isInteractive && (
                    <div className={`church-tooltip ${hovering === d.id ? 'church-tooltip--visible' : ''}`}>
                      {d.hover}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
