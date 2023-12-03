<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { Toaster } from "svelte-sonner";
  import "../app.css";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<svelte:head>
  <title>CoinInvest</title>
</svelte:head>

<Toaster richColors position="top-right" duration={3000} closeButton />
<QueryClientProvider client={data.queryClient}>
  <slot />
</QueryClientProvider>
