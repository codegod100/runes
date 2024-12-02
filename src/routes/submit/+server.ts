import { getSessionAgent } from "$lib/agent.js";
import { json } from "@sveltejs/kit";
import { TID } from "@atproto/common";

export async function POST({ request }) {
  const { room, message } = await request.json();
  let agent = await getSessionAgent(request, json(""));
  if (!agent.ok) {
    return json(agent.error);
  }
  console.log({ agent: agent.value });
  const rkey = TID.nextStr();
  const record = {
    $type: "social.psky.chat.message",
    content: message,
    room: "at://did:plc:b3pn34agqqchkaf75v7h43dk/social.psky.chat.room/3lat3axu4bk2k",
  };

  const res = await agent.value.com.atproto.repo.putRecord({
    repo: agent.value.assertDid,
    collection: "social.psky.chat.message",
    rkey,
    record,
    validate: false,
  });
  console.log({ res });

  return json("OK");
}
