<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { INVESTED } from "$lib/constants";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div>
  <h1 class="text-3xl mb-3">Hệ thống DCA Crypto</h1>
  {#each data?.coinPercentMap ?? [] as coin}
    <div>{coin.symbol}: {coin.value}$</div>
  {/each}

  <p class="mt-3">Total Market Cap: {data.totalMarket}</p>
  <p>Vốn đầu tư: {INVESTED}</p>
  <p>Tổng tài sản: {data.total}</p>
  <p>Lợi nhuận là {data.total - INVESTED}</p>
  <Tooltip.Root>
    <Tooltip.Trigger class="block mt-4"
      ><p>Fear And Greed Index: {data.fearAndGreedIndex}</p></Tooltip.Trigger
    >
    <Tooltip.Content>
      <p>{`We should sell when it > 70`}</p>
    </Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger class="block">
      <p>
        Bitcoin Supply In Profit Index: {data.supplyInProfitIndex}
      </p></Tooltip.Trigger
    >
    <Tooltip.Content>
      <p>{`We should sell when it > 80`}</p>
    </Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger class="block"
      ><p>
        Bitcoin Net Unrealized Profit/Loss: {data.nuplIndex}
      </p></Tooltip.Trigger
    >
    <Tooltip.Content>
      <p>{`We should sell when it > 0.5, we should buy when it < 0`}</p>
    </Tooltip.Content>
  </Tooltip.Root>

  <p class="mt-10">
    {#if data.shouldSell}
      <span class="text-red-500"
        >Bạn nên bán bớt đi {data.price}$: {data.minAlphaCoin.symbol}</span
      >
    {:else if data.maxAlphaCoin.symbol === "USDT"}
      Bạn nên bán bớt đi {data.price}$ {data.minAlphaCoin.symbol} và mua thêm
      {data.price}$ {data.maxAlphaCoin.symbol}
    {:else}
      <span class="text-green-500"
        >Bạn nên mua thêm {data.price}$: {data.maxAlphaCoin.symbol}</span
      >
    {/if}
  </p>
</div>
