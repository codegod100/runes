import { auth } from "$lib/oauth";
import { json } from "@sveltejs/kit";

export async function GET({ request }) {
  const url = await auth("nandi.dads.lol");
  return json(url);
}
