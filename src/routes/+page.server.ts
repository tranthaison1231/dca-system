import { redirect, type RequestEvent } from "@sveltejs/kit";

export const load = async (event: RequestEvent) => {
  if (!event.locals.session) {
    redirect(302, "/sign-in");
  }
  redirect(302, "/dashboard");
};
