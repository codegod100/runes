import { createClient } from "$lib/auth/client";
import { json } from "@sveltejs/kit";
import { getIronSession } from "iron-session";

type Session = { did: string };

export async function GET({ request, params, url }) {
  const oauthClient = await createClient();
  const { session } = await oauthClient.callback(url.searchParams);
  const clientSession = await getIronSession<Session>(request, json(""), {
    cookieName: "sid",
    password: process.env.COOKIE_SECRET!,
  });
  clientSession.did = session.did;
  await clientSession.save();
  return json("yolo");
}
