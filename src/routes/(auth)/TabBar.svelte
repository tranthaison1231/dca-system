<script lang="ts">
  import { page } from "$app/stores";
  import { SIDEBARS } from "$lib/constants/sidebar";
</script>

<div class="flex border-t px-3 py-2 shadow-2xl justify-between">
  {#each SIDEBARS as sidebar}
    <a
      href={sidebar.path}
      class="text-gray-400 gap-1 flex flex-col items-center"
      class:text-primary={sidebar.path === $page.url.pathname}
    >
      <svelte:component this={sidebar.icon} />
      <p class="text-xs">{sidebar.name}</p>
    </a>
  {/each}
</div>
