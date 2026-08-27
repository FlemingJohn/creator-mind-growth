interface WorkingStepsProps {
  steps: string[];
  activeIndex: number;
}

export function WorkingSteps({ steps, activeIndex }: WorkingStepsProps) {
  return (
    <ol className="flex flex-col gap-2.5">
      {steps.map(function drawStep(step, index) {
        const done = index < activeIndex;
        const active = index === activeIndex;

        return (
          <li key={step} className="flex items-center gap-3">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 ${
                done ? "bg-[var(--rising)]" : active ? "animate-pulseSoft bg-[var(--accent)]" : "bg-[var(--edge)]"
              }`}
            />
            <span
              className={`text-[13px] transition-colors duration-300 ${
                active ? "text-[var(--ink)]" : done ? "text-[var(--muted)]" : "text-[var(--faint)]"
              }`}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
