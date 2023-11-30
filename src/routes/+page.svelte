<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { INVESTED } from "$lib/utils/constants";
  import type { PageData } from "./$types";
  import * as Table from "$lib/components/ui/table";
  import { cn } from "$lib/utils/style";
  import PieChart from "$lib/components/charts/PieChart.svelte";
  import { formatMoney, formatNumber } from "$lib/utils/number";

  export let data: PageData;

  $: minCoinAmount = (data.price / data.minAlphaCoin.price).toFixed(2);
  $: maxCoinAmount = (data.price / data.maxAlphaCoin.price).toFixed(2);
</script>

<div>
  <h1 class="text-3xl mb-3 text-center text-black">Hệ thống DCA Crypto</h1>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mt-10">
    <div class="col-span-2 border p-5 rounded-md shadow-xl">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head class="font-bold">Name</Table.Head>
            <Table.Head class="font-bold text-right">Amount</Table.Head>
            <Table.Head class="font-bold">Price</Table.Head>
            <Table.Head class="font-bold">Total</Table.Head>
            <Table.Head class="font-bold">Market Cap</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data.coinPercentMap as coin, i (i)}
            <Table.Row>
              <Table.Cell>{coin.symbol}</Table.Cell>
              <Table.Cell class="text-right"
                >{formatNumber(coin.amount)}</Table.Cell
              >
              <Table.Cell>{formatMoney(coin.price)}</Table.Cell>
              <Table.Cell>{formatMoney(coin.value)}</Table.Cell>
              <Table.Cell>{formatMoney(coin.marketCap)}</Table.Cell>
            </Table.Row>
          {/each}
          <Table.Row>
            <Table.Cell colspan={3} class="font-bold">Total</Table.Cell>
            <Table.Cell>{formatMoney(data.total)}</Table.Cell>
            <Table.Cell>{formatMoney(data.totalMarket)}</Table.Cell>
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
              })}>{formatMoney(data.total - INVESTED)}</Table.Cell
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
              Fear And Greed: {data.fearAndGreedIndex.toFixed(2)}
            </p></Tooltip.Trigger
          >
          <Tooltip.Content>
            <p>{`We should sell when it > 70`}</p>
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger class="block">
            <p>
              Supply In Profit: {data.supplyInProfitIndex.toFixed(2)}
            </p></Tooltip.Trigger
          >
          <Tooltip.Content>
            <p>{`We should sell when it > 80`}</p>
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger class="block"
            ><p>
              Bitcoin NUPL: {data.nuplIndex.toFixed(2)}
            </p></Tooltip.Trigger
          >
          <Tooltip.Content>
            <p>{`We should sell when it > 0.5, we should buy when it < 0`}</p>
          </Tooltip.Content>
        </Tooltip.Root>

        <p>
          {#if data.shouldSell}
            <span class="text-red-500"
              >Nên bán ${data.price}: {data.minAlphaCoin.symbol} ({minCoinAmount})</span
            >
          {:else if data.maxAlphaCoin.symbol === "USDT"}
            <span class="text-blue-500">
              Nên bán ${data.price}
              {data.minAlphaCoin.symbol} ({minCoinAmount}) và mua thêm ${data.price}
              USDT</span
            >
          {:else}
            <span class="text-green-500"
              >Bạn nên mua thêm {data.price}$: {data.maxAlphaCoin.symbol} ({maxCoinAmount})</span
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
