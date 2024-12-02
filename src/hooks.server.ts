import { createIdResolver } from "$lib/id-resolver";
import PocketBase from "pocketbase";
import { PUBLIC_POCKET_BASE } from "$env/static/public";
import dotenv from "dotenv";
import createSocket from "$lib/websocket";
import { DidResolver } from "@atproto/identity";
import pino from "pino";
const logger = pino();
const didres = new DidResolver({});
const pb = new PocketBase(PUBLIC_POCKET_BASE);
logger.info("server hooks");
dotenv.config();
// const baseIdResolver = createIdResolver();
// const ingester = createIngester(baseIdResolver);
// ingester.start();
const jetstream = createSocket();
jetstream.start();
jetstream.onCreate("social.psky.chat.message", async (event) => {
  logger.info(JSON.stringify(event));
  const doc = await didres.resolveAtprotoData(event.did);
  logger.info({ doc });
  const data = {
    room: event.commit.record.room,
    content: event.commit.record.content,
    rkey: event.commit.rkey,
    did: event.did,
    handle: doc.handle,
    created: new Date(event.time_us).toISOString(),
  };
  const record = await pb
    .collection("messages")
    .create(data)
    .catch((e) => logger.info({ e }));
  logger.info({ record });
});

jetstream.on("error", (err) => {
  logger.info("error");
  logger.info({ err });
});
