interface MarkIconProps {
  size?: number;
}

export function MarkIcon({ size = 22 }: MarkIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5 3.8 7.2v9.6L12 21.5l8.2-4.7V7.2Z"
        stroke="var(--accent)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.4v9.2M8.1 9.6v4.8M15.9 9.6v4.8"
        stroke="var(--accent)"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
