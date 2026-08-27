import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  tone?: "solid" | "quiet";
  busy?: boolean;
  disabled?: boolean;
  wide?: boolean;
}

export function Button({ children, onPress, tone = "solid", busy = false, disabled = false, wide = false }: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[9px] px-4 py-2 text-[13px] font-medium tracking-tight transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45";

  const solid = "bg-[var(--accent)] text-[var(--page)] hover:brightness-110 active:scale-[0.985]";
  const quiet =
    "border border-[var(--edge)] text-[var(--muted)] hover:border-[var(--faint)] hover:text-[var(--ink)] active:scale-[0.985]";

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled || busy}
      className={`${base} ${tone === "solid" ? solid : quiet} ${wide ? "w-full" : ""}`}
    >
      {busy ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-[3px] w-8 overflow-hidden rounded-full bg-black/20">
            <span className="block h-full w-1/3 animate-sweep rounded-full bg-current opacity-70" />
          </span>
        </span>
      ) : null}
      <span className={busy ? "invisible" : "visible"}>{children}</span>
    </button>
  );
}
