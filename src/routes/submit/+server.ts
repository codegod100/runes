import { Connection } from "$lib/storage";
import { json } from "@sveltejs/kit";
import { Firehose } from "@atproto/sync";
import type { Database } from "$lib/db";
import { pino } from "pino";
import type { OAuthClient } from "@atproto/oauth-client-node";
import {
  createBidirectionalResolver,
  createIdResolver,
  type BidirectionalResolver,
} from "$lib/id-resolver";

import { TID } from "@atproto/common";
import { getSessionAgent } from "$lib/agent.js";
const connection = new Connection();

// const io = new Server();
// const socket = skio.get();

export type AppContext = {
  db: Database;
  ingester: Firehose;
  logger: pino.Logger;
  oauthClient: OAuthClient;
  resolver: BidirectionalResolver;
};

export async function POST({ request }) {
  const { room, message } = await request.json();
  let agent = await getSessionAgent(request, json(""));
  if (!agent.ok) {
    return json(agent.error);
  }
  console.log({ agent });
  const rkey = TID.nextStr();
  const record = {
    $type: "social.psky.chat.message",
    content: message,
    room: "at://did:plc:b3pn34agqqchkaf75v7h43dk/social.psky.chat.room/3lat3axu4bk2k",
  };

  const res = await agent.value.com.atproto.repo.putRecord({
    repo: agent.value.assertDid,
    collection: "social.psky.chat.message",
    rkey,
    record,
    validate: false,
  });
  console.log({ res });
  // connection.insertMessage(message, did, room);
  // const messages = await connection.messages(room);
  // console.log({ messages });
  // socket.emit("messages", messages);
  return json("OK");
}
