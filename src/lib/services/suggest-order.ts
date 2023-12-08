import type { ExtendCurrency } from "$lib/utils/type";
import { last, sortBy } from "lodash-es";

interface Index {
  fearAndGreed: number;
  supplyInProfit: number;
  nupl: number;
}

export const calPrice = (
  currencies: ExtendCurrency[],
  { fearAndGreed, supplyInProfit, nupl }: Index
) => {
  let price = 30;

  const usdt = currencies.find((currency) => currency.symbol === "USDT");

  const highRisk =
    fearAndGreed > 80 || supplyInProfit > 95 || nupl > 0.5 || nupl < 0;

  if (highRisk && usdt && usdt.percent <= 30) {
    price = 100;
  }
  return price;
};

const calShouldSell = ({ supplyInProfit, nupl, fearAndGreed }: Index) => {
  let shouldSell = false;

  if (fearAndGreed > 70 || supplyInProfit > 80 || nupl > 0.5) {
    shouldSell = true;
  }

  return shouldSell;
};

export const suggestOrder = (
  currencies: ExtendCurrency[],
  { supplyInProfit, nupl, fearAndGreed }: Index
) => {
  if (!currencies.length) return "";

  const price = calPrice(currencies, {
    fearAndGreed,
    supplyInProfit,
    nupl,
  });

  const sortedCurrenciesWithoutUSDTByAlpha = sortBy(
    currencies.filter((currency) => currency.symbol !== "USDT"),
    "alpha"
  );

  const shouldSell = calShouldSell({
    supplyInProfit,
    nupl,
    fearAndGreed,
  });

  if (shouldSell) {
    return `Nên bán $${price} ${sortedCurrenciesWithoutUSDTByAlpha[0]?.symbol}`;
  }

  return `Nên mua $${price} ${
    last(sortedCurrenciesWithoutUSDTByAlpha)?.symbol
  }`;
};
