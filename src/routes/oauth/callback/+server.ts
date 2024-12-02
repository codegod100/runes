import { createClient } from "$lib/auth/client";
import { json } from "@sveltejs/kit";
import { getIronSession } from "iron-session";
import { redirect } from "@sveltejs/kit";

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
  redirect(307, "/foo/bar");
}
