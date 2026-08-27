interface ReadIconProps {
  size?: number;
}

export function ReadIcon({ size = 18 }: ReadIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.4h6.2a1.8 1.8 0 0 1 1.8 1.8v10.4a1.4 1.4 0 0 0-1.4-1.4H4Z"
        stroke="var(--accent)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M20 6.4h-6.2a1.8 1.8 0 0 0-1.8 1.8v10.4a1.4 1.4 0 0 1 1.4-1.4H20Z"
        stroke="var(--accent)"
        strokeWidth="1.3"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}
