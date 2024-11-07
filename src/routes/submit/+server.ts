import { Connection } from "$lib/storage";
import { json } from "@sveltejs/kit";
// import { Server } from "socket.io";
const connection = new Connection();
const did = "did:plc:ngokl2gnmpbvuvrfckja3g7p";
// const io = new Server();
import skio from "sveltekit-io";
const socket = skio.get();
export async function POST({ request }) {
  const { room, message } = await request.json();
  connection.insertMessage(message, did, room);
  const messages = connection.messages(room);
  socket.emit("messages", messages);
  return json("OK");
}
