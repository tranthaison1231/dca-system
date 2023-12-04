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
      const res = await fetch(
        `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail?slug=${currency.coinGeckoId}`
      );
      const data = await res.json();
      return {
        ...currency,
        ...data,
      };
    })
  );

  const formattedCurrencies = cmcCurrencies.map((currency) => ({
    name: currency.name,
    symbol: currency.symbol,
    url: currency.url,
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
