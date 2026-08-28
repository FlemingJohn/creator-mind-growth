interface IdeasIconProps {
  size?: number;
  lit?: boolean;
}

export function IdeasIcon({ size = 16, lit = false }: IdeasIconProps) {
  const tone = lit ? "var(--accent)" : "var(--faint)";

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2.4 12 8l5.6 2-5.6 2-2 5.6-2-5.6L2.4 10 8 8Z" stroke={tone} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="1.4" fill={tone} opacity="0.8" />
    </svg>
  );
}
