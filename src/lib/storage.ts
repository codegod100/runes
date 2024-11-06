import { Database } from "bun:sqlite";
export class Message {
  id: number;
  text: string;
  author: string;
  channel: string;
  server: string; //did of server
}
class Server {
  did: string;
}
class Channel {
  did: string;
  title: string;
}

export class Connection {
  db: Database;
  last_query: string;
  constructor() {
    const db = new Database("runes.db");
    this.db = db;
    db.exec("PRAGMA journal_mode = WAL;");
    try {
      db.run(
        `create table messages(id integer primary key, created_at text, text text, author text, channel text, server text);
         create table servers(did text primary key);`
      );
    } catch (e) {
      // console.log(e);
    }
  }
  messages(channel: string): Message[] {
    let messages: Message[];
    if (this.last_query) {
      const query = this.db
        .query(
          `select * from messages where channel = $channel and created_at > $last_query`
        )
        .as(Message);
      messages = query.all({ $channel: channel, $last_query: this.last_query });
    } else {
      const query = this.db
        .query(`select * from messages where channel = $channel`)
        .as(Message);
      messages = query.all({ $channel: channel });
    }
    if (messages.length) {
      //   console.log({ messages });
      //   console.log({ length: messages.length });
      //   this.last_query = new Date().toISOString();
    }
    return messages;
  }
  insertMessage(text: string, author: string, channel: string): void {
    const query = this.db.query(
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
