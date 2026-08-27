interface CheckIconProps {
  size?: number;
}

export function CheckIcon({ size = 15 }: CheckIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" stroke="var(--rising)" strokeWidth="1.4" opacity="0.4" />
      <path
        d="M7.8 12.3 10.6 15l5.6-5.9"
        stroke="var(--rising)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
