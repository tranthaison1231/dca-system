<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import { BarChart, Gauge, LayoutGrid, Settings } from "lucide-svelte";
  import { page } from "$app/stores";

  const SIDEBARS = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutGrid,
    },
    {
      name: "Portfolio",
      path: "/portfolio",
      icon: Gauge,
    },
    {
      name: "Setting",
      path: "/setting",
      icon: Settings,
    },
    {
      name: "Metric",
      path: "/metrics",
      icon: BarChart,
    },
  ];
</script>

<div class="border-r h-screen">
  <ul>
    <li class="p-3 border-b">
      <a href="/dashboard">
        <Logo />
      </a>
    </li>
    {#each SIDEBARS as sidebar}
      <li class="p-4" class:bg-gray-100={$page.url.pathname === sidebar.path}>
        <a href={sidebar.path}>
          <svelte:component this={sidebar.icon} />
        </a>
      </li>
    {/each}
  </ul>
</div>
