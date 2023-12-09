import prisma from "$lib/db/prisma";
import { json, type RequestEvent } from "@sveltejs/kit";

export const GET = async (event: RequestEvent) => {
  const currencyId = event.params.id;

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: event.locals.session.userId,
      currencyId: currencyId!,
    },
  });
  return json({
    status: "success",
    currencies: transactions,
  });
};
