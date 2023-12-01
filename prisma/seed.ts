import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // const data = await prisma.currency.createMany({
  //   data: [
  //     {
  //       symbol: "BTC",
  //       amount: "0.10971092",
  //       userId: "user_2YwM6Lp6t3ETj4k6aB2ZedU56fm",
  //     },
  //     {
  //       symbol: "ETH",
  //       amount: "0.59430315",
  //       userId: "user_2YwM6Lp6t3ETj4k6aB2ZedU56fm",
  //     },
  //     {
  //       symbol: "USDT",
  //       amount: "392",
  //       userId: "user_2YwM6Lp6t3ETj4k6aB2ZedU56fm",
  //     },
  //     {
  //       symbol: "BNB",
  //       amount: "0.8156",
  //       userId: "user_2YwM6Lp6t3ETj4k6aB2ZedU56fm",
  //     },
  //     {
  //       symbol: "XRP",
  //       amount: "496",
  //       userId: "user_2YwM6Lp6t3ETj4k6aB2ZedU56fm",
  //     },
  //     {
  //       symbol: "SOL",
  //       amount: "0",
  //       userId: "user_2YwM6Lp6t3ETj4k6aB2ZedU56fm",
  //     },
  //     {
  //       symbol: "ADA",
  //       amount: "3046",
  //       userId: "user_2YwM6Lp6t3ETj4k6aB2ZedU56fm",
  //     },
  //     {
  //       symbol: "DOGE",
  //       amount: "0",
  //       userId: "user_2YwM6Lp6t3ETj4k6aB2ZedU56fm",
  //     },
  //     {
  //       symbol: "TRX",
  //       amount: "0",
  //       userId: "user_2YwM6Lp6t3ETj4k6aB2ZedU56fm",
  //     },
  //   ],
  // });
  // const data = await prisma.currency.findMany({});
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
