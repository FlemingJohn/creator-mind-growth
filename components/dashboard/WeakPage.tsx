"use client";

import { useState } from "react";
import type { Complaint, WeakSpots } from "@/types/weakness";
import { ComplaintIcon } from "@/components/icons/ComplaintIcon";
import { MissBar } from "@/components/icons/MissBar";
import { SparkIcon } from "@/components/icons/SparkIcon";
import { Button } from "@/components/ui/Button";
import { CountBar } from "@/components/ui/CountBar";
import { Panel } from "@/components/ui/Panel";
import { ReasoningTrace } from "@/components/ui/ReasoningTrace";
import { RichText } from "@/components/ui/RichText";

interface WeakPageProps {
  spots: WeakSpots | null;
  thinking: boolean;
  thinkingSteps: string[];
  waitedSeconds: number;
  onAsk: () => void;
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

export function WeakPage({ spots, thinking, thinkingSteps, waitedSeconds, onAsk }: WeakPageProps) {
  const [chosenKind, setChosenKind] = useState<string>("");

  if (!spots || spots.complaints.length === 0) {
    return (
      <Panel grow>
        <p className="text-[13px] leading-relaxed text-[var(--faint)]">
          Nothing was complained about by more than two people. That is a good sign.
        </p>
      </Panel>
    );
  }

  const loudest = spots.complaints.reduce(function findLoudest(running, complaint) {
    return Math.max(running, complaint.peopleCount);
  }, 1);

  const chosen: Complaint =
    spots.complaints.find(function matchKind(complaint) {
      return complaint.kind === chosenKind;
    }) ?? spots.complaints[0];

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-[18px]">
      <div className="flex min-h-0 flex-col gap-4 lg:gap-[18px]">
        <Panel grow>
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">
            What they complain about
          </h2>

          <ul className="flex flex-col gap-3">
            {spots.complaints.map(function drawRow(complaint, index) {
              const active = complaint.kind === chosen.kind;

              return (
                <li key={complaint.kind}>
                  <button
                    type="button"
                    onClick={function pick() {
                      setChosenKind(complaint.kind);
                    }}
                    className={`w-full rounded-[9px] px-2.5 py-2 text-left transition-colors duration-200 ${
                      active ? "bg-[var(--edge)]/50" : "hover:bg-[var(--edge)]/25"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ComplaintIcon kind={complaint.kind} lit={active} />
                      <span
                        className={`flex-1 truncate text-[13px] capitalize ${
                          active ? "text-[var(--ink)]" : "text-[var(--muted)]"
                        }`}
                      >
                        {complaint.kind}
                      </span>
                      <span className="text-[12px] tabular-nums text-[var(--faint)]">{complaint.peopleCount}</span>
                    </span>
                    <span className="mt-2 block">
                      <CountBar
                        filledShare={complaint.peopleCount / loudest}
                        tone={active ? "fading" : "steady"}
                        delayMs={index * 70}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel>
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">
            Videos that missed
          </h2>

          {spots.weakVideos.length === 0 ? (
            <p className="text-[12.5px] text-[var(--faint)]">Nothing landed far below your usual.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {spots.weakVideos.slice(0, 3).map(function drawVideo(video, index) {
                return (
                  <li key={video.videoId}>
                    <p className="truncate text-[12.5px] text-[var(--ink)]">{video.title}</p>
                    <span className="mt-1.5 block">
                      <MissBar
                        viewCount={video.viewCount}
                        usualViewCount={video.usualViewCount}
                        delayMs={index * 90}
                      />
                    </span>
                    <p className="mt-1 text-[11px] tabular-nums text-[var(--faint)]">
                      {readCount(video.viewCount)} against a usual {readCount(video.usualViewCount)}
                      <span className="text-[var(--fading)]"> down {video.shortfall}%</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>

      <div className="flex min-h-0 flex-col gap-4 lg:gap-[18px]">
        <Panel grow>
          <div className="mb-1 flex items-center gap-2">
            <ComplaintIcon kind={chosen.kind} lit />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--ink)]">{chosen.kind}</h2>
          </div>

          <p className="mb-4 text-[12px] text-[var(--faint)]">
            {chosen.peopleCount} people said this, {chosen.timesSaid} times
          </p>

          <ul className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
            {chosen.quotes.map(function drawQuote(quote) {
              return (
                <li key={quote.text}>
                  <p className="text-[13px] leading-relaxed text-[var(--muted)]">{quote.text}</p>
                  <p className="mt-1 truncate text-[11px] text-[var(--faint)]">
                    {quote.videoTitle} · {quote.likeCount} likes
                  </p>
                </li>
              );
            })}
          </ul>

          {chosen.worstVideoTitle.length > 0 ? (
            <p className="mt-4 border-t border-[var(--edge)] pt-3 text-[12px] text-[var(--faint)]">
              {chosen.worstVideoCount} of these came from
              <span className="text-[var(--muted)]"> {chosen.worstVideoTitle}</span>
            </p>
          ) : null}
        </Panel>

        <Panel>
          <div className="mb-3 flex items-center gap-2">
            <SparkIcon />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">What to stop</h2>
          </div>

          {thinking ? (
            <ReasoningTrace steps={thinkingSteps} seconds={waitedSeconds} />
          ) : spots.whatToStop ? (
            <div>
              <RichText html={spots.whatToStop} className="text-[13px] leading-relaxed text-[var(--muted)]" />
              <p className="mt-2 text-[11px] italic text-[var(--faint)]">
                {spots.stopSaidBy === "mind" ? "from your Mind" : "from the standby model"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <p className="text-[13px] leading-relaxed text-[var(--muted)]">
                Ask what is hurting this channel and what to stop making.
              </p>
              <Button onPress={onAsk}>Ask what to stop</Button>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
