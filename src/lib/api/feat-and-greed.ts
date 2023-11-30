const FEAR_AND_GREED_API =
  "https://api.coinmarketcap.com/data-api/v3/fear-greed/chart";

export async function getFearAndGreedIndex() {
  const end = Math.floor(Date.now() / 1000);
  const start = end - 24 * 60 * 60 * 2; // 2 days;
  try {
    const res = await fetch(`${FEAR_AND_GREED_API}?end=${end}&start=${start}`, {
      method: "GET",
    });
    const { data } = await res.json();

    if (!data?.dataList?.length) {
      throw new Error("No data from Fear and Greed API");
    }

    const latestValue = data.dataList[data.dataList.length - 1].score;
    return latestValue;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
