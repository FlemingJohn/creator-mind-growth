interface CountBarProps {
  filledShare: number;
  tone: "rising" | "steady" | "fading";
  delayMs: number;
}

const tones = {
  rising: "var(--rising)",
  steady: "var(--muted)",
  fading: "var(--fading)"
};

export function CountBar({ filledShare, tone, delayMs }: CountBarProps) {
  return (
    <span className="block h-[7px] w-full overflow-hidden rounded-full bg-[var(--edge)]/60">
      <span
        className="block h-full origin-left animate-drawBar rounded-full"
        style={{
          width: `${Math.max(4, Math.round(filledShare * 100))}%`,
          background: tones[tone],
          opacity: 0.85,
          animationDelay: `${delayMs}ms`
        }}
      />
    </span>
  );
}
