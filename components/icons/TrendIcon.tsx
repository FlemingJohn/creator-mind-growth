import type { AskDirection } from "@/types/ask";

interface TrendIconProps {
  direction: AskDirection;
  size?: number;
}

const paths: Record<AskDirection, string> = {
  rising: "M5 16.5 10.2 10l3.4 3.4L19 7",
  new: "M5 16.5 10.2 10l3.4 3.4L19 7",
  steady: "M5 12h14",
  fading: "M5 7.5 10.2 14l3.4-3.4L19 17"
};

const tips: Record<AskDirection, string> = {
  rising: "M19 7h-4.2M19 7v4.2",
  new: "M19 7h-4.2M19 7v4.2",
  steady: "M19 12h-3.6M19 12l-2 2M19 12l-2-2",
  fading: "M19 17h-4.2M19 17v-4.2"
};

export function TrendIcon({ direction, size = 15 }: TrendIconProps) {
  const tone = direction === "fading" ? "var(--fading)" : direction === "steady" ? "var(--faint)" : "var(--rising)";

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[direction]} stroke={tone} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d={tips[direction]} stroke={tone} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
