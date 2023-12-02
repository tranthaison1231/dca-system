import prisma from "$lib/db/prisma.js";
import { json } from "@sveltejs/kit";

export async function GET(event) {
  if (!event.locals.session) {
    return json({
      status: "error",
      message: "Not logged in",
    });
  }

  const currencies = await prisma.currency.findMany({
    where: {
      userId: event.locals.session.userId,
    },
  });

  return json({
    status: "success",
    currencies: currencies,
  });
}
