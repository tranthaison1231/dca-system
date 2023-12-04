<script lang="ts">
  import PieChart from "$lib/components/charts/PieChart.svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import Progress from "$lib/components/ui/progress/progress.svelte";
  import * as Table from "$lib/components/ui/table";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { suggestOrder } from "$lib/services/suggest-order";
  import { INVESTED } from "$lib/utils/constants";
  import { getCryptoLogo } from "$lib/utils/getCryptoLogo";
  import { formatMoney, formatNumber } from "$lib/utils/number";
  import { cn } from "$lib/utils/style";
  import { createQuery } from "@tanstack/svelte-query";
  import { sumBy } from "lodash-es";

  const result = createQuery({
    queryKey: ["currencies/listing"],
    queryFn: async () => (await fetch("/api/currencies/listing")).json(),
  });

  const fearAndGreedResult = createQuery({
    queryKey: ["fear-and-greed"],
    queryFn: async () => (await fetch("/api/cmc/fear-and-greed")).json(),
    initialData: {
      value: 0,
    },
  });

  const nuplResult = createQuery({
    queryKey: ["nupl"],
    queryFn: async () => (await fetch("/api/crypto-quant/nupl")).json(),
    initialData: {
      value: 0,
    },
  });

  const supplyInProfitResult = createQuery({
    queryKey: ["supply-in-profit"],
    queryFn: async () =>
      (await fetch("/api/crypto-quant/supply-in-profit")).json(),
    initialData: {
      value: 0,
    },
  });

  $: formattedCurrencies =
    $result.data?.currencies?.map((currency) => {
      const percent = (currency.value / total) * 100;
      const marketCapPercent = (currency.marketCap / totalMarket) * 100;
      return {
        ...currency,
        percent: percent,
        marketCapPercent: marketCapPercent,
        alpha: marketCapPercent - percent,
      };
    }) ?? [];

  $: total = sumBy($result.data?.currencies, "value");
  $: totalMarket = sumBy($result.data?.currencies, "marketCap");
</script>

