<script lang="ts">
  import { cn } from "$lib/utils/style";
  import { Calendar as CalendarPrimitive } from "bits-ui";

  type $$Props = CalendarPrimitive.HeadCellProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.HeadCell
  class={cn(
    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
    className
  )}
  {...$$restProps}
>
  <slot />
</CalendarPrimitive.HeadCell>
