import { createClient } from "$lib/auth/client";
import { createDb, migrateToLatest } from "$lib/db";

export async function auth(handle: string) {
  const { NODE_ENV, HOST, PORT, DB_PATH } = process.env;
  const db = createDb(DB_PATH!);
  await migrateToLatest(db);
  const oauthClient = await createClient(db);
  const url = oauthClient.authorize(handle, {
    scope: "atproto transition:generic",
  });
  return url;
}
