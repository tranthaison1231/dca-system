import { getNuplIndex, getSupplyInProfitIndex } from "$lib/api/crypto-quant";
import { getFearAndGreedIndex } from "$lib/api/feat-and-greed";
import prisma from "$lib/db/prisma";
import { redirect } from "@sveltejs/kit";

export async function load(event) {
  if (!event.locals.session) {
    throw redirect(302, "/sign-in");
  }

  const [currencies, fearAndGreedIndex, supplyInProfitIndex, nuplIndex] =
    await Promise.all([
      prisma.currency.findMany({
        where: {
          userId: event.locals.session.userId,
        },
      }),
      getFearAndGreedIndex(),
      getSupplyInProfitIndex(),
      getNuplIndex(),
    ]);

  return {
    currencies: currencies,
    fearAndGreedIndex,
    supplyInProfitIndex,
    nuplIndex,
  };
}
