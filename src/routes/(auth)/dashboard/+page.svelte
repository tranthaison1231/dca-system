<script lang="ts">
  import Page from "$lib/components/layouts/Page.svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import Progress from "$lib/components/ui/progress/progress.svelte";
  import * as Table from "$lib/components/ui/table";
  import { Tooltip } from "$lib/components/ui/tooltip";
  import { getCryptoLogo } from "$lib/utils/getCryptoLogo";
  import { formatMoney, formatNumber } from "$lib/utils/number";
  import { cn } from "$lib/utils/style";
  import type { ExtendCurrency } from "$lib/utils/type";
  import { createQuery } from "@tanstack/svelte-query";
  import { sumBy } from "lodash-es";
  import { Eye } from "lucide-svelte";
  import AddTransaction from "./AddTransaction.svelte";
  import AllocationChart from "./AllocationChart.svelte";
  import IndexSummary from "./IndexSummary.svelte";

  const result = createQuery<{ currencies: ExtendCurrency[] }>({
    queryKey: ["currencies/listing"],
    queryFn: async () => (await fetch("/api/currencies/listing")).json(),
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

  $: invest =
    $result.data?.currencies.reduce(
      (total, curr) =>
        total + Number(curr.amount) * Number(curr.averagePrice ?? curr.price),
      0
    ) ?? 0;

  const columns: Table.Column[] = [
    { dataIndex: "name", title: "Name" },
    {
      dataIndex: "amount",
      title: "Amount",
      titleClass: "text-right",
      cellClass: "text-right",
    },
    {
      dataIndex: "price",
      title: "Price",
      titleClass: "text-right",
      cellClass: "text-right",
    },
    {
      dataIndex: "averagePrice",
      title: "Average Price",
      titleClass: "text-right",
      cellClass: "text-right",
    },
    {
      dataIndex: "statistics.priceChangePercentage24h",
      title: "24h %",
    },
    {
      dataIndex: "statistics.priceChangePercentage7d",
      title: "7d %",
    },
    {
      dataIndex: "statistics.priceChangePercentage30d",
      title: "30d %",
    },
    {
      dataIndex: "statistics.priceChangePercentage60d",
      title: "60d %",
    },
    {
      dataIndex: "statistics.priceChangePercentage90d",
      title: "90d %",
    },
    {
      title: "Total",
      titleClass: "text-right",
      cellClass: "text-right",
    },
    {
      title: "Market Cap",
      titleClass: "text-right",
      cellClass: "text-right",
    },
    {
      title: "Action",
      titleClass: "text-right",
    },
  ];
</script>

<Page title="Dashboard">
  <div class="space-y-4 w-full mt-4">
    <div class="grid grid-cols-3 gap-4 w-full">
      <IndexSummary currencies={formattedCurrencies} />
      <AllocationChart
        currencies={formattedCurrencies}
        loading={$result.isPending}
      />
      <div class="border p-4 rounded-md shadow-md col-span-3 md:col-span-1">
        <iframe
          width="100%"
          height="420"
          frameborder="0"
          src="https://www.theblock.co/data/crypto-markets/prices/bitcoin-dominance/embed"
          title="Bitcoin Dominance"
        ></iframe>
      </div>
      <div class="border p-4 col-span-3 rounded-md shadow-md">
        <Table.DataTable
          {columns}
          dataSource={formattedCurrencies.sort(
            (a, b) => b.marketCap - a.marketCap
          )}
          loading={$result.isPending}
        >
          <svelte:fragment slot="empty">
            <p class="font-normal">
              You don't have any currency yet. Please click <a
                class={buttonVariants({ variant: "default" })}
                href="/setting">Setup</a
              >
              to add some currencies.
            </p>
          </svelte:fragment>
          <svelte:fragment slot="cell" let:source let:column let:value>
            {#if column.title === "Name"}
              <img
                class="w-5 h-5 mr-2 object-cover inline"
                alt={source.symbol}
                src={source.url || getCryptoLogo(source.symbol)}
              />
              {source.name}
            {:else if column.title === "Amount"}
              {formatNumber(value)}
            {:else if column.title === "Price"}
              {formatMoney(value)}
            {:else if column.title === "Average Price"}
              {#if Number(source.amount) > 0 && source.averagePrice}
                <p
                  class={cn({
                    "text-error":
                      Number(source.averagePrice) - Number(source.price) > 0,
                    "text-success":
                      Number(source.averagePrice) - Number(source.price) <= 0,
                  })}
                >
                  {formatMoney(value)}
                </p>
              {/if}
            {:else if ["24h %", "7d %", "30d %", "60d %", "90d %"].includes(column.title)}
              <div
                class={cn({
                  "text-error": value < 0,
                  "text-success": value > 0,
                })}
              >
                {Math.round(value)}%
              </div>
            {:else if column.title === "Total"}
              <div class="flex items-end flex-col gap-1">
                <p>{formatMoney(source.value)}</p>
                <p class="tex-xs text-gray-400">
                  {formatNumber(source.percent, 2)}%
                </p>
                <Progress value={source.percent} />
              </div>
            {:else if column.title === "Market Cap"}
              <div class="flex items-end flex-col gap-1">
                <p>{formatMoney(source.marketCap)}</p>
                <p class="tex-xs text-gray-400">
                  {formatNumber(source.marketCapPercent, 2)}%
                </p>
                <Progress value={source.marketCapPercent} />
              </div>
            {:else if column.title === "Action"}
              {#if source.symbol !== "USDT"}
                <div class="flex flex-col items-end gap-1">
                  <Tooltip content="Add transaction">
                    <AddTransaction currency={source} />
                  </Tooltip>
                  <Tooltip content="View transactions">
                    <a href={`/currencies/${source.id}`} rel="noreferrer">
                      <Eye />
                    </a>
                  </Tooltip>
                </div>
              {/if}
            {:else}
              {value}
            {/if}
          </svelte:fragment>
          <svelte:fragment slot="footer">
            <Table.Row>
              <Table.Cell colspan={9} class="font-bold">Total</Table.Cell>
              <Table.Cell class="text-right">{formatMoney(total)}</Table.Cell>
              <Table.Cell class="text-right"
                >{formatMoney(totalMarket)}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell colspan={9} class="font-bold">Invested</Table.Cell>
              <Table.Cell class="text-right">{formatMoney(invest)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell colspan={9} class="font-bold">Profit</Table.Cell>
              <Table.Cell
                class={cn("text-right", {
                  "text-success": total - invest > 0,
                  "text-error": total - invest < 0,
                })}>{formatMoney(total - invest)}</Table.Cell
              >
            </Table.Row>
          </svelte:fragment>
        </Table.DataTable>
      </div>
    </div>
  </div></Page
>
