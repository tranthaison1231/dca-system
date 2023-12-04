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

  await redis.set("crypto-quant-access-token", data.accessToken, "EX", 30 * 60);

  return data;
}
