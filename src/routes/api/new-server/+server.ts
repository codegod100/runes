import { getSessionAgent } from "$lib/agent";
import { json } from "@sveltejs/kit";
export async function POST({ request }) {
  const data = await request.json();
  let agent = await getSessionAgent(request, json(""));
  if (!agent.ok) {
    return json("oops no agent");
  }
  const res = await agent.value.com.atproto.repo.createRecord({
    repo: agent.value.assertDid,
    collection: "ooo.demon.chat.server",
    record: {
      $type: "ooo.demon.chat.server",
      rooms: data.rooms,
    },
  });
  console.log({ res });
  return json(res);
}
