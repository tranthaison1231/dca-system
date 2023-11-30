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
      type: "pie",
      data: data,
      options: {
        responsive: true,
      },
    });
  });
</script>

<canvas bind:this={canvasRef} />
