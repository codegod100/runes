import { createClient } from "$lib/auth/client";
import { json } from "@sveltejs/kit";
import { createDb, migrateToLatest } from "$lib/db";
import { getIronSession } from "iron-session";

type Session = { did: string };

export async function GET({ request, params, url }) {
  const { NODE_ENV, HOST, PORT, DB_PATH } = process.env;
  const db = createDb(DB_PATH!);
  const oauthClient = await createClient(db);
  const { session } = await oauthClient.callback(url.searchParams);
  const clientSession = await getIronSession<Session>(request, json(""), {
    cookieName: "sid",
    password: process.env.COOKIE_SECRET!,
  });
  clientSession.did = session.did;
  await clientSession.save();
  return json("yolo");
}
