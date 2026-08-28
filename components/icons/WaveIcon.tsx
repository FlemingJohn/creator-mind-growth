interface WaveIconProps {
  size?: number;
  lit?: boolean;
}

export function WaveIcon({ size = 16, lit = false }: WaveIconProps) {
  const tone = lit ? "var(--accent)" : "var(--faint)";

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 13.4c2.2 0 2.2-3.4 4.4-3.4s2.2 3.4 4.4 3.4 2.2-3.4 4.4-3.4c1.1 0 1.65.85 2.2 1.7" stroke={tone} strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
      <path d="M2 10.2c2.2 0 2.2-3.4 4.4-3.4s2.2 3.4 4.4 3.4 2.2-3.4 4.4-3.4c1.1 0 1.65.85 2.2 1.7" stroke={tone} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <path d="M2 16.6c2.2 0 2.2-3.4 4.4-3.4s2.2 3.4 4.4 3.4 2.2-3.4 4.4-3.4c1.1 0 1.65.85 2.2 1.7" stroke={tone} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
