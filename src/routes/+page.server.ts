import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
  if (!event.locals.session) {
    redirect(302, "/sign-in");
  }
  redirect(302, "/dashboard");
};
