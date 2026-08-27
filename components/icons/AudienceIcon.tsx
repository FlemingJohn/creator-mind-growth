interface AudienceIconProps {
  size?: number;
  lit?: boolean;
}

export function AudienceIcon({ size = 16, lit = false }: AudienceIconProps) {
  const tone = lit ? "var(--accent)" : "var(--faint)";

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 6.4h11.5" stroke={tone} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 10h8" stroke={tone} strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      <path d="M3 13.6h13" stroke={tone} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="16.6" cy="6.4" r="1.3" fill={tone} />
    </svg>
  );
}
