import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "$env/static/private";

import Redis from "ioredis";

export const redis = new Redis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
});
