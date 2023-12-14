import prisma from "$lib/db/prisma";
import { getCMCCurrencyDetail } from "$lib/externals/cmc-currency-detail";
import { changeImageType } from "$lib/utils/image";
import { Prisma } from "@prisma/client";
import { error, json, type RequestEvent } from "@sveltejs/kit";

export const GET = async (event: RequestEvent) => {
  const currencies = await prisma.currency.findMany({
    where: {
      userId: event.locals.session.userId,
    },
  });
  return json({
    status: "success",
    currencies: currencies,
  });
};

export async function POST(event) {
  try {
    const body = await event.request.json();

    const res = await Promise.any([
      getCMCCurrencyDetail(body.symbol),
      getCMCCurrencyDetail(body.name),
      getCMCCurrencyDetail(body.slug),
    ]);

    let slug = res.data.slug;

    const currency = await prisma.currency.create({
      data: {
        slug: slug,
        name: body.name,
        symbol: body.symbol,
        url: changeImageType(body.url),
        amount: String(body.amount),
        userId: event.locals.session.userId,
      },
    });

    return json({
      status: "success",
      currency: currency,
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      error(409, {
                message: "Currency already exist!",
              });
    }
    if (err instanceof AggregateError) {
      error(400, {
                message: err.errors[0].message,
              });
    }
    throw err;
  }
}
