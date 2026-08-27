import { keepSafeHtml } from "@/lib/minds/keepSafeHtml";

interface RichTextProps {
  html: string;
  clampLines?: number;
  className?: string;
}

export function RichText({ html, clampLines, className = "" }: RichTextProps) {
  const safe = keepSafeHtml(html);

  const clamp = clampLines
    ? { display: "-webkit-box", WebkitLineClamp: clampLines, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }
    : undefined;

  return (
    <div
      className={`[&_code]:rounded [&_code]:bg-[var(--edge)] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[12px] [&_em]:italic [&_li]:ml-4 [&_li]:list-disc [&_ol]:mt-1 [&_p]:mt-0 [&_strong]:font-medium [&_strong]:text-[var(--ink)] [&_ul]:mt-1 ${className}`}
      style={clamp}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
