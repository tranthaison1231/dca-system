import prisma from "$lib/db/prisma";
import { json } from "@sveltejs/kit";

export async function PUT(event) {
  if (!event.locals.session) {
    return json({
      status: "error",
      message: "Not logged in",
    });
  }

  const body = await event.request.json();
  const currencyId = event.params.id;

  const currency = await prisma.currency.update({
    where: {
      id: currencyId,
    },
    data: {
      ...body,
      amount: String(body.amount),
    },
  });
  return json({
    status: "success",
    currency: currency,
  });
}

export async function DELETE(event) {
  const currencyId = event.params.id;

  await prisma.currency.delete({
    where: {
      id: currencyId,
    },
  });
  return json({
    status: "success",
    message: "Currency deleted successfully",
  });
}
