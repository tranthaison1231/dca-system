<script lang="ts">
  import { Button as ButtonPrimitive } from "bits-ui";
  import { buttonVariants, type Props, type Events } from ".";
  import { cn } from "$lib/utils/style";
  import { Loader2 } from "lucide-svelte";

  type $$Props = Props;
  type $$Events = Events;

  let className: $$Props["class"] = undefined;
  export let loading: $$Props["loading"] = false;
  export let variant: $$Props["variant"] = "default";
  export let size: $$Props["size"] = "default";
  export { className as class };
</script>

<ButtonPrimitive.Root
  class={cn(buttonVariants({ variant, size, className }))}
  type="button"
  {...$$restProps}
  on:click
  on:keydown
  disabled={loading}
>
  {#if loading}
    <Loader2 />
  {/if}
  <slot />
</ButtonPrimitive.Root>
