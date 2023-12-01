<script lang="ts">
  import { cn } from "$lib/utils/style";
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { fade } from "svelte/transition";

  type $$Props = DialogPrimitive.OverlayProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DialogPrimitive.Overlay
  transition={fade}
  transitionConfig={{
    duration: 150,
  }}
  class={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm", className)}
  {...$$restProps}
/>
