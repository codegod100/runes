import type { PageLoad } from "./$types";
import { Connection } from "$lib/storage";
const connection = new Connection();

export const load: PageLoad = async ({ params }) => {
  const messages = await connection.messages(params.room);
  // console.log({ messages });
  return { messages: JSON.stringify(messages), room: params.room };
};
