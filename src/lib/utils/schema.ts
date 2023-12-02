import * as z from "zod";

export const updateCurrencySchema = z.object({
  symbol: z.string({
    required_error: "Symbol is required",
  }),
  amount: z.coerce.number(),
});
