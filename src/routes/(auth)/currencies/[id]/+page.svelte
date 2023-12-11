<script lang="ts">
  import { page } from "$app/stores";
  import { DataTable } from "$lib/components/ui/table";
  import { formatDate } from "$lib/utils/date";
  import { cn } from "$lib/utils/style";
  import type { ExtendCurrency } from "$lib/utils/type";
  import type { Transaction } from "@prisma/client";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { Trash } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import AddTransaction from "../../dashboard/AddTransaction.svelte";
  import { formatMoney, formatNumber } from "$lib/utils/number";
  import Button from "$lib/components/ui/button/button.svelte";

  const currencyQuery = createQuery<{ currency: ExtendCurrency }>({
    queryKey: ["currencies", $page.params.id],
    queryFn: async () =>
      (await fetch(`/api/currencies/${$page.params.id}`)).json(),
  });

  const transactionsQuery = createQuery<{ transactions: Transaction[] }>({
    queryKey: [`transactions-by-currency-${$page.params.id}`],
    queryFn: async () =>
      (await fetch(`/api/currencies/${$page.params.id}/transactions`)).json(),
  });

  const deleteTransactionMutate = createMutation({
    mutationFn: async (id: string) =>
      fetch(`/api/currencies/${$page.params.id}/transactions/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Transaction has been deleted!");
      $transactionsQuery.refetch();
    },
  });

  $: dataSource = $transactionsQuery.data?.transactions ?? [];

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Date",
      dataIndex: "timestamp",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Cost",
    },
    {
      title: "Action",
    },
  ];

  $: totalCost =
    Number($currencyQuery.data?.currency.amount) *
    Number($currencyQuery.data?.currency.averagePrice);

  $: totalValue =
    Number($currencyQuery.data?.currency.amount) *
    Number($currencyQuery.data?.currency.price);

  $: profit = totalValue - totalCost;
</script>

<div>
  <div class="flex items-center gap-2">
    <img
      class="w-8 h-8 object-cover"
      src={$currencyQuery.data?.currency.url}
      alt={$currencyQuery.data?.currency.name}
    />
    <h1 class="text-2xl font-medium">
      {$currencyQuery.data?.currency.name}
      <span class="text-gray-500 text-xl font-normal">
        {$currencyQuery.data?.currency.symbol}</span
      >
    </h1>
  </div>
  <p class="text-3xl font-medium mt-4">
    {formatMoney(Number($currencyQuery.data?.currency.price))}
  </p>
</div>
<div class="flex mt-4 gap-4">
  <div class="card">
    <p class="text-xl font-medium">{formatMoney(totalValue)}</p>
    <p>Holdings Value</p>
  </div>
  <div class="card">
    <p class="text-xl font-medium">{$currencyQuery.data?.currency.amount}</p>
    <p>Amount</p>
  </div>
  <div class="card">
    <p class="text-xl font-medium">{formatMoney(totalCost)}</p>
    <p>Total Cost</p>
  </div>
  <div class="card">
    <p class="text-xl font-medium">
      {formatMoney(Number($currencyQuery.data?.currency.averagePrice))}
    </p>
    <p>Average Net Cost</p>
  </div>
  <div class="card">
    {#if profit > 0}
      <p class="text-success text-xl font-medium">
        +{formatMoney(profit)}
      </p>
    {:else}
      <p class="text-error text-xl font-medium">
        {formatMoney(profit)}
      </p>
    {/if}
    <p>Profit / Loss</p>
  </div>
</div>

<div class="border p-4 rounded-md shadow-md mt-4">
  {#if $currencyQuery.data?.currency}
    <div class="flex justify-end mb-5">
      <AddTransaction currency={$currencyQuery.data.currency}>
        <svelte:fragment slot="trigger">
          <Button>Add Transaction</Button>
        </svelte:fragment>
      </AddTransaction>
    </div>
  {/if}
  <DataTable {columns} {dataSource} loading={$transactionsQuery.isPending}>
    <svelte:fragment slot="cell" let:source let:column let:value>
      {#if column.title === "Date"}
        {formatDate(new Date(source.timestamp))}
      {:else if column.title === "Type"}
        <p
          class={cn({
            "text-error": source.type === "SELL",
            "text-success": source.type === "BUY",
          })}
        >
          {source.type === "BUY" ? "Buy" : "Sell"}
        </p>
      {:else if column.title === "Amount"}
        {#if source.type === "BUY"}
          <p class="text-success">
            +{formatNumber(Number(source.amount))}
          </p>
        {:else}
          <p class="text-error">
            -{formatNumber(Number(source.amount))}
          </p>
        {/if}
      {:else if column.title === "Price"}
        {formatMoney(Number(source.price))}
      {:else if column.title === "Cost"}
        {formatMoney(Number(source.price) * Number(source.amount))}
      {:else if column.title === "Action"}
        <button on:click={() => $deleteTransactionMutate.mutate(source.id)}
          ><Trash color="red" />
        </button>
      {:else}
        {value}
      {/if}
    </svelte:fragment>
  </DataTable>
</div>

<style lang="postcss">
  .card {
    @apply border p-4 rounded-md shadow-md space-y-2 text-center;
  }
</style>
