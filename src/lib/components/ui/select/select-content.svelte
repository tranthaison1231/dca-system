<script lang="ts">
  import { cn, flyAndScale } from "$lib/utils/style";
  import { Select as SelectPrimitive } from "bits-ui";
  import { scale } from "svelte/transition";

  type $$Props = SelectPrimitive.ContentProps;
  type $$Events = SelectPrimitive.ContentEvents;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<SelectPrimitive.Content
  inTransition={flyAndScale}
  inTransitionConfig={undefined}
  outTransition={scale}
  outTransitionConfig={{
    start: 0.95,
    opacity: 0,
    duration: 50,
  }}
  sideOffset={4}
  class={cn(
    "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
    className
  )}
  {...$$restProps}
  on:keydown
>
  <div class="w-full p-1">
    <slot />
  </div>
</SelectPrimitive.Content>
