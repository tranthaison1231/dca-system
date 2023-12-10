<script lang="ts">
  import Page from "$lib/components/layouts/Page.svelte";
  const CHARTS = [
    {
      src: "https://www.theblock.co/data/on-chain-metrics/bitcoin/transactions-on-the-bitcoin-network-daily/embed",
      title: "Transactions on the Bitcoin Network",
    },
    {
      src: "https://www.theblock.co/data/on-chain-metrics/bitcoin/bitcoins-adjusten-on-chain-volume-daily/embed",
      title: "Bitcoin's On-Chain Volume",
    },
    {
      src: "https://www.theblock.co/data/on-chain-metrics/bitcoin/percentage-of-btc-supply-in-profit-7dma/embed",
      title: "Percentage of BTC Supply in Profit",
    },
  ];
</script>

<Page title="Metric">
  <div class="grid grid-cols-2 gap-4">
    {#each CHARTS as chart}
      <div
        class="border col-span-4 md:col-span-2 xl:col-span-1 p-4 rounded-md shadow-md"
      >
        <iframe
          width="100%"
          height="420"
          frameborder="0"
          src={chart.src}
          title={chart.title}
        ></iframe>
      </div>
    {/each}
  </div>
</Page>
