import prisma from "$lib/db/prisma";
import { getCMCCurrencyDetail } from "$lib/externals/cmc-currency-detail.js";
import { json } from "@sveltejs/kit";

export async function GET(event) {
  const currencyId = event.params.id;

  const currency = await prisma.currency.findFirst({
    where: {
      id: currencyId,
    },
  });

  if (!currency) {
    return json({
      status: "error",
      message: "Currency not found",
    });
  }

  const { data } = await getCMCCurrencyDetail(currency.slug);

  return json({
    status: "success",
    currency: {
      ...currency,
      price: data?.statistics?.price,
    },
  });
}

export async function PUT(event) {
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
