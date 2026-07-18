export function CommentsEmptyIllustration({ width = 160, height = 140 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="28" y="36" width="88" height="56" rx="12" fill="#E8F5E9" stroke="#81C784" strokeWidth="2" />
      <path d="M44 52h56M44 64h40M44 76h48" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <path d="M88 92l20 16V92H88z" fill="#E8F5E9" stroke="#81C784" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="118" cy="48" r="14" fill="#2E7D32" opacity="0.15" />
    </svg>
  );
}
