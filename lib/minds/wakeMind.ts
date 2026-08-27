import type { MindHandle } from "@/types/mind";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";
import type { MindsClient } from "./connectToMinds";
import { chooseArchetype } from "./chooseArchetype";
import { nameAliasForChannel, nameMindForChannel } from "./nameMindForChannel";

export async function wakeMind(
  client: MindsClient,
  channelTitle: string,
  channelId: string
): Promise<Result<MindHandle>> {
  const wantedName = nameMindForChannel(channelTitle, channelId);
  const alias = nameAliasForChannel(channelId);

  const existing = await findExistingMind(client, wantedName);
  if (existing.ok) {
    const bound = await bindConversation(client, alias, existing.value.mindId);
    if (!bound.ok) {
      return fail(bound.failure);
    }
    return succeed({ mindId: existing.value.mindId, name: wantedName, alias });
  }

  try {
    const created = await client.awakenMind({ name: wantedName, id: chooseArchetype() });
    const bound = await bindConversation(client, alias, created.mindId);
    if (!bound.ok) {
      return fail(bound.failure);
    }
    return succeed({ mindId: created.mindId, name: wantedName, alias });
  } catch {
    return fail(describeFailure("mind_unavailable"));
  }
}

async function findExistingMind(
  client: MindsClient,
  wantedName: string
): Promise<Result<{ mindId: string }>> {
  try {
    const minds = await client.listMinds();
    const match = minds.find(function hasName(mind) {
      return mind.name === wantedName;
    });
    if (!match) {
      return fail(describeFailure("nothing_stored"));
    }
    return succeed({ mindId: match.mindId });
  } catch {
    return fail(describeFailure("mind_unavailable"));
  }
}

async function bindConversation(
  client: MindsClient,
  alias: string,
  mindId: string
): Promise<Result<true>> {
  try {
    await client.ensureConversation(alias, mindId);
    return succeed(true);
  } catch {
    return fail(describeFailure("mind_unavailable"));
  }
}
