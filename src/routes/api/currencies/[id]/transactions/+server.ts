import { TransactionType } from "@prisma/client";
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
    transactions: transactions,
  });
};

export const POST = async (event: RequestEvent) => {
  const body = await event.request.json();
  const currencyId = event.params.id;

  const transaction = await prisma.transaction.create({
    data: {
      userId: event.locals.session.userId,
      currencyId: currencyId!,
      type: TransactionType.BUY,
      amount: String(body.amount),
      price: String(body.price),
      timestamp: body.timestamp,
    },
  });
  return json({
    status: "success",
    transaction: transaction,
  });
};
