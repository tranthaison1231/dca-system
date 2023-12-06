<script lang="ts">
  import {
    ArcElement,
    CategoryScale,
    Chart,
    Legend,
    PieController,
    Title,
    Tooltip,
    type ChartData,
  } from "chart.js";
  import { onMount } from "svelte";

  let canvasRef: HTMLCanvasElement;

  export let data: ChartData;

  onMount(() => {
    const ctx = canvasRef.getContext("2d");
    if (!ctx) return;

    Chart.register(
      PieController,
      ArcElement,
      Title,
      Legend,
      Tooltip,
      CategoryScale
    );

    new Chart(ctx, {
      type: "doughnut",
      data: data,
      // plugins: [
      //   {
      //     id: "legendMargin",
      //     beforeInit: function (chart) {
      //       const fitValue = chart.legend!.fit;
      //       chart.legend!.fit = function fit() {
      //         fitValue.bind(chart.legend)();
      //         return (this!.height += 20);
      //       };
      //     },
      //   },
      // ],
      options: {
        aspectRatio: 1.4,
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  });
</script>

<canvas bind:this={canvasRef} />
