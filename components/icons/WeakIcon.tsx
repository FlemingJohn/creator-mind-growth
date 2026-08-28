interface WeakIconProps {
  size?: number;
  lit?: boolean;
}

export function WeakIcon({ size = 16, lit = false }: WeakIconProps) {
  const tone = lit ? "var(--accent)" : "var(--faint)";

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3 18 17H2Z" stroke={tone} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M10 8.4v3.6" stroke={tone} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.3" r="0.85" fill={tone} />
    </svg>
  );
}
