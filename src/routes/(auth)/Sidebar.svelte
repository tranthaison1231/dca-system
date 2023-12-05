<script lang="ts">
  import { page } from "$app/stores";
  import Logo from "$lib/components/Logo.svelte";
  import { SIDEBARS } from "$lib/constants/sidebar";
  import { cn } from "$lib/utils/style";
</script>

<div class="border-r h-screen">
  <ul>
    <li class="p-3 border-b">
      <a href="/dashboard">
        <Logo />
      </a>
    </li>
    {#each SIDEBARS as sidebar}
      <li
        class={cn("p-4 text-gray-400", {
          "text-primary bg-gray-100": sidebar.path === $page.url.pathname,
        })}
      >
        <a href={sidebar.path}>
          <svelte:component this={sidebar.icon} />
        </a>
      </li>
    {/each}
  </ul>
</div>
