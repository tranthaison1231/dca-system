const CRYPTO_QUANT_API = process.env.CRYPTO_QUANT_API;

async function signIn() {
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

export async function getSupplyInProfitIndex() {
  const end = Math.floor(Date.now());
  const start = end - 86400000;
  try {
    const { accessToken } = await signIn();
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

    return data.result.data[data.result.data.length - 1][1];
  } catch (error) {
    console.log(error);
  }
}
