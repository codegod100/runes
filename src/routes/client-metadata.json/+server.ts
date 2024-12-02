import { createClient } from "$lib/auth/client";
import { json } from "@sveltejs/kit";

export async function GET({ request }) {
  const oauthClient = await createClient();
  return json(oauthClient.clientMetadata);
}
