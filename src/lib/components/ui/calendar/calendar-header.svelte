<script lang="ts">
  import { cn } from "$lib/utils/style";
  import { Calendar as CalendarPrimitive } from "bits-ui";

  type $$Props = CalendarPrimitive.HeaderProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.Header
  class={cn(
    "flex justify-between pt-1 relative items-center w-full",
    className
  )}
  {...$$restProps}
>
  <slot />
</CalendarPrimitive.Header>
