<script lang="ts">
  import { DataTable, type Column } from "$lib/components/ui/table";
  import { getCryptoLogo } from "$lib/utils/getCryptoLogo";
  import { formatNumber } from "$lib/utils/number";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { Trash } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import CreateCurrency from "./CreateCurrency.svelte";
  import EditCurrency from "./EditCurrency.svelte";
  import { sortBy } from "lodash-es";
  import type { ExtendCurrency } from "$lib/utils/type";

  const result = createQuery<{ currencies: ExtendCurrency[] }>({
    queryKey: ["currencies"],
    queryFn: async () => (await fetch("/api/currencies")).json(),
  });

  const deleteCurrencyMutate = createMutation({
    mutationFn: async (id: string) =>
      fetch(`/api/currencies/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Currency has been deleted!");
      $result.refetch();
    },
  });

  const columns: Column[] = [
    { dataIndex: "symbol", title: "Name" },
    {
      dataIndex: "amount",
      title: "Amount",
      titleClass: "text-right",
      cellClass: "text-right",
    },
    {
      title: "Action",
      titleClass: "text-right",
      cellClass: "text-right",
    },
  ];

  $: dataSource = sortBy($result.data?.currencies, "createdAt");
</script>

<div>
  <h1 class="text-2xl text-primary">Setting</h1>
  <div class="border p-5 rounded-md shadow-xl mt-4">
    <div class="flex justify-end mb-5">
      <CreateCurrency />
    </div>
    <DataTable {columns} {dataSource} loading={$result.isPending}>
      <svelte:fragment slot="cell" let:source let:column let:value>
        {#if column.title === "Action"}
          <button on:click={() => $deleteCurrencyMutate.mutate(source.id)}
            ><Trash color="red" /></button
          >
          <EditCurrency currency={source} />
        {:else if column.title === "Amount"}
          {formatNumber(value)}
        {:else if column.title === "Name"}
          <img
            class="w-6 h-6 mr-2 inline"
            alt={source.symbol}
            src={source.url || getCryptoLogo(source.symbol)}
          />
          {source.symbol}
        {:else}
          {value}
        {/if}
      </svelte:fragment>
    </DataTable>
  </div>
</div>
