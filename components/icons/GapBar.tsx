interface GapBarProps {
  nicheShare: number;
  coveredShare: number;
  delayMs: number;
}

export function GapBar({ nicheShare, coveredShare, delayMs }: GapBarProps) {
  return (
    <span className="relative block h-[7px] w-full overflow-hidden rounded-full border border-[var(--edge)]">
      <span
        className="absolute inset-y-0 left-0 block origin-left animate-drawBar rounded-full bg-[var(--accent)] opacity-25"
        style={{ width: `${Math.max(4, Math.round(nicheShare * 100))}%`, animationDelay: `${delayMs}ms` }}
      />
      <span
        className="absolute inset-y-0 left-0 block origin-left animate-drawBar rounded-full bg-[var(--accent)]"
        style={{ width: `${Math.round(coveredShare * 100)}%`, animationDelay: `${delayMs + 120}ms` }}
      />
    </span>
  );
}
