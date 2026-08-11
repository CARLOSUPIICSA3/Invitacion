export default function MapSection() {
  // Placeholder coordinates – update with actual venue address
  const address = 'Parroquia de San Juan, México';
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  return (
    <section className="section map-section" id="ubicacion">
      <div className="section__inner">
        <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
          <span className="section-tag">¿Cómo llegar?</span>
          <h2 className="section-title">Ubicación</h2>
          <p className="section-text">
            Parroquia de San Juan &mdash; Calle Principal #100, Ciudad, México
          </p>
        </div>

        <div className="map-wrapper animate-on-scroll">
          <iframe
            title="Ubicación del evento"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3aEo&q=Parroquia+de+San+Juan,Mexico"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-cta"
            id="map-directions-btn"
          >
            📍 Abrir en Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
