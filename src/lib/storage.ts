// import { Database } from "bun:sqlite";
import sqlite from "sqlite3";

// export class Message {
//   id: number;
//   text: string;
//   author: string;
//   channel: string;
//   server: string; //did of server
// }

type Message = {
  id: number;
  text: string;
  author: string;
  channel: string;
  server: string;
};
class Server {
  did: string;
}
class Channel {
  did: string;
  title: string;
}

export class Connection {
  db: sqlite.Database;
  last_query: string;
  constructor() {
    // const db = new Database("runes.db");
    const db = new sqlite.Database("runes.db");
    this.db = db;
    db.exec("PRAGMA journal_mode = WAL;");
    try {
      db.run(
        `create table messages(id integer primary key, created_at text, text text, author text, channel text, server text);
         create table servers(did text primary key);`,
        (err) => {
          console.log({ err });
        }
      );
    } catch (e) {
      // console.log(e);
    }
  }
  async messages(channel: string): Promise<Message[]> {
    let messages: Message[] = [];
    let promise: Promise<Message[]> = new Promise((resolve, reject) => {
      if (this.last_query) {
        const query = this.db.prepare(
          `select * from messages where channel = $channel and created_at > $last_query`
        );

        query.each(
          {
            $channel: channel,
            $last_query: this.last_query,
          },
          (err, row) => {
            console.log({ err });
            let message: Message = row as Message;
            messages.push(message);
          }
        );
      } else {
        const query = this.db.prepare(
          `select * from messages where channel = $channel`
        );
        query.all({ $channel: channel }, (err, rows) => {
          console.log({ err });
          if (err) {
            reject(err);
          }

          resolve(rows as Message[]);
        });
      }
    });
    return promise;
  }
  insertMessage(text: string, author: string, channel: string): void {
    const query = this.db.prepare(
      "insert into messages (text, author, channel, created_at) values ($text, $author, $channel, $created_at)"
    );
    query.run({
      $text: text,
      $author: author,
      $channel: channel,
      $created_at: new Date().toISOString(),
    });
  }
}
