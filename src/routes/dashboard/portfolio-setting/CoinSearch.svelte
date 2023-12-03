<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Command from "$lib/components/ui/command";
  import * as Popover from "$lib/components/ui/popover";
  import type { Currency } from "@prisma/client";
  import { createQuery } from "@tanstack/svelte-query";
  import { debounce } from "lodash-es";
  import { ChevronsUpDown, Loader2 } from "lucide-svelte";
  import { derived, writable } from "svelte/store";

  let search = writable("");
  export let value: Partial<Currency> | null = null;
  let open = false;

  const result = createQuery(
    derived(search, ($search) => ({
      queryKey: ["coingecko-search", { search: $search }],
      queryFn: async () =>
        (await fetch(`/api/coingecko/search?query=${$search || "b"}`)).json(),
    }))
  );

  const handleChange = debounce((e) => {
    $search = e.target.value;
  }, 400);
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    <Button
      variant="outline"
      role="combobox"
      class="w-full text-left font-normal flex justify-between"
    >
      {#if value}
        <div class="flex gap-2">
          <img src={value?.url} alt={value.name} class="w-5 h-5 object-cover" />
          <span>{value?.name}</span>
        </div>
      {:else}
        <span>Pick a coin</span>
      {/if}
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-full p-0 max-h-[300px] overflow-y-scroll">
    <Command.Root>
      <Command.Input placeholder="Search for a coin" on:input={handleChange} />
      {#if $result.isPending}
        <div class="h-44 flex justify-center items-center">
          <Loader2 class="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      {:else if $result.data?.coins.length}
        <Command.Group>
          {#each $result.data?.coins as coin}
            <Command.Item
              value={coin.name}
              class="cursor-pointer hover:bg-gray-50"
              onSelect={() => {
                value = {
                  symbol: coin.symbol,
                  name: coin.name,
                  url: coin.thumb,
                };
                open = false;
              }}
            >
              <div class="flex gap-2">
                <img src={coin.thumb} alt={coin.name} width={20} height={30} />
                <span>{coin.name}</span>
              </div>
            </Command.Item>
          {/each}
        </Command.Group>
      {:else if !$result.data?.coins.length}
        <Command.Empty>
          <p>No results found.</p>
        </Command.Empty>
      {/if}
    </Command.Root>
  </Popover.Content>
</Popover.Root>
