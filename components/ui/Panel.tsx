import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  title?: string;
  padded?: boolean;
  grow?: boolean;
}

export function Panel({ children, title, padded = true, grow = false }: PanelProps) {
  return (
    <section
      className={`flex min-h-0 flex-col rounded-[14px] border border-[var(--edge)] bg-[var(--panel)] ${
        padded ? "p-[22px]" : ""
      } ${grow ? "flex-1" : ""}`}
    >
      {title ? (
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
