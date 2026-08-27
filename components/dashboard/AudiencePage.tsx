import type { Ask } from "@/types/ask";
import { TrendIcon } from "@/components/icons/TrendIcon";
import { CountBar } from "@/components/ui/CountBar";
import { Panel } from "@/components/ui/Panel";

interface AudiencePageProps {
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

export function AudiencePage({ asks }: AudiencePageProps) {
  const largest = asks.reduce(function findLargest(running, ask) {
    return Math.max(running, ask.askCount);
  }, 1);

  return (
    <Panel grow>
      <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">
        What your audience keeps asking for
      </h2>

      {asks.length === 0 ? (
        <p className="text-[13px] leading-relaxed text-[var(--faint)]">
          Nothing repeated often enough to count yet. Paste a channel with more comments.
        </p>
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-1">
          {asks.map(function drawAsk(ask, index) {
            return (
              <li key={ask.topic}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="text-[15px] font-medium capitalize text-[var(--ink)]">{ask.topic}</span>
                  <span className="flex items-center gap-1.5 text-[11.5px] text-[var(--faint)]">
                    {ask.askCount} asked
                    <span className="opacity-50">·</span>
                    {ask.repeatAskerCount} twice
                    <span className="opacity-50">·</span>
                    <TrendIcon direction={ask.direction} />
                    {wording[ask.direction]}
                  </span>
                </div>

                <div className="mt-2">
                  <CountBar
                    filledShare={ask.askCount / largest}
                    tone={readTone(ask.direction)}
                    delayMs={index * 90}
                  />
                </div>

                <ul className="mt-3 flex flex-col gap-1.5 border-l border-[var(--edge)] pl-3">
                  {ask.sampleQuotes.slice(0, 3).map(function drawQuote(quote) {
                    return (
                      <li key={quote} className="text-[12.5px] leading-relaxed text-[var(--muted)]">
                        {quote}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
