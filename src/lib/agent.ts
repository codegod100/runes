import { getIronSession } from "iron-session";
import { Agent } from "@atproto/api";
import { createClient } from "$lib/auth/client";
import { type Result, Ok, Err } from "$lib/result";
import pino from "pino";
import { type Error } from "$lib/util";
import { type CookieStore } from "$lib/cookies";
const logger = pino();
type Session = { did: string };
export async function getSessionAgent(
  cookies: CookieStore,
): Promise<Result<Agent, string>> {
  const session = await getIronSession<Session>(cookies, {
    cookieName: "sid",
    password: process.env.COOKIE_SECRET!,
  });
  const oauthClient = await createClient();
  if (!session.did) return Err("no did");
  try {
    const oauthSession = await oauthClient.restore(session.did);
    return Ok(new Agent(oauthSession));
  } catch (e) {
    return Err(e.message);
    session.destroy();
  }
}
