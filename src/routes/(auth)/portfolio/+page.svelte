<script lang="ts">
  import PortfolioChart from "./PortfolioChart.svelte";
</script>

<h1 class="text-2xl text-primary">Portfolio</h1>
<div class="mt-4 grid grid-cols-3 gap-4">
  <div class="col-span-1">
    <PortfolioChart />
  </div>
  <div class="col-span-1">
    <div
      class="border col-span-3 md:col-span- xl:col-span-1 p-4 rounded-md shadow-md space-y-4"
    >
      <h2 class="text-xl font-medium text-primary mb-">Index</h2>
      <p>DXY Index</p>
      <p>Gold Index</p>
    </div>
  </div>
  <div class="col-span-1">Hello</div>
</div>
