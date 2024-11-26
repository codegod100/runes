import type { Actions } from "./$types";
import { getSessionAgent } from "$lib/agent.js";
import { json } from "@sveltejs/kit";

export const actions = {
  default: async (event) => {
    let agent = await getSessionAgent(event.request, json(""));
    console.log({ request: event.request });
    const data = await event.request.formData();
    console.log({ data });
    const file = data.get("file");
    console.log({ file });
    if (!agent.ok) {
      return json(agent.error);
    }

    const res = await agent.value.com.atproto.repo.uploadBlob(file as File);
    console.log({ res });
    console.log(res.data.blob.ref.toString());
    console.log(JSON.stringify(res));
    console.log({ did: agent.value.assertDid });
    // const blobs = await agent.value.com.atproto.sync.listBlobs({ did: agent.value.assertDid })
    // console.log(JSON.stringify(blobs));
    // const cid = blobs.data.cids[0];
    const cid = res.data.blob.ref.toString();
    const did = agent.value.assertDid;
    const crecord = await agent.value.com.atproto.repo.createRecord({
      repo: did,
      collection: "ooo.demon.test.file",
      record: {
        $type: "ooo.demon.test.file",
        blob: {
          $type: "blob",
          ref: {
            $link: cid,
          },
          mimeType: file.type,
          size: file.size,
        },
      },
    });
    console.log({ crecord });
    const blob = await agent.value.com.atproto.sync.getBlob({
      did: agent.value.assertDid,
      cid: res.data.blob.ref.toString(),
    });
    console.log(JSON.stringify(blob));
  },
};
