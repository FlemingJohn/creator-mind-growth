import type { TrackRecord as TrackRecordShape } from "@/types/call";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { CrossIcon } from "@/components/icons/CrossIcon";
import { Panel } from "@/components/ui/Panel";

interface TrackRecordProps {
  record: TrackRecordShape;
}

function readShortDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function TrackRecord({ record }: TrackRecordProps) {
  const judged = record.calls.filter(function wasJudged(call) {
    return call.outcome !== "waiting";
  });

  const shown = judged.slice(0, 4);

  return (
    <Panel title="My track record">
      <div className="flex items-baseline gap-3">
        <div className="flex gap-[5px]">
          {judged.slice(0, 10).map(function drawDot(call) {
            const hit = call.outcome === "hit";
            return (
              <span
                key={call.callId}
                className={`h-[7px] w-[7px] rounded-full ${
                  hit ? "bg-[var(--rising)]" : "border border-[var(--fading)] bg-transparent"
                }`}
              />
            );
          })}
          {judged.length === 0
            ? Array.from({ length: 6 }).map(function drawEmpty(unused, index) {
                return <span key={index} className="h-[7px] w-[7px] rounded-full bg-[var(--edge)]" />;
              })
            : null}
        </div>
        {judged.length > 0 ? (
          <span className="text-[12.5px] tabular-nums text-[var(--muted)]">
            {record.hitCount} of {record.judgedCount}
          </span>
        ) : null}
      </div>

      {shown.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-2.5">
          {shown.map(function drawRow(call) {
            return (
              <li key={call.callId} className="flex items-center gap-3 text-[12.5px]">
                <span className="w-[46px] shrink-0 tabular-nums text-[var(--faint)]">{readShortDate(call.madeOn)}</span>
                <span className="min-w-0 flex-1 truncate text-[var(--muted)]">{call.title}</span>
                <span className="shrink-0">{call.outcome === "hit" ? <CheckIcon /> : <CrossIcon />}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-5 text-[12.5px] leading-relaxed text-[var(--faint)]">
          Nothing judged yet. Once you make something it suggested, it will mark itself.
        </p>
      )}

      {record.latestLesson ? (
        <div className="mt-auto border-t border-[var(--edge)] pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">I changed my mind</p>
          <p className="mt-1.5 line-clamp-5 text-[12.5px] leading-relaxed text-[var(--muted)]">{record.latestLesson}</p>
        </div>
      ) : null}
    </Panel>
  );
}
