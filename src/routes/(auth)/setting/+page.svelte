<script lang="ts">
  import Page from "$lib/components/layouts/Page.svelte";
  import { DataTable, type Column } from "$lib/components/ui/table";
  import { getCryptoLogo } from "$lib/utils/getCryptoLogo";
  import { formatNumber } from "$lib/utils/number";
  import type { ExtendCurrency } from "$lib/utils/type";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { sortBy } from "lodash-es";
  import { Trash } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import CreateCurrency from "./CreateCurrency.svelte";
  import EditCurrency from "./EditCurrency.svelte";
  import UpdateProfile from "./UpdateProfile.svelte";

  const currenciesResult = createQuery<{ currencies: ExtendCurrency[] }>({
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
      $currenciesResult.refetch();
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

  $: dataSource = sortBy($currenciesResult.data?.currencies, "createdAt");
</script>

<Page title="Setting">
  <div class="grid grid-cols-3 gap-4">
    <UpdateProfile />
    <div class="border p-4 col-span-3 md:col-span-2 rounded-md shadow-xl">
      <div class="flex justify-end mb-5">
        <CreateCurrency />
      </div>
      <DataTable {columns} {dataSource} loading={$currenciesResult.isPending}>
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
</Page>
