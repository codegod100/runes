import { Connection } from "$lib/storage";
import { json } from "@sveltejs/kit";
// import { Server } from "socket.io";
import skio from "sveltekit-io";
import type { IncomingMessage, ServerResponse } from "node:http";
import { Firehose } from "@atproto/sync";
import type { Database } from "$lib/db";
import { pino } from "pino";
import type { OAuthClient } from "@atproto/oauth-client-node";
import {
  createBidirectionalResolver,
  createIdResolver,
  type BidirectionalResolver,
} from "$lib/id-resolver";
import { getIronSession } from "iron-session";
import { Agent } from "@atproto/api";
import { createDb, migrateToLatest } from "$lib/db";
import { createClient } from "$lib/auth/client";
import { TID } from "@atproto/common";
import { type Result, Ok, Err } from "$lib/result";
type Session = { did: string };
const connection = new Connection();
const did = "did:plc:ngokl2gnmpbvuvrfckja3g7p";
// const io = new Server();
const socket = skio.get();

export type AppContext = {
  db: Database;
  ingester: Firehose;
  logger: pino.Logger;
  oauthClient: OAuthClient;
  resolver: BidirectionalResolver;
};

async function getSessionAgent(
  req: Request,
  res: Response
): Promise<Result<Agent, string>> {
  const session = await getIronSession<Session>(req, res, {
    cookieName: "sid",
    password: process.env.COOKIE_SECRET!,
  });
  console.log({ session });
  const db = createDb(process.env.DB_PATH!);
  const oauthClient = await createClient(db);
  // console.log({ oauthClient });
  // if (!session.did) return null;
  try {
    const oauthSession = await oauthClient.restore(did);
    return Ok(new Agent(oauthSession));
  } catch (err) {
    console.log({ err });
    return Err(err.message());
    // ctx.logger.warn({ err }, "oauth restore failed");
    session.destroy();
  }
  // return Err("something went wrong");
}

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
    room: "at://did:plc:bpmiiiabnbf2hf7uuqdbjne6/social.psky.chat.room/3l6k3isiuzb2j",
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
  const messages = await connection.messages(room);
  console.log({ messages });
  socket.emit("messages", messages);
  return json("OK");
}
