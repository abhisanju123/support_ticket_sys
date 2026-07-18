export function SearchIllustration({ width = 160, height = 140 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="72" cy="64" r="28" fill="#FFF3E0" stroke="#FFB74D" strokeWidth="2" />
      <circle cx="72" cy="64" r="16" stroke="#ED6C02" strokeWidth="3" />
      <path d="M90 82l24 24" stroke="#ED6C02" strokeWidth="4" strokeLinecap="round" />
      <path d="M52 110h56" stroke="#E0E0E0" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 122h40" stroke="#EEEEEE" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
