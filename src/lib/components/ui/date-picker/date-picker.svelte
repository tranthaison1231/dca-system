<script lang="ts">
  import { DateInput } from "date-picker-svelte";
  import type { DateInputProps } from "date-picker-svelte/DateInput.svelte";

  type $$Props = DateInputProps;
  export let value: $$Props["value"] = undefined;
</script>

<DateInput
  bind:value
  {...$$restProps}
  class="[&_input]:!p-3 [&_input]:!rounded-md [&_input]:!outline-none [&_.picker]:!w-full"
/>
