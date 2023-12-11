import prisma from "$lib/db/prisma";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {
  const user = await prisma.user.findFirst({
    where: {
      clerkId: event.locals.session.userId,
    },
  });

  return json({
    status: "success",
    user: user,
  });
}

export async function PUT(event: RequestEvent) {
  const updatedUserDto = await event.request.json();

  const updatedUser = await prisma.user.update({
    where: {
      clerkId: event.locals.session.userId,
    },
    data: {
      ...updatedUserDto,
    },
  });

  return json({
    status: "success",
    user: updatedUser,
  });
}
