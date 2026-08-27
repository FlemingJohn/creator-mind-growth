interface BellIconProps {
  size?: number;
}

export function BellIcon({ size = 18 }: BellIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.4 10.2a5.6 5.6 0 0 1 11.2 0c0 3.4.9 5 1.8 5.9H4.6c.9-.9 1.8-2.5 1.8-5.9Z"
        stroke="var(--accent)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M10.2 19a2 2 0 0 0 3.6 0" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
