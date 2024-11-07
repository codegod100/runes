import type { PageLoad } from "./$types";
import { Connection } from "$lib/storage";
const connection = new Connection();

export const load: PageLoad = ({ params }) => {
  const messages = connection.messages(params.room);
  return { messages: JSON.stringify(messages), room: params.room };
};
