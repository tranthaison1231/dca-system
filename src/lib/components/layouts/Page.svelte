<script lang="ts">
  export let title: string;
</script>

<div>
  <h1 class="text-2xl mb-4 text-primary">{title}</h1>
  <slot />
</div>
