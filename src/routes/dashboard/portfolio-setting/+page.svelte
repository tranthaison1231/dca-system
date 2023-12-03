<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { getCryptoLogo } from "$lib/utils/getCryptoLogo";
  import { formatNumber } from "$lib/utils/number";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { Trash } from "lucide-svelte";
  import CreateCurrency from "./CreateCurrency.svelte";
  import EditCurrency from "./EditCurrency.svelte";
  import { toast } from "svelte-sonner";

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
    <div class="flex justify-end">
      <CreateCurrency />
    </div>
    <Table.Root class="mt-5">
      <Table.Header>
        <Table.Row class="uppercase">
          <Table.Head class="font-bold">Name</Table.Head>
          <Table.Head class="font-bold text-right">Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
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
              <button on:click={() => $deleteCurrencyMutate.mutate(currency.id)}
                ><Trash color="red" /></button
              >
              <EditCurrency {currency} />
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>
