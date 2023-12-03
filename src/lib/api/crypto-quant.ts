import {
  VITE_CRYPTO_QUANT_API,
  VITE_CRYPTO_QUANT_EMAIL,
  VITE_CRYPTO_QUANT_PASSWORD,
} from "$env/static/private";
import { redis } from "$lib/services/redis";

export async function signIn() {
  const accessToken = await redis.get("crypto-quant-access-token");
  if (accessToken) {
    return { accessToken };
  }
  const res = await fetch(`${VITE_CRYPTO_QUANT_API}/v1/sign-in`, {
    body: JSON.stringify({
      email: VITE_CRYPTO_QUANT_EMAIL,
      password: VITE_CRYPTO_QUANT_PASSWORD,
      stayLoggedIn: false,
    }),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (res.status !== 200) {
    throw new Error("Sign in failed", { cause: res });
  }

  const data = await res.json();

  await redis.set(
    "crypto-quant-access-token",
    data.accessToken,
    "EX",
    60 * 60 * 24
  );

  return data;
}

export async function getNuplIndex() {
  const end = Math.floor(Date.now());
  const start = end - 86400000;
  const { accessToken } = await signIn();

  const res = await fetch(
    `${VITE_CRYPTO_QUANT_API}/v3/charts/61a607dca46ca1128e34dfb7?window=DAY&from=${start}&to=${end}&limit=10000`,
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

  return data.result.data[data.result.data.length - 1][1];
}

export async function getSupplyInProfitIndex() {
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

  return data.result.data[data.result.data.length - 1][1];
}
