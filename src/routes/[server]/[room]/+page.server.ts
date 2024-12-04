import type { PageLoad } from "./$types";
import { getSessionAgent } from "$lib/agent.js";
import { json } from "@sveltejs/kit";
import getCookieStore from "$lib/cookies";
import pino from "pino";
import { DidResolver } from "@atproto/identity";
const logger = pino();

export const load: PageLoad = async ({ params, request, cookies }) => {
  let logged_in = false;
  let handle = "";
  let _agent = await getSessionAgent(getCookieStore(cookies));
  if (_agent.ok) {
    logged_in = true;

    const didres = new DidResolver({});
    const did = _agent.value.assertDid;
    const doc = await didres.resolveAtprotoData(did);
    handle = doc.handle;
  } else {
    logger.info({ _agent });
  }

  logger.info({ room: params.room, logged_in, handle });
  return { room: params.room, logged_in, handle };
};
