const FEAR_AND_GREED_API =
  "https://api.coinmarketcap.com/data-api/v3/fear-greed/chart";

export async function getFearAndGreedIndex() {
  const end = Math.floor(Date.now() / 1000);
  const start = end - 86400;
  try {
    const res = await fetch(`${FEAR_AND_GREED_API}?end=${end}&start=${start}`, {
      method: "GET",
    });
    const { data } = await res.json();
    const latestValue = data.dataList[data.dataList.length - 1].score;
    return latestValue;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
