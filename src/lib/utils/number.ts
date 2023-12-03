export const formatMoney = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};

export const formatNumber = (number: number, maxDecimals = 8) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: maxDecimals,
  }).format(number);
};
