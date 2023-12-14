import { redis } from "$lib/services/redis";
import { parse, stringify } from "lossless-json";

export const memorize = <T extends Function>(
  key: string,
  fn: T,
  ttl = 30 * 60
) => {
  return async (...args: unknown[]) => {
    try {
      const data = await redis.get(key);
      if (data) {
        return parse(data);
      }
      const result = await fn(...args);
      const value = stringify(result);
      if (value) {
        await redis.set(key, value, "EX", ttl);
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};
