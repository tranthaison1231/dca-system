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
  import { formatNumber } from "$lib/utils/number";

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

  $: totalCost = dataSource.reduce(
    (total, transaction) =>
      total + Number(transaction.price) * Number(transaction.amount),
    0
  );

  $: amount = dataSource.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0
  );
</script>

<div>
  {$currencyQuery.data?.currency.name}
  <img
    src={$currencyQuery.data?.currency.url}
    alt={$currencyQuery.data?.currency.name}
  />
</div>
<div class="flex mt-4 gap-4">
  <div class="border p-4 rounded-md shadow-md">
    <p>
      {Number($currencyQuery.data?.currency.amount) *
        Number($currencyQuery.data?.currency.price)}
    </p>
    <p>Holdings Value</p>
  </div>
  <div class="border p-4 rounded-md shadow-md">
    <p>{amount}</p>
    <p>Amount</p>
  </div>
  <div class="border p-4 rounded-md shadow-md">
    <p>{totalCost}</p>
    <p>Total Cost</p>
  </div>
  <div class="border p-4 rounded-md shadow-md">
    <p>{totalCost}</p>
    <p>Average Net Cost</p>
  </div>
  <div class="border p-4 rounded-md shadow-md">
    <p>{totalCost}</p>
    <p>Profit / Loss</p>
  </div>
</div>

<div class="border p-4 rounded-md shadow-md mt-4">
  {#if $currencyQuery.data?.currency}
    <div class="flex justify-end mb-5">
      <AddTransaction currency={$currencyQuery.data.currency} />
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
      {:else if column.title === "Cost"}
        {Number(source.price) * Number(source.amount)}
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
