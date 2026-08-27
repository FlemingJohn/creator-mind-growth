import type { Call } from "@/types/call";
import type { Channel } from "@/types/channel";
import { Panel } from "@/components/ui/Panel";
import { RichText } from "@/components/ui/RichText";

interface JourneyPageProps {
  calls: Call[];
  channel: Channel;
  checkedAt: string;
}

function readLongDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

export function JourneyPage({ calls, channel, checkedAt }: JourneyPageProps) {
  const ordered = [...calls].sort(function newestFirst(left, right) {
    return new Date(right.madeOn).getTime() - new Date(left.madeOn).getTime();
  });

  return (
    <Panel grow>
      <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">
        What your Mind has learned
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <ol className="relative flex flex-col gap-7 border-l border-[var(--edge)] pl-6">
          <li className="relative">
            <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
            <p className="text-[11px] text-[var(--faint)]">{readLongDate(checkedAt)}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--ink)]">
              Read the comments on {channel.title} and built a picture of who watches it.
            </p>
          </li>

          {ordered.map(function drawCall(call) {
            const hit = call.outcome === "hit";
            const waiting = call.outcome === "waiting";

            return (
              <li key={call.callId} className="relative">
                <span
                  className={`absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full ${
                    waiting
                      ? "bg-[var(--edge)]"
                      : hit
                        ? "bg-[var(--rising)]"
                        : "border border-[var(--fading)] bg-transparent"
                  }`}
                />
                <p className="text-[11px] text-[var(--faint)]">{readLongDate(call.madeOn)}</p>
                <p className="mt-1 text-[13.5px] font-medium leading-snug text-[var(--ink)]">{call.title}</p>

                <p className="mt-1 text-[12px] text-[var(--faint)]">
                  {waiting ? "waiting for you to make it" : hit ? "it worked" : "it did not work"}
                </p>

                {call.verdict ? (
                  <RichText
                    html={call.verdict}
                    className="mt-2 text-[12.5px] italic leading-relaxed text-[var(--muted)]"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>

        {ordered.length === 0 ? (
          <p className="mt-4 text-[13px] leading-relaxed text-[var(--faint)]">
            The rest of the story starts once it makes its first call.
          </p>
        ) : null}
      </div>
    </Panel>
  );
}
