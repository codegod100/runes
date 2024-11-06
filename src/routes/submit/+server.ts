import { Connection } from "$lib/storage";
import { json } from "@sveltejs/kit";
const connection = new Connection();
const did = "did:plc:ngokl2gnmpbvuvrfckja3g7p";
export async function POST({ request }) {
  const { room, message } = await request.json();
  connection.insertMessage(message, did, room);
  return json("OK");
}
