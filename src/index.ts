import "dotenv/config";
import { getCryptoCurrencies } from "./lib/crypto-currencies";
import { getFearAndGreedIndex } from "./lib/feat-and-greed";
import { sumBy, maxBy, minBy } from "lodash";
import { getSupplyInProfitIndex } from "./lib/supply-in-profit";
import { CURRENCIES, INVESTED } from "./lib/constants";
import { getNuplIndex } from "./lib/nupl";

async function main() {
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

  console.log("Hệ thống DCA Crypto");

  coinPercentMap.map((e) => {
    if (e.value) {
      console.log(`${e.symbol}: ${e.value}$`);
    }
  });

  const results = [
    `Total Market Cap: ${totalMarket}$`,
    `Vốn đầu tư: ${INVESTED}$ `,
    `Tổng tài sản: ${total}$`,
    `Lợi nhuận là ${total - INVESTED}$`,
    `Fear And Greed Index: ${fearAndGreedIndex}`,
    `Bitcoin Supply In Profit Index: ${supplyInProfitIndex}`,
    `Bitcoin Net Unrealized Profit/Loss: ${nuplIndex}`,
  ];

  const shouldSell =
    fearAndGreedIndex > 70 ||
    supplyInProfitIndex > 80 ||
    (nuplIndex > 0 && nuplIndex < 30);

  if (shouldSell) {
    results.push(`Bạn nên bán bớt đi 30$: ${minAlphaCoin.symbol}`);
  } else {
    if (maxAlphaCoin.symbol === "USDT") {
      results.push(
        `Bạn nên bán bớt đi 30$ ${minAlphaCoin.symbol} và mua thêm 30$ ${maxAlphaCoin.symbol}`
      );
    } else {
      results.push(`Bạn nên mua thêm 30$: ${maxAlphaCoin.symbol}`);
    }
  }

  console.log(results.join("\n"));
}

main();
