export const formatMoney = (
  number: number,
  locale = "en-US",
  currency = "USD"
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 3,
  }).format(number);
};

export const formatNumber = (number: number, maxDecimals = 8) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: maxDecimals,
  }).format(number);
};
