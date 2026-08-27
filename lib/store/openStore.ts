import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Store } from "@/types/store";

const storePath = join(process.cwd(), "data", "store.json");

const emptyStore: Store = { channels: {} };

export async function openStore(): Promise<Store> {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!parsed.channels) {
      return emptyStore;
    }
    return parsed;
  } catch {
    return emptyStore;
  }
}

export async function saveStore(store: Store): Promise<boolean> {
  try {
    await mkdir(dirname(storePath), { recursive: true });
    await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}
