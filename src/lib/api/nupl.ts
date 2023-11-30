import { CRYPTO_QUANT_API } from "../utils/constants";
import { signIn } from "./crypto-quant-sign-in";

export async function getNuplIndex() {
  const end = Math.floor(Date.now());
  const start = end - 86400000;
  try {
    const { accessToken } = await signIn();
    const res = await fetch(
      `${CRYPTO_QUANT_API}/v3/charts/61a607dca46ca1128e34dfb7?window=DAY&from=${start}&to=${end}&limit=10000`,
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
  } catch (error) {
    console.log(error);
  }
}
