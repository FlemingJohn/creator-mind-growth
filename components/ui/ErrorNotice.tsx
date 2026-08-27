import type { Failure } from "@/types/result";
import { AlertIcon } from "@/components/icons/AlertIcon";
import { Button } from "./Button";

interface ErrorNoticeProps {
  failure: Failure;
  onRetry?: () => void;
  retrying?: boolean;
}

export function ErrorNotice({ failure, onRetry, retrying = false }: ErrorNoticeProps) {
  return (
    <div className="animate-riseIn flex items-start gap-3.5 rounded-[12px] border border-[var(--fading)]/30 bg-[var(--fading)]/[0.06] p-4">
      <span className="mt-0.5 shrink-0">
        <AlertIcon />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium text-[var(--ink)]">{failure.title}</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--muted)]">{failure.detail}</p>
        {failure.canRetry && onRetry ? (
          <div className="mt-3">
            <Button tone="quiet" onPress={onRetry} busy={retrying}>
              Try again
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
