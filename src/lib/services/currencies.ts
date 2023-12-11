import prisma from "$lib/db/prisma";

export const updateCurrencyAfterTransaction = async (currencyId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      currencyId: currencyId,
    },
  });
  const amount = transactions.reduce((total, transaction) => {
    if (transaction.type === "BUY") {
      return total + Number(transaction.amount);
    } else {
      return total - Number(transaction.amount);
    }
  }, 0);

  const totalCost = transactions.reduce((total, transaction) => {
    if (transaction.type === "BUY") {
      return total + Number(transaction.price) * Number(transaction.amount);
    } else {
      return total - Number(transaction.price) * Number(transaction.amount);
    }
  }, 0);

  const averagePrice = totalCost / amount;

  const currency = await prisma.currency.update({
    where: {
      id: currencyId,
    },
    data: {
      amount: String(amount),
      averagePrice: String(averagePrice),
    },
  });

  return currency;
};
