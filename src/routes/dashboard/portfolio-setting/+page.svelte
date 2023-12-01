<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { Edit, Trash } from "lucide-svelte";

  import { getCryptoLogo } from "$lib/utils/getCryptoLogo";
  import { formatNumber } from "$lib/utils/number";
  import { createQuery } from "@tanstack/svelte-query";

  const result = createQuery({
    queryKey: ["currencies"],
    queryFn: async () => (await fetch("/api/currencies")).json(),
  });

  $: console.log($result.data);
</script>

<div>
  <h1 class="text-2xl mb-3 text-center text-black font-bold">
    Portfolio Setting
  </h1>
  <Table.Root>
    <Table.Header>
      <Table.Row class="uppercase">
        <Table.Head class="font-bold">Name</Table.Head>
        <Table.Head class="font-bold text-right">Amount</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each $result.data ?? [] as coin, i (i)}
        <Table.Row>
          <Table.Cell>
            <img
              class="w-6 h-6 mr-2 inline"
              alt={coin.symbol}
              src={getCryptoLogo(coin.symbol)}
            />
            {coin.symbol}
          </Table.Cell>
          <Table.Cell class="text-right">{formatNumber(coin.amount)}</Table.Cell
          >
          <Table.Cell class="text-right space-x-2">
            <button><Trash color="red" /></button>
            <button><Edit /></button>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
