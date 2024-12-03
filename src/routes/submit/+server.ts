import { getSessionAgent } from "$lib/agent.js";
import { json } from "@sveltejs/kit";
import { TID } from "@atproto/common";
import getCookieStore from "$lib/cookies";
import pino from "pino";

const logger = pino();
export async function POST({ request, cookies }) {
  const { room, message } = await request.json();
  let agent = await getSessionAgent(getCookieStore(cookies));
  if (!agent.ok) {
    return json(agent.error, { status: 401 });
  }
  logger.info({ agent: agent.value });
  const rkey = TID.nextStr();
  const record = {
    $type: "social.psky.chat.message",
    content: message,
    room,
  };

  const res = await agent.value.com.atproto.repo.putRecord({
    repo: agent.value.assertDid,
    collection: "social.psky.chat.message",
    rkey,
    record,
    validate: false,
  });
  logger.info({ res });

  return json("OK");
}
