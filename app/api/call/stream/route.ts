import type { NextRequest } from "next/server";
import { connectToMinds } from "@/lib/minds/connectToMinds";
import { readCallFromReply } from "@/lib/minds/readCallFromReply";
import { askAzure, canAskAzure } from "@/lib/azure/askAzure";
import { askForNextCall } from "@/prompts/askForNextCall";
import { readChannelRecord } from "@/lib/store/readChannelRecord";
import { saveCall } from "@/lib/store/saveCall";
import { describeFailure } from "@/lib/errors/describeFailure";
import type { Failure } from "@/types/result";

export const maxDuration = 300;

const waitLimitInMs = 280000;
const beatEveryMs = 1000;

const notes = [
  { after: 0, text: "Sending your comments over" },
  { after: 4, text: "Your Mind is reading them" },
  { after: 14, text: "Weighing what people asked twice" },
  { after: 34, text: "Comparing against what it remembers" },
  { after: 64, text: "Still thinking, it does this properly" },
  { after: 120, text: "Taking longer than usual, hold on" },
  { after: 200, text: "Nearly at the limit now" }
];

function readNote(seconds: number): string {
  let chosen = notes[0].text;
  for (const note of notes) {
    if (seconds >= note.after) {
      chosen = note.text;
    }
  }
  return chosen;
}

function packEvent(name: string, body: unknown): string {
  return "event: " + name + "\ndata: " + JSON.stringify(body) + "\n\n";
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(function onBadBody() {
    return {};
  })) as { channelId?: string };

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let closed = false;

      function push(name: string, payload: unknown) {
        if (closed) {
          return;
        }
        controller.enqueue(encoder.encode(packEvent(name, payload)));
      }

      function finish(name: string, payload: unknown) {
        push(name, payload);
        closed = true;
        controller.close();
      }

      function stopWith(failure: Failure) {
        finish("failed", failure);
      }

      const record = await readChannelRecord(body.channelId ?? "");
      if (!record.ok) {
        stopWith(record.failure);
        return;
      }

      const connection = connectToMinds();
      if (!connection.ok) {
        stopWith(connection.failure);
        return;
      }

      const client = connection.value;
      const alias = record.value.mind.alias;
      const question = askForNextCall(record.value.asks);

      let mark = "";
      try {
        mark = (await client.getLatestHistoryFingerprint(alias)) ?? "";
      } catch {
        mark = "";
      }

      try {
        await client.sendMessage({ alias, messageText: question });
      } catch {
        stopWith(describeFailure("mind_unavailable"));
        return;
      }

      const startedAt = Date.now();
      const beat = setInterval(function sendBeat() {
        const seconds = Math.round((Date.now() - startedAt) / 1000);
        push("waiting", { seconds, note: readNote(seconds) });
      }, beatEveryMs);

      push("waiting", { seconds: 0, note: readNote(0) });

      try {
        const outcome = await client.waitForReply({
          alias,
          timeoutMs: waitLimitInMs,
          afterFingerprint: mark.length > 0 ? mark : undefined,
          sentMessageText: question
        });

        clearInterval(beat);

        const fromMind = outcome.timedOut
          ? null
          : readCallFromReply(outcome.reply?.messageText ?? "", record.value.channel.channelId, "mind");

        let call = fromMind && fromMind.ok ? fromMind : null;

        if (!call) {
          if (!canAskAzure()) {
            stopWith(describeFailure("mind_took_too_long"));
            return;
          }

          push("waiting", { seconds: 0, note: "Your Mind could not answer, using the standby model" });

          const spare = await askAzure(question);
          if (!spare.ok) {
            stopWith(describeFailure("mind_took_too_long"));
            return;
          }

          const fromSpare = readCallFromReply(spare.value, record.value.channel.channelId, "fallback");
          if (!fromSpare.ok) {
            stopWith(fromSpare.failure);
            return;
          }

          call = fromSpare;
        }

        const saved = await saveCall(record.value.channel.channelId, call.value);
        if (!saved.ok) {
          stopWith(saved.failure);
          return;
        }

        finish("call", saved.value);
      } catch {
        clearInterval(beat);
        stopWith(describeFailure("mind_unavailable"));
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
