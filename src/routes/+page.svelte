<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { INVESTED } from "$lib/constants";
  import type { PageData } from "./$types";
  import * as Table from "$lib/components/ui/table";

  export let data: PageData;
</script>

<div class="mt-20">
  <h1 class="text-3xl mb-3 text-center">Hệ thống DCA Crypto</h1>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mt-10">
    <div class="col-span-2">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Price</Table.Head>
            <Table.Head>Total</Table.Head>
            <Table.Head>Market Cap</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data.coinPercentMap as coin, i (i)}
            <Table.Row>
              <Table.Cell>{coin.symbol}</Table.Cell>
              <Table.Cell>{coin.price}$</Table.Cell>
              <Table.Cell>{coin.marketCap}$</Table.Cell>
              <Table.Cell>{coin.value}$</Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
    <div class="col-span-1">
      <p class="mt-3">Total Market Cap: {data.totalMarket}</p>
      <p>Vốn đầu tư: {INVESTED}</p>
      <p>Tổng tài sản: {data.total}</p>
      <p>Lợi nhuận là {data.total - INVESTED}</p>
      <Tooltip.Root>
        <Tooltip.Trigger class="block mt-4"
          ><p>
            Fear And Greed Index: {data.fearAndGreedIndex}
          </p></Tooltip.Trigger
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
  </div>
</div>
