import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export class StateStore implements NodeSavedStateStore {
  async get(key: string): Promise<NodeSavedState | undefined> {
    const record = await pb
      .collection("auth_state")
      .getFirstListItem(`key="${key}"`);
    // const result = await this.db
    //   .selectFrom("auth_state")
    //   .selectAll()
    //   .where("key", "=", key)
    //   .executeTakeFirst();
    // if (!result) return;
    return JSON.parse(record.state);
  }
  async set(key: string, val: NodeSavedState) {
    const state = JSON.stringify(val);
    await pb.collection("auth_state").create({ key, state });
    // await this.db
    //   .insertInto("auth_state")
    //   .values({ key, state })
    //   .onConflict((oc) => oc.doUpdateSet({ state }))
    //   .execute();
  }
  async del(key: string) {
    const record = await pb
      .collection("auth_state")
      .getFirstListItem(`key="${key}"`);
    pb.collection("auth_state").delete(record.id);
    // await this.db.deleteFrom("auth_state").where("key", "=", key).execute();
  }
}

export class SessionStore implements NodeSavedSessionStore {
  async get(key: string): Promise<NodeSavedSession | undefined> {
    const record = await pb
      .collection("auth_session")
      .getFirstListItem(`key="${key}"`);
    // const result = await this.db
    //   .selectFrom("auth_session")
    //   .selectAll()
    //   .where("key", "=", key)
    //   .executeTakeFirst();
    // if (!result) return;
    // return JSON.parse(result.session) as NodeSavedSession;
    return JSON.parse(record.session);
  }
  async set(key: string, val: NodeSavedSession) {
    const session = JSON.stringify(val);
    await pb.collection("auth_session").create({ key, session });
    // await this.db
    //   .insertInto("auth_session")
    //   .values({ key, session })
    //   .onConflict((oc) => oc.doUpdateSet({ session }))
    //   .execute();
  }
  async del(key: string) {
    const record = await pb
      .collection("auth_session")
      .getFirstListItem(`key="${key}"`);
    pb.collection("auth_session").delete(record.id);
  }
}
