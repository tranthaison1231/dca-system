import { VITE_CRYPTO_QUANT_API } from "$env/static/private";
import { signIn } from "$lib/externals/crypto-quant";
import { RedisKey, redis } from "$lib/services/redis";
import { json } from "@sveltejs/kit";

export const GET = async () => {
  const cache = await redis.get(RedisKey.CRYPTO_QUANT_SUPPLY_IN_PROFIT);

  if (cache) {
    return json({
      status: "success",
      value: JSON.parse(cache),
    });
  }

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

  await redis.set(
    RedisKey.CRYPTO_QUANT_SUPPLY_IN_PROFIT,
    JSON.stringify(data.result.data[data.result.data.length - 1][1]),
    "EX",
    60 * 60 * 8
  );

  return json({
    status: "success",
    value: data.result.data[data.result.data.length - 1][1],
  });
};
