interface RecordIconProps {
  size?: number;
  lit?: boolean;
}

export function RecordIcon({ size = 16, lit = false }: RecordIconProps) {
  const tone = lit ? "var(--accent)" : "var(--faint)";

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.4" stroke={tone} strokeWidth="1.3" opacity="0.5" />
      <circle cx="10" cy="10" r="4.2" stroke={tone} strokeWidth="1.3" opacity="0.8" />
      <circle cx="10" cy="10" r="1.5" fill={tone} />
    </svg>
  );
}
