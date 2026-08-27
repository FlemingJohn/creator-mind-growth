interface AlertIconProps {
  size?: number;
}

export function AlertIcon({ size = 18 }: AlertIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.6 21.4 20H2.6Z"
        stroke="var(--fading)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M12 9.6v4.2" stroke="var(--fading)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="0.95" fill="var(--fading)" />
    </svg>
  );
}
