import type { PageLoad } from "./$types";
import { Connection } from "$lib/storage";
const connection = new Connection();

export const load: PageLoad = ({ params }) => {
  const messages = connection.messages();
  console.log({ messages });
  return { messages: JSON.stringify(messages) };
};

import type { Actions } from "./$types";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const message = data.get("message")! as string;
    // TODO log the user in
    connection.insertMessage(message);
  },
} satisfies Actions;
