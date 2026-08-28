import type { Call } from "@/types/call";
import { SparkIcon } from "@/components/icons/SparkIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { RichText } from "@/components/ui/RichText";
import { ReasoningTrace } from "@/components/ui/ReasoningTrace";

interface NextCallProps {
  call: Call | null;
  thinking: boolean;
  thinkingSteps: string[];
  waitedSeconds: number;
  onAsk: () => void;
  onAccept: () => void;
}

export function NextCall({ call, thinking, thinkingSteps, waitedSeconds, onAsk, onAccept }: NextCallProps) {
  return (
    <Panel grow>
      <div className="mb-4 flex items-center gap-2">
        <SparkIcon />
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">Make this next</h2>
      </div>

      {thinking ? (
        <div className="flex flex-1 flex-col justify-center gap-4">
          <ReasoningTrace steps={thinkingSteps} seconds={waitedSeconds} />

          <p className="max-w-[40ch] text-[12px] leading-relaxed text-[var(--faint)]">
            It is reading months of comments before it answers. This can take a few minutes.
          </p>
        </div>
      ) : null}

      {!thinking && !call ? (
        <div className="flex flex-1 flex-col items-start gap-4">
          <p className="max-w-[34ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
            Your Mind has read the comments. Ask it what to make and it will pick one thing.
          </p>
          <Button onPress={onAsk}>Ask what to make</Button>
        </div>
      ) : null}

      {!thinking && call ? (
        <div className="animate-riseIn flex min-h-0 flex-1 flex-col">
          <p className="text-[17px] font-medium leading-snug tracking-tight text-[var(--ink)]">{call.title}</p>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">Why</p>
          <RichText html={call.reason} clampLines={4} className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)]" />

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge label="Risk" value={call.risk} />
            <Badge label="Upside" value={call.upside} />
            <Badge label="Answered by" value={call.answeredBy === "mind" ? "your Mind" : "standby model"} />
          </div>

          <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
            <Button onPress={onAccept}>I am making this</Button>
            <Button tone="quiet" onPress={onAsk}>
              Something else
            </Button>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
