import { json, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { handleClerk } from "clerk-sveltekit/server";
import { CLERK_SECRET_KEY } from "$env/static/private";

async function authMiddleware({ event, resolve }: Parameters<Handle>[0]) {
  if (
    event.url.pathname.startsWith("/api") &&
    !event.url.pathname.startsWith("/api/webhooks") &&
    !event.locals.session
  ) {
    return json(
      {
        status: "error",
        message: "Not logged in",
      },
      {
        status: 401,
      }
    );
  }
  return resolve(event);
}

export const handle: Handle = sequence(
  handleClerk(CLERK_SECRET_KEY, {
    protectedPaths: [
      "/dashboard",
      "/portfolio",
      "setting",
      "/metrics",
      "/whales",
    ],
    signInUrl: "/sign-in",
  }),
  authMiddleware
);
