import { getCMCCurrencyDetail } from "$lib/api/cmc-currency-detail";
import prisma from "$lib/db/prisma";
import { json } from "@sveltejs/kit";

export async function GET(event) {
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

  const currencies = await prisma.currency.findMany({
    where: {
      userId: event.locals.session.userId,
    },
  });

  const cmcCurrencies = await Promise.all(
    currencies.map(async (currency) => {
      const data = await getCMCCurrencyDetail(currency.slug);
      return {
        ...currency,
        ...data,
      };
    })
  );

  const formattedCurrencies = cmcCurrencies.map((currency) => ({
    name: currency.name,
    symbol: currency.symbol,
    slug: currency.coinGeckoId,
    url: currency.url,
    statistics: currency.data?.statistics,
    price: currency.data?.statistics?.price,
    amount: Number(currency.amount),
    value: Number(currency.amount) * currency.data?.statistics?.price,
    marketCap: currency.data?.statistics?.marketCap ?? 0,
  }));

  return json({
    status: "success",
    currencies: formattedCurrencies,
  });
}
