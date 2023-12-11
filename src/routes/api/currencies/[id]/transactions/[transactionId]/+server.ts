import prisma from "$lib/db/prisma";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { updateCurrencyAfterTransaction } from "$lib/services/currencies";

export const DELETE = async (event: RequestEvent) => {
  const transactionId = event.params.transactionId;
  const currencyId = event.params.id!;

  if (!transactionId) {
    return json({
      status: "error",
      message: "Invalid transaction ID",
    });
  }

  await prisma.transaction.deleteMany({
    where: {
      id: transactionId,
    },
  });

  await updateCurrencyAfterTransaction(currencyId);

  return json({
    status: "success",
    message: "Transaction deleted successfully",
  });
};
