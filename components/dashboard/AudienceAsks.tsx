import type { Ask } from "@/types/ask";
import { TrendIcon } from "@/components/icons/TrendIcon";
import { CountBar } from "@/components/ui/CountBar";

interface AudienceAsksProps {
  asks: Ask[];
}

const wording: Record<Ask["direction"], string> = {
  rising: "rising",
  new: "new",
  steady: "steady",
  fading: "fading"
};

function readTone(direction: Ask["direction"]): "rising" | "steady" | "fading" {
  if (direction === "fading") {
    return "fading";
  }
  if (direction === "steady") {
    return "steady";
  }
  return "rising";
}

export function AudienceAsks({ asks }: AudienceAsksProps) {
  const largest = asks.reduce(function findLargest(running, ask) {
    return Math.max(running, ask.askCount);
  }, 1);

  return (
    <section>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">
        What your audience keeps asking for
      </h2>

      {asks.length === 0 ? (
        <p className="mt-3 text-[12.5px] text-[var(--faint)]">
          Nothing repeated often enough to count yet.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {asks.slice(0, 4).map(function drawAsk(ask, index) {
            return (
              <li key={ask.topic} className="grid grid-cols-[150px_1fr_42px_78px] items-center gap-4">
                <span className="truncate text-[13px] capitalize text-[var(--ink)]">{ask.topic}</span>
                <CountBar filledShare={ask.askCount / largest} tone={readTone(ask.direction)} delayMs={index * 90} />
                <span className="text-right text-[12.5px] tabular-nums text-[var(--muted)]">{ask.askCount}</span>
                <span className="flex items-center gap-1.5 text-[11.5px] text-[var(--faint)]">
                  <TrendIcon direction={ask.direction} />
                  {wording[ask.direction]}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
