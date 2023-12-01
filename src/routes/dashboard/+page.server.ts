import { calculateBuyAndSellPrice } from "$lib/api/buy-and-price";
import { getCryptoCurrencies } from "$lib/api/crypto-currencies";
import { getFearAndGreedIndex } from "$lib/api/feat-and-greed";
import { getNuplIndex } from "$lib/api/nupl";
import { getSupplyInProfitIndex } from "$lib/api/supply-in-profit";
import prisma from "$lib/db/prisma";
import { maxBy, minBy, sumBy } from "lodash-es";

export async function load(event) {
  event.setHeaders({
    "cache-control": "max-age=60",
  });

  const currencies = await prisma.currency.findMany({
    where: {
      userId: event.locals.session.userId,
    },
  });

  const [coinsObj, fearAndGreedIndex, supplyInProfitIndex, nuplIndex] =
    await Promise.all([
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

  const total = sumBy(coinsMapper, "value");
  const totalMarket = sumBy(coinsMapper, "marketCap");

  const coinPercentMap = coinsMapper.map((coin) => {
    const percent = (coin.value / total) * 100;
    const marketCapPercent = (coin.marketCap / totalMarket) * 100;
    return {
      ...coin,
      percent: percent,
      marketCapPercent: marketCapPercent,
      alpha: marketCapPercent - percent,
    };
  });

  const maxAlphaCoin = maxBy(coinPercentMap, "alpha");
  const minAlphaCoin = minBy(coinPercentMap, "alpha");

  const shouldSell =
    fearAndGreedIndex > 70 || supplyInProfitIndex > 80 || nuplIndex > 0.5;

  const price = calculateBuyAndSellPrice(
    fearAndGreedIndex,
    supplyInProfitIndex,
    nuplIndex
  );

  return {
    coinPercentMap,
    shouldSell,
    maxAlphaCoin,
    minAlphaCoin,
    price,
    totalMarket,
    total,
    fearAndGreedIndex,
    supplyInProfitIndex,
    nuplIndex,
  };
}