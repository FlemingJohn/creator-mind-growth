interface BadgeProps {
  label: string;
  value: string;
}

export function Badge({ label, value }: BadgeProps) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-[7px] border border-[var(--edge)] px-2.5 py-1">
      <span className="text-[10px] uppercase tracking-[0.11em] text-[var(--faint)]">{label}</span>
      <span className="text-[12px] font-medium capitalize text-[var(--muted)]">{value}</span>
    </span>
  );
}
