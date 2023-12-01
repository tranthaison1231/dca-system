import prisma from "$lib/db/prisma.js";

export async function GET(event) {
  const currencies = await prisma.currency.findMany({
    where: {
      userId: event.locals.session.userId,
    },
  });

  return new Response(JSON.stringify(currencies), {
    headers: {
      "content-type": "application/json",
    },
  });
}
