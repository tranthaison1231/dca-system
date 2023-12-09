import { TransactionType } from "@prisma/client";
import * as z from "zod";

export const updateCurrencySchema = z.object({
  amount: z.coerce.number().min(0),
});

export const updateProfileSchema = z.object({
  amount: z.coerce.number().min(0),
});

export const createCurrencySchema = z.object({
  symbol: z.string(),
  amount: z.coerce.number().min(0),
  url: z.string(),
  name: z.string().optional(),
});

export const createTransactionSchema = z.object({
  amount: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  timestamp: z.coerce.date(),
  type: z.enum([TransactionType.BUY, TransactionType.SELL]),
});
