import { json } from "@sveltejs/kit";

export async function GET() {
  const end = Math.floor(Date.now() / 1000);
  const start = end - 24 * 60 * 60 * 2; // 2 days;
  const res = await fetch(
    `https://api.coinmarketcap.com/data-api/v3/fear-greed/chart?end=${end}&start=${start}`,
    {
      method: "GET",
    },
  );
  const { data } = await res.json();

  if (!data?.dataList?.length) {
    throw new Error("No data from Fear and Greed API");
  }

  const latestValue = data.dataList[data.dataList.length - 1].score;
  return json({
    status: "success",
    value: latestValue,
  });
}
