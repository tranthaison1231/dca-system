import { CRYPTO_QUANT_API } from "./constants";

export async function signIn() {
  try {
    const res = await fetch(`${CRYPTO_QUANT_API}/v1/sign-in`, {
      body: JSON.stringify({
        email: process.env.CRYPTO_QUANT_EMAIL,
        password: process.env.CRYPTO_QUANT_PASSWORD,
        stayLoggedIn: false,
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
