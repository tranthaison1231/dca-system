<script lang="ts">
  import PieChart from "$lib/components/charts/PieChart.svelte";
  import type { ExtendCurrency } from "$lib/utils/type";
  import { sumBy } from "lodash-es";

  export let currencies: ExtendCurrency[] = [];

  $: formattedCurrencies = [
    ...currencies.filter((currency) => currency.percent > 10),
    {
      name: "Others",
      value: sumBy(
        currencies.filter((currency) => currency.percent <= 10),
        "value"
      ),
    },
  ];
</script>

<div
  class="border col-span-4 md:col-span-2 xl:col-span-1 p-4 rounded-md shadow-md"
>
  <h2 class="text-xl text-primary mb-4">Allocation</h2>
  <div>
    <PieChart
      data={{
        labels: formattedCurrencies.map((currency) => currency.name),
        datasets: [
          {
            label: "Total",
            data: formattedCurrencies.map((currency) => currency.value),
            backgroundColor: ["#F9D923", "#187498", "#36AE7C", "#EB5353"],
            hoverOffset: 15,
          },
        ],
      }}
    />
  </div>
</div>
