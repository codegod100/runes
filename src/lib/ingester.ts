import pino from "pino";
import { IdResolver } from "@atproto/identity";
import { Firehose } from "@atproto/sync";
// import type { Database } from "$lib/db";
// import * as Status from "#/lexicon/types/xyz/statusphere/status";
// const Message = require("$lib/lexicon/types/social/psky/chat/message");
import { Connection } from "$lib/storage";
import skio from "sveltekit-io";

const connection = new Connection();

export function createIngester(idResolver: IdResolver) {
  const logger = pino({ name: "firehose ingestion" });
  logger.info("creating ingester");
  console.log("creating ingester");
  return new Firehose({
    idResolver,
    handleEvent: async (evt) => {
      const socket = skio.get();
      logger.info(evt);
      // Watch for write events
      if (evt.event === "create" || evt.event === "update") {
        const now = new Date();
        const record = evt.record;

        // If the write is a valid status update
        if (evt.collection === "social.psky.chat.message") {
          console.log({ record });
          connection.insertMessage(record.content, evt.did, record.room);
          const messages = await connection.messages(record.room);
          console.log({ messages });
          socket.emit("messages", messages);
          // Store the status in our SQLite
          // await db
          //   .insertInto("status")
          //   .values({
          //     uri: evt.uri.toString(),
          //     authorDid: evt.did,
          //     status: record.status,
          //     createdAt: record.createdAt,
          //     indexedAt: now.toISOString(),
          //   })
          //   .onConflict((oc) =>
          //     oc.column("uri").doUpdateSet({
          //       status: record.status,
          //       indexedAt: now.toISOString(),
          //     })
          //   )
          //   .execute();
        }
      }
    },
    onError: (err) => {
      logger.error({ err }, "error on firehose ingestion");
    },
    filterCollections: ["social.psky.chat.message"],
    excludeIdentity: true,
    excludeAccount: true,
  });
}
