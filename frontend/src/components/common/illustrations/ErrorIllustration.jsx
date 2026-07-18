export function ErrorIllustration({ width = 160, height = 140 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M80 24l56 96H24L80 24z"
        fill="#FFEBEE"
        stroke="#EF5350"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="76" y="58" width="8" height="32" rx="4" fill="#D32F2F" />
      <circle cx="80" cy="102" r="5" fill="#D32F2F" />
    </svg>
  );
}
