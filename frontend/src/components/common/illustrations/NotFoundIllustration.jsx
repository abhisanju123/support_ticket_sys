export function NotFoundIllustration({ width = 160, height = 140 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="80" cy="70" r="44" fill="#E3F2FD" stroke="#64B5F6" strokeWidth="2" />
      <text x="80" y="82" textAnchor="middle" fontSize="28" fontWeight="700" fill="#1565C0">
        404
      </text>
      <path d="M34 118c12-10 28-16 46-16s34 6 46 16" stroke="#90CAF9" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
