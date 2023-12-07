import type { Currency } from "@prisma/client";

export interface ExtendCurrency extends Currency {
  percent: number;
  value: number;
  marketCap: number;
  statistics: {
    priceChangePercentage24h: string;
    priceChangePercentage7d: string;
    priceChangePercentage30d: string;
    priceChangePercentage60d: string;
    priceChangePercentage90d: string;
  };
}
