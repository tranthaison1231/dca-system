<script lang="ts">
  import { cn } from "$lib/utils/style";
  import { Command as CommandPrimitive } from "cmdk-sv";

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<CommandPrimitive.Root
  class={cn(
    "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
    className
  )}
  {...$$restProps}
>
  <slot />
</CommandPrimitive.Root>
