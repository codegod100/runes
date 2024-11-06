import { produce } from "sveltekit-sse";
import { Connection } from "$lib/storage";
const connection = new Connection();

function delay(milliseconds: number) {
  return new Promise(function run(resolve) {
    setTimeout(resolve, milliseconds);
  });
}

export function POST({ params }) {
  return produce(async function start({ emit }) {
    let m;
    while (true) {
      // console.log(connection.last_query);
      const messages = connection.messages(params.room);
      const r = JSON.stringify(messages);
      if (m != r) {
        // console.log({ messages });
        const { error } = emit("message", r);
        if (error) {
          return;
        }
      }
      m = r;

      await delay(1000);
    }
  });
}
