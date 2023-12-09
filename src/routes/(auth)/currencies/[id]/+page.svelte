<script lang="ts">
  import { page } from "$app/stores";
  import { DataTable } from "$lib/components/ui/table";
  import { formatDate } from "$lib/utils/date";
  import { cn } from "$lib/utils/style";
  import type { Transaction } from "@prisma/client";
  import { createQuery } from "@tanstack/svelte-query";

  const transactionsQuery = createQuery<{ transactions: Transaction[] }>({
    queryKey: [`transactions-by-currency-${$page.params.id}`],
    queryFn: async () =>
      (await fetch(`/api/currencies/${$page.params.id}/transactions`)).json(),
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
  ];
</script>

<div class="border p-5 rounded-md shadow-md">
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
      {:else}
        {value}
      {/if}
    </svelte:fragment>
  </DataTable>
</div>
