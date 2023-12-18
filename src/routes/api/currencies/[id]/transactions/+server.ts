import prisma from "$lib/db/prisma";
import { updateCurrencyAfterTransaction } from "$lib/services/currencies";
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

  const usdt = await prisma.currency.findFirst({
    where: {
      symbol: "USDT",
      userId: event.locals.session.userId,
    },
  });

  if (!usdt) {
    return json({
      status: "error",
      message: "Please add your usdt to porfolio!",
    });
  }

  const cost = body.price * body.amount;

  if (cost > Number(usdt?.amount)) {
    return json({
      status: "error",
      message: "Insufficient balance",
    });
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: event.locals.session.userId,
      currencyId: currencyId!,
      type: body.type,
      amount: String(body.amount),
      price: String(body.price),
      timestamp: body.timestamp,
    },
  });

  if (body.type === "BUY") {
    await prisma.currency.update({
      where: {
        id: usdt?.id!,
      },
      data: {
        amount: String(Number(usdt?.amount) - cost),
      },
    });
  } else {
    await prisma.currency.update({
      where: {
        id: usdt?.id!,
      },
      data: {
        amount: String(Number(usdt?.amount) + cost),
      },
    });
  }

  await updateCurrencyAfterTransaction(currencyId!);

  return json({
    status: "success",
    transaction: transaction,
  });
};
