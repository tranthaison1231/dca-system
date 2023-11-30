import { CRYPTO_QUANT_API } from "../utils/constants";

export async function signIn() {
  try {
    const res = await fetch(`${CRYPTO_QUANT_API}/v1/sign-in`, {
      body: JSON.stringify({
        email: import.meta.env.VITE_CRYPTO_QUANT_EMAIL,
        password: import.meta.env.VITE_CRYPTO_QUANT_PASSWORD,
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
