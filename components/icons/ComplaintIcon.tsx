import type { ComplaintKind } from "@/types/weakness";

interface ComplaintIconProps {
  kind: ComplaintKind;
  size?: number;
  lit?: boolean;
}

const drawings: Record<ComplaintKind, string[]> = {
  "too fast": ["M7 5.5 12.5 10 7 14.5", "M11.5 5.5 17 10l-5.5 4.5", "M2 7.5h3M2 10h4.5M2 12.5h3"],
  "not deep enough": ["M3 6h14", "M4.5 10h11", "M6 14h8"],
  "too long": ["M6 3h8M6 17h8", "M6 3c0 3 4 5 4 7s-4 4-4 7", "M14 3c0 3-4 5-4 7s4 4 4 7"],
  "misleading title": ["M3.5 9.5 9.5 3.5h6v6l-6 6z", "M12.7 6.3h.01", "M8 8.5l-2 2"],
  "sound and picture": ["M4 8v4h3l4 3V5L7 8Z", "M14 7.5a4 4 0 0 1 0 5"],
  "wrong or outdated": ["M4 5h12v11H4z", "M4 8h12", "M7 3v3M13 3v3", "M6.5 13.5l7-4"],
  "off topic": ["M3 15c4 0 5-8 9-8", "M12 7l4.5 4.5"]
};

export function ComplaintIcon({ kind, size = 16, lit = false }: ComplaintIconProps) {
  const tone = lit ? "var(--fading)" : "var(--faint)";

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {drawings[kind].map(function drawPart(path, index) {
        return (
          <path
            key={index}
            d={path}
            stroke={tone}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={index === 0 ? 1 : 0.65}
          />
        );
      })}
    </svg>
  );
}
