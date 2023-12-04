import { VITE_CRYPTO_QUANT_API } from "$env/static/private";
import { signIn } from "$lib/api/crypto-quant";
import { json } from "@sveltejs/kit";

export async function GET() {
  const end = Math.floor(Date.now());
  const start = end - 86400000;
  const { accessToken } = await signIn();

  const res = await fetch(
    `${VITE_CRYPTO_QUANT_API}/v3/charts/61a607fda46ca1128e34dfbe?window=DAY&from=${start}&to=${end}&limit=10000`,
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

  return json({
    status: "success",
    value: data.result.data[data.result.data.length - 1][1],
  });
}
