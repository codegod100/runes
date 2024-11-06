import type { PageLoad } from "./$types";
import { Connection } from "$lib/storage";
const connection = new Connection();

export const load: PageLoad = ({ params }) => {
  return { room: params.room };
};

import type { Actions } from "./$types";
const did = "did:plc:ngokl2gnmpbvuvrfckja3g7p";
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    console.log({ data });
    const message = data.get("message")! as string;
    const channel = data.get("room")! as string;
    connection.insertMessage(message, did, channel);
  },
} satisfies Actions;
