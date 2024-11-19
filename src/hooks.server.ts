import { createIdResolver } from "$lib/id-resolver";
import { createIngester } from "$lib/ingester.js";
import PocketBase from 'pocketbase';
import { POCKET_BASE } from "$env/static/private";
import dotenv from "dotenv";
import createSocket from "$lib/websocket";
const pb = new PocketBase(POCKET_BASE);
console.log("server hooks")
dotenv.config();
// const baseIdResolver = createIdResolver();
// const ingester = createIngester(baseIdResolver);
// ingester.start();
const jetstream = createSocket();
jetstream.start();
jetstream.
    onCreate("social.psky.chat.message", async (
        event) => {
        console.log(
            JSON.stringify(event));

        const data = { room: event.commit.record.room, content: event.commit.record.content, rkey: event.commit.rkey, did: event.did }
        const record = await pb.collection('messages').create(data);
    });

// jetstream.
//     on("account", (
//         event) => {

//         console.
//             log("account update",
//                 event.
//                     account.
//                     status)
//     });

jetstream.on('error', (err) => {
    console.log('error')
    console.log({ err });
});