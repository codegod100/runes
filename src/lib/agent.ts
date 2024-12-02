import { getIronSession } from "iron-session";
import { Agent } from "@atproto/api";
import { createClient } from "$lib/auth/client";
import { type Result, Ok, Err } from "$lib/result";
import pino from "pino";
const logger = pino();
type Session = { did: string };
// const did = "did:plc:ngokl2gnmpbvuvrfckja3g7p";
export async function getSessionAgent(cookies): Promise<Result<Agent, string>> {
  const session = await getIronSession(cookies, {
    cookieName: "sid",
    password: process.env.COOKIE_SECRET!,
  });
  logger.info({ session });
  const oauthClient = await createClient();
  // logger.info({ oauthClient });
  if (!session.did) return Err("no did");
  try {
    const oauthSession = await oauthClient.restore(session.did);
    return Ok(new Agent(oauthSession));
  } catch (err) {
    logger.info({ err });
    return Err(err.message);
    // ctx.logger.warn({ err }, "oauth restore failed");
    session.destroy();
  }
  // return Err("something went wrong");
}
