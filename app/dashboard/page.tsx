"use client";

import { useState } from "react";
import { AudienceAsks } from "@/components/dashboard/AudienceAsks";
import { AudiencePage } from "@/components/dashboard/AudiencePage";
import { ConnectChannel } from "@/components/dashboard/ConnectChannel";
import { GreetingBar } from "@/components/dashboard/GreetingBar";
import { JourneyPage } from "@/components/dashboard/JourneyPage";
import { NextCall } from "@/components/dashboard/NextCall";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TrackRecord } from "@/components/dashboard/TrackRecord";
import { TrackRecordPage } from "@/components/dashboard/TrackRecordPage";
import { useDashboard } from "@/components/dashboard/useDashboard";
import { ErrorNotice } from "@/components/ui/ErrorNotice";
import { ThinkingDots } from "@/components/ui/ThinkingDots";

function readHeadline(page: string, askCount: number, hasCall: boolean): string {
  if (page === "Track Record") {
    return "Every call it made, and how each one went.";
  }
  if (page === "Audience") {
    return "The real comments behind every count.";
  }
  if (page === "Journey") {
    return "How your audience has shaped what it believes.";
  }
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

  const data = dashboard.data;

  return (
    <main className="flex min-h-screen flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
      <Sidebar
        mindName={data.mindName}
        activePage={activePage}
        thinking={dashboard.thinking}
        onChangePage={setActivePage}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6 lg:gap-[18px] lg:overflow-hidden lg:p-7">
        <GreetingBar
          channelTitle={data.channel.title}
          headline={readHeadline(activePage, data.asks.length, data.nextCall !== null)}
          checkedAt={data.checkedAt}
        />

        {dashboard.failure ? <ErrorNotice failure={dashboard.failure} onRetry={dashboard.loadDashboard} /> : null}

        {activePage === "Today" ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4 lg:gap-[18px]">
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:gap-[18px]">
              <NextCall
                call={data.nextCall}
                thinking={dashboard.thinking}
                thinkingSteps={dashboard.thinkingSteps}
                waitedSeconds={dashboard.waitedSeconds}
                onAsk={dashboard.askForCall}
                onAccept={dashboard.askForCall}
              />
              <TrackRecord record={data.trackRecord} />
            </div>

            <AudienceAsks asks={data.asks} />
          </div>
        ) : null}

        {activePage === "Track Record" ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <TrackRecordPage record={data.trackRecord} />
          </div>
        ) : null}

        {activePage === "Audience" ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <AudiencePage asks={data.asks} />
          </div>
        ) : null}

        {activePage === "Journey" ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <JourneyPage calls={data.trackRecord.calls} channel={data.channel} checkedAt={data.checkedAt} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
