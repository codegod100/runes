import { createClient } from "$lib/auth/client";
import { createDb, migrateToLatest } from "$lib/db";

export async function auth(handle: string) {
  const oauthClient = await createClient();
  const url = oauthClient.authorize(handle, {
    scope: "atproto transition:generic",
  });
  return url;
}
