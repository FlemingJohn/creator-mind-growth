"use client";

import { useState } from "react";
import type { Failure } from "@/types/result";
import { MarkIcon } from "@/components/icons/MarkIcon";
import { Button } from "@/components/ui/Button";
import { ErrorNotice } from "@/components/ui/ErrorNotice";
import { WorkingSteps } from "@/components/ui/WorkingSteps";

interface ConnectChannelProps {
  onConnect: (link: string) => void;
  working: boolean;
  workingStep: number;
  failure: Failure | null;
}

const steps = [
  "Reading the channel",
  "Reading the comments",
  "Grouping what people ask for",
  "Telling your Mind the story",
  "Your Mind is forming a view"
];

export function ConnectChannel({ onConnect, working, workingStep, failure }: ConnectChannelProps) {
  const [link, setLink] = useState("");

  function submit() {
    if (link.trim().length > 0) {
      onConnect(link.trim());
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-6">
      <div className="w-full max-w-[440px]">
        <div className="mb-9 flex items-center gap-2.5">
          <MarkIcon size={24} />
          <div className="leading-tight">
            <p className="text-[14px] font-semibold tracking-tight text-[var(--ink)]">Creator Mind Growth</p>
            <p className="text-[11px] text-[var(--faint)]">It remembers what your audience asks for</p>
          </div>
        </div>

        {working ? (
          <div className="animate-riseIn rounded-[14px] border border-[var(--edge)] bg-[var(--panel)] p-[22px]">
            <WorkingSteps steps={steps} activeIndex={workingStep} />
          </div>
        ) : (
          <div className="animate-riseIn">
            <label htmlFor="channel-link" className="text-[13.5px] text-[var(--muted)]">
              Paste your channel link.
            </label>

            <input
              id="channel-link"
              value={link}
              onChange={function change(event) {
                setLink(event.target.value);
              }}
              onKeyDown={function press(event) {
                if (event.key === "Enter") {
                  submit();
                }
              }}
              placeholder="youtube.com/@yourname"
              spellCheck={false}
              autoComplete="off"
              className="mt-3 w-full rounded-[10px] border border-[var(--edge)] bg-[var(--panel)] px-4 py-3 text-[14px] text-[var(--ink)] outline-none transition-colors duration-200 placeholder:text-[var(--faint)] focus:border-[var(--accent)]/60"
            />

            <div className="mt-4">
              <Button onPress={submit} disabled={link.trim().length === 0} wide>
                Let it read
              </Button>
            </div>

            <p className="mt-4 text-center text-[11.5px] text-[var(--faint)]">
              No login. It only reads what is already public.
            </p>
          </div>
        )}

        {failure ? (
          <div className="mt-5">
            <ErrorNotice failure={failure} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
