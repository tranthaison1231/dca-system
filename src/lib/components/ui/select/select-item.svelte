<script lang="ts">
  import { cn } from "$lib/utils/style";
  import { Select as SelectPrimitive } from "bits-ui";
  import { Check } from "lucide-svelte";

  type $$Events = SelectPrimitive.ItemEvents;

  let className: string | undefined | null = undefined;
  export let value: string | undefined = undefined;
  export let disabled: boolean = false;
  export { className as class };
</script>

<SelectPrimitive.Item
  {value}
  {disabled}
  class={cn(
    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )}
  {...$$restProps}
  on:click
  on:keydown
  on:focusin
  on:focusout
  on:pointerleave
  on:pointermove
>
  <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
    <SelectPrimitive.ItemIndicator>
      <Check class="h-4 w-4" />
    </SelectPrimitive.ItemIndicator>
  </span>
  <slot />
</SelectPrimitive.Item>