<div>
  <h1 class="text-2xl mb-3 text-primary">Report</h1>

  {#if $result.isPending || $fearAndGreedResult.isPending || $nuplResult.isPending || $supplyInProfitResult.isPending}
    <p class="mt-4">Loading...</p>
  {:else if $result.data?.currencies.length === 0}
    <p class="mt-4">
      You don't have any currency yet. Please click <a
        class={buttonVariants({ variant: "default" })}
        href="/dashboard/portfolio-setting">Setup</a
      >
      to add some currencies.
    </p>
  {:else}
    <div class="space-y-4 w-full mt-4">
      <div class="grid grid-cols-3 gap-4 w-full">
        <div
          class="border col-span-4 md:col-span-2 xl:col-span-1 p-5 rounded-md shadow-md space-y-4"
        >
          <Tooltip.Root>
            <Tooltip.Trigger class="block mt-4"
              ><p>
                Fear And Greed: {$fearAndGreedResult.data?.value?.toFixed(2)}
              </p></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>{`We should sell when it > 70`}</p>
            </Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger class="block">
              <p>
                Supply In Profit: {$supplyInProfitResult.data?.value?.toFixed(
                  2
                )}
              </p></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>{`We should sell when it > 80`}</p>
            </Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger class="block"
              ><p>
                Bitcoin NUPL: {$nuplResult.data?.value?.toFixed(2)}
              </p></Tooltip.Trigger
            >
            <Tooltip.Content>
              <p>{`We should sell when it > 0.5, we should buy when it < 0`}</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <p class="font-medium tex-3xl">
            {suggestOrder({
              currencies: formattedCurrencies,
              nupl: $nuplResult.data?.value,
              fearAndGreed: $fearAndGreedResult.data?.value,
              supplyInProfit: $supplyInProfitResult.data?.value,
            })}
          </p>
        </div>
        <div
          class="border col-span-4 md:col-span-2 xl:col-span-1 p-5 rounded-md shadow-md"
        >
          <PieChart
            data={{
              labels: $result.data?.currencies.map((currency) => currency.name),
              datasets: [
                {
                  label: "Total",
                  data: $result.data?.currencies.map(
                    (currency) => currency.value
                  ),
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
      <div class="border p-5 rounded-md shadow-md">
        <Table.Root>
          <Table.Header>
            <Table.Row class="uppercase font-bold">
              <Table.Head>Name</Table.Head>
              <Table.Head class="text-right">Amount</Table.Head>
              <Table.Head>Price</Table.Head>
              <Table.Head>24h %</Table.Head>
              <Table.Head>7d %</Table.Head>
              <Table.Head>30d %</Table.Head>
              <Table.Head>60d %</Table.Head>
              <Table.Head class="text-right">Total</Table.Head>
              <Table.Head class="text-right">Market Cap</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each formattedCurrencies.sort((a, b) => b.marketCap - a.marketCap) as currency, i (i)}
              <Table.Row>
                <Table.Cell>
                  <img
                    class="w-5 h-5 mr-2 object-cover inline"
                    alt={currency.symbol}
                    src={currency.url || getCryptoLogo(currency.symbol)}
                  />
                  {currency.name}
                </Table.Cell>
                <Table.Cell class="text-right"
                  >{formatNumber(currency.amount)}</Table.Cell
                >
                <Table.Cell>{formatMoney(currency.price)}</Table.Cell>
                <Table.Cell
                  class={cn({
                    "text-red-500":
                      currency.statistics.priceChangePercentage24h < 0,
                    "text-green-500":
                      currency.statistics.priceChangePercentage24h > 0,
                  })}
                  >{Math.round(
                    currency.statistics.priceChangePercentage24h
                  )}%</Table.Cell
                >
                <Table.Cell
                  class={cn({
                    "text-red-500":
                      currency.statistics.priceChangePercentage7d < 0,
                    "text-green-500":
                      currency.statistics.priceChangePercentage7d > 0,
                  })}
                  >{Math.round(
                    currency.statistics.priceChangePercentage7d
                  )}%</Table.Cell
                >
                <Table.Cell
                  class={cn({
                    "text-red-500":
                      currency.statistics.priceChangePercentage30d < 0,
                    "text-green-500":
                      currency.statistics.priceChangePercentage30d > 0,
                  })}
                  >{Math.round(
                    currency.statistics.priceChangePercentage30d
                  )}%</Table.Cell
                >
                <Table.Cell
                  class={cn({
                    "text-red-500":
                      currency.statistics.priceChangePercentage60d < 0,
                    "text-green-500":
                      currency.statistics.priceChangePercentage60d > 0,
                  })}
                  >{Math.round(
                    currency.statistics.priceChangePercentage60d
                  )}%</Table.Cell
                >
                <Table.Cell class="text-right mr-0">
                  <div class="flex items-end flex-col gap-1">
                    <p>{formatMoney(currency.value)}</p>
                    <p class="tex-xs text-gray-400">
                      {formatNumber(currency.percent, 2)}%
                    </p>
                    <Progress value={currency.percent} />
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div class="flex items-end flex-col gap-1">
                    <p>{formatMoney(currency.marketCap)}</p>
                    <p class="tex-xs text-gray-400">
                      {formatNumber(currency.marketCapPercent, 2)}%
                    </p>
                    <Progress value={currency.marketCapPercent} />
                  </div></Table.Cell
                >
              </Table.Row>
            {/each}
            <Table.Row>
              <Table.Cell colspan={7} class="font-bold">Total</Table.Cell>
              <Table.Cell class="text-right">{formatMoney(total)}</Table.Cell>
              <Table.Cell class="text-right"
                >{formatMoney(totalMarket)}</Table.Cell
              >
            </Table.Row>
            <Table.Row>
              <Table.Cell colspan={7} class="font-bold">Invested</Table.Cell>
              <Table.Cell class="text-right">{formatMoney(INVESTED)}</Table.Cell
              >
            </Table.Row>
            <Table.Row>
              <Table.Cell colspan={7} class="font-bold">Profit</Table.Cell>
              <Table.Cell
                class={cn("text-right", {
                  "text-green-500": total - INVESTED > 0,
                  "text-red-500": total - INVESTED < 0,
                })}>{formatMoney(total - INVESTED)}</Table.Cell
              >
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  {/if}
</div>
