import type { PageLoad } from "./$types";
import { getSessionAgent } from "$lib/agent.js";
import { json } from "@sveltejs/kit";
import getCookieStore from "$lib/cookies";
let logged_in: bool;

export const load: PageLoad = async ({ params, request, cookies }) => {
  let _agent = await getSessionAgent(getCookieStore(cookies));
  if (_agent.ok) {
    logged_in = true;
  }

  // console.log({ messages });
  return { room: params.room, logged_in };
};
