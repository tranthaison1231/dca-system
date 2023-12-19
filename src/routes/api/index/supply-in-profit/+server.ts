import { json } from "@sveltejs/kit";
import dayjs from "dayjs";

export const GET = async () => {
  const mrd = dayjs().subtract(5, "day").startOf("day").unix();

  const res = await fetch(
    `https://www.mesmerdata.com/n2/mesmer_charts.php?q=79&mrd=${mrd}`,
  );
  const data = await res.json();

  return json({
    status: "success",
    value: data[data.length - 1][1],
  });
};
