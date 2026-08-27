interface ThinkingDotsProps {
  label?: string;
}

export function ThinkingDots({ label }: ThinkingDotsProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="inline-flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-[var(--accent)] [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-[var(--accent)] [animation-delay:200ms]" />
        <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-[var(--accent)] [animation-delay:400ms]" />
      </span>
      {label ? <span className="text-[12.5px] text-[var(--muted)]">{label}</span> : null}
    </span>
  );
}
