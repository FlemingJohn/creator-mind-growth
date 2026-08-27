interface TodayIconProps {
  size?: number;
  lit?: boolean;
}

export function TodayIcon({ size = 16, lit = false }: TodayIconProps) {
  const tone = lit ? "var(--accent)" : "var(--faint)";

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="6.6" stroke={tone} strokeWidth="1.3" />
      <path d="M10 3.4a6.6 6.6 0 0 1 0 13.2Z" fill={tone} opacity="0.85" />
      <path d="M10 1v1.6M10 17.4V19M1 10h1.6M17.4 10H19" stroke={tone} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
