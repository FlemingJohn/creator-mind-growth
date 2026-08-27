interface CrossIconProps {
  size?: number;
}

export function CrossIcon({ size = 15 }: CrossIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" stroke="var(--fading)" strokeWidth="1.4" opacity="0.4" />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="var(--fading)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
