import { ClockIcon } from "@/components/icons/ClockIcon";

interface GreetingBarProps {
  channelTitle: string;
  headline: string;
  checkedAt: string;
}

function readTimeSince(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) {
    return "just now";
  }

  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 2) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.round(hours / 24)}d ago`;
}

export function GreetingBar({ channelTitle, headline, checkedAt }: GreetingBarProps) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <h1 className="truncate text-[19px] font-semibold tracking-tight text-[var(--ink)]">{channelTitle}</h1>
        <p className="mt-1 text-[13.5px] text-[var(--muted)]">{headline}</p>
      </div>
      <span className="mt-1 flex shrink-0 items-center gap-1.5 text-[11.5px] text-[var(--faint)]">
        <ClockIcon />
        checked {readTimeSince(checkedAt)}
      </span>
    </header>
  );
}
