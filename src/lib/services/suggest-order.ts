import type { ExtendCurrency } from "$lib/utils/type";
import { last, sortBy } from "lodash-es";

interface SuggestOrder {
  fearAndGreed: number;
  supplyInProfit: number;
  nupl: number;
  currencies: ExtendCurrency[];
}

export const suggestOrder = ({
  currencies,
  supplyInProfit,
  nupl,
  fearAndGreed,
}: SuggestOrder) => {
  if (!currencies.length) return "";

  let price = 30;
  if (fearAndGreed > 80 || supplyInProfit > 95 || nupl > 0.5 || nupl < 0) {
    price = 100;
  }
  const usdt = currencies.find((item) => item.symbol === "USDT");

  const shouldSell = fearAndGreed > 70 || supplyInProfit > 80 || nupl > 0.5;

  const sortedCurrenciesByAlpha = sortBy(currencies, "alpha");

  if (shouldSell) {
    if (
      usdt &&
      usdt.percent > 30 &&
      sortedCurrenciesByAlpha[0]?.symbol === "USDT"
    ) {
      return `Nên mua $${price} ${last(sortedCurrenciesByAlpha)?.symbol}`;
    }
    return `Nên bán $${price} ${sortedCurrenciesByAlpha[1]?.symbol}`;
  }

  return `Nên mua $30 ${last(sortedCurrenciesByAlpha)?.symbol}`;
};
