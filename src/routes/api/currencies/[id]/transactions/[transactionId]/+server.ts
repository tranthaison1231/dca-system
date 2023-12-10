import prisma from "$lib/db/prisma";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export const DELETE = async (event: RequestEvent) => {
  const transactionId = event.params.transactionId;

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

  return json({
    status: "success",
    message: "Transaction deleted successfully",
  });
};
