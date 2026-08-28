"use client";

import { useCallback, useEffect, useState } from "react";
import type { Call } from "@/types/call";
import type { DashboardData } from "@/types/dashboard";
import type { Failure } from "@/types/result";
import { callApi } from "@/lib/browser/callApi";
import { readEventStream } from "@/lib/browser/readEventStream";

const stepPace = 2200;

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connectStep, setConnectStep] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const [waitedSeconds, setWaitedSeconds] = useState(0);

  const loadDashboard = useCallback(async function load() {
    const outcome = await callApi<DashboardData>("/api/dashboard", "GET");

    if (outcome.ok) {
      setData(outcome.value);
      setFailure(null);
    } else if (outcome.failure.kind !== "nothing_stored") {
      setFailure(outcome.failure);
    }

    setLoading(false);
  }, []);

  useEffect(
    function loadOnOpen() {
      loadDashboard();
    },
    [loadDashboard]
  );

  useEffect(
    function walkConnectSteps() {
      if (!connecting) {
        return;
      }

      const timer = window.setInterval(function advance() {
        setConnectStep(function next(current) {
          return current < 4 ? current + 1 : current;
        });
      }, stepPace);

      return function stop() {
        window.clearInterval(timer);
      };
    },
    [connecting]
  );

  async function connectChannel(link: string) {
    setConnecting(true);
    setConnectStep(0);
    setFailure(null);

    const outcome = await callApi<{ channelId: string }>("/api/channel", "POST", { link });

    setConnecting(false);
    setConnectStep(0);

    if (!outcome.ok) {
      setFailure(outcome.failure);
      return;
    }

    await loadDashboard();
  }

  async function askForCall() {
    if (!data) {
      return;
    }

    setThinking(true);
    setThinkingSteps([]);
    setWaitedSeconds(0);
    setFailure(null);

    let landed: Call | null = null;
    let stumble: Failure | null = null;

    await readEventStream(
      "/api/call/stream",
      { channelId: data.channel.channelId },
      {
        onWaiting: function beat(seconds, note) {
          setWaitedSeconds(seconds);
          setThinkingSteps(function addStep(current) {
            if (current[current.length - 1] === note) {
              return current;
            }
            return [...current, note];
          });
        },
        onCall: function arrived(call) {
          landed = call as Call;
        },
        onFailed: function broke(failure) {
          stumble = failure as Failure;
        }
      }
    );

    setThinking(false);
    setThinkingSteps([]);

    if (stumble) {
      setFailure(stumble);
      return;
    }

    if (landed) {
      await loadDashboard();
    }
  }

  async function findIdeas() {
    if (!data) {
      return;
    }

    setThinking(true);
    setThinkingSteps(["Searching your whole niche"]);
    setWaitedSeconds(0);
    setFailure(null);

    const started = Date.now();
    const timer = window.setInterval(function tick() {
      setWaitedSeconds(Math.round((Date.now() - started) / 1000));
    }, 1000);

    const outcome = await callApi<unknown>("/api/ideas", "POST", { channelId: data.channel.channelId });

    window.clearInterval(timer);
    setThinking(false);
    setThinkingSteps([]);

    if (!outcome.ok) {
      setFailure(outcome.failure);
      return;
    }

    await loadDashboard();
  }

  async function askWhatToStop() {
    if (!data) {
      return;
    }

    setThinking(true);
    setThinkingSteps(["Reading every complaint"]);
    setWaitedSeconds(0);
    setFailure(null);

    const started = Date.now();
    const timer = window.setInterval(function tick() {
      setWaitedSeconds(Math.round((Date.now() - started) / 1000));
    }, 1000);

    const outcome = await callApi<unknown>("/api/weak", "POST", { channelId: data.channel.channelId });

    window.clearInterval(timer);
    setThinking(false);
    setThinkingSteps([]);

    if (!outcome.ok) {
      setFailure(outcome.failure);
      return;
    }

    await loadDashboard();
  }

  function clearFailure() {
    setFailure(null);
  }

  return {
    data,
    failure,
    loading,
    connecting,
    connectStep,
    thinking,
    thinkingSteps,
    waitedSeconds,
    connectChannel,
    askForCall,
    findIdeas,
    askWhatToStop,
    loadDashboard,
    clearFailure
  };
}
