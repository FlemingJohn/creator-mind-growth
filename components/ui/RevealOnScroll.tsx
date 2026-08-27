"use client";

import type { ReactNode } from "react";
import { useReachedView } from "./useReachedView";

interface RevealOnScrollProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

export function RevealOnScroll({ children, delayMs = 0, className = "" }: RevealOnScrollProps) {
  const { holderRef, reached } = useReachedView<HTMLDivElement>({ once: true, showWhenPart: 0.2 });

  return (
    <div
      ref={holderRef}
      className={`transition-all duration-[720ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        reached ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
