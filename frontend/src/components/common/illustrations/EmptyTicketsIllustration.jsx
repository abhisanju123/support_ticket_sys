export function EmptyTicketsIllustration({ width = 160, height = 140 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="24" y="28" width="112" height="84" rx="12" fill="#E8EAF6" stroke="#7986CB" strokeWidth="2" />
      <rect x="40" y="48" width="56" height="8" rx="4" fill="#3949AB" opacity="0.35" />
      <rect x="40" y="64" width="80" height="6" rx="3" fill="#3949AB" opacity="0.2" />
      <rect x="40" y="76" width="72" height="6" rx="3" fill="#3949AB" opacity="0.2" />
      <circle cx="118" cy="92" r="18" fill="#1565C0" />
      <path d="M110 92h16M118 84v16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
