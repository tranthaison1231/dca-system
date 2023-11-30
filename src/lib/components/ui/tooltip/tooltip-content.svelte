<script lang="ts">
  import { Tooltip as TooltipPrimitive } from "bits-ui";
  import { cn, flyAndScale } from "$lib/utils/style";

  type $$Props = TooltipPrimitive.ContentProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<TooltipPrimitive.Content
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
  <slot />
</TooltipPrimitive.Content>
