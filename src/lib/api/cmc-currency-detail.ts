export const getCMCCurrencyDetail = async (slug: string) => {
  const res = await fetch(
    `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail?slug=${slug}`
  );

  const data = await res.json();
  return data;
};
