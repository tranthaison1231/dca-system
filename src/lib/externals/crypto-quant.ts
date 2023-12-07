import {
  VITE_CRYPTO_QUANT_API,
  VITE_CRYPTO_QUANT_EMAIL,
  VITE_CRYPTO_QUANT_PASSWORD,
} from "$env/static/private";
import { memorize } from "$lib/middlewares/memorize";
import { RedisKey } from "$lib/services/redis";

export const signIn = memorize(
  RedisKey.CRYPTO_QUANT_SIGN_IN,
  async () => {
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

    return data;
  },
  8 * 60 * 60
);
