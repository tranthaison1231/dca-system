<script lang="ts">
  import PieChart from "$lib/components/charts/PieChart.svelte";

  const data = [
    {
      name: "Crypto",
      value: 55,
    },
    {
      name: "Gold",
      value: 10,
    },
    {
      name: "Cash",
      value: 10,
    },
    {
      name: "Stock",
      value: 5,
    },
    {
      name: "Real Estate",
      value: 20,
    },
  ];
</script>

<div
  class="border col-span-3 md:col-span-2 xl:col-span-1 p-4 rounded-md shadow-md"
>
  <h2 class="text-xl text-primary mb-4 font-medium">Allocation</h2>
  <PieChart
    data={{
      labels: data.map((e) => e.name),
      datasets: [
        {
          label: "Total",
          data: data.map((e) => e.value),
          backgroundColor: [
            "#F9D923",
            "#187498",
            "#36AE7C",
            "#EB5353",
            "#0F2167",
          ],
          hoverOffset: 15,
        },
      ],
    }}
  />
</div>
