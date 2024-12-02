import { auth } from "$lib/oauth";
import { json } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
export async function GET({ request }) {
  const url = await auth("nandi.dads.lol");
  redirect(307, url);
  // return json(url);
}
