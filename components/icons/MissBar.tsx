interface MissBarProps {
  viewCount: number;
  usualViewCount: number;
  delayMs: number;
}

export function MissBar({ viewCount, usualViewCount, delayMs }: MissBarProps) {
  const share = usualViewCount > 0 ? Math.min(1, viewCount / usualViewCount) : 0;

  return (
    <span className="relative block h-[7px] w-full overflow-hidden rounded-full border border-dashed border-[var(--edge)]">
      <span
        className="absolute inset-y-0 left-0 block origin-left animate-drawBar rounded-full bg-[var(--fading)] opacity-80"
        style={{ width: `${Math.max(3, Math.round(share * 100))}%`, animationDelay: `${delayMs}ms` }}
      />
    </span>
  );
}
