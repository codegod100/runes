import { redirect } from "@sveltejs/kit";
export const load = async ({ cookies }) => {
  cookies.delete("sid", { path: "/" });
  redirect(307, "/");
};
