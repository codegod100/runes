import { NodeOAuthClient } from "@atproto/oauth-client-node";
import type { Database } from "$lib/db";
import { SessionStore, StateStore } from "$lib/auth/storage";

export const createClient = async (db: Database) => {
  const publicUrl = process.env.PUBLIC_URL;
  const url = publicUrl || `http://127.0.0.1:${process.env.PORT}`;
  const enc = encodeURIComponent;
  return new NodeOAuthClient({
    clientMetadata: {
      client_name: "AT Protocol Express App",
      client_id: publicUrl
        ? `${url}/client-metadata.json`
        : `http://localhost?redirect_uri=${enc(`${url}/oauth/callback`)}&scope=${enc("atproto transition:generic")}`,
      client_uri: url,
      redirect_uris: [`${url}/oauth/callback`],
      scope: "atproto transition:generic",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "none",
      dpop_bound_access_tokens: true,
    },
    stateStore: new StateStore(db),
    sessionStore: new SessionStore(db),
  });
};
