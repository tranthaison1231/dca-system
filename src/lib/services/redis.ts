import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "$env/static/private";

import Redis from "ioredis";

export const redis = new Redis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
});

export const RedisKey = {
  CRYPTO_QUANT_NUPL: "crypto-quant-nupl",
  CRYPTO_QUANT_SUPPLY_IN_PROFIT: "crypto-quant-supply-in-profit",
  CRYPTO_QUANT_SIGN_IN: "crypto-quant-sign-in",
  CURRENCIES: "currencies",
};
