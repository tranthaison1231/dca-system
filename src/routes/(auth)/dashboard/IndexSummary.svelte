<script lang="ts">
  import Tooltip from "$lib/components/ui/tooltip/tooltip.svelte";
  import { suggestOrder } from "$lib/services/suggest-order";
  import type { ExtendCurrency } from "$lib/utils/type";
  import { createQuery } from "@tanstack/svelte-query";

  export let currencies: ExtendCurrency[] = [];

  const fearAndGreedResult = createQuery({
    queryKey: ["fear-and-greed"],
    queryFn: async () => (await fetch("/api/cmc/fear-and-greed")).json(),
  });

  const nuplResult = createQuery({
    queryKey: ["nupl"],
    queryFn: async () => (await fetch("/api/crypto-quant/nupl")).json(),
  });

  const supplyInProfitResult = createQuery({
    queryKey: ["supply-in-profit"],
    queryFn: async () =>
      (await fetch("/api/crypto-quant/supply-in-profit")).json(),
  });

  const bitcoinRsi = createQuery({
    queryKey: ["bitcoin-rsi"],
    queryFn: async () => (await fetch("/api/crypto-waves/bitcoin-rsi")).json(),
  });

  $: console.log($bitcoinRsi.data?.value);
</script>

<div
  class="border col-span-3 md:col-span- xl:col-span-1 p-4 rounded-md shadow-md space-y-4"
>
  <h2 class="text-xl font-medium text-primary mb-">Index</h2>
  {#if $bitcoinRsi.isPending || $fearAndGreedResult.isPending || $nuplResult.isPending || $supplyInProfitResult.isPending}
    <div class="h-40 md:h-96 animate-pulse bg-gray-200" />
  {:else}
    <Tooltip content="We should sell when it > 70">
      Fear And Greed: {$fearAndGreedResult.data?.value?.toFixed(2)}
    </Tooltip>
    <Tooltip content="We should sell when it > 80">
      Supply In Profit: {$supplyInProfitResult.data?.value?.toFixed(2)}
    </Tooltip>
    <Tooltip content="We should sell when it > 0.5, we should buy when it < 0">
      Bitcoin NUPL: {$nuplResult.data?.value?.toFixed(2)}
    </Tooltip>
    <Tooltip content="We should sell when it > 70, we should buy when it < 30">
      Bitcoin RSI: {$bitcoinRsi.data?.value?.rsi_1d?.toFixed(2)}
    </Tooltip>
    <p class="font-medium tex-3xl">
      {suggestOrder(currencies, {
        nupl: $nuplResult.data?.value,
        fearAndGreed: $fearAndGreedResult.data?.value,
        supplyInProfit: $supplyInProfitResult.data?.value,
      })}
    </p>
  {/if}
</div>
