export interface StreamHandlers {
  onWaiting: (seconds: number, note: string) => void;
  onCall: (call: unknown) => void;
  onFailed: (failure: unknown) => void;
}

function readOneEvent(chunk: string, handlers: StreamHandlers) {
  let name = "";
  let raw = "";

  for (const line of chunk.split("\n")) {
    if (line.startsWith("event:")) {
      name = line.slice(6).trim();
    }
    if (line.startsWith("data:")) {
      raw = raw + line.slice(5).trim();
    }
  }

  if (name.length === 0 || raw.length === 0) {
    return;
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return;
  }

  if (name === "waiting") {
    const beat = body as { seconds: number; note: string };
    handlers.onWaiting(beat.seconds, beat.note);
    return;
  }

  if (name === "call") {
    handlers.onCall(body);
    return;
  }

  if (name === "failed") {
    handlers.onFailed(body);
  }
}

export async function readEventStream(
  path: string,
  body: unknown,
  handlers: StreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal
  });

  if (!response.body) {
    handlers.onFailed(null);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const step = await reader.read();
    if (step.done) {
      break;
    }

    buffer = buffer + decoder.decode(step.value, { stream: true });

    let split = buffer.indexOf("\n\n");
    while (split >= 0) {
      readOneEvent(buffer.slice(0, split), handlers);
      buffer = buffer.slice(split + 2);
      split = buffer.indexOf("\n\n");
    }
  }
}
