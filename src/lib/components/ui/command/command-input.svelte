<script lang="ts">
  import { cn } from "$lib/utils/style";
  import { Search } from "lucide-svelte";

  let className: string | undefined | null = undefined;
  export { className as class };
  export let value: string = "";
</script>

<div class="flex items-center border-b px-2">
  <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
  <input
    class={cn(
      "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...$$restProps}
    on:change
    on:input
    bind:value
  />
</div>
