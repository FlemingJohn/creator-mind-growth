"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MarkIcon } from "@/components/icons/MarkIcon";

const GlslHills = dynamic(
  function loadHills() {
    return import("@/components/ui/GlslHills").then(function pick(loaded) {
      return loaded.GlslHills;
    });
  },
  { ssr: false }
);

export function Hero() {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <GlslHills />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--page)] via-transparent to-[var(--page)]" />

      <nav className="absolute left-0 right-0 top-0 z-20 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2.5">
          <MarkIcon size={20} />
          <span className="text-[13px] font-semibold tracking-tight">CMG</span>
        </span>
        <Link
          href="/dashboard"
          className="rounded-[8px] border border-[var(--edge)] px-3.5 py-1.5 text-[12.5px] text-[var(--muted)] transition-colors duration-200 hover:border-[var(--faint)] hover:text-[var(--ink)]"
        >
          Open
        </Link>
      </nav>

      <div className="relative z-10 max-w-3xl px-6 text-center">
        <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--accent)]">Creator Mind Growth</p>

        <h1 className="mt-5 text-balance text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          <span className="block text-[var(--muted)]">Your audience already told you</span>
          what to make next
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-[var(--muted)]">
          An agent that reads every comment, remembers what people keep asking for, and keeps a record of whether its
          own advice worked.
        </p>

        <div className="mt-9 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-[9px] bg-[var(--accent)] px-5 py-2.5 text-[13.5px] font-medium text-[var(--page)] transition-all duration-200 hover:brightness-110 active:scale-[0.985]"
          >
            Read my channel
          </Link>
        </div>
      </div>
    </section>
  );
}
