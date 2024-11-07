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
  return { records: res.data.records };
};
