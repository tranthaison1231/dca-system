import { json } from "@sveltejs/kit";

export const GET = async () => {
  const res = await fetch(`https://www.cryptowaves.app/api/rsi`);
  const data = await res.json();

  return json({
    status: "success",
    value: data[0],
  });
};
