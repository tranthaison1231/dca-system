// import { json, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { handleClerk } from "clerk-sveltekit/server";
import { CLERK_SECRET_KEY } from "$env/static/private";
import type { Handle } from "@sveltejs/kit";

// async function authMiddleware({ event, resolve }) {
//   if (event.url.pathname.startsWith("/api") && !event.locals.session) {
//     return json(
//       {
//         status: "error",
//         message: "Not logged in",
//       },
//       {
//         status: 401,
//       }
//     );
//   }
//   return resolve(event);
// }

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
  })
  // authMiddleware
);
