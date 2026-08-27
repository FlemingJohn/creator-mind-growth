interface MindIconProps {
  size?: number;
  awake?: boolean;
  thinking?: boolean;
}

export function MindIcon({ size = 26, awake = true, thinking = false }: MindIconProps) {
  const core = awake ? "var(--accent)" : "var(--faint)";

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {thinking ? (
        <circle cx="16" cy="16" r="14.4" fill="none" stroke={core} strokeWidth="1.2" opacity="0.5">
          <animate attributeName="r" values="10;15.2;10" dur="2.1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.1s" repeatCount="indefinite" />
        </circle>
      ) : (
        <circle cx="16" cy="16" r="14.4" stroke="var(--edge)" strokeWidth="1.2" />
      )}

      <circle cx="16" cy="16" r="9.6" stroke={core} strokeWidth="1.2" opacity="0.5">
        {thinking ? (
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.1s" repeatCount="indefinite" />
        ) : null}
      </circle>

      <circle cx="16" cy="16" r="4.2" fill={core} opacity="0.9">
        {thinking ? (
          <animate attributeName="r" values="4.2;5.1;4.2" dur="2.1s" repeatCount="indefinite" />
        ) : null}
      </circle>

      <path d="M16 1.6v5M16 25.4v5M1.6 16h5M25.4 16h5" stroke="var(--edge)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
