export async function getCryptoCurrencies() {
  try {
    const res = await fetch(
      `${
        import.meta.env.VITE_PRO_COIN_MARKET_CAP_API
      }/v1/cryptocurrency/listings/latest`,
      {
        method: "GET",
        headers: {
          "X-CMC_PRO_API_KEY": String(
            import.meta.env.VITE_PRO_COIN_MARKET_CAP_KEY
          ),
        },
      }
    );
    const { data } = await res.json();
    let coins = data.map((coin) => {
      return {
        symbol: coin.symbol,
        price: coin.quote.USD.price,
        marketCap: coin.quote.USD.market_cap,
      };
    });
    const coinsObj = {};

    for (let i = 0; i < coins.length; i++) {
      if (coins[i].symbol === "USDC") {
        coinsObj["USDT"].marketCap += coins[i].marketCap;
      } else {
        coinsObj[coins[i].symbol] = coins[i];
      }
    }

    return coinsObj;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
