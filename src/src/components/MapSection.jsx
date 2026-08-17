export default function MapSection() {
  const MAPS_PARROQUIA = 'https://maps.google.com/?q=Parroquia+de+la+Asunción,+Chilcuautla,+Hidalgo';
  const MAPS_SALON     = 'https://maps.app.goo.gl/9GiaQxtXNKVWhkhUA';

  return (
    <section className="section map-section" id="ubicacion">
      <div className="section__inner">
        <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
          <span className="section-tag">¿Cómo llegar?</span>
          <h2 className="section-title">Ubicación</h2>
          <p className="section-text">
            Te esperamos en dos lugares especiales para celebrar juntos.
          </p>

          <div className="map-cta-group">
            <a
              href={MAPS_PARROQUIA}
              target="_blank"
              rel="noopener noreferrer"
              className="map-cta"
              id="map-parroquia-btn"
            >
              ⛪ Cómo llegar a la Parroquia
            </a>

            <a
              href={MAPS_SALON}
              target="_blank"
              rel="noopener noreferrer"
              className="map-cta map-cta--secondary"
              id="map-salon-btn"
            >
              🎉 Cómo llegar al Salón
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
