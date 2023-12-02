import { CRYPTO_QUANT_API } from "$lib/utils/constants";
import { json } from "@sveltejs/kit";

export async function GET(event) {
  const end = Math.floor(Date.now());
  const start = end - 86400000;
  const result = await event.fetch("/api/crypto-quant/sign-in");
  const { accessToken } = (await result.json()) ?? {};

  const res = await fetch(
    `${CRYPTO_QUANT_API}/v3/charts/61a607fda46ca1128e34dfbe?window=DAY&from=${start}&to=${end}&limit=10000`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        authorization: "Bearer " + accessToken,
      },
      method: "GET",
    }
  );
  const data = await res.json();

  if (data.error) {
    throw data.error;
  }

  return json(data.result.data[data.result.data.length - 1][1]);
}
