import { CRYPTO_QUANT_API } from "$lib/utils/constants";
import { json } from "@sveltejs/kit";

export async function GET(event) {
  event.setHeaders({
    "cache-control": "max-age=86400",
  });

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

  return json(data);
}
