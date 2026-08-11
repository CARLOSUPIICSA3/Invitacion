import { useState } from 'react';
import parroquiaImg from '../assets/parroquia.png';

const DETAILS = [
  {
    icon: '📅',
    label: 'Fecha',
    value: '19 de Septiembre',
    sub: '2026 · Sábado',
  },
  {
    id: 'church',
    icon: '⛪',
    label: 'Ceremonia',
    value: 'Parroquia de la Asunción',
    sub: '11:00 AM',
    hover: 'Chilcuautla, Hidalgo · Click para más info',
    modal: true,
  },
  {
    icon: '🎉',
    label: 'Recepción',
    value: 'Salón Los Pinos',
    sub: '1:00 PM – 7:00 PM',
  },
  {
    icon: '👗',
    label: 'Vestimenta',
    value: 'Formal',
    sub: 'Colores claros preferidos',
  },
];

const MAPS_URL = 'https://maps.google.com/?q=Parroquia+de+la+Asunci%C3%B3n,+Chilcuautla,+Hidalgo';

const CHURCH_DESC = `Ubicada en el corazón de Chilcuautla, la Parroquia de la Asunción se erige como un pilar histórico y espiritual para su comunidad. Con una historia que se remonta a finales del siglo XVIII, este templo no es solo un lugar de culto, sino también un testimonio arquitectónico del paso del tiempo. La información disponible, tanto de registros históricos como de la percepción de sus visitantes, permite trazar un perfil detallado de sus fortalezas y áreas de oportunidad para quienes deseen visitarla.`;

export default function DetailsSection() {
  const [modalOpen, setModalOpen]   = useState(false);
  const [hovering,  setHovering]    = useState(false);

  return (
    <>
      {/* ── Modal de la parroquia ── */}
      {modalOpen && (
        <div className="church-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="church-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="church-modal__close"
              onClick={() => setModalOpen(false)}
              aria-label="Cerrar"
            >✕</button>

            <div className="church-modal__image-wrap">
              <img src={parroquiaImg} alt="Parroquia de la Asunción" className="church-modal__image" />
              <div className="church-modal__image-overlay">
                <h3 className="church-modal__title">Parroquia de la Asunción</h3>
                <p className="church-modal__location">📍 Chilcuautla, Hidalgo</p>
              </div>
            </div>

            <div className="church-modal__body">
              <p className="church-modal__desc">{CHURCH_DESC}</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="church-modal__maps-btn"
                id="church-maps-btn"
              >
                🗺️ Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>
      )}

      <section className="section details-section" id="detalles">
        {/* Fondo papel picado */}
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
              if (d.modal) {
                return (
                  <article
                    key={i}
                    className="detail-card detail-card--church animate-on-scroll"
                    style={{ transitionDelay: `${i * 0.12}s` }}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    onClick={() => setModalOpen(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)}
                  >
                    <span className="detail-card__icon">{d.icon}</span>
                    <p className="detail-card__label">{d.label}</p>
                    <p className="detail-card__value">{d.value}</p>
                    <p className="detail-card__sub">{d.sub}</p>

                    {/* Tooltip en hover */}
                    <div className={`church-tooltip ${hovering ? 'church-tooltip--visible' : ''}`}>
                      {d.hover}
                    </div>
                  </article>
                );
              }

              return (
                <article
                  className="detail-card animate-on-scroll"
                  key={i}
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <span className="detail-card__icon">{d.icon}</span>
                  <p className="detail-card__label">{d.label}</p>
                  <p className="detail-card__value">{d.value}</p>
                  <p className="detail-card__sub">{d.sub}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
