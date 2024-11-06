import { Database } from "bun:sqlite";
import type { Changes } from "bun-types/sqlite";
class Message {
  id: number;
  text: string;
  author?: number;
}
class Channel {
  title: string;
  messages: Message[];
}

export class Connection {
  db: Database;
  constructor() {
    const db = new Database("runes.db");
    this.db = db;
    db.exec("PRAGMA journal_mode = WAL;");
    try {
      db.run(
        `create table messages(id integer primary key, text text, author author_id);`
      );
    } catch (e) {
      // console.log(e);
    }
  }
  messages(): Message[] {
    const query = this.db.query(`select * from messages`).as(Message);
    let messages = query.all();
    if (!messages.length) {
      this.db.run("insert into messages (id,text) values (1,'yolo')");
    }
    messages = query.all();
    return messages;
  }
  insertMessage(message: string): void {
    const query = this.db.query("insert into messages (text) values ($text)");
    query.run({ $text: message });
  }
}
