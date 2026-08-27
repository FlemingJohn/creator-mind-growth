interface JourneyIconProps {
  size?: number;
  lit?: boolean;
}

export function JourneyIcon({ size = 16, lit = false }: JourneyIconProps) {
  const tone = lit ? "var(--accent)" : "var(--faint)";

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 16.5c0-3 3.4-3 3.4-6s3.6-3 3.6-6"
        stroke={tone}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.65"
      />
      <circle cx="5" cy="16.5" r="1.7" fill={tone} />
      <circle cx="8.4" cy="10.5" r="1.5" fill={tone} opacity="0.8" />
      <circle cx="12" cy="4.5" r="1.7" stroke={tone} strokeWidth="1.3" fill="none" />
    </svg>
  );
}
