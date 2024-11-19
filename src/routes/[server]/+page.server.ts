import type { PageLoad } from "./$types";
import { getSessionAgent } from "$lib/agent";
import { json } from "@sveltejs/kit";
export const load: PageLoad = async ({ params, request }) => {
  let agent = await getSessionAgent(request, json(""));
  if (!agent.ok) {
    return;
  }
  const res = await agent.value.com.atproto.repo.listRecords({
    repo: agent.value.assertDid,
    collection: "ooo.demon.chat.server",
  });
  console.log({ res });
  const enc = encodeURIComponent;
  // const server = enc(params.server)
  const server = enc(params.server);
  const room = enc("at://did:plc:b3pn34agqqchkaf75v7h43dk/social.psky.chat.room/3lat3axu4bk2u")
  return { records: res.data.records, server, room };
};
