<script lang="ts">
  import { cn } from "$lib/utils/style";
  import { Label as LabelPrimitive } from "bits-ui";

  type $$Events = LabelPrimitive.Events;

  export let required = false;
  export let label: string;
  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<LabelPrimitive.Root
  class={cn(
    "text-sm block space-y-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    className
  )}
  {...$$restProps}
  on:mousedown
>
  <div class="flex justify-between">
    <p>
      {label}
      {#if required}
        <span class="text-error">*</span>
      {/if}
    </p>
    <slot name="extra" />
  </div>
  <slot />
</LabelPrimitive.Root>
