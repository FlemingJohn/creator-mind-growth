"use client";

import { useCallback, useEffect, useState } from "react";
import type { Call } from "@/types/call";
import type { DashboardData } from "@/types/dashboard";
import type { Failure } from "@/types/result";
import { callApi } from "@/lib/browser/callApi";

const stepPace = 2200;

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connectStep, setConnectStep] = useState(0);
  const [thinking, setThinking] = useState(false);

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
    setFailure(null);

    const outcome = await callApi<Call>("/api/call", "POST", { channelId: data.channel.channelId });

    setThinking(false);

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
    connectChannel,
    askForCall,
    loadDashboard,
    clearFailure
  };
}
