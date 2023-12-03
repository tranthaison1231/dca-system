import { getCryptoCurrencies } from "$lib/api/crypto-currencies";
import { getNuplIndex, getSupplyInProfitIndex } from "$lib/api/crypto-quant.js";
import { getFearAndGreedIndex } from "$lib/api/feat-and-greed";
import prisma from "$lib/db/prisma";
import { redirect } from "@sveltejs/kit";

export async function load(event) {
  if (!event.locals.session) {
    throw redirect(302, "/sign-in");
  }

  const [
    currencies,
    coinsObj,
    fearAndGreedIndex,
    supplyInProfitIndex,
    nuplIndex,
  ] = await Promise.all([
    prisma.currency.findMany({
      where: {
        userId: event.locals.session.userId,
      },
    }),
    getCryptoCurrencies(),
    getFearAndGreedIndex(),
    getSupplyInProfitIndex(),
    getNuplIndex(),
  ]);

  const formattedCurrencies = currencies.map((cur) => {
    const coin = coinsObj?.[cur.symbol];
    const value = Number(cur.amount) * coin.price;
    return {
      ...coin,
      url: cur.url,
      amount: Number(cur.amount),
      value: value,
    };
  });

  return {
    currencies: formattedCurrencies,
    fearAndGreedIndex,
    supplyInProfitIndex,
    nuplIndex,
  };
}
