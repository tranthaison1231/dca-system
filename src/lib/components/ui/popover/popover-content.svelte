<script lang="ts">
  import { cn, flyAndScale } from "$lib/utils/style";
  import { Popover as PopoverPrimitive } from "bits-ui";

  type $$Props = PopoverPrimitive.ContentProps;
  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<PopoverPrimitive.Content
  transition={flyAndScale}
  class={cn(
    "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
    className,
  )}
  {...$$restProps}
>
  <slot />
</PopoverPrimitive.Content>
