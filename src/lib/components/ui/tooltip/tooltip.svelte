<script lang="ts">
  import { Tooltip } from "bits-ui";
  import { cn, flyAndScale } from "$lib/utils/style";

  export let content: string;
  let className: string | undefined = undefined;
  export { className as class };
</script>

<Tooltip.Root>
  <Tooltip.Trigger class="block mt-4">
    <slot />
  </Tooltip.Trigger>
  <Tooltip.Content
    transition={flyAndScale}
    transitionConfig={{
      y: 8,
      duration: 150,
    }}
    sideOffset={4}
    class={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      className
    )}
    {...$$restProps}
  >
    {content}
  </Tooltip.Content>
</Tooltip.Root>
