import { calculateBuyAndSellPrice } from "$lib/api/buy-and-price";
import { CURRENCIES } from "$lib/utils/constants";
import { getCryptoCurrencies } from "$lib/api/crypto-currencies";
import { getFearAndGreedIndex } from "$lib/api/feat-and-greed";
import { getNuplIndex } from "$lib/api/nupl";
import { getSupplyInProfitIndex } from "$lib/api/supply-in-profit";
import { maxBy, minBy, sumBy } from "lodash-es";

export async function load() {
  const [coinsObj, fearAndGreedIndex, supplyInProfitIndex, nuplIndex] =
    await Promise.all([
      getCryptoCurrencies(),
      getFearAndGreedIndex(),
      getSupplyInProfitIndex(),
      getNuplIndex(),
    ]);

  const coinsMapper = CURRENCIES.map((cur) => {
    const coin = coinsObj?.[cur.symbol];
    const value = cur.amount * coin.price;
    return {
      ...coin,
      amount: cur.amount,
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
