<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { getCryptoLogo } from "$lib/utils/getCryptoLogo";
  import { formatNumber } from "$lib/utils/number";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { Trash } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import CreateCurrency from "./CreateCurrency.svelte";
  import EditCurrency from "./EditCurrency.svelte";

  const result = createQuery({
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
</script>

<div>
  <h1 class="text-2xl text-primary">Setting</h1>
  <div class="border p-5 rounded-md shadow-xl mt-4">
    <div class="flex justify-end mb-5">
      <CreateCurrency />
    </div>
    <Table.Root>
      <Table.Header>
        <Table.Row class="uppercase">
          <Table.Head class="font-bold">Name</Table.Head>
          <Table.Head class="font-bold text-right">Amount</Table.Head>
          <Table.Head class="font-bold text-right">Action</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#if $result.isPending}
          {#each new Array(8).fill(0) as _}
            <Table.Row>
              <Table.Cell>
                <div
                  class="w-full h-6 animate-pulse bg-gray-200 rounded-full"
                />
              </Table.Cell>
              <Table.Cell>
                <div
                  class="w-full h-6 animate-pulse bg-gray-200 rounded-full"
                />
              </Table.Cell>
              <Table.Cell>
                <div
                  class="w-full h-6 animate-pulse bg-gray-200 rounded-full"
                />
              </Table.Cell>
            </Table.Row>
          {/each}
        {:else if !$result.data?.currencies.length}
          <Table.Row>
            <Table.Cell
              class="font-bold text-center h-96 text-gray-400"
              colspan={3}
              >Empty
            </Table.Cell>
          </Table.Row>
        {:else}
          {#each $result.data?.currencies ?? [] as currency, i (i)}
            <Table.Row>
              <Table.Cell>
                <img
                  class="w-6 h-6 mr-2 inline"
                  alt={currency.symbol}
                  src={getCryptoLogo(currency.symbol)}
                />
                {currency.symbol}
              </Table.Cell>
              <Table.Cell class="text-right"
                >{formatNumber(currency.amount)}</Table.Cell
              >
              <Table.Cell class="text-right space-x-2">
                <button
                  on:click={() => $deleteCurrencyMutate.mutate(currency.id)}
                  ><Trash color="red" /></button
                >
                <EditCurrency {currency} />
              </Table.Cell>
            </Table.Row>
          {/each}
        {/if}
      </Table.Body>
    </Table.Root>
  </div>
</div>
