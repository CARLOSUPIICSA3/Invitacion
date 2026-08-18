import { useEffect, useState } from 'react';

const EVENT_DATE = new Date('2026-09-19T11:00:00');

function pad(n) {
  return String(n).padStart(2, '0');
}

function getTimeLeft() {
  const diff = EVENT_DATE - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);
  return { days, hours, minutes, seconds };
}

const UNITS = [
  { key: 'days',    label: 'Días' },
  { key: 'hours',   label: 'Horas' },
  { key: 'minutes', label: 'Minutos' },
  { key: 'seconds', label: 'Segundos' },
];

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section countdown-section" id="cuenta-regresiva">
      <div className="section__inner">
        <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
          <span className="section-tag">Faltan</span>
          <h2 className="section-title">Cuenta Regresiva</h2>
        </div>

        <div className="countdown-grid">
          {UNITS.map(({ key, label }) => (
            <div className="countdown-block animate-on-scroll" key={key}>
              <span className="countdown-number">{pad(time[key])}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
