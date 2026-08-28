import type { TrackRecord } from "@/types/call";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { CrossIcon } from "@/components/icons/CrossIcon";
import { Panel } from "@/components/ui/Panel";
import { RichText } from "@/components/ui/RichText";

interface TrackRecordPageProps {
  record: TrackRecord;
}

function readLongDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function TrackRecordPage({ record }: TrackRecordPageProps) {
  return (
    <Panel grow>
      <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">Every call it made</h2>
        {record.judgedCount > 0 ? (
          <span className="text-[12.5px] tabular-nums text-[var(--muted)]">
            right {record.hitCount} of {record.judgedCount}
          </span>
        ) : null}
      </div>

      {record.calls.length === 0 ? (
        <p className="text-[13px] leading-relaxed text-[var(--faint)]">
          Nothing yet. Ask your Mind what to make and the first call lands here.
        </p>
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {record.calls.map(function drawCall(call) {
            return (
              <li key={call.callId} className="rounded-[11px] border border-[var(--edge)] bg-[var(--page)] p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="min-w-0 text-[14px] font-medium leading-snug text-[var(--ink)]">{call.title}</p>
                  <span className="mt-0.5 shrink-0">
                    {call.outcome === "hit" ? <CheckIcon size={17} /> : null}
                    {call.outcome === "miss" ? <CrossIcon size={17} /> : null}
                    {call.outcome === "waiting" ? (
                      <span className="text-[var(--faint)]">
                        <ClockIcon size={15} />
                      </span>
                    ) : null}
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-[var(--faint)]">
                  {readLongDate(call.madeOn)}
                  <span className="opacity-50"> · </span>
                  {call.answeredBy === "mind" ? "your Mind" : "standby model"}
                </p>

                <RichText html={call.reason} className="mt-2.5 text-[12.5px] leading-relaxed text-[var(--muted)]" />

                {call.verdict ? (
                  <div className="mt-3 border-l-2 border-[var(--edge)] pl-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--faint)]">
                      What it learned
                    </p>
                    <RichText html={call.verdict} className="mt-1 text-[12.5px] leading-relaxed text-[var(--muted)]" />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
