import { createClient } from "$lib/auth/client";
import { json } from "@sveltejs/kit";
import { getIronSession } from "iron-session";
import { redirect } from "@sveltejs/kit";
import getCookieStore from "$lib/cookies";
type Session = { did: string };

export async function GET({ request, params, url, cookies }) {
  const oauthClient = await createClient();
  const { session } = await oauthClient.callback(url.searchParams);
  const clientSession = await getIronSession<Session>(getCookieStore(cookies), {
    cookieName: "sid",
    password: process.env.COOKIE_SECRET!,
  });
  clientSession.did = session.did;
  await clientSession.save();
  // return json("test");
  redirect(307, "/foo/bar");
}
