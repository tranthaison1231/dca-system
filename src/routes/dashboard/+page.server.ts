import { getCryptoCurrencies } from "$lib/api/crypto-currencies";
import { getFearAndGreedIndex } from "$lib/api/feat-and-greed";
import prisma from "$lib/db/prisma";

export async function load(event) {
  event.setHeaders({
    "cache-control": "max-age=60",
  });

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
    event
      .fetch("/api/crypto-quant/supply-in-profit")
      .then(async (res) => await res.json()),
    event.fetch("/api/crypto-quant/nupl").then(async (res) => await res.json()),
  ]);

  const coinsMapper = currencies.map((cur) => {
    const coin = coinsObj?.[cur.symbol];
    const value = Number(cur.amount) * coin.price;
    return {
      ...coin,
      amount: Number(cur.amount),
      value: value,
    };
  });

  return {
    coinsMapper,
    fearAndGreedIndex,
    supplyInProfitIndex,
    nuplIndex,
  };
}
