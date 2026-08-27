interface MindIconProps {
  size?: number;
  awake?: boolean;
}

export function MindIcon({ size = 26, awake = true }: MindIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14.4" stroke="var(--edge)" strokeWidth="1.2" />
      <circle
        cx="16"
        cy="16"
        r="9.6"
        stroke={awake ? "var(--accent)" : "var(--faint)"}
        strokeWidth="1.2"
        opacity="0.5"
      />
      <circle cx="16" cy="16" r="4.2" fill={awake ? "var(--accent)" : "var(--faint)"} opacity="0.9" />
      <path
        d="M16 1.6v5M16 25.4v5M1.6 16h5M25.4 16h5"
        stroke="var(--edge)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
