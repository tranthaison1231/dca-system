import * as z from "zod";

export const updateCurrencySchema = z.object({
  amount: z.coerce.number(),
});

export const createCurrencySchema = z.object({
  symbol: z.string(),
  amount: z.coerce.number(),
  url: z.string(),
  name: z.string().optional(),
});
