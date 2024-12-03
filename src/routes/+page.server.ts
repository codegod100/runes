import { redirect } from "@sveltejs/kit";

export const load = async ({ url }) => {
  redirect(307, `/main/default`);
};
