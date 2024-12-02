import { auth } from "$lib/oauth";
import { json } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
export async function GET({ request, params }) {
  const url = await auth(params.did);
  redirect(307, url);
  // return json(url);
}
