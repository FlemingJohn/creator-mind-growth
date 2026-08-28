import type { Idea, IdeaBoard, IdeaKind } from "@/types/trend";
import { GapBar } from "@/components/icons/GapBar";
import { IdeasIcon } from "@/components/icons/IdeasIcon";
import { SparkIcon } from "@/components/icons/SparkIcon";
import { WaveIcon } from "@/components/icons/WaveIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { ReasoningTrace } from "@/components/ui/ReasoningTrace";
import { RichText } from "@/components/ui/RichText";

interface IdeasPageProps {
  board: IdeaBoard | null;
  thinking: boolean;
  thinkingSteps: string[];
  waitedSeconds: number;
  onFind: () => void;
}

const headings: Record<IdeaKind, string> = {
  signal: "Follow the signal",
  wave: "Ride the wave",
  new: "Try something new"
};

function drawKindIcon(kind: IdeaKind) {
  if (kind === "signal") {
    return <SparkIcon />;
  }
  if (kind === "wave") {
    return <WaveIcon lit />;
  }
  return <IdeasIcon lit />;
}

function readCount(count: number): string {
  if (count >= 1000000) {
    return Math.round(count / 100000) / 10 + "m";
  }
  if (count >= 1000) {
    return Math.round(count / 1000) + "k";
  }
  return String(count);
}

export function IdeasPage({ board, thinking, thinkingSteps, waitedSeconds, onFind }: IdeasPageProps) {
  if (thinking) {
    return (
      <Panel grow>
        <div className="flex flex-1 flex-col justify-center gap-4">
          <ReasoningTrace steps={thinkingSteps} seconds={waitedSeconds} />
          <p className="max-w-[44ch] text-[12px] leading-relaxed text-[var(--faint)]">
            Searching your whole niche, then asking your Mind for something nobody has made.
          </p>
        </div>
      </Panel>
    );
  }

  if (!board || board.ideas.length === 0) {
    return (
      <Panel grow>
        <div className="flex flex-1 flex-col items-start justify-center gap-4">
          <p className="max-w-[38ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
            Three directions: what your viewers ask for, what your whole niche is busy with, and one thing nobody has
            made yet.
          </p>
          <Button onPress={onFind}>Find me three ideas</Button>
        </div>
      </Panel>
    );
  }

  const widestNiche = board.gaps.reduce(function findWidest(running, gap) {
    return Math.max(running, gap.videoCount);
  }, 1);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:gap-[18px]">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-3 lg:gap-[18px]">
        {board.ideas.map(function drawIdea(idea: Idea) {
          return (
            <Panel key={idea.kind} grow>
              <div className="mb-4 flex items-center gap-2">
                {drawKindIcon(idea.kind)}
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">
                  {headings[idea.kind]}
                </h2>
              </div>

              <p className="text-[15px] font-medium leading-snug tracking-tight text-[var(--ink)]">{idea.title}</p>

              <RichText html={idea.reason} clampLines={6} className="mt-3 text-[13px] leading-relaxed text-[var(--muted)]" />

              <p className="mt-3 text-[11px] italic text-[var(--faint)]">{idea.source}</p>

              <div className="mt-auto flex flex-col gap-3 pt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge label="Risk" value={idea.risk} />
                  <Badge label="Upside" value={idea.upside} />
                </div>
                <Button tone={idea.kind === "new" ? "solid" : "quiet"}>Make it</Button>
              </div>
            </Panel>
          );
        })}
      </div>

      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">
          Rising in your niche, not yet on your channel
        </h2>

        <ul className="mt-4 flex flex-col gap-3">
          {board.gaps.slice(0, 3).map(function drawGap(gap, index) {
            return (
              <li key={gap.topic} className="grid grid-cols-[130px_1fr_92px_78px] items-center gap-4">
                <span className="truncate text-[13px] capitalize text-[var(--ink)]">{gap.topic}</span>
                <GapBar
                  nicheShare={gap.videoCount / widestNiche}
                  coveredShare={gap.coveredByCreator / widestNiche}
                  delayMs={index * 90}
                />
                <span className="text-right text-[12px] tabular-nums text-[var(--muted)]">
                  {gap.videoCount} videos
                </span>
                <span className="text-right text-[11.5px] tabular-nums text-[var(--faint)]">
                  {readCount(gap.topViewCount)} top
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
