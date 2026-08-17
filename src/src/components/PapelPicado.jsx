/* Tira de papel picado hecha en SVG puro */
export default function PapelPicado({ color = '#ffffff', opacity = 0.9, flipped = false }) {
  // Un triángulo de papel picado con calados geométricos
  const piece = (x) => (
    <g key={x} transform={`translate(${x}, 0)`}>
      {/* Triángulo base */}
      <polygon
        points="40,0 0,70 80,70"
        fill={color}
        opacity={opacity}
      />
      {/* Calados: círculo central */}
      <circle cx="40" cy="45" r="9" fill="none" stroke={color} strokeWidth="0"
        style={{ mixBlendMode: 'destination-out' }} />
      {/* Se simulan con rect recortados del polígono usando clipPath */}
    </g>
  );

  return (
    <div
      className="papel-picado-banner"
      style={{ transform: flipped ? 'scaleY(-1)' : 'none' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '80px', display: 'block' }}
      >
        <defs>
          {/* Máscara para calados */}
          <mask id="pp-mask">
            <rect width="800" height="80" fill="white" />
            {/* Calados circulares en cada triángulo */}
            {[0,1,2,3,4,5,6,7,8,9].map(i => (
              <g key={i}>
                <circle cx={40 + i * 80} cy={46} r={10} fill="black" />
                <ellipse cx={40 + i * 80} cy={28} rx={5} ry={7} fill="black" />
                <rect x={30 + i * 80} y={56} width={6} height={8} rx={2} fill="black" />
                <rect x={44 + i * 80} y={56} width={6} height={8} rx={2} fill="black" />
                <rect x={18 + i * 80} y={42} width={5} height={5} rx={1} fill="black" transform={`rotate(45,${20.5 + i*80},44.5)`} />
                <rect x={57 + i * 80} y={42} width={5} height={5} rx={1} fill="black" transform={`rotate(45,${59.5 + i*80},44.5)`} />
              </g>
            ))}
          </mask>
        </defs>

        {/* Hilo del que cuelgan */}
        <line x1="0" y1="3" x2="800" y2="3" stroke={color} strokeWidth="1.5" opacity={opacity * 0.6} />

        {/* Triángulos con calados */}
        {[0,1,2,3,4,5,6,7,8,9].map(i => (
          <g key={i} mask="url(#pp-mask)">
            <polygon
              points={`${i*80},4 ${i*80+40},76 ${i*80+80},4`}
              fill={color}
              opacity={opacity}
            />
          </g>
        ))}

        {/* Segunda fila desplazada para relleno */}
        {[-40,0,1,2,3,4,5,6,7,8,9,10].map(i => (
          <polygon
            key={`d${i}`}
            points={`${i*80+40},4 ${i*80+80},76 ${i*80+120},4`}
            fill={color}
            opacity={opacity * 0.35}
          />
        ))}
      </svg>
    </div>
  );
}
