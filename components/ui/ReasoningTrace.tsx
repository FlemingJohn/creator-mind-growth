import { CheckIcon } from "@/components/icons/CheckIcon";

interface ReasoningTraceProps {
  steps: string[];
  seconds: number;
}

function readClock(seconds: number): string {
  if (seconds < 60) {
    return seconds + "s";
  }
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes + "m " + String(rest).padStart(2, "0") + "s";
}

export function ReasoningTrace({ steps, seconds }: ReasoningTraceProps) {
  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col gap-2.5">
        {steps.map(function drawStep(step, index) {
          const current = index === steps.length - 1;

          return (
            <li key={step} className="animate-riseIn flex items-center gap-2.5">
              {current ? (
                <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center">
                  <span className="h-[7px] w-[7px] animate-pulseSoft rounded-full bg-[var(--accent)]" />
                </span>
              ) : (
                <span className="shrink-0 opacity-70">
                  <CheckIcon size={15} />
                </span>
              )}
              <span
                className={`text-[13px] transition-colors duration-300 ${
                  current ? "text-[var(--ink)]" : "text-[var(--faint)]"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="flex items-center gap-3">
        <span className="h-[3px] w-40 max-w-full overflow-hidden rounded-full bg-[var(--edge)]">
          <span className="block h-full w-1/3 animate-sweep rounded-full bg-[var(--accent)] opacity-70" />
        </span>
        <span className="text-[11.5px] tabular-nums text-[var(--faint)]">{readClock(seconds)}</span>
      </div>
    </div>
  );
}
