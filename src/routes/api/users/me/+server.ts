import prisma from "$lib/db/prisma";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {
  if (!event.locals.session) {
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

  const user = await prisma.user.findMany({
    where: {
      clerkId: event.locals.session.userId,
    },
  });

  return json({
    status: "success",
    user: user,
  });
}
