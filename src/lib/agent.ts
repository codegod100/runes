import { getIronSession } from "iron-session";
import { Agent } from "@atproto/api";
import { createDb, migrateToLatest } from "$lib/db";
import { createClient } from "$lib/auth/client";
import { type Result, Ok, Err } from "$lib/result";
type Session = { did: string };
const did = "did:plc:ngokl2gnmpbvuvrfckja3g7p";
export async function getSessionAgent(
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
