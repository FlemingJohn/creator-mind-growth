"use client";

import { useState } from "react";
import { AudienceAsks } from "@/components/dashboard/AudienceAsks";
import { ConnectChannel } from "@/components/dashboard/ConnectChannel";
import { GreetingBar } from "@/components/dashboard/GreetingBar";
import { NextCall } from "@/components/dashboard/NextCall";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TrackRecord } from "@/components/dashboard/TrackRecord";
import { useDashboard } from "@/components/dashboard/useDashboard";
import { ErrorNotice } from "@/components/ui/ErrorNotice";
import { ThinkingDots } from "@/components/ui/ThinkingDots";

function readHeadline(askCount: number, hasCall: boolean): string {
  if (hasCall) {
    return "I read your comments. One thing stands out.";
  }
  if (askCount > 0) {
    return "I read your comments. Ask me what to make.";
  }
  return "I read your comments.";
}

export default function DashboardPage() {
  const dashboard = useDashboard();
  const [activePage, setActivePage] = useState("Today");

  if (dashboard.loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <ThinkingDots label="Opening" />
      </main>
    );
  }

  if (!dashboard.data) {
    return (
      <main>
        <ConnectChannel
          onConnect={dashboard.connectChannel}
          working={dashboard.connecting}
          workingStep={dashboard.connectStep}
          failure={dashboard.failure}
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
      <Sidebar mindName={dashboard.data.mindName} activePage={activePage} onChangePage={setActivePage} />

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6 lg:gap-[18px] lg:overflow-hidden lg:p-7">
        <GreetingBar
          channelTitle={dashboard.data.channel.title}
          headline={readHeadline(dashboard.data.asks.length, dashboard.data.nextCall !== null)}
          checkedAt={dashboard.data.checkedAt}
        />

        {dashboard.failure ? <ErrorNotice failure={dashboard.failure} onRetry={dashboard.loadDashboard} /> : null}

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:gap-[18px]">
          <NextCall
            call={dashboard.data.nextCall}
            thinking={dashboard.thinking}
            thinkingNote={dashboard.thinkingNote}
            waitedSeconds={dashboard.waitedSeconds}
            onAsk={dashboard.askForCall}
            onAccept={dashboard.askForCall}
          />
          <TrackRecord record={dashboard.data.trackRecord} />
        </div>

        <AudienceAsks asks={dashboard.data.asks} />
      </div>
    </main>
  );
}
