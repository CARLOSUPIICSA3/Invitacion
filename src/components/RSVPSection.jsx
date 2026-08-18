import { useState } from 'react';

export default function RSVPSection() {
  const [form, setForm] = useState({ name: '', guests: '1', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate async submission (replace with real API call)
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="section rsvp-section" id="confirmacion">
      <div className="section__inner">
        <div className="animate-on-scroll">
          <span className="section-tag" style={{ color: 'var(--color-gold-light)' }}>
            Confirmación
          </span>
          <h2 className="section-title">¿Podrás acompañarnos?</h2>
          <p className="section-text">
            Por favor confirma tu asistencia antes del <strong>7 de Septiembre de 2026</strong>.
          </p>
        </div>

        {submitted ? (
          <div className="rsvp-success animate-on-scroll">
            <span className="rsvp-success__icon">🎉</span>
            <h3 className="rsvp-success__title">¡Gracias, {form.name}!</h3>
            <p className="rsvp-success__text">
              Hemos registrado tu confirmación. ¡Nos veremos pronto para celebrar juntos!
            </p>
          </div>
        ) : (
          <form className="rsvp-form animate-on-scroll" onSubmit={handleSubmit} id="rsvp-form">
            <input
              id="rsvp-name"
              type="text"
              name="name"
              placeholder="Tu nombre completo"
              value={form.name}
              onChange={handleChange}
              required
            />
            <select
              id="rsvp-guests"
              name="guests"
              value={form.guests}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'persona' : 'personas'}
                </option>
              ))}
            </select>
            <textarea
              id="rsvp-message"
              name="message"
              placeholder="Déjanos un mensaje para Gibran (opcional)"
              rows={3}
              value={form.message}
              onChange={handleChange}
            />
            <button
              id="rsvp-submit"
              type="submit"
              className="rsvp-btn"
              disabled={loading}
            >
              {loading ? 'Enviando...' : '✉️ Confirmar Asistencia'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
