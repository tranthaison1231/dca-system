<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { INVESTED } from "$lib/utils/constants";
  import type { PageData } from "./$types";
  import * as Table from "$lib/components/ui/table";
  import { cn } from "$lib/utils/style";
  import PieChart from "$lib/components/charts/PieChart.svelte";

  export let data: PageData;
</script>

<div>
  <h1 class="text-3xl mb-3 text-center text-black">Hệ thống DCA Crypto</h1>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mt-10">
    <div class="col-span-2 border p-5 rounded-md shadow-xl">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            {#each ["Name", "Amount", "Price", "Total", "Market Cap"] as name}
              <Table.Head class="font-bold">{name}</Table.Head>
            {/each}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data.coinPercentMap as coin, i (i)}
            <Table.Row>
              <Table.Cell>{coin.symbol}</Table.Cell>
              <Table.Cell>{coin.amount}</Table.Cell>
              <Table.Cell>${coin.price}</Table.Cell>
              <Table.Cell>${coin.value}</Table.Cell>
              <Table.Cell>${coin.marketCap}</Table.Cell>
            </Table.Row>
          {/each}
          <Table.Row>
            <Table.Cell colspan={3} class="font-bold">Total</Table.Cell>
            <Table.Cell>${data.total}</Table.Cell>
            <Table.Cell>${data.totalMarket}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell colspan={3} class="font-bold">Invested</Table.Cell>
            <Table.Cell>${INVESTED}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell colspan={3} class="font-bold">Profit</Table.Cell>
            <Table.Cell
              class={cn({
                "text-green-500": data.total - INVESTED > 0,
                "text-red-500": data.total - INVESTED < 0,
              })}>${data.total - INVESTED}</Table.Cell
            >
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
    <div class="col-span-2 md:col-span-1 space-y-8">
      <div class="border p-5 rounded-md shadow-xl h-fit space-y-4">
        <Tooltip.Root>
          <Tooltip.Trigger class="block mt-4"
            ><p>
              Fear And Greed Index: {data.fearAndGreedIndex}
            </p></Tooltip.Trigger
          >
          <Tooltip.Content>
            <p>{`We should sell when it > 70`}</p>
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger class="block">
            <p>
              Bitcoin Supply In Profit Index: {data.supplyInProfitIndex}
            </p></Tooltip.Trigger
          >
          <Tooltip.Content>
            <p>{`We should sell when it > 80`}</p>
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger class="block"
            ><p>
              Bitcoin Net Unrealized Profit/Loss: {data.nuplIndex}
            </p></Tooltip.Trigger
          >
          <Tooltip.Content>
            <p>{`We should sell when it > 0.5, we should buy when it < 0`}</p>
          </Tooltip.Content>
        </Tooltip.Root>

        <p>
          {#if data.shouldSell}
            <span class="text-red-500"
              >Bạn nên bán bớt đi {data.price}$: {data.minAlphaCoin
                .symbol}</span
            >
          {:else if data.maxAlphaCoin.symbol === "USDT"}
            Bạn nên bán bớt đi {data.price}$ {data.minAlphaCoin.symbol} và mua thêm
            {data.price}$ {data.maxAlphaCoin.symbol}
          {:else}
            <span class="text-green-500"
              >Bạn nên mua thêm {data.price}$: {data.maxAlphaCoin.symbol}</span
            >
          {/if}
        </p>
      </div>
      <div class="border p-5 rounded-md shadow-xl">
        <PieChart
          data={{
            labels: data.coinPercentMap.map((coin) => coin.symbol),
            datasets: [
              {
                label: "Total",
                data: data.coinPercentMap.map((coin) => coin.value),
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                  "#C0C0C0",
                  "#00FF00",
                  "#FF00FF",
                ],
              },
            ],
          }}
        />
      </div>
    </div>
  </div>
</div>
