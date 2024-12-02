import type { PageLoad } from "./$types";
import { getSessionAgent } from "$lib/agent.js";
import { json } from "@sveltejs/kit";
import getCookieStore from "$lib/cookies";
import pino from "pino";

const logger = pino();

export const load: PageLoad = async ({ params, request, cookies }) => {
  let logged_in: false;
  let _agent = await getSessionAgent(getCookieStore(cookies));
  logger.info({ _agent });
  logger.info({ wat: _agent.ok });
  if (_agent.ok) {
    logged_in = true;
  }
  logger.info({ logged_in });

  // console.log({ messages });
  return { room: params.room, logged_in };
};
