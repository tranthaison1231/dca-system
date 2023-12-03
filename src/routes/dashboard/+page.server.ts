import { getCryptoCurrencies } from "$lib/api/crypto-currencies";
import { getNuplIndex, getSupplyInProfitIndex } from "$lib/api/crypto-quant.js";
import { getFearAndGreedIndex } from "$lib/api/feat-and-greed";
import prisma from "$lib/db/prisma";

export async function load(event) {
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
