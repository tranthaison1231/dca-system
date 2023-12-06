<script lang="ts">
  export let value: number | undefined = undefined;
</script>

<div class="w-20 bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
  <div class="bg-info h-1.5 rounded-full" style={`width: ${value}%`}></div>
</div>
