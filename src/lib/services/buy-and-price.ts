export const calculateBuyAndSellPrice = (
  fearAndGreedIndex: number,
  supplyInProfitIndex: number,
  nuplIndex: number
) => {
  let price = 30;
  if (
    fearAndGreedIndex > 80 ||
    supplyInProfitIndex > 95 ||
    nuplIndex > 0.5 ||
    nuplIndex < 0
  ) {
    price = 100;
  }
  return price;
};
